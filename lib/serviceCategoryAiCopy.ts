import type { ServicePageCategory } from '@/lib/servicePagesMessages';

export type ServiceAiLocale = 'pt' | 'en' | 'fr';

export interface ServiceAiOptionSets {
  situations: string[];
  goals: string[];
  obstacles: string[];
  maturities: string[];
}

const OPTION_COUNT = 5;

function assertLen(arr: string[], name: string) {
  if (arr.length !== OPTION_COUNT) {
    throw new Error(`serviceCategoryAiCopy: expected ${OPTION_COUNT} ${name}`);
  }
}

const OPTIONS: Record<ServiceAiLocale, Record<ServicePageCategory, ServiceAiOptionSets>> = {
  pt: {
    design: {
      situations: [
        'Identidade inconsistente entre canais',
        'Rebrand ou refresh necessário',
        'Marca nova / pré-lançamento',
        'A escalar criativo sem sistema',
        'Sem guidelines ou desatualizadas',
      ],
      goals: [
        'Mais reconhecimento e memorização',
        'Guias claros para equipas',
        'Embalagem / digital alinhados',
        'Lançar com impacto visual forte',
        'Reduzir retrabalho criativo',
      ],
      obstacles: [
        'Falta de tempo ou prioridade interna',
        'Muitos fornecedores sem direção',
        'Orçamento limitado',
        'Decisões por comité lentas',
        'Não sabemos por onde começar',
      ],
      maturities: [
        'Só logótipo, pouco mais',
        'Alguns templates soltos',
        'Manual parcial ou pouco usado',
        'Sistema razoável mas desatualizado',
        'Sistema vivo com revisões',
      ],
    },
    marketing: {
      situations: [
        'Conteúdo sem direção clara',
        'Canais desalinhados',
        'Pouca conversão apesar de tráfego',
        'Tom de voz inconsistente',
        'Campanhas isoladas sem narrativa',
      ],
      goals: [
        'Mais leads qualificados',
        'Autoridade e SEO/AEO',
        'Consistência editorial',
        'Melhor ROI em paid',
        'Alinhar vendas e marketing',
      ],
      obstacles: [
        'Falta de dados ou métricas',
        'Equipa pequena',
        'Ferramentas dispersas',
        'Mudanças de prioridade frequentes',
        'Conteúdo genérico',
      ],
      maturities: [
        'Publicação ad hoc',
        'Calendário informal',
        'KPIs básicos acompanhados',
        'Testes e otimização recorrentes',
        'Operação estruturada com owners',
      ],
    },
    audiovisual: {
      situations: [
        'Produções irregulares ou amadoras',
        'Briefs pouco claros',
        'Muitos formatos, pouco planeados',
        'Som ou imagem fracos',
        'Pós-produção caótica',
      ],
      goals: [
        'Vídeos institucionais fortes',
        'Conteúdo social contínuo',
        'Eventos bem documentados',
        'Anúncios com criativo sólido',
        'História emocional clara',
      ],
      obstacles: [
        'Prazos apertados',
        'Orçamento limitado',
        'Locações ou talentos difíceis',
        'Falta de arquivo organizado',
        'Direitos ou música incertos',
      ],
      maturities: [
        'Gravações pontuais sem processo',
        'Alguns templates de entrega',
        'Checklists de produção',
        'Pipeline com revisões',
        'Produção recorrente com fornecedores estáveis',
      ],
    },
    animacao: {
      situations: [
        'Explicar produto complexo',
        'Feeds com pouco movimento',
        'Falta de storyboard ou conceito',
        'Renders lentos ou caros',
        'Inconsistência visual vs marca',
      ],
      goals: [
        'Motion para campanhas paid',
        'Tutoriais / onboarding animados',
        'Destaque em social em segundos',
        'VFX para elevar produção',
        'Biblioteca de motion reutilizável',
      ],
      obstacles: [
        'Ficheiros fonte desorganizados',
        'Muitas revisões sem limite',
        'Falta de skills 3D internas',
        'Export errado por canal',
        'Conceito muda a meio',
      ],
      maturities: [
        'Animações pontuais',
        'Alguns templates motion',
        'Convenções de projeto definidas',
        'Animatic antes de render pesado',
        'Versionamento e arquivo claros',
      ],
    },
  },
  en: {
    design: {
      situations: [
        'Inconsistent identity across touchpoints',
        'Rebrand or refresh needed',
        'New brand / pre-launch',
        'Scaling creative without a system',
        'Missing or outdated guidelines',
      ],
      goals: [
        'Stronger recognition and recall',
        'Clear guides for teams',
        'Packaging / digital aligned',
        'Launch with strong visual impact',
        'Reduce creative rework',
      ],
      obstacles: [
        'Limited time or internal priority',
        'Many vendors, no direction',
        'Tight budget',
        'Slow committee decisions',
        'Unsure where to start',
      ],
      maturities: [
        'Logo only, little else',
        'Some loose templates',
        'Partial or unused manual',
        'Reasonable system but dated',
        'Living system with reviews',
      ],
    },
    marketing: {
      situations: [
        'Content without clear direction',
        'Misaligned channels',
        'Low conversion despite traffic',
        'Inconsistent tone of voice',
        'Isolated campaigns, weak narrative',
      ],
      goals: [
        'More qualified leads',
        'Authority and SEO/AEO',
        'Editorial consistency',
        'Better paid ROI',
        'Align sales and marketing',
      ],
      obstacles: [
        'Weak data or metrics',
        'Small team',
        'Scattered tools',
        'Frequent priority shifts',
        'Generic content',
      ],
      maturities: [
        'Ad hoc publishing',
        'Informal calendar',
        'Basic KPI tracking',
        'Regular tests and optimization',
        'Structured ops with owners',
      ],
    },
    audiovisual: {
      situations: [
        'Irregular or amateur productions',
        'Unclear briefs',
        'Many formats, little planning',
        'Weak sound or picture',
        'Chaotic post-production',
      ],
      goals: [
        'Strong corporate films',
        'Steady social content',
        'Events well documented',
        'Ads with solid creative',
        'Clear emotional story',
      ],
      obstacles: [
        'Tight deadlines',
        'Limited budget',
        'Hard locations or talent',
        'No organized archive',
        'Uncertain rights or music',
      ],
      maturities: [
        'Occasional shoots, no process',
        'Some delivery templates',
        'Production checklists',
        'Pipeline with review rounds',
        'Recurring production, stable partners',
      ],
    },
    animacao: {
      situations: [
        'Explain a complex product',
        'Feeds lack motion',
        'Missing storyboard or concept',
        'Slow or costly renders',
        'Visuals misaligned with brand',
      ],
      goals: [
        'Motion for paid campaigns',
        'Animated tutorials / onboarding',
        'Stop-scroll social clips',
        'VFX to elevate production',
        'Reusable motion library',
      ],
      obstacles: [
        'Messy source files',
        'Unbounded review rounds',
        'No internal 3D skills',
        'Wrong exports per channel',
        'Concept shifts mid-project',
      ],
      maturities: [
        'One-off animations',
        'Some motion templates',
        'Defined project conventions',
        'Animatic before heavy render',
        'Clear versioning and archive',
      ],
    },
  },
  fr: {
    design: {
      situations: [
        'Identité incohérente entre canaux',
        'Rebrand ou refresh nécessaire',
        'Nouvelle marque / pré-lancement',
        'Scaler le créatif sans système',
        'Pas de guidelines ou obsolètes',
      ],
      goals: [
        'Meilleure reconnaissance',
        'Guides clairs pour les équipes',
        'Packaging / digital alignés',
        'Lancement avec fort impact visuel',
        'Réduire le rework créatif',
      ],
      obstacles: [
        'Peu de temps ou priorité interne',
        'Nombreux fournisseurs sans direction',
        'Budget serré',
        'Décisions lentes en comité',
        'Ne savent pas par où commencer',
      ],
      maturities: [
        'Logo seulement',
        'Quelques templates isolés',
        'Manuel partiel ou peu utilisé',
        'Système correct mais daté',
        'Système vivant avec revues',
      ],
    },
    marketing: {
      situations: [
        'Contenu sans direction claire',
        'Canaux désalignés',
        'Peu de conversion malgré le trafic',
        'Ton de voix incohérent',
        'Campagnes isolées, peu de récit',
      ],
      goals: [
        'Plus de leads qualifiés',
        'Autorité et SEO/AEO',
        'Cohérence éditoriale',
        'Meilleur ROI paid',
        'Aligner ventes et marketing',
      ],
      obstacles: [
        'Données ou métriques faibles',
        'Petite équipe',
        'Outils dispersés',
        'Changements de priorité fréquents',
        'Contenu générique',
      ],
      maturities: [
        'Publication ad hoc',
        'Calendrier informel',
        'KPI de base suivis',
        'Tests et optimisation réguliers',
        'Opération structurée avec owners',
      ],
    },
    audiovisual: {
      situations: [
        'Productions irrégulières ou amateur',
        'Briefs peu clairs',
        'Nombreux formats, peu de plan',
        'Son ou image faibles',
        'Post-production chaotique',
      ],
      goals: [
        'Films institutionnels forts',
        'Contenu social continu',
        'Événements bien documentés',
        'Ads avec créatif solide',
        'Histoire émotionnelle claire',
      ],
      obstacles: [
        'Délais serrés',
        'Budget limité',
        'Lieux ou talents difficiles',
        'Pas d’archive organisée',
        'Droits ou musique incertains',
      ],
      maturities: [
        'Tournages ponctuels sans process',
        'Quelques templates de livraison',
        'Checklists de production',
        'Pipeline avec revues',
        'Production récurrente, partenaires stables',
      ],
    },
    animacao: {
      situations: [
        'Expliquer un produit complexe',
        'Feeds peu animés',
        'Pas de storyboard ou concept',
        'Rendus lents ou coûteux',
        'Incohérence avec la marque',
      ],
      goals: [
        'Motion pour campagnes paid',
        'Tutoriels / onboarding animés',
        'Formats courts qui arrêtent le scroll',
        'VFX pour élever la prod',
        'Bibliothèque motion réutilisable',
      ],
      obstacles: [
        'Fichiers sources désorganisés',
        'Trop de rounds de revue',
        'Pas de compétences 3D internes',
        'Mauvais exports par canal',
        'Changement de concept en cours',
      ],
      maturities: [
        'Animations ponctuelles',
        'Quelques templates motion',
        'Conventions de projet définies',
        'Animatic avant rendu lourd',
        'Versioning et archive clairs',
      ],
    },
  },
};

for (const loc of ['pt', 'en', 'fr'] as const) {
  for (const cat of ['design', 'marketing', 'audiovisual', 'animacao'] as const) {
    const o = OPTIONS[loc][cat];
    assertLen(o.situations, 'situations');
    assertLen(o.goals, 'goals');
    assertLen(o.obstacles, 'obstacles');
    assertLen(o.maturities, 'maturities');
  }
}

export interface ServiceAiChrome {
  /** Main heading on the start screen (MarTech diagnostic style). */
  startHeroTitle: string;
  /** Subtitle; include `{service}` where the service name should appear. */
  startHeroSubtitle: string;
  /** Label under the big step count (e.g. “questions”). */
  startQuestionsLabel: string;
  startFreeLabel: string;
  startNoSignup: string;
  startButton: string;
  stepOf: string;
  of: string;
  fields: {
    websiteUrl: string;
    noWebsite: string;
    companyContext: string;
    industry: string;
    situation: string;
    primaryGoal: string;
    mainObstacle: string;
    maturity: string;
  };
  next: string;
  submitButton: string;
  back: string;
  loading: string;
  errorSubmit: string;
  suggestFromWebsiteLoading: string;
  suggestFromWebsiteError: string;
  title: string;
  result: {
    scoreLabel: string;
    maturityLabel: string;
    summaryLabel: string;
    frictionsLabel: string;
    leaksLabel: string;
    actionsLabel: string;
    ctaButton: string;
    downloadPdf: string;
    pdfCtaHint: string;
    pdfCtaButton: string;
  };
  maturity: { early: string; emerging: string; structured: string; advanced: string };
  severity: { low: string; medium: string; high: string };
  pdfFilename: string;
}

const CHROME: Record<ServiceAiLocale, ServiceAiChrome> = {
  pt: {
    startHeroTitle: 'Diagnóstico de serviço com IA',
    startHeroSubtitle:
      'Descobre em poucos minutos onde estás com {service} e que passos dar a seguir.',
    startQuestionsLabel: 'perguntas',
    startFreeLabel: 'Grátis',
    startNoSignup: 'Sem registo',
    startButton: 'Começar diagnóstico',
    stepOf: 'Pergunta',
    of: 'de',
    fields: {
      websiteUrl: 'Website (opcional)',
      noWebsite: 'Ainda não tenho website',
      companyContext: 'Contexto do negócio ou oferta',
      industry: 'Setor ou indústria',
      situation: 'Situação atual',
      primaryGoal: 'Objetivo principal',
      mainObstacle: 'Maior obstáculo',
      maturity: 'Maturidade nesta área',
    },
    next: 'Seguinte',
    submitButton: 'Obter relatório',
    back: 'Voltar',
    loading: 'A gerar o teu relatório…',
    errorSubmit: 'Não foi possível concluir. Tenta novamente.',
    suggestFromWebsiteLoading: 'A sugerir dados a partir do site…',
    suggestFromWebsiteError: 'Não conseguimos ler o site. Preenche manualmente.',
    title: 'O teu relatório',
    result: {
      scoreLabel: 'Score',
      maturityLabel: 'Nível de maturidade',
      summaryLabel: 'Resumo',
      frictionsLabel: 'Pontos de fricção',
      leaksLabel: 'Oportunidades e lacunas',
      actionsLabel: 'Próximos passos sugeridos',
      ctaButton: 'Falar com a Flowi',
      downloadPdf: 'Descarregar PDF',
      pdfCtaHint: 'Abre o chat Flowi para um plano personalizado:',
      pdfCtaButton: 'Abrir Flowi',
    },
    maturity: {
      early: 'Inicial',
      emerging: 'Em evolução',
      structured: 'Estruturado',
      advanced: 'Avançado',
    },
    severity: { low: 'Baixa', medium: 'Média', high: 'Alta' },
    pdfFilename: 'relatorio-servico-flow.pdf',
  },
  en: {
    startHeroTitle: 'AI service diagnostic',
    startHeroSubtitle:
      'Discover in a couple of minutes where you stand with {service} and what to do next.',
    startQuestionsLabel: 'questions',
    startFreeLabel: 'Free',
    startNoSignup: 'No signup',
    startButton: 'Start diagnostic',
    stepOf: 'Question',
    of: 'of',
    fields: {
      websiteUrl: 'Website (optional)',
      noWebsite: 'I do not have a website yet',
      companyContext: 'Business or offer context',
      industry: 'Industry',
      situation: 'Current situation',
      primaryGoal: 'Primary goal',
      mainObstacle: 'Main obstacle',
      maturity: 'Maturity in this area',
    },
    next: 'Next',
    submitButton: 'Get report',
    back: 'Back',
    loading: 'Generating your report…',
    errorSubmit: 'Something went wrong. Please try again.',
    suggestFromWebsiteLoading: 'Suggesting details from your site…',
    suggestFromWebsiteError: 'We could not read the site. Fill in manually.',
    title: 'Your report',
    result: {
      scoreLabel: 'Score',
      maturityLabel: 'Maturity level',
      summaryLabel: 'Summary',
      frictionsLabel: 'Friction points',
      leaksLabel: 'Gaps and opportunities',
      actionsLabel: 'Suggested next steps',
      ctaButton: 'Talk to Flowi',
      downloadPdf: 'Download PDF',
      pdfCtaHint: 'Open Flowi chat for a tailored plan:',
      pdfCtaButton: 'Open Flowi',
    },
    maturity: {
      early: 'Early',
      emerging: 'Emerging',
      structured: 'Structured',
      advanced: 'Advanced',
    },
    severity: { low: 'Low', medium: 'Medium', high: 'High' },
    pdfFilename: 'flow-service-report.pdf',
  },
  fr: {
    startHeroTitle: 'Diagnostic de service IA',
    startHeroSubtitle:
      'Découvrez en quelques minutes où vous en êtes avec {service} et quoi faire ensuite.',
    startQuestionsLabel: 'questions',
    startFreeLabel: 'Gratuit',
    startNoSignup: 'Sans inscription',
    startButton: 'Lancer le diagnostic',
    stepOf: 'Question',
    of: 'sur',
    fields: {
      websiteUrl: 'Site web (optionnel)',
      noWebsite: 'Je n’ai pas encore de site',
      companyContext: 'Contexte de l’offre ou de l’entreprise',
      industry: 'Secteur',
      situation: 'Situation actuelle',
      primaryGoal: 'Objectif principal',
      mainObstacle: 'Principal obstacle',
      maturity: 'Maturité dans ce domaine',
    },
    next: 'Suivant',
    submitButton: 'Obtenir le rapport',
    back: 'Retour',
    loading: 'Génération du rapport…',
    errorSubmit: 'Une erreur s’est produite. Réessayez.',
    suggestFromWebsiteLoading: 'Suggestion à partir du site…',
    suggestFromWebsiteError: 'Impossible de lire le site. Remplissez manuellement.',
    title: 'Votre rapport',
    result: {
      scoreLabel: 'Score',
      maturityLabel: 'Niveau de maturité',
      summaryLabel: 'Résumé',
      frictionsLabel: 'Points de friction',
      leaksLabel: 'Lacunes et opportunités',
      actionsLabel: 'Prochaines étapes suggérées',
      ctaButton: 'Parler à Flowi',
      downloadPdf: 'Télécharger le PDF',
      pdfCtaHint: 'Ouvrez le chat Flowi pour un plan sur mesure :',
      pdfCtaButton: 'Ouvrir Flowi',
    },
    maturity: {
      early: 'Naissant',
      emerging: 'En progression',
      structured: 'Structuré',
      advanced: 'Avancé',
    },
    severity: { low: 'Faible', medium: 'Moyenne', high: 'Élevée' },
    pdfFilename: 'rapport-service-flow.pdf',
  },
};

export function normalizeServiceAiLocale(locale: string): ServiceAiLocale {
  if (locale === 'pt' || locale === 'fr') return locale;
  return 'en';
}

export function getServiceAiChrome(locale: string): ServiceAiChrome {
  return CHROME[normalizeServiceAiLocale(locale)];
}

export function getServiceAiOptions(locale: string, category: ServicePageCategory): ServiceAiOptionSets {
  return OPTIONS[normalizeServiceAiLocale(locale)][category];
}
