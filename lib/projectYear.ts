export function normalizeProjectYear(value: unknown): string {
  if (value == null || value === '') return '';

  const text = String(value).replace(/^"|"$/g, '').trim();
  if (!text) return '';

  if (/^\d{4}$/.test(text)) return text;

  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : text;
}

export function yearFromPublishedAt(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return String(date.getUTCFullYear());
}
