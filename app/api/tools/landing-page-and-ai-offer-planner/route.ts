import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

function normalizeUrl(val: string): string {
  const s = val.trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

const auditRequestSchema = z.object({
  mode: z.literal('audit'),
  language: z.enum(['en', 'pt', 'fr']),
  landingPageUrl: z.string().transform((s) => s.trim()).pipe(z.string().min(1).transform(normalizeUrl).pipe(z.string().url())),
  pageGoal: z.string().min(1),
  trafficSources: z.array(z.string()).min(1),
  biggestIssue: z.string().min(1),
  multipleCampaignsToSamePage: z.string().min(1),
  testingDiscipline: z.string().min(1),
  actionClarity: z.string().min(1),
});

const planRequestSchema = z.object({
  mode: z.literal('plan'),
  language: z.enum(['en', 'pt', 'fr']),
  websiteUrl: z.string().transform((s) => s.trim()).optional(),
  industry: z.string().optional(),
  mainOffer: z.string().optional(),
  pageGoal: z.string().min(1),
  offerDescription: z.string().transform((s) => s.trim()).pipe(z.string().min(1)),
  targetAudience: z.string().transform((s) => s.trim()).pipe(z.string().min(1)),
  trafficSources: z.array(z.string()).min(1),
  desiredNextAction: z.string().min(1),
  offerClarity: z.string().min(1),
  aiOfferInterest: z.string().min(1),
});

const requestSchema = z.discriminatedUnion('mode', [auditRequestSchema, planRequestSchema]);

const blockerSchema = z.object({
  title: z.string(),
  severity: z.enum(['low', 'medium', 'high']).catch('medium'),
  explanation: z.string(),
});

const aiOfferRecSchema = z.object({
  recommended: z.boolean(),
  type: z.string(),
  reason: z.string(),
});

const structureItemSchema = z.object({
  section: z.string(),
  purpose: z.string(),
});

const auditResponseSchema = z.object({
  toolName: z.string().optional().default('landingPageAndAiOfferPlanner'),
  language: z.string(),
  mode: z.literal('audit'),
  overallScore: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
  }),
  resultLevel: z.enum(['weak', 'mixed', 'promising', 'strong']),
  summary: z.string(),
  topBlockers: z.array(blockerSchema).max(5).optional().default([]),
  priorityActions: z.array(z.string()).min(1).max(10).transform((arr) => arr.slice(0, 5)),
  aiOfferRecommendation: aiOfferRecSchema.optional().nullable(),
  ctaText: z.string().optional().default('Get a tailored landing page action plan with our AI adviser'),
  pdfTitle: z.string().optional().default('Landing page diagnostic report'),
});

const planResponseSchema = z.object({
  toolName: z.string().optional().default('landingPageAndAiOfferPlanner'),
  language: z.string(),
  mode: z.literal('plan'),
  overallScore: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
  }),
  resultLevel: z.enum(['weak', 'mixed', 'promising', 'strong']),
  summary: z.string(),
  essentialTopics: z.array(z.string()).max(8).optional().default([]),
  suggestedStructure: z.array(structureItemSchema).max(8).optional().default([]),
  copyRecommendations: z.array(z.string()).max(6).optional().default([]),
  offerRecommendation: z.string().optional().default(''),
  aiOfferRecommendation: aiOfferRecSchema.optional().nullable(),
  ctaText: z.string().optional().default('Get a tailored landing page action plan with our AI adviser'),
  pdfTitle: z.string().optional().default('Landing page action plan'),
});

export type LandingPageAuditResponse = z.infer<typeof auditResponseSchema>;
export type LandingPagePlanResponse = z.infer<typeof planResponseSchema>;
export type LandingPagePlannerResponse = LandingPageAuditResponse | LandingPagePlanResponse;

const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';

function buildAuditPrompt(lang: string, payload: z.infer<typeof auditRequestSchema>): string {
  const langInstruction =
    lang === 'pt' ? 'Write all output in Portuguese (Portugal).' : lang === 'fr' ? 'Write all output in French.' : 'Write all output in English.';

  return `You are a B2B landing page and conversion strategist focused on SMEs in the UK and Portugal.
Your job is to assess an existing landing page and identify structure, offer, copy, and conversion weaknesses.
Only recommend an AI offer when it clearly adds utility. Return only valid JSON matching this exact schema. No markdown, no code fence.
${langInstruction}
Be practical, concise, and specific.

Schema:
{
  "toolName": "landingPageAndAiOfferPlanner",
  "language": "${payload.language}",
  "mode": "audit",
  "overallScore": <0-100>,
  "resultLevel": "weak" | "mixed" | "promising" | "strong",
  "summary": "<2-4 sentences>",
  "topBlockers": [{ "title": "...", "severity": "low"|"medium"|"high", "explanation": "..." }, ... up to 3],
  "priorityActions": ["action1", ... 3-5 items],
  "aiOfferRecommendation": { "recommended": true|false, "type": "...", "reason": "..." } or null,
  "ctaText": "<one CTA sentence>",
  "pdfTitle": "<report title in requested language>"
}

User answers:
- Landing page URL: ${payload.landingPageUrl}
- Main goal of page: ${payload.pageGoal}
- Traffic sources: ${payload.trafficSources.join(', ')}
- Biggest issue: ${payload.biggestIssue}
- Multiple campaigns to same page: ${payload.multipleCampaignsToSamePage}
- Testing headlines/offers/CTAs: ${payload.testingDiscipline}
- How clear is page action: ${payload.actionClarity}

Return only the JSON object.`;
}

function buildPlanPrompt(lang: string, payload: z.infer<typeof planRequestSchema>): string {
  const langInstruction =
    lang === 'pt' ? 'Write all output in Portuguese (Portugal).' : lang === 'fr' ? 'Write all output in French.' : 'Write all output in English.';
  const context = [payload.websiteUrl && `Website: ${payload.websiteUrl}`, payload.industry && `Industry: ${payload.industry}`, payload.mainOffer && `Main offer: ${payload.mainOffer}`].filter(Boolean).join('\n');

  return `You are a B2B landing page and conversion strategist focused on SMEs in the UK and Portugal.
Your job is to create a tailored action plan for a landing page that does not exist yet.
Identify essential topics, suggested structure, copy recommendations, and offer. Recommend an AI offer only when it clearly adds value.
Return only valid JSON matching this exact schema. No markdown, no code fence.
${langInstruction}
Be practical, concise, and specific.

Schema:
{
  "toolName": "landingPageAndAiOfferPlanner",
  "language": "${payload.language}",
  "mode": "plan",
  "overallScore": <0-100>,
  "resultLevel": "weak" | "mixed" | "promising" | "strong",
  "summary": "<2-4 sentences>",
  "essentialTopics": ["topic1", ... 4-6 items],
  "suggestedStructure": [{ "section": "...", "purpose": "..." }, ...],
  "copyRecommendations": ["rec1", ... 3-5 items],
  "offerRecommendation": "<one paragraph>",
  "aiOfferRecommendation": { "recommended": true|false, "type": "...", "reason": "..." } or null,
  "ctaText": "<one CTA sentence>",
  "pdfTitle": "<report title in requested language>"
}

User answers:
${context ? context + '\n' : ''}
- Main thing page should achieve: ${payload.pageGoal}
- What they are offering: ${payload.offerDescription}
- Who the page is for: ${payload.targetAudience}
- Traffic that will come: ${payload.trafficSources.join(', ')}
- Desired next action: ${payload.desiredNextAction}
- How clear is current offer: ${payload.offerClarity}
- AI offer interest: ${payload.aiOfferInterest}

Return only the JSON object.`;
}

function extractJson(text: string): string {
  let raw = text.trim();
  const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) raw = codeBlockMatch[1].trim();
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) raw = raw.slice(firstBrace, lastBrace + 1);
  return raw;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      return NextResponse.json({ error: 'Invalid request', details: flat, fieldErrors: flat.fieldErrors }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = parsed.data.mode === 'audit'
      ? buildAuditPrompt(parsed.data.language, parsed.data)
      : buildPlanPrompt(parsed.data.language, parsed.data);

    let text: string;
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (genErr: unknown) {
      const msg = genErr instanceof Error ? genErr.message : String(genErr);
      console.error('Gemini generateContent error:', msg);
      if (/blocked|safety|valid Part|no candidate/i.test(msg)) {
        return NextResponse.json({ error: 'Response was blocked or empty. Try again.' }, { status: 502 });
      }
      throw genErr;
    }
    if (!text?.trim()) return NextResponse.json({ error: 'Empty response from AI. Try again.' }, { status: 502 });

    const rawJson = extractJson(text);
    let json: unknown;
    try {
      json = JSON.parse(rawJson);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from AI', raw: text.slice(0, 600) }, { status: 502 });
    }

    const mode = (json as { mode?: string })?.mode ?? parsed.data.mode;
    const responseSchema = mode === 'plan' ? planResponseSchema : auditResponseSchema;
    const validated = responseSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'AI response schema invalid', details: validated.error.flatten(), raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error('landing-page-and-ai-offer-planner error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
