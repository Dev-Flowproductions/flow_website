const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatBoldHtml(text: string): string {
  const parts: string[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(BOLD_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(escapeHtml(text.slice(lastIndex, index)));
    }
    parts.push(
      `<strong class="font-semibold text-gray-800">${escapeHtml(match[1])}</strong>`
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(escapeHtml(text.slice(lastIndex)));
  }

  return parts.join('');
}
