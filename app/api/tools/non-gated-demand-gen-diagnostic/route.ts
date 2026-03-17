import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

function normalizeUrl(val: string): string {
  const s = val.trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

const requestSchema = z.object({
  language: z.enum(['en', 'pt', 'fr']),
  websiteUrl: z.string().transform((s) => s.trim()).pipe(z.string().min(1).transform(normalizeUrl).pipe(z.string().url())),
  industry: z.string().transform((s) => s.trim()).pipe(z.string().min(1)),
  mainOffer: z.string().transform((s) => s.trim()).pipe(z.string().min(1)),
  salesCycle: z.string().min(1),
  leadSources: z.array(z.string()).min(1),
  publishingConsistency: z.string().min(1),
  distributionChannels: z.array(z.string()).min(1),
  preSalesContentAccess: z.string().min(1),
  measurementMethods: z.array(z.string()).min(1),
  biggestChallenge: z.string().min(1),
});

const frictionPointSchema = z.object({
  title: z.string(),
  severity: z.enum(['low', 'medium', 'high']).catch('medium'),
  explanation: z.string(),
});

const demandLeakSchema = z.object({
  title: z.string(),
  explanation: z.string(),
});

const responseSchema = z.object({
  toolName: z.string().optional().default('nonGatedDemandGenDiagnostic'),
  language: z.string(),
  overallScore: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
  }),
  maturityLevel: z.enum(['early', 'emerging', 'structured', 'advanced']),
  summary: z.string(),
  topFrictionPoints: z.array(frictionPointSchema).max(5).optional().default([]),
  demandLeaks: z.array(demandLeakSchema).max(5).optional().default([]),
  priorityActions: z.array(z.string()).min(1).max(10).transform((arr) => arr.slice(0, 5)),
  ctaText: z.string().optional().default('Get a tailored demand gen action plan with our AI adviser'),
  pdfTitle: z.string().optional().default('Non-Gated demand diagnostic report'),
});

export type DiagnosticResponse = z.infer<typeof responseSchema>;

const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';

function buildPrompt(lang: string, payload: z.infer<typeof requestSchema>): string {
  const langInstruction =
    lang === 'pt'
      ? 'Write all output in Portuguese (Portugal).'
      : lang === 'fr'
        ? 'Write all output in French.'
        : 'Write all output in English.';

  return `You are a B2B demand generation strategist focused on SMEs in the UK and Portugal.
Your job is to assess how well a company is creating demand without over-relying on gated content.
Identify trust, distribution, content, and measurement weaknesses.
Return only valid JSON matching this exact schema. No markdown, no code fence, no extra text.
${langInstruction}
Be practical, concise, and specific. Do not use hype or generic advice.

Schema:
{
  "toolName": "nonGatedDemandGenDiagnostic",
  "language": "${payload.language}",
  "overallScore": <0-100>,
  "maturityLevel": "early" | "emerging" | "structured" | "advanced",
  "summary": "<2-4 sentences tailored to answers>",
  "topFrictionPoints": [{ "title": "...", "severity": "low"|"medium"|"high", "explanation": "..." }, ... up to 3],
  "demandLeaks": [{ "title": "...", "explanation": "..." }, ... up to 3],
  "priorityActions": ["action1", "action2", ... 3-5 items],
  "ctaText": "<one CTA sentence for the AI adviser>",
  "pdfTitle": "<report title in requested language>"
}

User answers:
- Website: ${payload.websiteUrl}
- Industry: ${payload.industry}
- Main offer: ${payload.mainOffer}
- Average sales cycle: ${payload.salesCycle}
- How they generate leads: ${payload.leadSources.join(', ')}
- Publishing consistency: ${payload.publishingConsistency}
- Distribution channels: ${payload.distributionChannels.join(', ')}
- Before sales (content access): ${payload.preSalesContentAccess}
- How they measure demand: ${payload.measurementMethods.join(', ')}
- Biggest challenge: ${payload.biggestChallenge}

Return only the JSON object.`;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = buildPrompt(parsed.data.language, parsed.data);

    let text: string;
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (genErr: unknown) {
      const msg = genErr instanceof Error ? genErr.message : String(genErr);
      console.error('Gemini generateContent error:', msg);
      if (/blocked|safety|valid Part|no candidate/i.test(msg)) {
        return NextResponse.json({ error: 'Response was blocked or empty. Try again or rephrase.' }, { status: 502 });
      }
      throw genErr;
    }
    if (!text || !text.trim()) {
      console.error('Gemini empty text');
      return NextResponse.json({ error: 'Empty response from AI. Try again.' }, { status: 502 });
    }

    // Extract JSON: strip markdown code fences and any leading/trailing text
    let rawJson = text.trim();
    const codeBlockMatch = rawJson.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) rawJson = codeBlockMatch[1].trim();
    const firstBrace = rawJson.indexOf('{');
    const lastBrace = rawJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      rawJson = rawJson.slice(firstBrace, lastBrace + 1);
    }

    let json: unknown;
    try {
      json = JSON.parse(rawJson);
    } catch (e) {
      console.error('Gemini JSON parse error', e);
      return NextResponse.json(
        { error: 'Invalid JSON from AI', raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    const validated = responseSchema.safeParse(json);
    if (!validated.success) {
      const err = validated.error.flatten();
      console.error('Gemini schema validation failed', err);
      return NextResponse.json(
        { error: 'AI response schema invalid', details: err, raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error('non-gated-demand-gen-diagnostic error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
