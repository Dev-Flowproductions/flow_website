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
  landingPageUrl: z.string().transform((s) => s.trim()).optional(),
  industry: z.string().optional(),
  mainOffer: z.string().optional(),
  monthlyAdSpend: z.string().min(1),
  channels: z.array(z.string()).min(1),
  campaignGoal: z.string().min(1),
  successMetrics: z.array(z.string()).min(1),
  testingDiscipline: z.string().min(1),
  adLandingAlignment: z.string().min(1),
  postLeadTracking: z.string().min(1),
  biggestChallenge: z.string().min(1),
});

const wasteRiskSchema = z.object({
  title: z.string(),
  severity: z.enum(['low', 'medium', 'high']).catch('medium'),
  explanation: z.string(),
});

const blockerSchema = z.object({
  title: z.string(),
  explanation: z.string(),
});

const responseSchema = z.object({
  toolName: z.string().optional().default('paidMediaWasteAudit'),
  language: z.string(),
  overallScore: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
  }),
  auditLevel: z.enum(['inefficient', 'unstable', 'improving', 'efficient and scalable']),
  summary: z.string(),
  topWasteRisks: z.array(wasteRiskSchema).max(5).optional().default([]),
  performanceBlockers: z.array(blockerSchema).max(5).optional().default([]),
  priorityActions: z.array(z.string()).min(1).max(10).transform((arr) => arr.slice(0, 5)),
  ctaText: z.string().optional().default('Get a tailored paid media action plan with our AI adviser'),
  pdfTitle: z.string().optional().default('Paid media waste audit report'),
});

export type PaidMediaWasteAuditResponse = z.infer<typeof responseSchema>;

const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';

function buildPrompt(lang: string, payload: z.infer<typeof requestSchema>): string {
  const langInstruction =
    lang === 'pt'
      ? 'Write all output in Portuguese (Portugal).'
      : lang === 'fr'
        ? 'Write all output in French.'
        : 'Write all output in English.';

  const landing = payload.landingPageUrl?.trim() ? payload.landingPageUrl : payload.websiteUrl;
  const context = [payload.industry && `Industry: ${payload.industry}`, payload.mainOffer && `Main offer: ${payload.mainOffer}`].filter(Boolean).join('\n');

  return `You are a B2B paid media strategist focused on SMEs in the UK and Portugal.
Your job is to assess whether a business is wasting paid media budget and where performance is being blocked.
Identify campaign structure, testing, message, landing page, measurement, and quality weaknesses.
Return only valid JSON matching this exact schema. No markdown, no code fence, no extra text.
${langInstruction}
Be practical, concise, and specific. Do not use hype or generic advice.

Schema:
{
  "toolName": "paidMediaWasteAudit",
  "language": "${payload.language}",
  "overallScore": <0-100>,
  "auditLevel": "inefficient" | "unstable" | "improving" | "efficient and scalable",
  "summary": "<2-4 sentences tailored to answers>",
  "topWasteRisks": [{ "title": "...", "severity": "low"|"medium"|"high", "explanation": "..." }, ... up to 3],
  "performanceBlockers": [{ "title": "...", "explanation": "..." }, ... up to 3],
  "priorityActions": ["action1", "action2", ... 3-5 items],
  "ctaText": "<one CTA sentence for the AI adviser>",
  "pdfTitle": "<report title in requested language>"
}

User answers:
- Website: ${payload.websiteUrl}
- Main landing page used in campaigns: ${landing}
${context ? `\nContext from website:\n${context}` : ''}
- Monthly ad spend: ${payload.monthlyAdSpend}
- Channels: ${payload.channels.join(', ')}
- Campaign goal: ${payload.campaignGoal}
- How they judge success: ${payload.successMetrics.join(', ')}
- Testing discipline: ${payload.testingDiscipline}
- Ads/landing alignment: ${payload.adLandingAlignment}
- Post-lead tracking: ${payload.postLeadTracking}
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
        return NextResponse.json({ error: 'Response was blocked or empty. Try again.' }, { status: 502 });
      }
      throw genErr;
    }
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Empty response from AI. Try again.' }, { status: 502 });
    }

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
    console.error('paid-media-waste-audit error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
