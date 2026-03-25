import { SERVICE_PAGE_SLUGS, type ServicePageSlug } from '@/lib/serviceItemRoutes';
import { getServicePageSeo } from '@/lib/servicePageSeo';

type Lang = 'pt' | 'en' | 'fr';
type L3 = Record<Lang, string>;
export type ServicePageCategory = 'design' | 'marketing' | 'audiovisual' | 'animacao';
type Cat = ServicePageCategory;

export interface ServicePageMessage {
  metaTitle: string;
  metaDescription: string;
  /** Page-specific terms for `<meta name="keywords">` (SEO + topical relevance). */
  seoKeywords: string[];
  hero: { label: string; title: string; subtitle: string };
  intro: { text: string };
  whatIs: { title: string; items: Array<{ term: string; description: string }> };
  forWho: { title: string; subtitle: string; items: string[] };
  diagnostic: { title: string; description: string; cta: string };
  delivers: { title: string; items: string[] };
  improvements: { title: string; items: string[] };
  faqSectionTitle: string;
  schemaFaqs: Array<{ question: string; answer: string }>;
}

const CATEGORY_LABEL: Record<Cat, L3> = {
  design: { pt: 'Design', en: 'Design', fr: 'Design' },
  marketing: { pt: 'Marketing', en: 'Marketing', fr: 'Marketing' },
  audiovisual: { pt: 'Audiovisual', en: 'Audiovisual', fr: 'Audiovisual' },
  animacao: { pt: 'Animação', en: 'Animation', fr: 'Animation' },
};

const INTRO_TAIL: Record<Cat, L3> = {
  design: {
    pt: 'Unimos pesquisa, conceito e execução para materiais coerentes com a tua marca.',
    en: 'We combine research, concept and craft so every asset stays true to your brand.',
    fr: 'Nous combinons recherche, concept et exécution pour des supports alignés sur votre marque.',
  },
  marketing: {
    pt: 'Planeamos mensagens e canais com foco em clareza, consistência e resultados mensuráveis.',
    en: 'We plan messages and channels for clarity, consistency and measurable outcomes.',
    fr: 'Nous planifions messages et canaux pour la clarté, la cohérence et des résultats mesurables.',
  },
  audiovisual: {
    pt: 'Da pré-produção à entrega final, cuidamos de narrativa, imagem e som com padrão broadcast.',
    en: 'From pre-production to final delivery, we care for story, picture and sound at broadcast quality.',
    fr: 'De la pré-production à la livraison, nous soignons récit, image et son avec une qualité broadcast.',
  },
  animacao: {
    pt: 'Do storyboard ao render, criamos movimento que explica, convence e escala em vários formatos.',
    en: 'From storyboard to render, we create motion that explains, persuades and scales across formats.',
    fr: 'Du storyboard au rendu, nous créons du mouvement qui explique, convainc et s’adapte aux formats.',
  },
};

function designContent(lang: Lang, title: string): Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'> {
  const blocks: Record<
    Lang,
    () => Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'>
  > = {
    pt: () => ({
      whatIs: {
        title: `Como trabalhamos ${title}`,
        items: [
          {
            term: 'Estratégia visual',
            description: `Antes de produzir, alinhamos objetivos, público e posicionamento para guiar decisões de ${title.toLowerCase()}.`,
          },
          {
            term: 'Conceito e craft',
            description: 'Exploramos referências, esboços e protótipos até encontrar uma solução distinta e aplicável.',
          },
          {
            term: 'Implementação',
            description: 'Entregamos ficheiros, especificações e orientações para equipas internas ou parceiros aplicarem bem.',
          },
        ],
      },
      forWho: {
        title: 'Para quem é este serviço?',
        subtitle: 'Ideal se queres elevar percepção de marca sem perder consistência.',
        items: [
          `Marcas que precisam de ${title.toLowerCase()} mais coerente entre canais.`,
          'Equipas de marketing ou produto sem designer dedicado a tempo inteiro.',
          'Startups a preparar lançamento ou rebranding com prazos apertados.',
          'Empresas que já produzem conteúdo mas sentem falta de direção criativa.',
        ],
      },
      diagnostic: {
        title: 'Queres um diagnóstico rápido?',
        description: `Completa um diagnóstico com IA e recebe um relatório com prioridades para o teu ${title.toLowerCase()}.`,
        cta: 'Fazer diagnóstico',
      },
      delivers: {
        title: 'O que entregamos',
        items: [
          'Conceito visual e direção de arte alinhados com a estratégia.',
          'Peças e layouts prontos a produzir ou publicar.',
          'Guias ou notas de aplicação para manter consistência.',
          'Acompanhamento de revisões até à versão final aprovada.',
        ],
      },
      improvements: {
        title: 'O que vai melhorar',
        items: [
          'Reconhecimento e memória de marca mais fortes.',
          'Menos retrabalho entre equipas e fornecedores.',
          'Materiais mais claros para vendas e marketing.',
          'Base sólida para campanhas e novos canais.',
        ],
      },
      faqSectionTitle: 'Perguntas frequentes',
      schemaFaqs: [
        {
          question: `Quanto tempo demora um projeto de ${title}?`,
          answer:
            'Depende do âmbito e revisões. Na conversa inicial definimos entregas, marcos e prazo realista para a tua equipa.',
        },
        {
          question: 'Trabalham à distância?',
          answer:
            'Sim. Acompanhámos marcas em Portugal e no estrangeiro com rituais de aprovação claros e partilha de ficheiros centralizada.',
        },
      ],
    }),
    en: () => ({
      whatIs: {
        title: `How we approach ${title}`,
        items: [
          {
            term: 'Visual strategy',
            description: `Before production we align goals, audience and positioning to steer ${title.toLowerCase()} decisions.`,
          },
          {
            term: 'Concept and craft',
            description: 'We explore references, sketches and prototypes until the idea is distinct and shippable.',
          },
          {
            term: 'Implementation',
            description: 'We hand off files, specs and guidance so internal teams or partners can apply everything correctly.',
          },
        ],
      },
      forWho: {
        title: 'Who is this for?',
        subtitle: 'Best when you want higher brand perception without losing consistency.',
        items: [
          `Brands that need more coherent ${title.toLowerCase()} across touchpoints.`,
          'Marketing or product teams without a full-time senior designer.',
          'Startups preparing a launch or rebrand under time pressure.',
          'Companies that already ship content but lack creative direction.',
        ],
      },
      diagnostic: {
        title: 'Want a quick diagnostic?',
        description: `Complete an AI diagnostic and get a prioritized report for your ${title.toLowerCase()}.`,
        cta: 'Start diagnostic',
      },
      delivers: {
        title: 'What we deliver',
        items: [
          'Visual concept and art direction tied to strategy.',
          'Layouts and assets ready for production or publishing.',
          'Guidelines or application notes to keep things consistent.',
          'Revision rounds until the approved final.',
        ],
      },
      improvements: {
        title: 'What improves',
        items: [
          'Stronger brand recognition and recall.',
          'Less rework between teams and vendors.',
          'Clearer materials for sales and marketing.',
          'A solid base for campaigns and new channels.',
        ],
      },
      faqSectionTitle: 'Frequently asked questions',
      schemaFaqs: [
        {
          question: `How long does a ${title} project take?`,
          answer:
            'It depends on scope and rounds of feedback. In the kickoff we agree milestones and a realistic timeline for your team.',
        },
        {
          question: 'Do you work remotely?',
          answer:
            'Yes. We support brands in Portugal and abroad with clear approval rituals and centralized file sharing.',
        },
      ],
    }),
    fr: () => ({
      whatIs: {
        title: `Comment nous travaillons le ${title}`,
        items: [
          {
            term: 'Stratégie visuelle',
            description: `Avant la production, nous alignons objectifs, public et positionnement pour guider le ${title.toLowerCase()}.`,
          },
          {
            term: 'Concept et exécution',
            description: 'Nous explorons références, esquisses et prototypes jusqu’à une idée distinctive et réalisable.',
          },
          {
            term: 'Mise en œuvre',
            description: 'Nous livrons fichiers, spécifications et repères pour que vos équipes ou partenaires appliquent bien.',
          },
        ],
      },
      forWho: {
        title: 'Pour qui?',
        subtitle: 'Idéal pour élever la perception de marque sans perdre en cohérence.',
        items: [
          `Marques qui veulent un ${title.toLowerCase()} plus cohérent sur les points de contact.`,
          'Équipes marketing ou produit sans designer senior à temps plein.',
          'Startups qui préparent un lancement ou un rebranding avec des délais serrés.',
          'Entreprises qui produisent déjà du contenu mais manquent de direction créative.',
        ],
      },
      diagnostic: {
        title: 'Un diagnostic rapide?',
        description: `Complétez un diagnostic IA et recevez un rapport priorisé pour votre ${title.toLowerCase()}.`,
        cta: 'Lancer le diagnostic',
      },
      delivers: {
        title: 'Ce que nous livrons',
        items: [
          'Concept visuel et direction artistique alignés sur la stratégie.',
          'Mises en page et assets prêts pour production ou publication.',
          'Guides ou notes d’application pour garder la cohérence.',
          'Cycles de révision jusqu’à la version finale validée.',
        ],
      },
      improvements: {
        title: 'Ce qui s’améliore',
        items: [
          'Meilleure reconnaissance et mémorisation de la marque.',
          'Moins de retravail entre équipes et fournisseurs.',
          'Supports plus clairs pour ventes et marketing.',
          'Une base solide pour campagnes et nouveaux canaux.',
        ],
      },
      faqSectionTitle: 'Questions fréquentes',
      schemaFaqs: [
        {
          question: `Combien de temps dure un projet de ${title}?`,
          answer:
            'Cela dépend du périmètre et des itérations. Lors du kick-off nous fixons jalons et un calendrier réaliste.',
        },
        {
          question: 'Travaillez-vous à distance?',
          answer:
            'Oui. Nous accompagnons des marques au Portugal et à l’international avec des validations claires et un partage de fichiers centralisé.',
        },
      ],
    }),
  };
  return blocks[lang]();
}

function marketingContent(lang: Lang, title: string): Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'> {
  const blocks: Record<
    Lang,
    () => Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'>
  > = {
    pt: () => ({
      whatIs: {
        title: `O que inclui ${title}`,
        items: [
          {
            term: 'Diagnóstico e foco',
            description: 'Olhamos para audiências, oferta e canais para priorizar o que move negócio.',
          },
          {
            term: 'Narrativa e execução',
            description: `Construímos mensagens, formatos e ritmo editorial alinhados com ${title.toLowerCase()}.`,
          },
          {
            term: 'Medição e iteração',
            description: 'Ligamos criativo a indicadores para ajustar hipóteses com dados.',
          },
        ],
      },
      forWho: {
        title: 'Para quem?',
        subtitle: 'Marcas que precisam de marketing mais estruturado e menos improviso.',
        items: [
          `Equipas que querem escalar ${title.toLowerCase()} com qualidade estável.`,
          'Negócios B2B ou B2C com várias personas e mensagens a harmonizar.',
          'Quem precisa de conteúdo alinhado com vendas e produto.',
          'Marcas a testar novos canais sem perder voz de marca.',
        ],
      },
      diagnostic: {
        title: 'Avalia o teu marketing em 30 segundos',
        description: 'Um mini-checklist para ver clareza de mensagem, consistência e foco em resultados.',
        cta: 'Fazer diagnóstico',
      },
      delivers: {
        title: 'O que entregamos',
        items: [
          'Plano ou calendário com temas, formatos e responsáveis.',
          'Copy e peças adaptadas a web, social, email ou campanhas.',
          'Briefs e guidelines para equipas internas ou media.',
          'Relatórios de performance e recomendações de próximo passo.',
        ],
      },
      improvements: {
        title: 'O que vai melhorar',
        items: [
          'Mensagens mais claras em cada etapa do funil.',
          'Melhor alinhamento entre marketing, vendas e produto.',
          'Mais eficiência na produção de conteúdos.',
          'Decisões apoiadas em dados, não só em opinião.',
        ],
      },
      faqSectionTitle: 'Perguntas frequentes',
      schemaFaqs: [
        {
          question: `Como medem o sucesso de ${title}?`,
          answer:
            'Combinamos indicadores de alcance, envolvimento, geração de procura e qualidade de leads conforme o teu modelo de negócio.',
        },
        {
          question: 'Podem trabalhar com a nossa equipa interna?',
          answer:
            'Sim. Integramo-nos com redatores, designers e media buyers, definindo rituais de aprovação e ownership claros.',
        },
      ],
    }),
    en: () => ({
      whatIs: {
        title: `What ${title} covers`,
        items: [
          {
            term: 'Diagnosis and focus',
            description: 'We review audiences, offer and channels to prioritize what moves revenue.',
          },
          {
            term: 'Narrative and execution',
            description: `We craft messages, formats and cadence aligned with ${title.toLowerCase()}.`,
          },
          {
            term: 'Measurement and iteration',
            description: 'We connect creative work to KPIs so we can refine with evidence.',
          },
        ],
      },
      forWho: {
        title: 'Who is this for?',
        subtitle: 'Brands that want structured marketing with less guesswork.',
        items: [
          `Teams scaling ${title.toLowerCase()} while keeping quality steady.`,
          'B2B or B2C brands harmonizing multiple personas and messages.',
          'Organizations aligning content with sales and product.',
          'Brands testing new channels without losing voice.',
        ],
      },
      diagnostic: {
        title: 'Score your marketing in 30 seconds',
        description: 'A short checklist for message clarity, consistency and outcome focus.',
        cta: 'Start diagnostic',
      },
      delivers: {
        title: 'What we deliver',
        items: [
          'Plan or calendar with themes, formats and owners.',
          'Copy and assets for web, social, email or paid campaigns.',
          'Briefs and guardrails for internal teams or media partners.',
          'Performance readouts and next-step recommendations.',
        ],
      },
      improvements: {
        title: 'What improves',
        items: [
          'Clearer messages at each funnel stage.',
          'Tighter alignment between marketing, sales and product.',
          'More efficient content production.',
          'Decisions grounded in data, not only opinions.',
        ],
      },
      faqSectionTitle: 'Frequently asked questions',
      schemaFaqs: [
        {
          question: `How do you measure success for ${title}?`,
          answer:
            'We blend reach, engagement, demand generation and lead quality metrics depending on your business model.',
        },
        {
          question: 'Can you work with our in-house team?',
          answer:
            'Yes. We plug in with writers, designers and media buyers with clear approvals and ownership.',
        },
      ],
    }),
    fr: () => ({
      whatIs: {
        title: `Ce que couvre ${title}`,
        items: [
          {
            term: 'Diagnostic et focus',
            description: 'Nous analysons audiences, offre et canaux pour prioriser ce qui fait avancer le business.',
          },
          {
            term: 'Narratif et exécution',
            description: `Nous bâtissons messages, formats et rythme éditorial alignés sur ${title.toLowerCase()}.`,
          },
          {
            term: 'Mesure et itération',
            description: 'Nous lions le créatif aux KPI pour ajuster avec des preuves.',
          },
        ],
      },
      forWho: {
        title: 'Pour qui?',
        subtitle: 'Marques qui veulent un marketing structuré avec moins d’improvisation.',
        items: [
          `Équipes qui scalent ${title.toLowerCase()} en gardant une qualité stable.`,
          'Marques B2B ou B2C avec plusieurs personas à harmoniser.',
          'Organisations qui alignent contenu, ventes et produit.',
          'Marques qui testent de nouveaux canaux sans perdre la voix.',
        ],
      },
      diagnostic: {
        title: 'Évaluez votre marketing en 30 secondes',
        description: 'Mini-checklist sur clarté du message, cohérence et focus résultats.',
        cta: 'Lancer le diagnostic',
      },
      delivers: {
        title: 'Ce que nous livrons',
        items: [
          'Plan ou calendrier avec thèmes, formats et responsables.',
          'Textes et assets pour web, social, email ou campagnes.',
          'Briefs et repères pour équipes internes ou partenaires media.',
          'Lectures de performance et recommandations.',
        ],
      },
      improvements: {
        title: 'Ce qui s’améliore',
        items: [
          'Messages plus clairs à chaque étape du funnel.',
          'Meilleur alignement marketing, ventes et produit.',
          'Production de contenu plus efficace.',
          'Décisions appuyées sur des données.',
        ],
      },
      faqSectionTitle: 'Questions fréquentes',
      schemaFaqs: [
        {
          question: `Comment mesurez-vous le succès de ${title}?`,
          answer:
            'Nous combinons portée, engagement, génération de demande et qualité des leads selon votre modèle.',
        },
        {
          question: 'Pouvez-vous travailler avec notre équipe interne?',
          answer:
            'Oui. Nous nous intégrons avec rédacteurs, designers et acheteurs média avec des validations claires.',
        },
      ],
    }),
  };
  return blocks[lang]();
}

function avContent(lang: Lang, title: string): Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'> {
  const blocks: Record<
    Lang,
    () => Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'>
  > = {
    pt: () => ({
      whatIs: {
        title: `Como produzimos ${title}`,
        items: [
          {
            term: 'Pré-produção',
            description: 'Roteiro, casting, locações, equipa e plano técnico antes de gravar.',
          },
          {
            term: 'Produção',
            description: 'Direção de fotografia, som e arte para captar imagem com intenção.',
          },
          {
            term: 'Pós-produção',
            description: 'Edição, cor, som, legendas e masterização nos formatos que precisas.',
          },
        ],
      },
      forWho: {
        title: 'Para quem?',
        subtitle: 'Marcas que precisam de vídeo ou foto com nível profissional e prazos fiáveis.',
        items: [
          `Campanhas que exigem ${title.toLowerCase()} para social, web ou TV.`,
          'Eventos, lançamentos ou employer branding.',
          'Equipas internas sem estúdio ou equipamento dedicado.',
          'Agências a precisar de parceiro de produção em Portugal.',
        ],
      },
      diagnostic: {
        title: 'Diagnóstico rápido de produção',
        description: 'Vê se o teu processo audiovisual está maduro em briefing, execução e distribuição.',
        cta: 'Fazer diagnóstico',
      },
      delivers: {
        title: 'O que entregamos',
        items: [
          'Plano de produção e cronograma com marcos claros.',
          'Material em bruto organizado e backups seguros.',
          'Versões master e adaptações por canal (16:9, 9:16, etc.).',
          'Documentação de uso de direitos quando aplicável.',
        ],
      },
      improvements: {
        title: 'O que vai melhorar',
        items: [
          'Histórias mais claras e emocionalmente credíveis.',
          'Menos surpresas de custo ou prazo em rodagens.',
          'Assets prontos para paid, orgânico e CRM.',
          'Consistência visual e sonora com a identidade da marca.',
        ],
      },
      faqSectionTitle: 'Perguntas frequentes',
      schemaFaqs: [
        {
          question: 'Gravam fora de Faro?',
          answer:
            'Sim, deslocamo-nos conforme o projeto. O orçamento inclui logística acordada na proposta.',
        },
        {
          question: 'Fornecem apenas pós-produção?',
          answer:
            'Sim, se já tens material. Ajudamos com edição, cor, som e adaptação multicanal.',
        },
      ],
    }),
    en: () => ({
      whatIs: {
        title: `How we produce ${title}`,
        items: [
          {
            term: 'Pre-production',
            description: 'Script, casting, locations, crew and technical planning before we roll.',
          },
          {
            term: 'Production',
            description: 'Cinematography, sound and art direction to capture with intent.',
          },
          {
            term: 'Post-production',
            description: 'Edit, grade, sound, captions and masters in the formats you need.',
          },
        ],
      },
      forWho: {
        title: 'Who is this for?',
        subtitle: 'Brands that need professional photo or video with dependable delivery.',
        items: [
          `Campaigns that require ${title.toLowerCase()} for social, web or broadcast.`,
          'Events, launches or employer branding.',
          'Internal teams without a dedicated studio or kit.',
          'Agencies needing a production partner in Portugal.',
        ],
      },
      diagnostic: {
        title: 'Quick production diagnostic',
        description: 'Check maturity across briefing, execution and distribution.',
        cta: 'Start diagnostic',
      },
      delivers: {
        title: 'What we deliver',
        items: [
          'Production plan and schedule with clear milestones.',
          'Organized rushes and safe backups.',
          'Master cuts and channel adaptations (16:9, 9:16, etc.).',
          'Rights documentation when applicable.',
        ],
      },
      improvements: {
        title: 'What improves',
        items: [
          'Clearer stories with credible emotion.',
          'Fewer budget or timeline surprises on set.',
          'Assets ready for paid, organic and CRM.',
          'Visual and sonic consistency with brand identity.',
        ],
      },
      faqSectionTitle: 'Frequently asked questions',
      schemaFaqs: [
        {
          question: 'Do you shoot outside Faro?',
          answer:
            'Yes, we travel as needed. Logistics are agreed upfront in the proposal.',
        },
        {
          question: 'Post-production only?',
          answer:
            'Yes if you already have footage. We help with edit, grade, sound and multi-channel cutdowns.',
        },
      ],
    }),
    fr: () => ({
      whatIs: {
        title: `Comment nous produisons ${title}`,
        items: [
          {
            term: 'Préproduction',
            description: 'Script, casting, lieux, équipe et plan technique avant le tournage.',
          },
          {
            term: 'Production',
            description: 'Image, son et direction artistique pour capturer avec intention.',
          },
          {
            term: 'Postproduction',
            description: 'Montage, étalonnage, son, sous-titres et masters aux formats requis.',
          },
        ],
      },
      forWho: {
        title: 'Pour qui?',
        subtitle: 'Marques qui veulent photo ou vidéo pro avec une livraison fiable.',
        items: [
          `Campagnes qui demandent ${title.toLowerCase()} pour social, web ou TV.`,
          'Événements, lancements ou employer branding.',
          'Équipes internes sans studio dédié.',
          'Agences cherchant un partenaire de production au Portugal.',
        ],
      },
      diagnostic: {
        title: 'Diagnostic production rapide',
        description: 'Évaluez brief, exécution et distribution.',
        cta: 'Lancer le diagnostic',
      },
      delivers: {
        title: 'Ce que nous livrons',
        items: [
          'Plan de production et planning avec jalons.',
          'Rushes organisés et sauvegardes sécurisées.',
          'Masters et déclinaisons par canal (16:9, 9:16, etc.).',
          'Documentation des droits si besoin.',
        ],
      },
      improvements: {
        title: 'Ce qui s’améliore',
        items: [
          'Récits plus clairs et crédibles émotionnellement.',
          'Moins de surprises budget ou délais sur le tournage.',
          'Assets prêts pour paid, organique et CRM.',
          'Cohérence visuelle et sonore avec la marque.',
        ],
      },
      faqSectionTitle: 'Questions fréquentes',
      schemaFaqs: [
        {
          question: 'Tournez-vous hors de Faro?',
          answer:
            'Oui, nous nous déplaçons selon le projet. La logistique est fixée dans la proposition.',
        },
        {
          question: 'Postproduction seulement?',
          answer:
            'Oui si vous avez déjà des rushes. Nous aidons au montage, étalonnage, son et déclinaisons.',
        },
      ],
    }),
  };
  return blocks[lang]();
}

function animContent(lang: Lang, title: string): Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'> {
  const blocks: Record<
    Lang,
    () => Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'>
  > = {
    pt: () => ({
      whatIs: {
        title: `Como criamos ${title}`,
        items: [
          {
            term: 'Conceito e storyboard',
            description: 'Traduzimos a mensagem em sequências, ritmo e estilo visual antes de animar.',
          },
          {
            term: 'Produção 2D/3D',
            description: 'Modelação, rig, animação, iluminação e render com pipeline revisável.',
          },
          {
            term: 'Entrega multiformato',
            description: 'Exportamos para web, social, salas ou apresentações com especificações corretas.',
          },
        ],
      },
      forWho: {
        title: 'Para quem?',
        subtitle: 'Marcas que precisam explicar produtos complexos ou humanizar mensagens.',
        items: [
          `Quem quer ${title.toLowerCase()} para campanhas, tutoriais ou branding motion.`,
          'Equipas de produto a lançar features difíceis de mostrar ao vivo.',
          'Marketing a pedir variações para vários formatos e durações.',
          'Empresas que querem biblioteca de motion reutilizável.',
        ],
      },
      diagnostic: {
        title: 'Diagnóstico de animação',
        description: 'Avalia processo criativo, técnico e distribuição do teu motion.',
        cta: 'Fazer diagnóstico',
      },
      delivers: {
        title: 'O que entregamos',
        items: [
          'Storyboard ou animatic aprovados antes do render pesado.',
          'Cenas e projetos fonte organizados.',
          'Renders finais e loops otimizados para web.',
          'Guias de uso de marca em movimento.',
        ],
      },
      improvements: {
        title: 'O que vai melhorar',
        items: [
          'Explicações mais simples de conceitos abstratos.',
          'Mais impacto em feeds com vídeo curto.',
          'Coerência entre campanhas paid e orgânicas.',
          'Menos retrabalho entre copy, design e motion.',
        ],
      },
      faqSectionTitle: 'Perguntas frequentes',
      schemaFaqs: [
        {
          question: 'Fazem 2D e 3D?',
          answer:
            'Sim. Escolhemos a técnica certa para o orçamento, prazo e nível de realismo de cada projeto.',
        },
        {
          question: 'Podem adaptar ilustrações existentes?',
          answer:
            'Muitas vezes sim, desde que os ficheiros e direitos estejam claros. Avaliamos no brief inicial.',
        },
      ],
    }),
    en: () => ({
      whatIs: {
        title: `How we create ${title}`,
        items: [
          {
            term: 'Concept and storyboard',
            description: 'We translate the message into beats, pacing and look before heavy animation.',
          },
          {
            term: '2D/3D production',
            description: 'Modeling, rigging, animation, lighting and rendering with a reviewable pipeline.',
          },
          {
            term: 'Multi-format delivery',
            description: 'Exports for web, social, rooms or decks with correct specs.',
          },
        ],
      },
      forWho: {
        title: 'Who is this for?',
        subtitle: 'Brands explaining complex products or humanizing messages.',
        items: [
          `Teams needing ${title.toLowerCase()} for campaigns, tutorials or motion branding.`,
          'Product orgs launching features that are hard to show live.',
          'Marketing asking for variations across formats and lengths.',
          'Companies building a reusable motion library.',
        ],
      },
      diagnostic: {
        title: 'Animation diagnostic',
        description: 'Score creative process, craft and distribution for your motion work.',
        cta: 'Start diagnostic',
      },
      delivers: {
        title: 'What we deliver',
        items: [
          'Approved storyboard or animatic before expensive renders.',
          'Organized scene files and project sources.',
          'Final renders and web-optimized loops.',
          'Motion brand usage notes.',
        ],
      },
      improvements: {
        title: 'What improves',
        items: [
          'Simpler explanations of abstract ideas.',
          'More impact in short-form feeds.',
          'Consistency between paid and organic.',
          'Less rework between copy, design and motion.',
        ],
      },
      faqSectionTitle: 'Frequently asked questions',
      schemaFaqs: [
        {
          question: 'Do you handle 2D and 3D?',
          answer:
            'Yes. We pick the right technique for budget, timeline and realism needs.',
        },
        {
          question: 'Can you animate existing illustrations?',
          answer:
            'Often yes, when files and rights are clear. We assess this in the initial brief.',
        },
      ],
    }),
    fr: () => ({
      whatIs: {
        title: `Comment nous créons ${title}`,
        items: [
          {
            term: 'Concept et storyboard',
            description: 'Nous traduisons le message en séquences, rythme et direction visuelle avant l’animation lourde.',
          },
          {
            term: 'Production 2D/3D',
            description: 'Modélisation, rig, animation, lumière et rendu avec un pipeline itérable.',
          },
          {
            term: 'Livraison multiformat',
            description: 'Exports web, social, salles ou présentations aux bons specs.',
          },
        ],
      },
      forWho: {
        title: 'Pour qui?',
        subtitle: 'Marques qui expliquent des produits complexes ou humanisent le message.',
        items: [
          `Équipes qui veulent ${title.toLowerCase()} pour campagnes, tutoriels ou branding motion.`,
          'Produit qui lance des features difficiles à montrer en live.',
          'Marketing qui demande des variations formats et durées.',
          'Entreprises qui construisent une bibliothèque motion réutilisable.',
        ],
      },
      diagnostic: {
        title: 'Diagnostic animation',
        description: 'Évaluez processus créatif, craft et distribution.',
        cta: 'Lancer le diagnostic',
      },
      delivers: {
        title: 'Ce que nous livrons',
        items: [
          'Storyboard ou animatic validé avant rendus coûteux.',
          'Scènes et sources de projet organisées.',
          'Rendus finaux et boucles optimisées web.',
          'Repères d’usage de la marque en mouvement.',
        ],
      },
      improvements: {
        title: 'Ce qui s’améliore',
        items: [
          'Explications plus simples des idées abstraites.',
          'Plus d’impact en formats courts.',
          'Cohérence entre paid et organique.',
          'Moins de retravail entre texte, design et motion.',
        ],
      },
      faqSectionTitle: 'Questions fréquentes',
      schemaFaqs: [
        {
          question: 'Faites-vous du 2D et 3D?',
          answer:
            'Oui. Nous choisissons la technique selon budget, délai et niveau de réalisme.',
        },
        {
          question: 'Pouvez-vous animer des illustrations existantes?',
          answer:
            'Souvent oui si fichiers et droits sont clairs. Nous évaluons au brief initial.',
        },
      ],
    }),
  };
  return blocks[lang]();
}

function categoryBody(cat: Cat, lang: Lang, title: string): Omit<ServicePageMessage, 'metaTitle' | 'metaDescription' | 'hero' | 'intro' | 'seoKeywords' | 'schemaFaqs'> {
  switch (cat) {
    case 'design':
      return designContent(lang, title);
    case 'marketing':
      return marketingContent(lang, title);
    case 'audiovisual':
      return avContent(lang, title);
    case 'animacao':
      return animContent(lang, title);
  }
}

interface Def {
  slug: ServicePageSlug;
  cat: Cat;
  title: L3;
  tagline: L3;
}

const DEFS: Def[] = [
  {
    slug: 'branding',
    cat: 'design',
    title: { pt: 'Branding', en: 'Branding', fr: 'Branding' },
    tagline: {
      pt: 'Identidade, voz e sistema visual que tornam a tua marca reconhecível e consistente.',
      en: 'Identity, voice and a visual system that make your brand recognizable and consistent.',
      fr: 'Identité, voix et système visuel pour une marque reconnaissable et cohérente.',
    },
  },
  {
    slug: 'web-design',
    cat: 'design',
    title: { pt: 'Web Design', en: 'Web Design', fr: 'Web design' },
    tagline: {
      pt: 'Websites rápidos, acessíveis e alinhados com conversão e SEO técnico.',
      en: 'Fast, accessible websites aligned with conversion and technical SEO.',
      fr: 'Sites rapides et accessibles, orientés conversion et SEO technique.',
    },
  },
  {
    slug: 'packaging-design',
    cat: 'design',
    title: { pt: 'Packaging Design', en: 'Packaging Design', fr: 'Design packaging' },
    tagline: {
      pt: 'Embalagens que destacam na prateleira e comunicam valor em segundos.',
      en: 'Packaging that wins shelf attention and communicates value in seconds.',
      fr: 'Packaging qui se démarque en linéaire et communique la valeur en quelques secondes.',
    },
  },
  {
    slug: 'ilustracao',
    cat: 'design',
    title: { pt: 'Ilustração', en: 'Illustration', fr: 'Illustration' },
    tagline: {
      pt: 'Ilustração editorial e de marca com estilo próprio e aplicação multicanal.',
      en: 'Editorial and brand illustration with a distinct style across channels.',
      fr: 'Illustration éditoriale et de marque, avec un style distinct sur tous les canaux.',
    },
  },
  {
    slug: 'design-editorial',
    cat: 'design',
    title: { pt: 'Design Editorial', en: 'Editorial Design', fr: 'Design éditorial' },
    tagline: {
      pt: 'Publicações, relatórios e livros com hierarquia clara e acabamentos cuidados.',
      en: 'Reports, books and publications with clear hierarchy and refined finishing.',
      fr: 'Rapports, livres et éditions avec hiérarchie claire et finitions soignées.',
    },
  },
  {
    slug: 'ux-ui-design',
    cat: 'design',
    title: { pt: 'UX / UI Design', en: 'UX / UI Design', fr: 'UX / UI Design' },
    tagline: {
      pt: 'Fluxos intuitivos, componentes reutilizáveis e protótipos testáveis.',
      en: 'Intuitive flows, reusable components and testable prototypes.',
      fr: 'Parcours intuitifs, composants réutilisables et prototypes testables.',
    },
  },
  {
    slug: 'social-media-design',
    cat: 'design',
    title: { pt: 'Social Media Design', en: 'Social Media Design', fr: 'Design social media' },
    tagline: {
      pt: 'Templates e criativos que mantêm identidade em feeds, stories e anúncios.',
      en: 'Templates and creatives that keep identity consistent across feeds, stories and ads.',
      fr: 'Templates et créas qui gardent l’identité sur feeds, stories et ads.',
    },
  },
  {
    slug: 'space-branding',
    cat: 'design',
    title: { pt: 'Space Branding', en: 'Space Branding', fr: 'Space branding' },
    tagline: {
      pt: 'Espaços físicos que contam a história da marca — sinalética, ambientes e experiência.',
      en: 'Physical spaces that tell the brand story—signage, environments and experience.',
      fr: 'Espaces physiques qui racontent la marque — signalétique, ambiance et expérience.',
    },
  },
  {
    slug: 'content-strategy',
    cat: 'marketing',
    title: { pt: 'Content Strategy', en: 'Content Strategy', fr: 'Stratégie de contenu' },
    tagline: {
      pt: 'Pilares, calendários e métricas para conteúdo que suporta negócio, não ruído.',
      en: 'Pillars, calendars and metrics for content that supports the business, not noise.',
      fr: 'Piliers, calendriers et métriques pour un contenu utile au business, pas du bruit.',
    },
  },
  {
    slug: 'copywriting',
    cat: 'marketing',
    title: { pt: 'Copywriting', en: 'Copywriting', fr: 'Copywriting' },
    tagline: {
      pt: 'Textos que convertem: landing pages, anúncios, emails e narrativas de marca.',
      en: 'Copy that converts—landing pages, ads, emails and brand narratives.',
      fr: 'Textes qui convertissent — landing pages, ads, emails et récits de marque.',
    },
  },
  {
    slug: 'blog-content-writing',
    cat: 'marketing',
    title: { pt: 'Blog Content Writing', en: 'Blog Content Writing', fr: 'Rédaction de blog' },
    tagline: {
      pt: 'Artigos pesquisados, SEO-aware e alinhados com autoridade de marca.',
      en: 'Researched, SEO-aware articles aligned with brand authority.',
      fr: 'Articles documentés, SEO-friendly, alignés sur l’autorité de marque.',
    },
  },
  {
    slug: 'storytelling',
    cat: 'marketing',
    title: { pt: 'Storytelling', en: 'Storytelling', fr: 'Storytelling' },
    tagline: {
      pt: 'Arcos narrativos e mensagens que tornam produtos e causas memoráveis.',
      en: 'Narrative arcs and messaging that make products and causes memorable.',
      fr: 'Arcs narratifs et messages qui rendent produits et causes mémorables.',
    },
  },
  {
    slug: 'brand-strategy',
    cat: 'marketing',
    title: { pt: 'Brand Strategy', en: 'Brand Strategy', fr: 'Stratégie de marque' },
    tagline: {
      pt: 'Posicionamento, proposta de valor e plano para decisões de marca coerentes.',
      en: 'Positioning, value proposition and a plan for coherent brand decisions.',
      fr: 'Positionnement, proposition de valeur et plan pour des décisions de marque cohérentes.',
    },
  },
  {
    slug: 'social-media-content',
    cat: 'marketing',
    title: { pt: 'Social Media Content', en: 'Social Media Content', fr: 'Contenu social media' },
    tagline: {
      pt: 'Calendários, roteiros e formatos que equilibram criatividade e consistência.',
      en: 'Calendars, scripts and formats balancing creativity and consistency.',
      fr: 'Calendriers, scripts et formats entre créativité et cohérence.',
    },
  },
  {
    slug: 'digital-advertising',
    cat: 'marketing',
    title: { pt: 'Digital Advertising', en: 'Digital Advertising', fr: 'Publicité digitale' },
    tagline: {
      pt: 'Criativos e mensagens para campanhas paid com testes e otimização contínua.',
      en: 'Creatives and messaging for paid campaigns with testing and continuous optimization.',
      fr: 'Créas et messages pour campagnes paid avec tests et optimisation continue.',
    },
  },
  {
    slug: 'consultoria',
    cat: 'marketing',
    title: { pt: 'Consultoria', en: 'Consulting', fr: 'Conseil' },
    tagline: {
      pt: 'Sessões estratégicas para priorizar marketing, criativo e canais com clareza.',
      en: 'Strategic sessions to prioritize marketing, creative and channels with clarity.',
      fr: 'Sessions stratégiques pour prioriser marketing, créatif et canaux avec clarté.',
    },
  },
  {
    slug: 'storytelling-audiovisual',
    cat: 'audiovisual',
    title: { pt: 'Storytelling Audiovisual', en: 'Audiovisual Storytelling', fr: 'Storytelling audiovisuel' },
    tagline: {
      pt: 'Documentários, branded content e vídeos que constroem narrativa de longo prazo.',
      en: 'Documentaries, branded content and films that build long-term narrative.',
      fr: 'Documentaires, branded content et films qui construisent une narration durable.',
    },
  },
  {
    slug: 'fotografia',
    cat: 'audiovisual',
    title: { pt: 'Fotografia', en: 'Photography', fr: 'Photographie' },
    tagline: {
      pt: 'Ensaios de produto, retrato e lifestyle com direção de arte integrada.',
      en: 'Product, portrait and lifestyle shoots with integrated art direction.',
      fr: 'Shootings produit, portrait et lifestyle avec direction artistique intégrée.',
    },
  },
  {
    slug: 'video',
    cat: 'audiovisual',
    title: { pt: 'Vídeo', en: 'Video', fr: 'Vidéo' },
    tagline: {
      pt: 'Spots, institucionais e conteúdo social com produção fim a fim.',
      en: 'Spots, corporate films and social content with end-to-end production.',
      fr: 'Spots, films institutionnels et contenus social avec production de bout en bout.',
    },
  },
  {
    slug: 'cobertura-eventos',
    cat: 'audiovisual',
    title: { pt: 'Cobertura de Eventos', en: 'Event Coverage', fr: 'Couverture d’événements' },
    tagline: {
      pt: 'Vídeo e foto ao vivo ou editado para amplificar conferências e lançamentos.',
      en: 'Live or edited video and photo to amplify conferences and launches.',
      fr: 'Vidéo et photo live ou montée pour amplifier conférences et lancements.',
    },
  },
  {
    slug: 'motion-graphics',
    cat: 'animacao',
    title: { pt: 'Motion Graphics', en: 'Motion Graphics', fr: 'Motion design' },
    tagline: {
      pt: 'Animação gráfica para logos, UI, explicadores e campanhas.',
      en: 'Graphic animation for logos, UI, explainers and campaigns.',
      fr: 'Animation graphique pour logos, UI, explainers et campagnes.',
    },
  },
  {
    slug: 'animacao-corporativa-educativa',
    cat: 'animacao',
    title: { pt: 'Animação Corporativa e Educativa', en: 'Corporate & Educational Animation', fr: 'Animation corporate et pédagogique' },
    tagline: {
      pt: 'Vídeos que formam equipas e explicam processos com clareza.',
      en: 'Films that train teams and explain processes with clarity.',
      fr: 'Films qui forment les équipes et expliquent les process avec clarté.',
    },
  },
  {
    slug: 'efeitos-especiais',
    cat: 'animacao',
    title: { pt: 'Efeitos Especiais', en: 'Visual Effects', fr: 'Effets spéciaux' },
    tagline: {
      pt: 'VFX e compositing para reforçar realismo ou fantasia em vídeo.',
      en: 'VFX and compositing to heighten realism or fantasy in video.',
      fr: 'VFX et compositing pour renforcer réalisme ou fantaisie en vidéo.',
    },
  },
  {
    slug: 'animacao-produto',
    cat: 'animacao',
    title: { pt: 'Animação de Produto', en: 'Product Animation', fr: 'Animation produit' },
    tagline: {
      pt: 'Renders 3D e animações que mostram detalhes impossíveis em foto.',
      en: '3D renders and animations that show details hard to capture in photo.',
      fr: 'Rendus 3D et animations qui montrent des détails difficiles en photo.',
    },
  },
  {
    slug: 'animacao-publicitaria-social',
    cat: 'animacao',
    title: { pt: 'Animação Publicitária e Social', en: 'Advertising & Social Animation', fr: 'Animation publicitaire et social' },
    tagline: {
      pt: 'Bumps, stingers e criativos motion para feeds e media.',
      en: 'Bumps, stingers and motion creatives for feeds and media.',
      fr: 'Bumps, stingers et créas motion pour feeds et media.',
    },
  },
];

function buildPage(def: Def, lang: Lang): ServicePageMessage {
  const title = def.title[lang];
  const body = categoryBody(def.cat, lang, title);
  const seo = getServicePageSeo(def.slug, lang);
  return {
    ...body,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    seoKeywords: seo.keywords,
    schemaFaqs: seo.schemaFaqs,
    hero: {
      label: CATEGORY_LABEL[def.cat][lang],
      title,
      subtitle: def.tagline[lang],
    },
    intro: { text: `${def.tagline[lang]} ${INTRO_TAIL[def.cat][lang]}` },
  };
}

export const servicePagesByLocale: Record<Lang, Record<ServicePageSlug, ServicePageMessage>> = {
  pt: Object.fromEntries(DEFS.map((d) => [d.slug, buildPage(d, 'pt')])) as Record<ServicePageSlug, ServicePageMessage>,
  en: Object.fromEntries(DEFS.map((d) => [d.slug, buildPage(d, 'en')])) as Record<ServicePageSlug, ServicePageMessage>,
  fr: Object.fromEntries(DEFS.map((d) => [d.slug, buildPage(d, 'fr')])) as Record<ServicePageSlug, ServicePageMessage>,
};

const slugSet = new Set(DEFS.map((d) => d.slug));
for (const s of SERVICE_PAGE_SLUGS) {
  if (!slugSet.has(s)) {
    throw new Error(`Missing service page definition for slug: ${s}`);
  }
}

export const SERVICE_SLUG_CATEGORY = Object.fromEntries(DEFS.map((d) => [d.slug, d.cat])) as Record<ServicePageSlug, ServicePageCategory>;

export function getServicePageCategory(slug: ServicePageSlug): ServicePageCategory {
  return SERVICE_SLUG_CATEGORY[slug];
}

/** Anchor id for the per-slug AI diagnostic (one section per service page). */
export function getServicosAiSectionIdForSlug(slug: ServicePageSlug): string {
  return `servicos-ai-${slug}`;
}
