import type { SlugSelectBlock } from './types';
import { l, sb } from './selectHelpers';

type Four = readonly [SlugSelectBlock, SlugSelectBlock, SlugSelectBlock, SlugSelectBlock];

export const MARKETING_SLUG_SELECTS: Record<
  | 'content-strategy'
  | 'copywriting'
  | 'blog-content-writing'
  | 'storytelling'
  | 'brand-strategy'
  | 'social-media-content'
  | 'digital-advertising'
  | 'consultoria',
  Four
> = {
  'content-strategy': [
    sb(l('Situação do conteúdo hoje', 'Content situation today', 'Situation contenu aujourd’hui'), [
      l('Sem norte editorial claro', 'No clear editorial north star', 'Pas de cap éditorial'),
      l('Muitos formatos, pouca estratégia', 'Many formats, weak strategy', 'Beaucoup de formats, peu de stratégie'),
      l('SEO e clusters indefinidos', 'SEO and clusters undefined', 'SEO et clusters flous'),
      l('Conteúdo genérico ou repetido', 'Generic or repeated content', 'Contenu générique ou répété'),
      l('Operação madura a otimizar', 'Mature ops to optimise', 'Ops mature à optimiser'),
    ]),
    sb(l('Objetivo da estratégia', 'Strategy goal', 'Objectif stratégie'), [
      l('Autoridade e thought leadership', 'Authority and thought leadership', 'Autorité et thought leadership'),
      l('Demanda orgânica qualificada', 'Qualified organic demand', 'Demande organique qualifiée'),
      l('Suporte ao funil comercial', 'Sales funnel support', 'Support au funnel commercial'),
      l('Ativação sazonal e campanhas', 'Seasonal activation and campaigns', 'Activation saisonnière'),
      l('Reduzir custo por lead', 'Lower cost per lead', 'Réduire le coût par lead'),
    ]),
    sb(l('Principal bloqueio', 'Main blocker', 'Principal blocage'), [
      l('Falta de dados e attribution', 'Weak data and attribution', 'Données et attribution faibles'),
      l('Equipa pequena ou part-time', 'Small or part-time team', 'Petite équipe ou part-time'),
      l('Ferramentas e CMS dispersos', 'Scattered tools and CMS', 'Outils et CMS dispersés'),
      l('Aprovações lentas', 'Slow approvals', 'Approbations lentes'),
      l('Ideias sem execução', 'Ideas without execution', 'Idées sans exécution'),
    ]),
    sb(l('Maturidade editorial', 'Editorial maturity', 'Maturité éditoriale'), [
      l('Publicação reativa', 'Reactive publishing', 'Publication réactive'),
      l('Calendário informal', 'Informal calendar', 'Calendrier informel'),
      l('Briefs e personas documentadas', 'Briefs and personas documented', 'Briefs et personas documentés'),
      l('KPIs e retro mensal', 'KPIs and monthly retro', 'KPIs et rétro mensuelle'),
      l('Playbook e owners por pilar', 'Playbook and owners per pillar', 'Playbook et owners par pilier'),
    ]),
  ],
  copywriting: [
    sb(l('Onde a copy mais falha', 'Where copy fails most', 'Où le copy échoue le plus'), [
      l('Headlines fracas ou genéricas', 'Weak or generic headlines', 'Headlines faibles ou génériques'),
      l('Proposta de valor pouco clara', 'Unclear value proposition', 'Proposition de valeur floue'),
      l('Páginas longas sem estrutura', 'Long pages, no structure', 'Pages longues sans structure'),
      l('Tom de voz inconsistente', 'Inconsistent tone of voice', 'Ton de voix incohérent'),
      l('CTAs confusos ou ausentes', 'Confusing or missing CTAs', 'CTA confus ou absent'),
    ]),
    sb(l('Objetivo principal da copy', 'Main copy goal', 'Objectif copy principal'), [
      l('Conversão em landing ou PDP', 'Conversion on landing or PDP', 'Conversion landing ou PDP'),
      l('Emails e sequências', 'Emails and sequences', 'Emails et séquences'),
      l('Anúncios e hooks curtos', 'Ads and short hooks', 'Ads et hooks courts'),
      l('Pitch e narrativa de marca', 'Pitch and brand narrative', 'Pitch et récit de marque'),
      l('Localização e variantes', 'Localisation and variants', 'Localisation et variantes'),
    ]),
    sb(l('Obstáculo típico', 'Typical obstacle', 'Obstacle typique'), [
      l('Muitos revisores com opiniões', 'Many reviewers, opinions', 'Nombreux relecteurs'),
      l('Legal ou compliance apertado', 'Tight legal / compliance', 'Legal / compliance strict'),
      l('Pouca pesquisa com clientes', 'Little customer research', 'Peu de recherche clients'),
      l('Traduções literais', 'Literal translations', 'Traductions littérales'),
      l('Falta de provas e dados na copy', 'No proof or data in copy', 'Pas de preuves dans le copy'),
    ]),
    sb(l('Maturidade de messaging', 'Messaging maturity', 'Maturité du messaging'), [
      l('Textos ad hoc por canal', 'Ad hoc copy per channel', 'Textes ad hoc par canal'),
      l('Algumas guidelines de tom', 'Some tone guidelines', 'Quelques guidelines de ton'),
      l('Biblioteca de claims aprovados', 'Library of approved claims', 'Bibliothèque de claims approuvés'),
      l('Testes A/B em headlines', 'A/B tests on headlines', 'Tests A/B sur headlines'),
      l('Messaging house e provas sociais', 'Messaging house and proof', 'Messaging house et preuves'),
    ]),
  ],
  'blog-content-writing': [
    sb(l('Estado do blog', 'Blog state', 'État du blog'), [
      l('Poucos artigos ou parado', 'Few posts or stalled', 'Peu d’articles ou à l’arrêt'),
      l('Temas dispersos sem clusters', 'Scattered topics, no clusters', 'Sujets dispersés'),
      l('SEO on-page fraco', 'Weak on-page SEO', 'SEO on-page faible'),
      l('Bom tráfego, baixa conversão', 'Good traffic, low conversion', 'Bon trafic, faible conversion'),
      l('Operação regular a escalar', 'Regular ops to scale', 'Ops régulières à scaler'),
    ]),
    sb(l('Prioridade dos artigos', 'Article priority', 'Priorité des articles'), [
      l('Rankear keywords transacionais', 'Rank transactional keywords', 'Ranquer mots transactionnels'),
      l('Educar topo de funil', 'Educate top of funnel', 'Éduquer haut de funnel'),
      l('Estudos de caso e provas', 'Case studies and proof', 'Études de cas et preuves'),
      l('Newsletter e série', 'Newsletter and series', 'Newsletter et série'),
      l('Atualizar conteúdos legados', 'Refresh legacy content', 'Rafraîchir contenu legacy'),
    ]),
    sb(l('O que mais atrasa publicação', 'What delays publishing most', 'Ce qui retarde la publication'), [
      l('Briefs vagos', 'Vague briefs', 'Briefs vagues'),
      l('Falta de SME interno', 'No internal SME', 'Pas de SME interne'),
      l('Imagens e media lentos', 'Slow imagery and media', 'Visuels et médias lents'),
      l('Revisão legal excessiva', 'Excessive legal review', 'Revue légale excessive'),
      l('CMS ou workflow confuso', 'Confusing CMS or workflow', 'CMS ou workflow confus'),
    ]),
    sb(l('Maturidade do programa blog', 'Blog programme maturity', 'Maturité du programme blog'), [
      l('Posts esporádicos', 'Sporadic posts', 'Articles sporadiques'),
      l('Calendário trimestral simples', 'Simple quarterly calendar', 'Calendrier trimestriel simple'),
      l('Templates e outlines', 'Templates and outlines', 'Templates et outlines'),
      l('Linking interno e atualizações', 'Internal linking and updates', 'Maillage interne et MAJ'),
      l('Governança SEO e métricas', 'SEO governance and metrics', 'Gouvernance SEO et métriques'),
    ]),
  ],
  storytelling: [
    sb(l('Narrativa atual da marca', 'Current brand narrative', 'Récit actuel de la marque'), [
      l('História pouco clara para outsiders', 'Story unclear to outsiders', 'Récit peu clair pour l’extérieur'),
      l('Foco em features, não em pessoas', 'Feature-led, not human', 'Features, pas humain'),
      l('Muitas versões conflituosas', 'Many conflicting versions', 'Versions conflictuelles'),
      l('Boa história, mal contada nos canais', 'Good story, badly told', 'Bonne histoire, mal racontée'),
      l('Narrativa alinhada mas estática', 'Aligned but static narrative', 'Récit aligné mais statique'),
    ]),
    sb(l('Objetivo do storytelling', 'Storytelling goal', 'Objectif storytelling'), [
      l('Emoção e memorização', 'Emotion and recall', 'Émotion et mémorisation'),
      l('Diferenciação vs concorrência', 'Differentiation vs competitors', 'Différenciation vs concurrence'),
      l('Alinhar equipa e parceiros', 'Align team and partners', 'Aligner équipe et partenaires'),
      l('Suportar campanhas e lançamentos', 'Support campaigns and launches', 'Soutenir campagnes et lancements'),
      l('Construir confiança B2B', 'Build B2B trust', 'Construire confiance B2B'),
    ]),
    sb(l('Principal desafio narrativo', 'Main narrative challenge', 'Principal défi narratif'), [
      l('Falta de protagonista claro', 'No clear protagonist', 'Pas de protagoniste clair'),
      l('Provas e dados fracos', 'Weak proof and data', 'Preuves et données faibles'),
      l('Medo de ser específico demais', 'Fear of being too specific', 'Peur d’être trop spécifique'),
      l('Tradução cultural', 'Cultural translation', 'Traduction culturelle'),
      l('Formato errado por canal', 'Wrong format per channel', 'Mauvais format par canal'),
    ]),
    sb(l('Maturidade do arc da marca', 'Brand arc maturity', 'Maturité de l’arc de marque'), [
      l('Anúncios isolados sem arco', 'Isolated ads, no arc', 'Ads isolés sans arc'),
      l('Alguns casos de cliente escritos', 'Some written customer stories', 'Quelques histoires clients'),
      l('Brand story deck interno', 'Internal brand story deck', 'Deck brand story interne'),
      l('Série de conteúdo com fio', 'Content series with thread', 'Série de contenu avec fil'),
      l('Playbook narrativo por jornada', 'Narrative playbook per journey', 'Playbook narratif par parcours'),
    ]),
  ],
  'brand-strategy': [
    sb(l('Momento estratégico da marca', 'Brand strategy moment', 'Moment stratégique marque'), [
      l('Reposicionamento ou pivot', 'Repositioning or pivot', 'Repositionnement ou pivot'),
      l('Fusão ou novo portefólio', 'Merger or new portfolio', 'Fusion ou nouveau portefeuille'),
      l('Entrada em novo mercado', 'Entering a new market', 'Entrée sur nouveau marché'),
      l('Crescimento sem direção clara', 'Growth without clear direction', 'Croissance sans cap clair'),
      l('Refresh sem mudar essência', 'Refresh without changing essence', 'Refresh sans changer l’essence'),
    ]),
    sb(l('Decisão mais urgente', 'Most urgent decision', 'Décision la plus urgente'), [
      l('Quem é o cliente ideal', 'Who is the ideal customer', 'Qui est le client idéal'),
      l('Categoria e alternativas', 'Category and alternatives', 'Catégorie et alternatives'),
      l('Proposta de valor e provas', 'Value proposition and proof', 'Proposition de valeur et preuves'),
      l('Arquitetura de marca / submarcas', 'Brand / sub-brand architecture', 'Architecture de marque'),
      l('Tom de voz e princípios', 'Tone of voice and principles', 'Ton et principes'),
    ]),
    sb(l('Obstáculo à decisão', 'Decision obstacle', 'Obstacle à la décision'), [
      l('Stakeholders com visões opostas', 'Opposing stakeholder views', 'Stakeholders en désaccord'),
      l('Dados de mercado insuficientes', 'Insufficient market data', 'Données marché insuffisantes'),
      l('Medo de alienar segmento', 'Fear of alienating a segment', 'Peur d’aliéner un segment'),
      l('Herança visual forte demais', 'Visual legacy too strong', 'Héritage visuel trop fort'),
      l('Prazo de lançamento iminente', 'Launch deadline imminent', 'Deadline de lancement imminente'),
    ]),
    sb(l('Maturidade estratégica', 'Strategic maturity', 'Maturité stratégique'), [
      l('Intuição e opiniões', 'Intuition and opinions', 'Intuition et opinions'),
      l('Alguns workshops feitos', 'Some workshops done', 'Quelques workshops'),
      l('Documento de posicionamento v1', 'Positioning doc v1', 'Doc positionnement v1'),
      l('Pesquisa e entrevistas resumidas', 'Research and interviews summarised', 'Recherche et interviews synthétisées'),
      l('OKRs ou métricas de marca', 'Brand OKRs or metrics', 'OKRs ou métriques de marque'),
    ]),
  ],
  'social-media-content': [
    sb(l('Desafio em redes sociais', 'Social media challenge', 'Défi réseaux sociaux'), [
      l('Presença irregular', 'Irregular presence', 'Présence irrégulière'),
      l('Baixo engagement orgânico', 'Low organic engagement', 'Engagement organique faible'),
      l('Conteúdo desalinhado com vendas', 'Content misaligned with sales', 'Contenu désaligné avec ventes'),
      l('Muitos canais, pouco foco', 'Many channels, little focus', 'Beaucoup de canaux, peu de focus'),
      l('Boa base, falta escala', 'Good base, needs scale', 'Bonne base, besoin de scale'),
    ]),
    sb(l('Objetivo do conteúdo social', 'Social content goal', 'Objectif contenu social'), [
      l('Comunidade e conversa', 'Community and conversation', 'Communauté et conversation'),
      l('Tráfego para site ou loja', 'Traffic to site or store', 'Trafic vers site ou magasin'),
      l('Prova social e UGC', 'Social proof and UGC', 'Preuve sociale et UGC'),
      l('Suporte a campanhas paid', 'Support paid campaigns', 'Soutien campagnes paid'),
      l('Recrutamento e employer brand', 'Hiring and employer brand', 'Recrutement et marque employeur'),
    ]),
    sb(l('Obstáculo operacional', 'Operational obstacle', 'Obstacle opérationnel'), [
      l('Sem roteiro nem pilares', 'No storyline or pillars', 'Pas de fil ni piliers'),
      l('Produção lenta ou cara', 'Slow or costly production', 'Production lente ou chère'),
      l('Falta de criativo aprovado', 'No approved creative', 'Pas de créa approuvée'),
      l('Moderação e comentários', 'Moderation and comments', 'Modération et commentaires'),
      l('Métricas vanity sem ação', 'Vanity metrics, no action', 'Métriques vanity sans action'),
    ]),
    sb(l('Maturidade do calendário social', 'Social calendar maturity', 'Maturité calendrier social'), [
      l('Posts quando há tempo', 'Posts when there is time', 'Posts quand il y a du temps'),
      l('Calendário mensal informal', 'Informal monthly calendar', 'Calendrier mensuel informel'),
      l('Pilares e buckets definidos', 'Pillars and buckets defined', 'Piliers et buckets définis'),
      l('Workflow aprovação em 48h', '48h approval workflow', 'Workflow approbation 48h'),
      l('Relatório com insights acionáveis', 'Report with actionable insights', 'Rapport avec insights actionnables'),
    ]),
  ],
  'digital-advertising': [
    sb(l('Situação do paid media', 'Paid media situation', 'Situation paid media'), [
      l('Contas novas ou pouco dados', 'New accounts or little data', 'Comptes neufs ou peu de données'),
      l('CPA alto ou inconsistente', 'High or inconsistent CPA', 'CPA élevé ou instable'),
      l('Criativos em fadiga', 'Creative fatigue', 'Fatigue créative'),
      l('Atribuição confusa', 'Confusing attribution', 'Attribution confuse'),
      l('Escala com margem saudável', 'Scale with healthy margin', 'Scale avec marge saine'),
    ]),
    sb(l('Objetivo principal de performance', 'Main performance goal', 'Objectif perf principal'), [
      l('Volume de leads ou vendas', 'Lead or sales volume', 'Volume leads ou ventes'),
      l('Custo por resultado', 'Cost per outcome', 'Coût par résultat'),
      l('Teste de mensagens e ofertas', 'Test messages and offers', 'Tester messages et offres'),
      l('Remarketing e recuperação', 'Remarketing and recovery', 'Remarketing et récupération'),
      l('Awareness com controlo de frequência', 'Awareness with frequency cap', 'Notoriété avec cap de fréquence'),
    ]),
    sb(l('Principal desperdício ou risco', 'Main waste or risk', 'Principal gaspillage ou risque'), [
      l('Audiências demasiado largas', 'Audiences too broad', 'Audiences trop larges'),
      l('Landing alinhada com anúncio', 'Landing misaligned with ad', 'Landing désalignée avec l’ad'),
      l('Pixel / conversões mal configurados', 'Pixels / conversions misconfigured', 'Pixels / conversions mal configurés'),
      l('Orçamento fragmentado', 'Fragmented budget', 'Budget fragmenté'),
      l('Falta de criativo suficiente', 'Not enough creative', 'Pas assez de créas'),
    ]),
    sb(l('Maturidade de growth ads', 'Growth ads maturity', 'Maturité growth ads'), [
      l('Boost posts sem estratégia', 'Boost posts, no strategy', 'Boost posts sans stratégie'),
      l('Alguns testes A/B simples', 'Some simple A/B tests', 'Quelques tests A/B simples'),
      l('Naming conventions e UTMs', 'Naming and UTMs', 'Naming et UTMs'),
      l('Creative testing sistemático', 'Systematic creative testing', 'Tests créas systématiques'),
      l('Modelos de atribuição acordados', 'Agreed attribution models', 'Modèles d’attribution alignés'),
    ]),
  ],
  consultoria: [
    sb(l('Porque procuras consultoria', 'Why you seek consulting', 'Pourquoi du conseil'), [
      l('Crescimento travado', 'Growth is stuck', 'Croissance bloquée'),
      l('Reorganização de marketing', 'Marketing reorganisation', 'Réorganisation marketing'),
      l('Due diligence ou investimento', 'Due diligence or investment', 'Due diligence ou investissement'),
      l('Entrada em novo país', 'Entering a new country', 'Entrée dans un nouveau pays'),
      l('Auditoria antes de tender', 'Audit before a tender', 'Audit avant appel d’offres'),
    ]),
    sb(l('Âmbito mais importante', 'Most important scope', 'Périmètre le plus important'), [
      l('Estratégia e posicionamento', 'Strategy and positioning', 'Stratégie et positionnement'),
      l('Operação e processos', 'Operations and processes', 'Opérations et processus'),
      l('Dados, CRM e automação', 'Data, CRM and automation', 'Données, CRM et automation'),
      l('Criativo e conteúdo', 'Creative and content', 'Créatif et contenu'),
      l('Parcerias e canais', 'Partnerships and channels', 'Partenariats et canaux'),
    ]),
    sb(l('Principal constrangimento', 'Main constraint', 'Contrainte principale'), [
      l('Tempo da direção limitado', 'Limited leadership time', 'Temps direction limité'),
      l('Resistência interna a mudança', 'Internal resistance to change', 'Résistance interne au changement'),
      l('Ferramentas e dados legados', 'Legacy tools and data', 'Outils et données legacy'),
      l('Orçamento incerto', 'Uncertain budget', 'Budget incertain'),
      l('Prazo curto para entregáveis', 'Short deadline for deliverables', 'Délais courts pour livrables'),
    ]),
    sb(l('Maturidade de governança', 'Governance maturity', 'Maturité gouvernance'), [
      l('Decisões ad hoc', 'Ad hoc decisions', 'Décisions ad hoc'),
      l('Alguns OKRs ou KPIs', 'Some OKRs or KPIs', 'Quelques OKRs ou KPIs'),
      l('RACI par iniciativa', 'RACI per initiative', 'RACI par initiative'),
      l('Revisões trimestrais formais', 'Formal quarterly reviews', 'Revues trimestrielles formelles'),
      l('Playbook partilhado com agency', 'Shared playbook with agency', 'Playbook partagé avec l’agence'),
    ]),
  ],
};
