import type { SlugSelectBlock } from './types';
import { l, sb } from './selectHelpers';

type Four = readonly [SlugSelectBlock, SlugSelectBlock, SlugSelectBlock, SlugSelectBlock];

export const ANIMACAO_SLUG_SELECTS: Record<
  | 'motion-graphics'
  | 'animacao-corporativa-educativa'
  | 'efeitos-especiais'
  | 'animacao-produto'
  | 'animacao-publicitaria-social',
  Four
> = {
  'motion-graphics': [
    sb(l('Uso principal de motion', 'Main motion use', 'Usage motion principal'), [
      l('Ident animada e vinhetas', 'Animated IDs and bumpers', 'IDs animées et jingles visuels'),
      l('Títulos e lower thirds', 'Titles and lower thirds', 'Titres et bandeaux'),
      l('Transições e packs de canal', 'Transitions and channel packs', 'Transitions et packs chaîne'),
      l('UI motion e protótipos', 'UI motion and prototypes', 'UI motion et prototypes'),
      l('Aberturas de evento ou vídeo', 'Event or video opens', 'Génériques événement ou vidéo'),
    ]),
    sb(l('Objetivo criativo', 'Creative goal', 'Objectif créatif'), [
      l('Refinar sistema de marca em movimento', 'Refine brand system in motion', 'Affiner le système en mouvement'),
      l('Ritmo e legibilidade em 2D', 'Rhythm and 2D readability', 'Rythme et lisibilité 2D'),
      l('Biblioteca reutilizável', 'Reusable library', 'Bibliothèque réutilisable'),
      l('Integração com live action', 'Integration with live action', 'Intégration avec live'),
      l('Export multi-formato leve', 'Light multi-format export', 'Export multi-format léger'),
    ]),
    sb(l('Obstáculo técnico ou de processo', 'Technical or process obstacle', 'Obstacle tech ou process'), [
      l('Ficheiros AE desorganizados', 'Messy AE project files', 'Projets AE désorganisés'),
      l('Fontes e licenças', 'Fonts and licences', 'Polices et licences'),
      l('Tempo de render vs prazo', 'Render time vs deadline', 'Temps de rendu vs deadline'),
      l('Handoff para vídeo final', 'Handoff to final video', 'Handoff vers vidéo finale'),
      l('Versões infinitas sem guia', 'Endless versions, no guide', 'Versions sans guide'),
    ]),
    sb(l('Maturidade motion ops', 'Motion ops maturity', 'Maturité motion ops'), [
      l('Peças únicas sem template', 'One-offs, no template', 'One-shots sans template'),
      l('Alguns mogrt ou presets', 'Some mogrt or presets', 'Quelques mogrt ou presets'),
      l('Convenções de naming e precomps', 'Naming and precomp conventions', 'Conventions nom et precomps'),
      l('Review com timecode e notas', 'Review with timecode', 'Review avec timecode'),
      l('Biblioteca aprovada pela marca', 'Brand-approved library', 'Bibliothèque approuvée marque'),
    ]),
  ],
  'animacao-corporativa-educativa': [
    sb(l('Tipo de peça animada', 'Animated piece type', 'Type de pièce animée'), [
      l('Onboarding interno ou RH', 'Internal or HR onboarding', 'Onboarding interne ou RH'),
      l('Explicação de processo ou compliance', 'Process or compliance explainer', 'Process ou compliance'),
      l('Formação de clientes ou parceiros', 'Customer or partner training', 'Formation clients ou partenaires'),
      l('Vídeo institucional animado', 'Animated corporate film', 'Film institutionnel animé'),
      l('Microlearning em série', 'Serial microlearning', 'Microlearning en série'),
    ]),
    sb(l('Prioridade pedagógica', 'Learning priority', 'Priorité pédagogique'), [
      l('Clareza em poucos minutos', 'Clarity in a few minutes', 'Clarté en quelques minutes'),
      l('Reduzir texto na voz-over', 'Less text in voice-over', 'Moins de texte en VO'),
      l('Acessibilidade (legendas, contraste)', 'Accessibility (captions, contrast)', 'Accessibilité (sous-titres, contraste'),
      l('Tradução e variantes regionais', 'Translation and regional variants', 'Traduction et variantes'),
      l('Quizzes ou checkpoints', 'Quizzes or checkpoints', 'Quiz ou checkpoints'),
    ]),
    sb(l('Principal desafio de produção', 'Main production challenge', 'Principal défi de prod'), [
      l('Conteúdo técnico denso', 'Dense technical content', 'Contenu technique dense'),
      l('SME indisponível para revisão', 'SME unavailable for review', 'SME indisponible pour relecture'),
      l('Storyboard ainda genérico', 'Storyboard still generic', 'Storyboard encore générique'),
      l('Voz e ritmo difíceis de alinhar', 'Voice and pace hard to align', 'Voix et rythme difficiles'),
      l('Atualizações frequentes ao script', 'Frequent script updates', 'Mises à jour fréquentes du script'),
    ]),
    sb(l('Maturidade de animação educativa', 'Educational animation maturity', 'Maturité anim éducative'), [
      l('Vídeos pontuais sem série', 'One-off videos, no series', 'Vidéos ponctuelles sans série'),
      l('Alguns templates de cena', 'Some scene templates', 'Quelques templates de scène'),
      l('Guia de voz e tom', 'Voice and tone guide', 'Guide voix et ton'),
      l('Versionamento por trimestre', 'Quarterly versioning', 'Versioning par trimestre'),
      l('Métricas de conclusão ou quiz', 'Completion or quiz metrics', 'Métriques complétion ou quiz'),
    ]),
  ],
  'efeitos-especiais': [
    sb(l('Contexto de VFX', 'VFX context', 'Contexte VFX'), [
      l('Integração CGI em live action', 'CGI in live action', 'CGI dans live action'),
      l('Cleanup e retoque de imagem', 'Cleanup and image fix', 'Cleanup et retouche image'),
      l('Simulações ou partículas', 'Simulations or particles', 'Simulations ou particules'),
      l('Compositing complexo', 'Complex compositing', 'Compositing complexe'),
      l('Packshots ou produto hero', 'Packshots or hero product', 'Packshots ou produit hero'),
    ]),
    sb(l('Prioridade de qualidade', 'Quality priority', 'Priorité qualité'), [
      l('Realismo e continuidade', 'Realism and continuity', 'Réalisme et continuité'),
      l('Tempo de entrega vs complexidade', 'Delivery vs complexity', 'Délai vs complexité'),
      l('Consistência com referências', 'Consistency with references', 'Cohérence avec références'),
      l('Performance de playback', 'Playback performance', 'Performance de lecture'),
      l('Documentação para re-use', 'Documentation for reuse', 'Documentation pour réutilisation'),
    ]),
    sb(l('Principal risco', 'Main risk', 'Principal risque'), [
      l('Brief visual insuficiente', 'Insufficient visual brief', 'Brief visuel insuffisant'),
      l('Footage ou greenscreen fraco', 'Weak footage or greenscreen', 'Rushes ou fond vert faibles'),
      l('Render farm ou hardware', 'Render farm or hardware', 'Render farm ou hardware'),
      l('Revisões que mudam o plano', 'Revisions that change the plan', 'Révisions qui changent le plan'),
      l('Direitos de stock e elementos', 'Stock and element rights', 'Droits stock et éléments'),
    ]),
    sb(l('Maturidade pipeline VFX', 'VFX pipeline maturity', 'Maturité pipeline VFX'), [
      l('Shots tratados caso a caso', 'Shots handled case by case', 'Shots au cas par cas'),
      l('Templates de comp básicos', 'Basic comp templates', 'Templates comp basiques'),
      l('Naming de passes e versões', 'Passes and version naming', 'Nommage passes et versions'),
      l('Review com ref frames', 'Review with ref frames', 'Review avec images ref'),
      l('Biblioteca de assets aprovados', 'Approved asset library', 'Bibliothèque assets approuvés'),
    ]),
  ],
  'animacao-produto': [
    sb(l('Objetivo da animação de produto', 'Product animation goal', 'Objectif anim produit'), [
      l('Mostrar funcionalidades ocultas', 'Show hidden features', 'Montrer fonctions cachées'),
      l('Comparar com concorrente', 'Compare vs competitor', 'Comparer au concurrent'),
      l('Explodir vista e componentes', 'Exploded view and parts', 'Vue éclatée et composants'),
      l('Materiais e acabamentos premium', 'Premium materials and finishes', 'Matériaux et finitions premium'),
      l('Variantes de cor ou SKU', 'Colour or SKU variants', 'Variantes couleur ou SKU'),
    ]),
    sb(l('Formato de entrega prioritário', 'Priority delivery format', 'Format livraison prioritaire'), [
      l('Loops para web e PDP', 'Loops for web and PDP', 'Loops web et PDP'),
      l('Anúncios paid 6–15s', 'Paid ads 6–15s', 'Ads paid 6–15s'),
      l('Apresentação a investidores', 'Investor presentation', 'Présentation investisseurs'),
      l('Feira ou ecrã grande', 'Fair or large screen', 'Salon ou grand écran'),
      l('AR ou 3D web viewer', 'AR or 3D web viewer', 'AR ou viewer 3D web'),
    ]),
    sb(l('Obstáculo mais frequente', 'Most frequent obstacle', 'Obstacle le plus fréquent'), [
      l('CAD ou modelos 3D incompletos', 'Incomplete CAD or 3D', 'CAD ou 3D incomplets'),
      l('Marca com restrições de ângulo', 'Brand restricts angles', 'Marque restreint les angles'),
      l('Prazo curto para feira', 'Short fair deadline', 'Délai salon court'),
      l('Ficheiros pesados para web', 'Heavy files for web', 'Fichiers lourds pour le web'),
      l('Alinhar com fotografia real', 'Match real photography', 'Aligner avec photo réelle'),
    ]),
    sb(l('Maturidade 3D produto', '3D product maturity', 'Maturité 3D produit'), [
      l('Renders pontuais', 'One-off renders', 'Renders ponctuels'),
      l('Cena base reutilizável', 'Reusable base scene', 'Scène de base réutilisable'),
      l('Materiais PBR documentados', 'Documented PBR materials', 'Matériaux PBR documentés'),
      l('Pipeline de revisão por frame', 'Per-frame review pipeline', 'Pipeline revue par image'),
      l('Biblioteca de variantes SKU', 'SKU variant library', 'Bibliothèque variantes SKU'),
    ]),
  ],
  'animacao-publicitaria-social': [
    sb(l('Formato social em foco', 'Social format in focus', 'Format social focus'), [
      l('Feed quadrado ou 4:5', 'Square or 4:5 feed', 'Feed carré ou 4:5'),
      l('Stories ou Reels verticais', 'Stories or vertical Reels', 'Stories ou Reels verticaux'),
      l('Bumper 6s para YouTube', '6s YouTube bumper', 'Bumper 6s YouTube'),
      l('Carrossel conceitual animado', 'Animated concept carousel', 'Carrousel concept animé'),
      l('Anúncio UGC-style com motion', 'UGC-style ad with motion', 'Ad style UGC avec motion'),
    ]),
    sb(l('Objetivo da peça', 'Creative objective', 'Objectif de la pièce'), [
      l('Parar o scroll em 1–2s', 'Stop scroll in 1–2s', 'Stop scroll en 1–2s'),
      l('Clareza de oferta e CTA', 'Offer and CTA clarity', 'Clarté offre et CTA'),
      l('Variações para teste criativo', 'Variants for creative testing', 'Variantes pour tests créas'),
      l('Tom jovem ou premium', 'Youthful or premium tone', 'Ton jeune ou premium'),
      l('Adaptar campanha TV a social', 'Adapt TV campaign to social', 'Adapter campagne TV au social'),
    ]),
    sb(l('Obstáculo operacional', 'Operational obstacle', 'Obstacle opérationnel'), [
      l('Safe zones e legendas nativas', 'Safe zones and native captions', 'Safe zones et captions natives'),
      l('Música trending e direitos', 'Trending music and rights', 'Musique trending et droits'),
      l('Cadência de entregas semanais', 'Weekly delivery cadence', 'Cadence hebdomadaire'),
      l('Formatos export errados', 'Wrong export formats', 'Mauvais formats export'),
      l('Brand aprovação lenta', 'Slow brand approval', 'Approbation marque lente'),
    ]),
    sb(l('Maturidade de motion ads', 'Motion ads maturity', 'Maturité motion ads'), [
      l('Peças únicas por campanha', 'One-offs per campaign', 'One-shots par campagne'),
      l('Alguns templates after effects', 'Some After Effects templates', 'Quelques templates AE'),
      l('Matriz de formatos por rede', 'Format matrix per network', 'Matrice formats par réseau'),
      l('Creative testing com métricas', 'Creative testing with metrics', 'Tests créas avec métriques'),
      l('Biblioteca de hooks aprovados', 'Approved hooks library', 'Bibliothèque hooks approuvés'),
    ]),
  ],
};
