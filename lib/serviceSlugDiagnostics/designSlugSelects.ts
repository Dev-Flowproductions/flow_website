import type { SlugSelectBlock } from './types';
import { l, sb } from './selectHelpers';

type Four = readonly [SlugSelectBlock, SlugSelectBlock, SlugSelectBlock, SlugSelectBlock];

export const DESIGN_SLUG_SELECTS: Record<
  | 'branding'
  | 'web-design'
  | 'packaging-design'
  | 'ilustracao'
  | 'design-editorial'
  | 'ux-ui-design'
  | 'social-media-design'
  | 'space-branding',
  Four
> = {
  branding: [
    sb(l('Onde está a tua identidade hoje?', 'Where is your identity today?', 'Où en est votre identité ?'), [
      l('Só logótipo e cores soltas', 'Logo and loose colours only', 'Logo et couleurs sans système'),
      l('Guidelines antigas ou pouco usadas', 'Old or rarely used guidelines', 'Guidelines anciennes ou peu utilisées'),
      l('Rebrand ou refresh planeado', 'Rebrand or refresh planned', 'Rebrand ou refresh prévu'),
      l('Submarcas ou parceiros desalinhados', 'Sub-brands or partners misaligned', 'Sous-marques ou partenaires désalignés'),
      l('Sistema vivo com revisões regulares', 'Living system with regular reviews', 'Système vivant avec revues régulières'),
    ]),
    sb(l('Objetivo principal em branding', 'Main branding goal', 'Objectif principal branding'), [
      l('Clareza de posicionamento', 'Clearer positioning', 'Positionnement plus clair'),
      l('Coerência entre digital e físico', 'Digital and physical coherence', 'Cohérence digital et physique'),
      l('Onboarding de equipas e agências', 'Onboarding teams and agencies', 'Onboarding équipes et agences'),
      l('Lançamento com impacto memorável', 'Launch with memorable impact', 'Lancement mémorable'),
      l('Arquivo e ativos organizados', 'Organised assets and archive', 'Archives et assets organisés'),
    ]),
    sb(l('Maior obstáculo ao branding', 'Biggest branding obstacle', 'Principal obstacle branding'), [
      l('Decisões lentas ou por comité', 'Slow or committee decisions', 'Décisions lentes ou en comité'),
      l('Muitos fornecedores sem norte', 'Many vendors, no direction', 'Nombreux fournisseurs sans cap'),
      l('Falta de tempo interno', 'No internal time', 'Pas de temps en interne'),
      l('Orçamento apertado', 'Tight budget', 'Budget serré'),
      l('Não sabemos o que medir', 'Unsure what to measure', 'On ne sait pas quoi mesurer'),
    ]),
    sb(l('Maturidade do sistema de marca', 'Brand system maturity', 'Maturité du système de marque'), [
      l('Quase nada documentado', 'Almost nothing documented', 'Presque rien de documenté'),
      l('PDFs e templates soltos', 'Loose PDFs and templates', 'PDF et templates isolés'),
      l('Manual parcial aplicado às vezes', 'Partial manual, sometimes used', 'Manuel partiel parfois appliqué'),
      l('Design tokens e componentes em curso', 'Design tokens and components underway', 'Tokens et composants en cours'),
      l('Governança e owners definidos', 'Governance and owners defined', 'Gouvernance et owners définis'),
    ]),
  ],
  'web-design': [
    sb(l('Estado do teu site', 'State of your website', 'État de votre site'), [
      l('Precisa de redesign estrutural', 'Needs structural redesign', 'Refonte structure nécessaire'),
      l('Lento ou mal em mobile', 'Slow or poor on mobile', 'Lent ou faible sur mobile'),
      l('Conteúdo desatualizado', 'Outdated content', 'Contenu obsolète'),
      l('SEO técnico fraco', 'Weak technical SEO', 'SEO technique faible'),
      l('Funciona mas falta conversão', 'Works but low conversion', 'Fonctionne mais peu de conversion'),
    ]),
    sb(l('Prioridade em web', 'Web priority', 'Priorité web'), [
      l('Mais leads qualificados', 'More qualified leads', 'Plus de leads qualifiés'),
      l('Melhor UX e navegação', 'Better UX and navigation', 'Meilleure UX et navigation'),
      l('Acessibilidade e performance', 'Accessibility and performance', 'Accessibilité et performance'),
      l('Integração com CRM/analytics', 'CRM / analytics integration', 'Intégration CRM / analytics'),
      l('Escalar páginas sem retrabalho', 'Scale pages without rework', 'Scaler des pages sans rework'),
    ]),
    sb(l('O que mais bloqueia o site', 'What blocks the site most', 'Ce qui bloque le plus le site'), [
      l('CMS ou stack legada', 'Legacy CMS or stack', 'CMS ou stack legacy'),
      l('Falta de copy e SEO on-page', 'Missing copy and on-page SEO', 'Manque de copy et SEO on-page'),
      l('Design inconsistente com a marca', 'Design inconsistent with brand', 'Design incohérent avec la marque'),
      l('Equipa interna sem owner', 'No internal owner', 'Pas de owner interne'),
      l('Briefs pouco claros', 'Unclear briefs', 'Briefs peu clairs'),
    ]),
    sb(l('Maturidade digital do produto', 'Digital product maturity', 'Maturité du produit digital'), [
      l('Páginas pontuais sem padrão', 'One-off pages, no pattern', 'Pages ponctuelles sans pattern'),
      l('Alguns componentes reutilizáveis', 'Some reusable components', 'Quelques composants réutilisables'),
      l('Design system parcial', 'Partial design system', 'Design system partiel'),
      l('Testes A/B e métricas básicas', 'A/B tests and basic metrics', 'Tests A/B et métriques de base'),
      l('Roadmap e owners por área', 'Roadmap and owners per area', 'Roadmap et owners par zone'),
    ]),
  ],
  'packaging-design': [
    sb(l('Contexto da embalagem', 'Packaging context', 'Contexte packaging'), [
      l('SKU novo ou linha a lançar', 'New SKU or line to launch', 'Nouveau SKU ou ligne à lancer'),
      l('Refresh visual sem mudar forma', 'Visual refresh, same format', 'Refresh visuel sans changer la forme'),
      l('Regulamentação ou claims a cumprir', 'Regulation or claims to meet', 'Réglementation ou claims à respecter'),
      l('Sustentabilidade e materiais', 'Sustainability and materials', 'Durabilité et matériaux'),
      l('Reposicionamento de marca', 'Brand repositioning', 'Repositionnement de marque'),
    ]),
    sb(l('Objetivo no ponto de venda', 'Goal at shelf / PDP', 'Objectif en rayon / PDP'), [
      l('Destaque vs concorrência', 'Stand out vs competition', 'Se démarquer de la concurrence'),
      l('Clareza de benefício em segundos', 'Benefit clarity in seconds', 'Clarté du bénéfice en secondes'),
      l('Série coerente em vários formatos', 'Coherent series across formats', 'Série cohérente multi-formats'),
      l('Premium vs mass market', 'Premium vs mass market', 'Premium vs mass market'),
      l('Omnicanal (online + loja)', 'Omnichannel (online + store)', 'Omnicanal (online + magasin)'),
    ]),
    sb(l('Principal risco ou bloqueio', 'Main risk or blocker', 'Principal risque ou blocage'), [
      l('Custos de produção / MOQ', 'Production costs / MOQ', 'Coûts de prod / MOQ'),
      l('Cores e provas de impressão', 'Colour and print proofs', 'Couleurs et épreuves'),
      l('Texto legal e idiomas', 'Legal copy and languages', 'Textes légaux et langues'),
      l('Fotografia e mockups', 'Photography and mockups', 'Photo et mockups'),
      l('Aprovações internas lentas', 'Slow internal approvals', 'Approbations internes lentes'),
    ]),
    sb(l('Maturidade do processo de pack', 'Pack process maturity', 'Maturité du process packaging'), [
      l('Primeira embalagem, sem histórico', 'First pack, no history', 'Premier pack, pas d’historique'),
      l('Fornecedor único sem specs', 'Single vendor, weak specs', 'Un fournisseur, specs faibles'),
      l('Ficha técnica e dieline estáveis', 'Stable spec and dieline', 'Fiche technique et gabarit stables'),
      l('Biblioteca de artes finais', 'Library of final artworks', 'Bibliothèque d’artworks finaux'),
      l('Governança SKU e revisões', 'SKU governance and reviews', 'Gouvernance SKU et revues'),
    ]),
  ],
  ilustracao: [
    sb(l('Tipo de necessidade de ilustração', 'Illustration need type', 'Type de besoin illustration'), [
      l('Iconografia e pictogramas', 'Iconography and pictograms', 'Iconographie et pictogrammes'),
      l('Ilustração editorial / artigos', 'Editorial / article illustration', 'Illustration éditoriale'),
      l('Personagens ou mascote', 'Characters or mascot', 'Personnages ou mascotte'),
      l('Infografias explicativas', 'Explaining infographics', 'Infographies explicatives'),
      l('Campanha com estilo próprio', 'Campaign with own style', 'Campagne avec style propre'),
    ]),
    sb(l('Objetivo criativo', 'Creative goal', 'Objectif créatif'), [
      l('Diferenciação visual clara', 'Clear visual differentiation', 'Différenciation visuelle claire'),
      l('Tom amigável e acessível', 'Friendly, accessible tone', 'Ton friendly et accessible'),
      l('Consistência com guidelines', 'Consistency with guidelines', 'Cohérence avec guidelines'),
      l('Escalabilidade para vários meios', 'Scale across many media', 'Scalabilité multi-supports'),
      l('Narrativa em sequência', 'Sequential storytelling', 'Récit en séquence'),
    ]),
    sb(l('Obstáculo típico', 'Typical obstacle', 'Obstacle typique'), [
      l('Estilo indefinido ou “genérico AI”', 'Undefined or generic style', 'Style indéfini ou générique'),
      l('Prazos apertados', 'Tight deadlines', 'Délais serrés'),
      l('Direitos e uso comercial', 'Rights and commercial use', 'Droits et usage commercial'),
      l('Tradução e adaptação cultural', 'Translation and cultural fit', 'Traduction et adaptation'),
      l('Integração com layout / UI', 'Layout / UI integration', 'Intégration layout / UI'),
    ]),
    sb(l('Maturidade do arquivo de ilustração', 'Illustration archive maturity', 'Maturité archive illustration'), [
      l('Comissões pontuais soltas', 'Loose one-off commissions', 'Commandes ponctuelles isolées'),
      l('Alguns ficheiros fonte guardados', 'Some source files kept', 'Quelques fichiers sources'),
      l('Paleta e traço documentados', 'Documented palette and stroke', 'Palette et trait documentés'),
      l('Biblioteca reutilizável', 'Reusable library', 'Bibliothèque réutilisable'),
      l('Style guide de ilustração', 'Illustration style guide', 'Style guide illustration'),
    ]),
  ],
  'design-editorial': [
    sb(l('Formato editorial principal', 'Main editorial format', 'Format éditorial principal'), [
      l('Relatório anual / ESG', 'Annual / ESG report', 'Rapport annuel / ESG'),
      l('Revista ou publicação periódica', 'Magazine or periodical', 'Magazine ou périodique'),
      l('Catálogo ou lookbook', 'Catalogue or lookbook', 'Catalogue ou lookbook'),
      l('Livro de marca ou manual', 'Brand book or manual', 'Brand book ou manuel'),
      l('Documentação técnica longa', 'Long technical documentation', 'Documentation technique longue'),
    ]),
    sb(l('Prioridade de design', 'Design priority', 'Priorité design'), [
      l('Legibilidade e hierarquia', 'Readability and hierarchy', 'Lisibilité et hiérarchie'),
      l('Ritmo visual e pacing', 'Visual rhythm and pacing', 'Rythme visuel et rythme de lecture'),
      l('Coerência com identidade', 'Brand consistency', 'Cohérence avec l’identité'),
      l('Versões digitais e impressão', 'Digital and print versions', 'Versions digital et print'),
      l('Acessibilidade (contraste, tamanhos)', 'Accessibility (contrast, sizes)', 'Accessibilité (contraste, tailles)'),
    ]),
    sb(l('Principal desafio de produção', 'Main production challenge', 'Principal défi de production'), [
      l('Volumes de texto em fluxo', 'Text volumes in flux', 'Volumes de texte changeants'),
      l('Imagens e direitos dispersos', 'Scattered images and rights', 'Images et droits dispersés'),
      l('Prazos de imprenta apertados', 'Tight print deadlines', 'Délais d’impression serrés'),
      l('Traduções e variantes', 'Translations and variants', 'Traductions et variantes'),
      l('Revisões infinitas', 'Endless revisions', 'Révisions sans fin'),
    ]),
    sb(l('Maturidade do fluxo editorial', 'Editorial workflow maturity', 'Maturité du flux éditorial'), [
      l('InDesign solto sem modelo', 'Loose InDesign, no template', 'InDesign sans gabarit'),
      l('Alguns templates de capítulo', 'Some chapter templates', 'Quelques gabarits de chapitre'),
      l('Grid e estilos de parágrafo', 'Grid and paragraph styles', 'Grille et styles de paragraphe'),
      l('Workflow com revisores', 'Workflow with reviewers', 'Workflow avec relecteurs'),
      l('Sistema de numeração e arquivo', 'Numbering and archive system', 'Numérotation et archives'),
    ]),
  ],
  'ux-ui-design': [
    sb(l('Estado do produto digital', 'Digital product state', 'État du produit digital'), [
      l('Ideação / discovery inicial', 'Early ideation / discovery', 'Idéation / discovery initial'),
      l('MVP com usabilidade fraca', 'MVP with weak usability', 'MVP avec UX faible'),
      l('Produto maduro a otimizar', 'Mature product to optimise', 'Produit mature à optimiser'),
      l('Redesign completo planeado', 'Full redesign planned', 'Redesign complet prévu'),
      l('Design system a alinhar dev', 'Design system vs dev alignment', 'Design system vs dev'),
    ]),
    sb(l('Foco principal de UX/UI', 'Main UX/UI focus', 'Focus UX/UI principal'), [
      l('Clareza de fluxos e tarefas', 'Flow and task clarity', 'Clarté des parcours'),
      l('Onboarding e primeira experiência', 'Onboarding and first-run', 'Onboarding et première expérience'),
      l('Acessibilidade WCAG', 'WCAG accessibility', 'Accessibilité WCAG'),
      l('Consistência de componentes', 'Component consistency', 'Cohérence des composants'),
      l('Handoff e specs para dev', 'Handoff and dev specs', 'Handoff et specs pour dev'),
    ]),
    sb(l('O que mais atrasa entregas', 'What delays delivery most', 'Ce qui retarde le plus'), [
      l('Requisitos mudam em sprint', 'Requirements change mid-sprint', 'Exigences qui changent en sprint'),
      l('Pouca pesquisa com utilizadores', 'Little user research', 'Peu de recherche utilisateurs'),
      l('Componentes duplicados no código', 'Duplicated components in code', 'Composants dupliqués dans le code'),
      l('Falta de prototipo testável', 'No testable prototype', 'Pas de prototype testable'),
      l('Stakeholders sem decisão única', 'Stakeholders, no single decision', 'Stakeholders sans décision unique'),
    ]),
    sb(l('Maturidade UX na organização', 'UX maturity in the org', 'Maturité UX dans l’org'), [
      l('Ad hoc, sem UX dedicado', 'Ad hoc, no dedicated UX', 'Ad hoc, pas d’UX dédié'),
      l('Alguns testes informais', 'Some informal tests', 'Quelques tests informels'),
      l('Design critiques recorrentes', 'Recurring design critiques', 'Design critiques récurrents'),
      l('Research ops básico', 'Basic research ops', 'Research ops basique'),
      l('Métricas de produto ligadas a UX', 'Product metrics tied to UX', 'Métriques produit liées à l’UX'),
    ]),
  ],
  'social-media-design': [
    sb(l('Desafio em criativo social', 'Social creative challenge', 'Défi créatif social'), [
      l('Feed sem identidade clara', 'Feed lacks clear identity', 'Feed sans identité claire'),
      l('Pouca variedade de formatos', 'Few formats used', 'Peu de formats'),
      l('Stories vs feed desalinhados', 'Stories vs feed misaligned', 'Stories vs feed désalignés'),
      l('Campanhas paid com criativos fracos', 'Paid campaigns, weak creatives', 'Paid avec créas faibles'),
      l('UGC difícil de integrar', 'Hard to integrate UGC', 'UGC difficile à intégrer'),
    ]),
    sb(l('Objetivo das peças', 'Creative objective', 'Objectif des créas'), [
      l('Reconhecimento e memorização', 'Recognition and recall', 'Reconnaissance et mémorisation'),
      l('Cliques e tráfego', 'Clicks and traffic', 'Clics et trafic'),
      l('Educar em 3–5 segundos', 'Educate in 3–5 seconds', 'Éduquer en 3–5 secondes'),
      l('Prova social e confiança', 'Social proof and trust', 'Preuve sociale et confiance'),
      l('Sazonalidade e campanhas', 'Seasonality and campaigns', 'Saisonnalité et campagnes'),
    ]),
    sb(l('Obstáculo operacional', 'Operational obstacle', 'Obstacle opérationnel'), [
      l('Sem calendário nem roteiro', 'No calendar or storyline', 'Pas de calendrier ni récit'),
      l('Muitas revisões por stakeholders', 'Too many stakeholder rounds', 'Trop de rounds stakeholders'),
      l('Falta de templates seguros', 'No safe templates', 'Pas de templates sûrs'),
      l('Rights em música e stock', 'Music and stock rights', 'Droits musique et stock'),
      l('Formatos export errados', 'Wrong export formats', 'Mauvais formats d’export'),
    ]),
    sb(l('Maturidade do kit social', 'Social kit maturity', 'Maturité du kit social'), [
      l('Peças únicas ad hoc', 'One-off ad hoc pieces', 'Pièces ad hoc'),
      l('Alguns templates Figma/Canva', 'Some Figma/Canva templates', 'Quelques templates Figma/Canva'),
      l('Grid, tipos e cores definidos', 'Grid, type and colours set', 'Grille, typo et couleurs'),
      l('Biblioteca de hooks e CTAs', 'Hooks and CTA library', 'Bibliothèque de hooks et CTA'),
      l('Playbook por canal e formato', 'Playbook per channel/format', 'Playbook par canal/format'),
    ]),
  ],
  'space-branding': [
    sb(l('Tipo de espaço', 'Space type', 'Type d’espace'), [
      l('Loja ou pop-up retail', 'Store or retail pop-up', 'Magasin ou pop-up retail'),
      l('Escritório ou HQ', 'Office or HQ', 'Bureau ou siège'),
      l('Evento ou feira', 'Event or trade fair', 'Événement ou salon'),
      l('Espaço público ou institucional', 'Public or institutional space', 'Espace public ou institutionnel'),
      l('Showroom ou experience center', 'Showroom or experience center', 'Showroom ou centre d’expérience'),
    ]),
    sb(l('Prioridade da experiência no espaço', 'In-space experience priority', 'Priorité expérience sur place'), [
      l('Wayfinding e sinalética', 'Wayfinding and signage', 'Signalétique et wayfinding'),
      l('Impacto de entrada e vitrine', 'Entry and window impact', 'Impact entrée et vitrine'),
      l('Materiais e acabamentos premium', 'Premium materials and finishes', 'Matériaux et finitions premium'),
      l('Fotogenicidade e social sharing', 'Photo-friendly and sharing', 'Photogénie et partage social'),
      l('Acessibilidade e segurança', 'Accessibility and safety', 'Accessibilité et sécurité'),
    ]),
    sb(l('Principal risco de execução', 'Main execution risk', 'Principal risque d’exécution'), [
      l('Prazos de obra ou montagem', 'Build or install deadlines', 'Délais de chantier / montage'),
      l('Fornecedores de sinalética', 'Signage suppliers', 'Fournisseurs signalétique'),
      l('Normas locais e licenças', 'Local codes and permits', 'Normes locales et permis'),
      l('Iluminação e som ambiente', 'Lighting and ambient sound', 'Lumière et son ambiant'),
      l('Manutenção pós-evento', 'Post-event maintenance', 'Maintenance post-événement'),
    ]),
    sb(l('Maturidade do playbook espacial', 'Spatial playbook maturity', 'Maturité du playbook spatial'), [
      l('Primeira intervenção física', 'First physical intervention', 'Première intervention physique'),
      l('Alguns mockups 3D', 'Some 3D mockups', 'Quelques mockups 3D'),
      l('Manual de aplicação espacial', 'Spatial application manual', 'Manuel d’application spatiale'),
      l('Lista de fornecedores aprovados', 'Approved vendor list', 'Liste fournisseurs approuvés'),
      l('Kits reutilizáveis por formato', 'Reusable kits by format', 'Kits réutilisables par format'),
    ]),
  ],
};
