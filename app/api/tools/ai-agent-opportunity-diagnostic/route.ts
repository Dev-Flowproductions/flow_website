import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  extractJsonObject,
  generateLlmText,
  getOpenAIApiKey,
  LlmBlockedError,
} from '@/lib/openai';

function normalizeUrl(val: string): string {
  const s = val.trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

const requestSchema = z.object({
  language: z.enum(['en', 'pt', 'fr']),
  websiteUrl: z.string().transform((s) => s.trim()).optional(),
  industry: z.string().optional(),
  mainOffer: z.string().optional(),
  weeklyInboundVolume: z.string().min(1),
  overloadedAreas: z.array(z.string()).min(1),
  currentHandlingState: z.string().min(1),
  ruleClarity: z.string().min(1),
  consistencyNeeds: z.array(z.string()).min(1),
  biggestChallenge: z.string().min(1),
  handoffImportance: z.string().min(1),
  knowledgeReadiness: z.string().min(1),
  firstPhasePriority: z.string().min(1),
});

const opportunityAreaSchema = z.object({
  title: z.string(),
  explanation: z.string(),
});

const recommendedAgentSchema = z.object({
  agentName: z.string(),
  whatItWouldDo: z.string(),
  whyItFits: z.string(),
  whatItNeeds: z.array(z.string()).max(6).optional().default([]),
});

const responseSchema = z.object({
  toolName: z.string().optional().default('aiAgentOpportunityDiagnostic'),
  language: z.string(),
  overallScore: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
  }),
  readinessLevel: z.enum(['early', 'emerging', 'ready to pilot', 'ready to implement']),
  summary: z.string(),
  topOpportunityAreas: z.array(opportunityAreaSchema).max(5).optional().default([]),
  recommendedAgents: z.array(recommendedAgentSchema).max(6).optional().default([]),
  implementationPriorities: z.array(z.string()).min(1).max(6).transform((arr) => arr.slice(0, 5)),
  governanceNote: z.string().optional().default(''),
  ctaText: z.string().optional().default('Get a tailored AI agent action plan with our AI adviser'),
  pdfTitle: z.string().optional().default('AI agent opportunity diagnostic report'),
});

export type AiAgentOpportunityResponse = z.infer<typeof responseSchema>;

function buildPrompt(lang: string, payload: z.infer<typeof requestSchema>): string {
  const langInstruction =
    lang === 'pt' ? 'Write all output in Portuguese (Portugal).' : lang === 'fr' ? 'Write all output in French.' : 'Write all output in English.';

  const context = [
    payload.websiteUrl && `Website: ${payload.websiteUrl}`,
    payload.industry && `Industry: ${payload.industry}`,
    payload.mainOffer && `Main offer: ${payload.mainOffer}`,
  ]
    .filter(Boolean)
    .join('\n');

  return `You are a B2B operations and AI agent strategist focused on SMEs in the UK and Portugal.
Your job is to assess which AI agents would create the most impact in a business and what should be implemented first.
Identify the most relevant agent types, explain what each one needs to work well, and include governance and human handoff notes.
Return only valid JSON matching this exact schema. No markdown, no code fence, no extra text.
${langInstruction}
Be practical, concise, and specific. Do not use hype or generic advice.

Schema:
{
  "toolName": "aiAgentOpportunityDiagnostic",
  "language": "${payload.language}",
  "overallScore": <0-100>,
  "readinessLevel": "early" | "emerging" | "ready to pilot" | "ready to implement",
  "summary": "<2-4 sentences tailored to answers>",
  "topOpportunityAreas": [{ "title": "...", "explanation": "..." }, ... up to 3],
  "recommendedAgents": [{ "agentName": "...", "whatItWouldDo": "...", "whyItFits": "...", "whatItNeeds": ["...", ...] }, ... 2-4 agents],
  "implementationPriorities": ["priority1", ... 3-5 items],
  "governanceNote": "<one concise note on limits, validation, logs, human handoff>",
  "ctaText": "<one CTA sentence for the AI adviser>",
  "pdfTitle": "<report title in requested language>"
}

User answers:
${context ? context + '\n' : ''}
- Weekly inbound requests/enquiries: ${payload.weeklyInboundVolume}
- Areas most overloaded: ${payload.overloadedAreas.join(', ')}
- When a new lead or request arrives: ${payload.currentHandlingState}
- Qualification criteria / response rules: ${payload.ruleClarity}
- Where consistency matters most: ${payload.consistencyNeeds.join(', ')}
- Biggest current challenge: ${payload.biggestChallenge}
- Human handoff when needed: ${payload.handoffImportance}
- Knowledge sources or process documents: ${payload.knowledgeReadiness}
- First phase priority: ${payload.firstPhasePriority}

Return only the JSON object.`;
}

export async function POST(request: NextRequest) {
  try {
    if (!getOpenAIApiKey()) {
      return NextResponse.json({ error: 'OpenAI API not configured' }, { status: 500 });
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      return NextResponse.json(
        { error: 'Invalid request', details: flat, fieldErrors: flat.fieldErrors },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(parsed.data.language, parsed.data);

    let text: string;
    try {
      text = await generateLlmText(prompt);
    } catch (genErr: unknown) {
      if (genErr instanceof LlmBlockedError) {
        return NextResponse.json({ error: genErr.message }, { status: 502 });
      }
      throw genErr;
    }

    const rawJson = extractJsonObject(text);
    let json: unknown;
    try {
      json = JSON.parse(rawJson);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from AI', raw: text.slice(0, 600) }, { status: 502 });
    }

    const validated = responseSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'AI response schema invalid', details: validated.error.flatten(), raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error('ai-agent-opportunity-diagnostic error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
