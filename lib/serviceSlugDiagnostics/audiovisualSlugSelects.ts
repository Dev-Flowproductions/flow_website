import type { SlugSelectBlock } from './types';
import { l, sb } from './selectHelpers';

type Four = readonly [SlugSelectBlock, SlugSelectBlock, SlugSelectBlock, SlugSelectBlock];

export const AUDIOVISUAL_SLUG_SELECTS: Record<
  'storytelling-audiovisual' | 'fotografia' | 'video' | 'cobertura-eventos',
  Four
> = {
  'storytelling-audiovisual': [
    sb(l('Formato narrativo principal', 'Main narrative format', 'Format narratif principal'), [
      l('Filme institucional curto', 'Short brand film', 'Film de marque court'),
      l('Documentário ou série episódica', 'Documentary or episodic series', 'Documentaire ou série'),
      l('Depoimentos e casos reais', 'Testimonials and real stories', 'Témoignages et histoires réelles'),
      l('Motion + live action misto', 'Mixed motion and live action', 'Mix motion et live'),
      l('Campanha multi-corte para social', 'Multi-cut campaign for social', 'Campagne multi-cuts social'),
    ]),
    sb(l('Objetivo emocional da história', 'Emotional story goal', 'Objectif émotionnel'), [
      l('Confiança e humanização', 'Trust and humanisation', 'Confiance et humanisation'),
      l('Inspiração e propósito', 'Inspiration and purpose', 'Inspiration et purpose'),
      l('Humor ou leveza memorável', 'Humour or memorable lightness', 'Humour ou légèreté mémorable'),
      l('Urgência e causa', 'Urgency and cause', 'Urgence et cause'),
      l('Educação com narrativa', 'Education through narrative', 'Éducation par le récit'),
    ]),
    sb(l('Principal risco de produção', 'Main production risk', 'Principal risque de prod'), [
      l('Brief narrativo ainda vago', 'Narrative brief still vague', 'Brief narratif encore vague'),
      l('Talentos ou locações difíceis', 'Talent or locations hard', 'Talents ou lieux difficiles'),
      l('Orçamento vs ambição criativa', 'Budget vs creative ambition', 'Budget vs ambition créative'),
      l('Música e direitos', 'Music and rights', 'Musique et droits'),
      l('Pós-produção com muitas revisões', 'Post with many revisions', 'Post avec trop de revues'),
    ]),
    sb(l('Maturidade do pipeline audiovisual', 'AV pipeline maturity', 'Maturité pipeline AV'), [
      l('Produções pontuais sem processo', 'One-offs, no process', 'One-shots sans process'),
      l('Roteiro e storyboard às vezes', 'Sometimes script and storyboard', 'Script et storyboard parfois'),
      l('Checklists de som e imagem', 'Sound and picture checklists', 'Checklists son et image'),
      l('Arquivo de takes e masters', 'Takes and masters archive', 'Archive rushes et masters'),
      l('Fornecedores estáveis e SLAs', 'Stable vendors and SLAs', 'Fournisseurs stables et SLAs'),
    ]),
  ],
  fotografia: [
    sb(l('Tipo de fotografia prioritária', 'Priority photography type', 'Type de photo prioritaire'), [
      l('Produto e e-commerce', 'Product and e-commerce', 'Produit et e-commerce'),
      l('Retrato e equipa', 'Portrait and team', 'Portrait et équipe'),
      l('Lifestyle e ambientes', 'Lifestyle and environments', 'Lifestyle et environnements'),
      l('Arquitetura e espaços', 'Architecture and spaces', 'Architecture et espaces'),
      l('Evento ou reportagem', 'Event or reportage', 'Événement ou reportage'),
    ]),
    sb(l('Objetivo das imagens', 'Image goal', 'Objectif des images'), [
      l('Conversão em PDP ou landing', 'Conversion on PDP or landing', 'Conversion PDP ou landing'),
      l('Consistência de marca', 'Brand consistency', 'Cohérence de marque'),
      l('Biblioteca reutilizável', 'Reusable library', 'Bibliothèque réutilisable'),
      l('Campanhas paid e social', 'Paid and social campaigns', 'Campagnes paid et social'),
      l('Imprensa e PR', 'Press and PR', 'Presse et PR'),
    ]),
    sb(l('Obstáculo mais comum', 'Most common obstacle', 'Obstacle le plus fréquent'), [
      l('Iluminação e locação limitadas', 'Lighting and location limits', 'Lumière et lieu limités'),
      l('Edição e retoque sem padrão', 'Editing and retouch inconsistent', 'Retouche sans standard'),
      l('Direitos de modelo e locação', 'Model and location rights', 'Droits modèles et lieux'),
      l('Prazos de entrega apertados', 'Tight delivery deadlines', 'Délais de livraison serrés'),
      l('Naming e arquivo caóticos', 'Chaotic naming and archive', 'Nommage et archive chaotiques'),
    ]),
    sb(l('Maturidade do fluxo foto', 'Photo workflow maturity', 'Maturité flux photo'), [
      l('Sessões sem briefing escrito', 'Shoots without written brief', 'Shoots sans brief écrit'),
      l('Alguns presets e guias', 'Some presets and guides', 'Quelques presets et guides'),
      l('Contratos e releases básicos', 'Basic contracts and releases', 'Contrats et releases basiques'),
      l('DAM ou pastas padronizadas', 'DAM or standard folders', 'DAM ou dossiers standard'),
      l('Style guide fotográfico vivo', 'Living photo style guide', 'Style guide photo vivant'),
    ]),
  ],
  video: [
    sb(l('Tipo de vídeo em foco', 'Video type in focus', 'Type de vidéo focus'), [
      l('Anúncio ou spot curto', 'Ad or short spot', 'Spot ou pub courte'),
      l('Vídeo explicativo / tutorial', 'Explainer or tutorial', 'Explicatif / tutoriel'),
      l('Conteúdo social recorrente', 'Recurring social content', 'Contenu social récurrent'),
      l('Institucional ou corporate', 'Corporate film', 'Film institutionnel'),
      l('Live stream ou híbrido', 'Live stream or hybrid', 'Live ou hybride'),
    ]),
    sb(l('Prioridade técnica ou criativa', 'Technical or creative priority', 'Priorité tech ou créa'), [
      l('Som limpo e legível', 'Clean, intelligible sound', 'Son propre et lisible'),
      l('Imagem estável e grading', 'Stable image and grade', 'Image stable et étalonnage'),
      l('Legendas e acessibilidade', 'Captions and accessibility', 'Sous-titres et accessibilité'),
      l('Formatos por canal (9:16 etc.)', 'Formats per channel', 'Formats par canal'),
      l('Ritmo de edição e hooks', 'Edit pace and hooks', 'Rythme de montage et hooks'),
    ]),
    sb(l('Principal bloqueio', 'Main blocker', 'Principal blocage'), [
      l('Brief incompleto ou em mudança', 'Incomplete or shifting brief', 'Brief incomplet ou mouvant'),
      l('Locação, elenco ou agenda', 'Location, cast or schedule', 'Lieu, casting ou planning'),
      l('Stock e B-roll insuficientes', 'Insufficient stock and B-roll', 'Stock et B-roll insuffisants'),
      l('Export errado ou pesado', 'Wrong or heavy export', 'Export erroné ou trop lourd'),
      l('Revisões sem limite claro', 'Unbounded revisions', 'Révisions sans limite claire'),
    ]),
    sb(l('Maturidade de produção vídeo', 'Video production maturity', 'Maturité prod vidéo'), [
      l('Gravações improvisadas', 'Improvised shoots', 'Tournages improvisés'),
      l('Templates de projeto e naming', 'Project templates and naming', 'Templates projet et naming'),
      l('Mixagem e master padronizados', 'Standard mix and master', 'Mix et master standardisés'),
      l('Versionamento e comentários', 'Versioning and comments', 'Versioning et commentaires'),
      l('Biblioteca de música licenciada', 'Licensed music library', 'Bibliothèque musique licenciée'),
    ]),
  ],
  'cobertura-eventos': [
    sb(l('Tipo de evento', 'Event type', 'Type d’événement'), [
      l('Conferência ou summit', 'Conference or summit', 'Conférence ou summit'),
      l('Lançamento ou ativação', 'Launch or activation', 'Lancement ou activation'),
      l('Feira com stand', 'Trade fair with booth', 'Salon avec stand'),
      l('Evento híbrido com remoto', 'Hybrid with remote', 'Hybride avec remote'),
      l('Gala ou cerimónia', 'Gala or ceremony', 'Gala ou cérémonie'),
    ]),
    sb(l('Prioridade de cobertura', 'Coverage priority', 'Priorité de couverture'), [
      l('Highlights rápidos para social', 'Fast highlights for social', 'Highlights rapides social'),
      l('Registo integral e arquivo', 'Full record and archive', 'Enregistrement intégral'),
      l('Entrevistas e backstage', 'Interviews and backstage', 'Interviews et backstage'),
      l('Live ou multicâmara', 'Live or multicam', 'Live ou multicam'),
      l('Foto + vídeo integrados', 'Integrated photo and video', 'Photo + vidéo intégrés'),
    ]),
    sb(l('Principal risco no dia', 'Main on-day risk', 'Principal risque le jour J'), [
      l('Som ambiente e palco', 'Ambient and stage sound', 'Son ambiant et scène'),
      l('Iluminação variável', 'Variable lighting', 'Lumière variable'),
      l('Permissões e zonas restritas', 'Permissions and restricted zones', 'Permissions et zones restreintes'),
      l('Backup de equipamento', 'Equipment backup', 'Backup matériel'),
      l('Entrega no prazo pós-evento', 'Post-event delivery deadline', 'Livraison post-événement'),
    ]),
    sb(l('Maturidade do kit de evento', 'Event kit maturity', 'Maturité kit événement'), [
      l('Equipa ad hoc por evento', 'Ad hoc crew per event', 'Équipe ad hoc par event'),
      l('Checklist básica de gear', 'Basic gear checklist', 'Checklist matériel basique'),
      l('Planta e run-of-show acordados', 'Floor plan and run of show', 'Plan et run of show'),
      l('Nomenclatura e entrega por fase', 'Naming and phased delivery', 'Nommage et livraison par phase'),
      l('Playbook reutilizável por formato', 'Reusable playbook by format', 'Playbook réutilisable par format'),
    ]),
  ],
};
