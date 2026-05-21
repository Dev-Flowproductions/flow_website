/** OpenAI model for Martech / service diagnostic tools */
export const OPENAI_MODEL = 'gpt-5.5';

export function getOpenAIApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function extractJsonObject(text: string): string {
  let raw = text.trim();
  const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) raw = codeBlockMatch[1].trim();
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return raw.slice(firstBrace, lastBrace + 1);
  }
  return raw;
}

export function isLlmBlockedError(message: string): boolean {
  return /blocked|safety|content.?filter|moderation|valid Part|no candidate/i.test(message);
}

export async function generateText(prompt: string): Promise<string> {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API not configured');
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`OpenAI API error ${res.status}: ${errBody.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error('Empty response from OpenAI');
  }

  return content.trim();
}

export class LlmBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LlmBlockedError';
  }
}

/** Generate text; maps moderation/empty failures to LlmBlockedError for API routes */
export async function generateLlmText(prompt: string): Promise<string> {
  try {
    return await generateText(prompt);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('OpenAI generateText error:', msg);
    if (isLlmBlockedError(msg)) {
      throw new LlmBlockedError('Response was blocked or empty. Try again or rephrase.');
    }
    throw err;
  }
}
