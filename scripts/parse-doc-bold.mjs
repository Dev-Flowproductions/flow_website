import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const html = fs.readFileSync(path.join(__dirname, '..', '.tmp-doc.html'), 'utf8');
const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];

const entities = {
  '&nbsp;': ' ',
  '&aacute;': 'á',
  '&eacute;': 'é',
  '&iacute;': 'í',
  '&oacute;': 'ó',
  '&uacute;': 'ú',
  '&ccedil;': 'ç',
  '&atilde;': 'ã',
  '&otilde;': 'õ',
  '&acirc;': 'â',
  '&ecirc;': 'ê',
  '&ocirc;': 'ô',
  '&agrave;': 'à',
  '&Aacute;': 'Á',
  '&Eacute;': 'É',
  '&Iacute;': 'Í',
  '&Oacute;': 'Ó',
  '&Uacute;': 'Ú',
  '&Ccedil;': 'Ç',
  '&Atilde;': 'Ã',
  '&Otilde;': 'Õ',
  '&Acirc;': 'Â',
  '&Ecirc;': 'Ê',
  '&Ocirc;': 'Ô',
  '&Agrave;': 'À',
  '&quot;': '"',
  '&mdash;': '—',
  '&ndash;': '–',
  '&#39;': "'",
  '&amp;': '&',
  '&ldquo;': '"',
  '&rdquo;': '"',
};

function decode(text) {
  let current = text;
  let previous = '';
  while (current !== previous) {
    previous = current;
    current = Object.entries(entities).reduce((acc, [key, value]) => acc.replaceAll(key, value), current);
    current = current.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
    current = current.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  return current;
}

function cleanBoldMarkup(text) {
  return text
    .replace(/\*\*\s*([^*]+?)\s*\*\*/g, '**$1**')
    .replace(/(\*\*[^*]+\*\*)\s+([,.;:!?])/g, '$1$2');
}

function spanToText(spanHtml) {
  const isBold = /\bc3\b/.test(spanHtml);
  let text = decode(
    spanHtml
      .replace(/<span[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<a[^>]*>[\s\S]*?<\/a>/g, '')
      .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, '')
  );
  return isBold ? `**${text.trim()}**` : text;
}

function joinSpanTexts(spans) {
  return spans.reduce((acc, part) => {
    if (!acc) return part;
    const needsSpace = /\*\*$/.test(acc) && /^[^\s*]/.test(part);
    return acc + (needsSpace ? ' ' : '') + part;
  }, '');
}

function liToText(liHtml) {
  const spans = [...liHtml.matchAll(/<span[^>]*>[\s\S]*?<\/span>/g)].map((m) => spanToText(m[0]));
  return cleanBoldMarkup(joinSpanTexts(spans).replace(/\s+/g, ' ').trim());
}

function extractListItems(chunk) {
  return [...chunk.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
    .map((m) => liToText(m[1]))
    .filter(Boolean);
}

const SECTION_MARKERS = {
  audiovisual: {
    start: 'AUDIOVISUAL - PROJETOS',
    end: 'ANIMA&Ccedil;&Atilde;O - PROJETOS',
  },
  animacao: {
    start: 'ANIMA&Ccedil;&Atilde;O - PROJETOS',
    end: '----------------------------------------------------------------------------------------',
  },
};

function parseSection(startMarker, endMarker) {
  const start = body.indexOf(startMarker);
  if (start === -1) return [];
  const end = body.indexOf(endMarker, start + startMarker.length);
  const chunk = body.slice(start, end > start ? end : undefined);
  return extractListItems(chunk);
}

function groupProjects(items) {
  const projects = [];
  let current = null;

  for (const item of items) {
    const titleMatch = item.match(/^T[ií]tulo:\s*(.+)$/i);
    const subtitleMatch = item.match(/^Subt[ií]tulo:\s*(.+)$/i);
    const textoMatch = /^Texto:?\s*$/i.test(item);

    if (titleMatch) {
      if (current) projects.push(current);
      current = {
        title: decode(titleMatch[1].replace(/\*\*/g, '')).trim(),
        subtitle: '',
        paragraphs: [],
      };
      continue;
    }
    if (!current) continue;
    if (subtitleMatch) {
      current.subtitle = decode(subtitleMatch[1].replace(/\*\*/g, '')).trim();
      continue;
    }
    if (textoMatch) continue;
    if (/^T[ií]tulo:/i.test(item) || /^Subt[ií]tulo:/i.test(item)) continue;
    current.paragraphs.push(item);
  }
  if (current) projects.push(current);
  return projects;
}

const avProjects = groupProjects(parseSection(SECTION_MARKERS.audiovisual.start, SECTION_MARKERS.audiovisual.end));
const animProjects = groupProjects(parseSection(SECTION_MARKERS.animacao.start, SECTION_MARKERS.animacao.end));

const output = { audiovisual: avProjects, animacao: animProjects };
fs.writeFileSync(path.join(__dirname, 'data', 'doc-bold-projects.json'), JSON.stringify(output, null, 2));

console.log('AV count', avProjects.length);
console.log('Anim count', animProjects.length);
console.log('Witfy sample:', JSON.stringify(avProjects.find((p) => /witfy/i.test(p.title)), null, 2));
