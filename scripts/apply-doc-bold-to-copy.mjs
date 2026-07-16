import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANIMACAO_PROJECTS, AUDIOVISUAL_PROJECTS } from './data/av-animacao-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TITLE_OVERRIDES = {
  'em jogo': 'emjogo',
  'portuguese lab pizza lab by chef domingos': 'pizza-lab',
  'pizza lab': 'pizza-lab',
  'details / old course vilamoura': 'details-old-course-vilamoura',
  'details old course vilamoura': 'details-old-course-vilamoura',
  'liga portuguesa contra o cancro': 'liga-portuguesa-contra-o-cancro',
  'podcast alberto': 'podcast-alberto',
  'dias medievais de castro marim': 'dias-medievais-de-castro-marim',
  'albufeira digital nomads': 'albufeira-digital-nomads',
  'parque mineiro de aljustrel': 'parque-mineiro-aljustrel',
  'the originals': 'the-originals',
  'travel tech partners': 'travel-tech-partners',
  'designer outlet algarve': 'designer-outlet-algarve',
  'dom jose beach hotel': 'dom-jose-beach-hotel',
  'dom josé beach hotel': 'dom-jose-beach-hotel',
  'rocamar beach hotel': 'rocamar-beach-hotel',
  'ria shopping': 'ria-shopping',
  'ibc security': 'ibc-security',
  'medwater': 'medwater',
  'barturs': 'barturs',
  'kipt': 'kipt',
  'kubidoce': 'kubidoce',
  'witfy': 'witfy',
  'fujifilm': 'fujifilm',
  'algarseafood': 'algarseafood',
  'mia': 'mia',
  'toma la, da ca': 'toma-la-da-ca',
  'toma lá, dá cá': 'toma-la-da-ca',
};

function normalizeTitle(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildSlugIndex(projects) {
  const byTitle = new Map();
  for (const project of projects) {
    byTitle.set(normalizeTitle(project.title.pt), project.slug);
    byTitle.set(normalizeTitle(project.client), project.slug);
  }
  return byTitle;
}

function resolveSlug(title, slugIndex) {
  const normalized = normalizeTitle(title);
  if (TITLE_OVERRIDES[normalized]) return TITLE_OVERRIDES[normalized];
  if (slugIndex.has(normalized)) return slugIndex.get(normalized);
  return null;
}

function extractBoldSegments(text) {
  return [...text.matchAll(/\*\*([^*]+)\*\*/g)].map((match) => match[1]);
}

function applyBoldSegments(text, segments) {
  let result = text;
  const sorted = [...segments].sort((a, b) => b.length - a.length);
  for (const segment of sorted) {
    if (!result.includes(segment)) continue;
    const escaped = segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`(?<!\\*)${escaped}(?!\\*)`, 'g'), `**${segment}**`);
  }
  return result.replace(/\*\*\*\*([^*]+)\*\*\*\*/g, '**$1**');
}

function applyBoldToProjects(projectMap, docProjects, slugIndex) {
  const unmatched = [];

  for (const docProject of docProjects) {
    const slug = resolveSlug(docProject.title, slugIndex);
    if (!slug) {
      unmatched.push(docProject.title);
      continue;
    }
    const project = projectMap.get(slug);
    if (!project) {
      unmatched.push(`${docProject.title} -> ${slug}`);
      continue;
    }

    const ptContent = docProject.paragraphs.join('\n\n');
    const boldSegments = extractBoldSegments(ptContent);
    project.content.pt = ptContent;
    project.content.en = applyBoldSegments(project.content.en, boldSegments);
    project.content.fr = applyBoldSegments(project.content.fr, boldSegments);
  }

  return unmatched;
}

function serializeProject(project) {
  const lines = [
    '  {',
    `    slug: ${JSON.stringify(project.slug)},`,
    `    client: ${JSON.stringify(project.client)},`,
    `    year: ${project.year === undefined ? 'undefined' : project.year === null ? 'null' : JSON.stringify(project.year)},`,
    `    title: { pt: ${JSON.stringify(project.title.pt)}, en: ${JSON.stringify(project.title.en)}, fr: ${JSON.stringify(project.title.fr)} },`,
    `    summary: { pt: ${JSON.stringify(project.summary.pt)}, en: ${JSON.stringify(project.summary.en)}, fr: ${JSON.stringify(project.summary.fr)} },`,
    `    content: { pt: ${JSON.stringify(project.content.pt)}, en: ${JSON.stringify(project.content.en)}, fr: ${JSON.stringify(project.content.fr)} },`,
  ];

  if (project.categories?.length) {
    lines.push(`    categories: ${JSON.stringify(project.categories)},`);
  }
  if (project.tags?.length) {
    lines.push(`    tags: ${JSON.stringify(project.tags)},`);
  }
  if (project.featuredImage) {
    lines.push(`    featuredImage: ${JSON.stringify(project.featuredImage)},`);
  }
  if (project.videoUrl) {
    lines.push(`    videoUrl: ${JSON.stringify(project.videoUrl)},`);
  }

  lines.push('  }');
  return lines.join('\n');
}

function writeCopyFile(audiovisual, animacao) {
  const header = `/** @typedef {{ slug: string; client: string; year?: string | null; title: { pt: string; en: string; fr: string }; summary: { pt: string; en: string; fr: string }; content: { pt: string; en: string; fr: string }; categories?: ('audiovisual' | 'animacao')[]; tags?: string[]; featuredImage?: string }} ProjectCopy */

/** @type {ProjectCopy[]} */
export const AUDIOVISUAL_PROJECTS = [
`;

  const middle = `];

/** @type {ProjectCopy[]} */
export const ANIMACAO_PROJECTS = [
`;

  const footer = `];
`;

  const content = [
    header,
    audiovisual.map(serializeProject).join(',\n'),
    middle,
    animacao.map(serializeProject).join(',\n'),
    footer,
  ].join('');

  fs.writeFileSync(path.join(__dirname, 'data', 'av-animacao-copy.mjs'), content, 'utf8');
}

const docBold = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'doc-bold-projects.json'), 'utf8'));
const slugIndex = buildSlugIndex([...AUDIOVISUAL_PROJECTS, ...ANIMACAO_PROJECTS]);

const avProjects = structuredClone(AUDIOVISUAL_PROJECTS);
const animProjects = structuredClone(ANIMACAO_PROJECTS);
const projectMap = new Map([...avProjects, ...animProjects].map((project) => [project.slug, project]));

const unmatchedAv = applyBoldToProjects(projectMap, docBold.audiovisual, slugIndex);
const unmatchedAnim = applyBoldToProjects(projectMap, docBold.animacao, slugIndex);

writeCopyFile(avProjects, animProjects);

console.log('Updated av-animacao-copy.mjs with bold markup');
if (unmatchedAv.length) console.log('Unmatched AV:', unmatchedAv);
if (unmatchedAnim.length) console.log('Unmatched Anim:', unmatchedAnim);
