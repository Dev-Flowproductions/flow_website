import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';
const MAX_HTML_LENGTH = 50000;
const FETCH_TIMEOUT_MS = 8000;

function stripHtml(html: string): string {
  const noScript = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  const noStyle = noScript.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  const text = noStyle.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.slice(0, 15000);
}

/** Extract meta description, og:title, og:description and title for SPAs with little body text */
function extractMetaText(html: string): string {
  const parts: string[] = [];
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (ogTitle?.[1]) parts.push(ogTitle[1].trim());
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
  if (ogDesc?.[1]) parts.push(ogDesc[1].trim());
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (metaDesc?.[1]) parts.push(metaDesc[1].trim());
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (title?.[1]) parts.push(title[1].trim());
  return parts.filter(Boolean).join(' ').slice(0, 8000);
}

const requestSchema = z.object({
  url: z.string().url(),
  language: z.enum(['en', 'pt', 'fr']).optional(),
});

const responseSchema = z.object({
  industry: z.string(),
  mainOffer: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid URL', details: parsed.error.flatten() }, { status: 400 });
    }

    const { url, language = 'en' } = parsed.data;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let html: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FlowDiagnostic/1.0; +https://flowproductions.pt)',
          Accept: 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
      clearTimeout(timeout);
      if (!res.ok) {
        return NextResponse.json({ error: 'Could not fetch website', status: res.status }, { status: 422 });
      }
      const raw = await res.text();
      html = raw.length > MAX_HTML_LENGTH ? raw.slice(0, MAX_HTML_LENGTH) : raw;
    } catch (e) {
      clearTimeout(timeout);
      if (e instanceof Error && e.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
      }
      return NextResponse.json({ error: 'Could not fetch website' }, { status: 422 });
    }

    let text = stripHtml(html);
    if (!text || text.length < 100) {
      const metaText = extractMetaText(html);
      if (metaText.length >= 30) {
        text = metaText;
      } else {
        return NextResponse.json(
          { error: 'Not enough content to analyse. The site may be built with JavaScript that we cannot run; try a site that shows its main text in the initial page load.' },
          { status: 422 }
        );
      }
    }

    const langInstruction =
      language === 'pt' ? 'Return industry and mainOffer in Portuguese.' : language === 'fr' ? 'Return industry and mainOffer in French.' : 'Return industry and mainOffer in English.';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = `You are analysing a company website to extract two short facts. Return only valid JSON, no markdown, no explanation.
${langInstruction}

Schema:
{ "industry": "one short phrase: sector or business type", "mainOffer": "one short phrase: main product or service offer" }

Website content (excerpt):
${text.slice(0, 12000)}

Return only the JSON object.`;

    const result = await model.generateContent(prompt);
    const output = result.response.text();
    if (!output || !output.trim()) {
      return NextResponse.json({ error: 'No suggestion from AI' }, { status: 502 });
    }

    const cleaned = output.replace(/^[\s\S]*?\{/, '{').replace(/\}[\s\S]*$/, '}').trim();
    let json: unknown;
    try {
      json = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 502 });
    }

    const validated = responseSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid suggestion format' }, { status: 502 });
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error('website-suggest error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
