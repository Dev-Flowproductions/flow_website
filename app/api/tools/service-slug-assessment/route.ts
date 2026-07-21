import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  extractJsonObject,
  generateLlmText,
  getOpenAIApiKey,
  LlmBlockedError,
} from '@/lib/openai';
import { assertPublicToolAccess } from '@/lib/publicApiGuard';
import { SERVICE_PAGE_SLUGS, type ServicePageSlug } from '@/lib/serviceItemRoutes';
import type { ServicePageCategory } from '@/lib/servicePagesMessages';
import { getServiceSlugDiagnostic } from '@/lib/serviceSlugDiagnostics/registry';
import type { ServiceAiLocale } from '@/lib/serviceCategoryAiCopy';
import { SELECT_KEYS } from '@/lib/serviceSlugDiagnostics/types';

function normalizeUrl(val: string): string {
  const s = val.trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

const slugAllowlist = new Set(SERVICE_PAGE_SLUGS as readonly string[]);

const idx = z.number().int().min(0).max(4);

const requestSchema = z.object({
  language: z.enum(['en', 'pt', 'fr']),
  serviceSlug: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => slugAllowlist.has(s), { message: 'Invalid service slug' }),
  serviceTitle: z.string().transform((s) => s.trim()).pipe(z.string().min(1)),
  websiteUrl: z
    .string()
    .optional()
    .transform((s) => {
      if (s == null || !s.trim()) return undefined;
      const n = normalizeUrl(s);
      try {
        new URL(n);
        return n;
      } catch {
        return undefined;
      }
    }),
  noWebsite: z.boolean().optional(),
  companyContext: z.string().transform((s) => s.trim()).pipe(z.string().min(8)),
  industry: z.string().transform((s) => s.trim()).pipe(z.string().min(2)),
  q1: idx,
  q2: idx,
  q3: idx,
  q4: idx,
});

const frictionPointSchema = z.object({
  title: z.string(),
  severity: z.enum(['low', 'medium', 'high']).catch('medium'),
  explanation: z.string(),
});

const gapSchema = z.object({
  title: z.string(),
  explanation: z.string(),
});

const responseSchema = z.object({
  toolName: z.string().optional().default('serviceSlugAssessment'),
  language: z.string(),
  overallScore: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
  }),
  maturityLevel: z.enum(['early', 'emerging', 'structured', 'advanced']),
  summary: z.string(),
  topFrictionPoints: z.array(frictionPointSchema).max(5).optional().default([]),
  demandLeaks: z.array(gapSchema).max(5).optional().default([]),
  priorityActions: z
    .array(z.string())
    .min(1)
    .max(10)
    .transform((arr) => arr.slice(0, 5)),
  ctaText: z.string().optional().default(''),
  pdfTitle: z.string().optional().default('Service assessment'),
});

export type ServiceSlugAssessmentResponse = z.infer<typeof responseSchema>;

function expertLens(category: ServicePageCategory): string {
  switch (category) {
    case 'design':
      return 'You are a senior brand and design director. Focus on visual identity, touchpoints, craft quality, and practical next steps for creative operations.';
    case 'marketing':
      return 'You are a senior marketing and content strategist. Focus on message-market fit, channels, measurement, and conversion-oriented messaging.';
    case 'audiovisual':
      return 'You are a lead audiovisual producer. Focus on brief quality, production maturity, sound and image standards, formats, and rights.';
    case 'animacao':
      return 'You are a senior motion design director. Focus on concept/storyboard discipline, pipeline, renders, formats for social and ads, and clarity.';
    default: {
      const _x: never = category;
      return _x;
    }
  }
}

function langLine(lang: ServiceAiLocale): string {
  if (lang === 'pt') return 'Write all output in Portuguese (Portugal).';
  if (lang === 'fr') return 'Write all output in French.';
  return 'Write all output in English.';
}

function buildPrompt(
  payload: z.infer<typeof requestSchema>,
  category: ServicePageCategory,
  answered: { question: string; answer: string }[]
): string {
  const lens = expertLens(category);
  const siteLine = payload.websiteUrl ? `Website: ${payload.websiteUrl}` : 'Website: not provided';

  const qaBlock = answered.map((row) => `Q: ${row.question}\nA: ${row.answer}`).join('\n\n');

  return `${lens}
Assess this company's situation specifically for the service "${payload.serviceTitle}" (internal slug: ${payload.serviceSlug}, category: ${category}).
Return only valid JSON matching the schema below. No markdown, no code fences, no extra text.
${langLine(payload.language as ServiceAiLocale)}
Be practical, concise, and specific to their answers and this exact service. Avoid generic platitudes.

Schema:
{
  "toolName": "serviceSlugAssessment",
  "language": "${payload.language}",
  "overallScore": <0-100>,
  "maturityLevel": "early" | "emerging" | "structured" | "advanced",
  "summary": "<2-4 sentences tailored to this service and answers>",
  "topFrictionPoints": [{ "title": "...", "severity": "low"|"medium"|"high", "explanation": "..." }, up to 3],
  "demandLeaks": [{ "title": "...", "explanation": "..." }, up to 3 — gaps or opportunities relevant to this service],
  "priorityActions": ["<3-5 concrete next steps>"],
  "ctaText": "<one sentence inviting them to talk to Flow Productions / AI adviser>",
  "pdfTitle": "<short report title in requested language>"
}

Context from user:
${siteLine}
Company / offer context: ${payload.companyContext}
Industry: ${payload.industry}

Diagnostic answers (in the user's language):
${qaBlock}

Return only the JSON object.`;
}

export async function POST(request: NextRequest) {
  try {
    const blocked = assertPublicToolAccess(request);
    if (blocked) return blocked;

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

    const slug = parsed.data.serviceSlug as ServicePageSlug;
    const def = getServiceSlugDiagnostic(slug);

    const lang = parsed.data.language as ServiceAiLocale;
    const langKey = lang;

    const answered = SELECT_KEYS.map((key, i) => {
      const block = def.selects[i];
      const choiceIdx = parsed.data[key];
      const question = block.label[langKey];
      const answer = block.options[choiceIdx][langKey];
      return { question, answer };
    });

    const prompt = buildPrompt(parsed.data, def.category, answered);

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
    } catch (e) {
      console.error('OpenAI JSON parse error', e);
      return NextResponse.json({ error: 'Invalid JSON from AI', raw: text.slice(0, 600) }, { status: 502 });
    }

    const validated = responseSchema.safeParse(json);
    if (!validated.success) {
      const err = validated.error.flatten();
      console.error('OpenAI schema validation failed', err);
      return NextResponse.json(
        { error: 'AI response schema invalid', details: err, raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error('service-slug-assessment error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
