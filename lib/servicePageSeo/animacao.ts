import type { ServicePageSeoMap } from './types';

export const ANIMACAO_SERVICE_SEO: Pick<
  ServicePageSeoMap,
  | 'motion-graphics'
  | 'animacao-corporativa-educativa'
  | 'efeitos-especiais'
  | 'animacao-produto'
  | 'animacao-publicitaria-social'
> = {
  'motion-graphics': {
    pt: {
      metaTitle: 'Motion graphics e animação 2D em Portugal',
      metaDescription:
        'Motion para logos, UI, explicadores e campanhas. Flow Productions em Faro: motion graphics com pipeline revisável e export multiformato.',
      keywords: [
        'motion graphics Portugal',
        'animação 2D',
        'logo animado',
        'explainer motion',
        'Faro motion design',
        'after effects Portugal',
      ],
      schemaFaqs: [
        {
          question: 'O que são motion graphics?',
          answer:
            'São gráficos em movimento—tipografia, formas, ícones e composições 2D (por vezes 3D leve) para vídeo, social ou UI. A Flow Productions em Faro entrega com storyboard, animatic e master multiformato.',
        },
        {
          question: 'Trabalham com guias de marca existentes?',
          answer:
            'Sim, respeitamos paleta, tipografia e regras de animação definidas pela marca.',
        },
        {
          question: 'Entregam templates reutilizáveis?',
          answer:
            'Sim para packs de canal (lower thirds, transitions) quando acordado.',
        },
        {
          question: 'Prazos típicos?',
          answer:
            'Dependem de duração, complexidade e revisões; estimativa após roteiro fechado.',
        },
        {
          question: 'Idiomas de projeto?',
          answer:
            'PT, EN, FR para interfaces e legendas.',
        },
      ],
    },
    en: {
      metaTitle: 'Motion graphics & 2D animation in Portugal',
      metaDescription:
        'Logo motion, UI animation, explainers and campaign motion from Flow Productions in Faro, Portugal. Reviewable pipeline and multi-format export.',
      keywords: [
        'motion graphics Portugal',
        '2D animation Faro',
        'logo animation',
        'explainer motion',
        'motion design Algarve',
        'After Effects studio',
      ],
      schemaFaqs: [
        {
          question: 'What are motion graphics?',
          answer:
            'Moving graphics—type, shapes, icons and 2D comps (sometimes light 3D) for video, social or UI. Flow Productions in Faro delivers storyboard, animatic and multi-format masters.',
        },
        {
          question: 'Do you follow existing brand guides?',
          answer:
            'Yes—palette, typography and motion rules as defined.',
        },
        {
          question: 'Reusable templates?',
          answer:
            'Yes for channel packs (lower thirds, transitions) when contracted.',
        },
        {
          question: 'Typical timelines?',
          answer:
            'Depend on length, complexity and revisions—estimate after script lock.',
        },
        {
          question: 'Project languages?',
          answer:
            'PT, EN, FR for UI and captions.',
        },
      ],
    },
    fr: {
      metaTitle: 'Motion design et animation 2D au Portugal',
      metaDescription:
        'Motion logo, UI, explainers avec Flow Productions à Faro : pipeline et exports multi-formats.',
      keywords: [
        'motion design Portugal',
        'animation 2D Faro',
        'logo animé',
        'explainer',
      ],
      schemaFaqs: [
        {
          question: 'Qu’est-ce que le motion design ?',
          answer:
            'Graphisme animé 2D pour vidéo, social, UI. Flow Productions à Faro.',
        },
        {
          question: 'Charte existante ?',
          answer:
            'Respect des couleurs et typo.',
        },
        {
          question: 'Templates ?',
          answer:
            'Oui si prévu.',
        },
        {
          question: 'Délais ?',
          answer:
            'Après verrouillage script.',
        },
        {
          question: 'Langues ?',
          answer:
            'PT, EN, FR.',
        },
      ],
    },
  },
  'animacao-corporativa-educativa': {
    pt: {
      metaTitle: 'Animação corporativa e vídeos educativos',
      metaDescription:
        'Vídeos que explicam processos e formam equipas. Flow Productions em Faro: animação 2D/3D com foco em clareza e acessibilidade.',
      keywords: [
        'animação corporativa Portugal',
        'vídeo formação animado',
        'onboarding animação',
        'vídeo compliance',
        'Faro animação',
        'e-learning vídeo',
      ],
      schemaFaqs: [
        {
          question: 'Para que serve animação corporativa?',
          answer:
            'Explicar processos internos, compliance, onboarding e mudança organizacional com visual claro e repetível. Produzimos em Faro com storyboard alinhado a SMEs.',
        },
        {
          question: 'Incluem locução e legendas?',
          answer:
            'Sim, PT/EN/FR; locutores aprovados pelo cliente quando necessário.',
        },
        {
          question: 'Integração em LMS?',
          answer:
            'Exportamos ficheiros e capítulos conforme especificações SCORM ou plataforma indicada.',
        },
        {
          question: 'Quanto tempo por minuto animado?',
          answer:
            'Varia com estilo (2D flat vs 3D) e revisões; orçamento após roteiro.',
        },
        {
          question: 'Atendem multinacionais?',
          answer:
            'Sim, variantes linguísticas e subtitling em pipeline.',
        },
      ],
    },
    en: {
      metaTitle: 'Corporate & educational animation videos',
      metaDescription:
        'Explain processes and train teams with clarity. Flow Productions in Faro, Portugal: 2D/3D animation with accessible pacing and SME-aligned scripts.',
      keywords: [
        'corporate animation Portugal',
        'training video animation',
        'onboarding animation',
        'compliance explainer',
        'Faro animation studio',
        'e-learning video',
      ],
      schemaFaqs: [
        {
          question: 'What is corporate animation for?',
          answer:
            'Internal processes, compliance, onboarding and change programmes with clear, repeatable visuals. We produce in Faro with SME-aligned storyboards.',
        },
        {
          question: 'Voiceover and captions?',
          answer:
            'Yes—PT/EN/FR; talent approved by the client when needed.',
        },
        {
          question: 'LMS integration?',
          answer:
            'We export files and chapters to SCORM or your platform specs.',
        },
        {
          question: 'Time per animated minute?',
          answer:
            'Varies with style (2D vs 3D) and rounds—quote after script.',
        },
        {
          question: 'Multinationals?',
          answer:
            'Yes—language variants and subtitling in pipeline.',
        },
      ],
    },
    fr: {
      metaTitle: 'Animation corporate et vidéos pédagogiques',
      metaDescription:
        'Processus, onboarding, compliance avec Flow Productions à Faro : 2D/3D clair et accessible.',
      keywords: [
        'animation corporate Portugal',
        'vidéo formation',
        'onboarding animé',
        'Faro',
      ],
      schemaFaqs: [
        {
          question: 'Usage animation corporate ?',
          answer:
            'Process, compliance, onboarding — storyboard avec SMEs à Faro.',
        },
        {
          question: 'Voix et sous-titres ?',
          answer:
            'PT/EN/FR.',
        },
        {
          question: 'LMS ?',
          answer:
            'Exports selon specs SCORM.',
        },
        {
          question: 'Délai par minute ?',
          answer:
            'Selon style et revues.',
        },
        {
          question: 'Multinationales ?',
          answer:
            'Variantes linguistiques.',
        },
      ],
    },
  },
  'efeitos-especiais': {
    pt: {
      metaTitle: 'VFX, compositing e efeitos especiais em vídeo',
      metaDescription:
        'Compositing, cleanup e VFX para reforçar realismo ou fantasia. Flow Productions em Faro: integração CGI, partículas e pós-produção avançada.',
      keywords: [
        'VFX Portugal',
        'efeitos especiais vídeo',
        'compositing',
        'CGI integração',
        'Faro pós-produção',
        'chroma key profissional',
      ],
      schemaFaqs: [
        {
          question: 'Que serviços de VFX oferecem?',
          answer:
            'Compositing, cleanup, integração 3D em live action, partículas, beauty work leve e preparação para cor final. Pipeline em Faro com revisões por shot.',
        },
        {
          question: 'Precisam de greenscreen profissional?',
          answer:
            'Ideal para extratos limpos; avaliamos footage existente antes de comprometer resultado.',
        },
        {
          question: 'Trabalham por shot ou projeto fechado?',
          answer:
            'Ambos; orçamento por shot complexo ou pack de escopo fechado.',
        },
        {
          question: 'Prazos de render?',
          answer:
            'Dependem de resolução, passes e farm disponível; comunicamos fila no kickoff.',
        },
        {
          question: 'Colaboram com produtoras externas?',
          answer:
            'Sim, como parceiros de pós ou co-produção.',
        },
      ],
    },
    en: {
      metaTitle: 'VFX, compositing & visual effects in Portugal',
      metaDescription:
        'Compositing, cleanup and VFX to heighten realism or fantasy. Flow Productions in Faro, Portugal: CGI integration, particles and advanced post.',
      keywords: [
        'VFX Portugal',
        'visual effects Faro',
        'video compositing',
        'CGI integration',
        'chroma key',
        'post production Algarve',
      ],
      schemaFaqs: [
        {
          question: 'Which VFX services do you offer?',
          answer:
            'Compositing, cleanup, 3D integration in live action, particles, light beauty and grade prep. Faro-based pipeline with per-shot reviews.',
        },
        {
          question: 'Do you need professional greenscreen?',
          answer:
            'Ideal for clean keys; we assess existing footage before promising outcomes.',
        },
        {
          question: 'Per shot or fixed project?',
          answer:
            'Both—quotes per complex shot or scoped packages.',
        },
        {
          question: 'Render timelines?',
          answer:
            'Depend on resolution, passes and farm capacity—queue communicated at kickoff.',
        },
        {
          question: 'Work with external producers?',
          answer:
            'Yes—as post partners or co-production.',
        },
      ],
    },
    fr: {
      metaTitle: 'VFX, compositing et effets spéciaux au Portugal',
      metaDescription:
        'Compositing, cleanup, CGI avec Flow Productions à Faro : particules, post avancée.',
      keywords: [
        'VFX Portugal',
        'effets spéciaux vidéo',
        'compositing Faro',
        'incrustation CGI',
      ],
      schemaFaqs: [
        {
          question: 'Services VFX ?',
          answer:
            'Compositing, cleanup, 3D dans live, particules — Faro.',
        },
        {
          question: 'Greenscreen ?',
          answer:
            'Idéal ; analyse des rushes.',
        },
        {
          question: 'Au shot ou forfait ?',
          answer:
            'Les deux.',
        },
        {
          question: 'Rendu ?',
          answer:
            'Selon résolution et farm.',
        },
        {
          question: 'Externes ?',
          answer:
            'Partenaires post.',
        },
      ],
    },
  },
  'animacao-produto': {
    pt: {
      metaTitle: 'Animação 3D de produto e renders comerciais',
      metaDescription:
        'Exploded view, variantes de cor e detalhe impossível em foto. Flow Productions em Faro: animação de produto para web, feiras e anúncios.',
      keywords: [
        'animação produto 3D',
        'render produto Portugal',
        'animação e-commerce',
        '360 produto 3D',
        'Faro 3D motion',
        'packshot animado',
      ],
      schemaFaqs: [
        {
          question: 'Precisam de ficheiros CAD?',
          answer:
            'CAD ou modelos 3D aceleram; podemos modelar a partir de referências com custo adicional.',
        },
        {
          question: 'Entregam loops para PDP?',
          answer:
            'Sim, GIF/WebM/MP4 otimizados por canal e peso.',
        },
        {
          question: 'Variações de SKU?',
          answer:
            'Sim, pipeline de materiais e cores para linhas de produto.',
        },
        {
          question: 'Estilo realista vs estilizado?',
          answer:
            'Ambos definidos no moodboard inicial.',
        },
        {
          question: 'Prazo de produção?',
          answer:
            'Ligado a complexidade do modelo e duração; estimativa pós-brief.',
        },
      ],
    },
    en: {
      metaTitle: '3D product animation & commercial renders',
      metaDescription:
        'Exploded views, colour variants and detail beyond photography. Flow Productions in Faro, Portugal: product animation for web, trade shows and ads.',
      keywords: [
        '3D product animation Portugal',
        'product render Faro',
        'ecommerce 3D video',
        '360 product animation',
        'packshot animation',
        'Algarve 3D studio',
      ],
      schemaFaqs: [
        {
          question: 'Do you need CAD files?',
          answer:
            'CAD or 3D models speed things up; we can model from references at extra cost.',
        },
        {
          question: 'Loops for PDP?',
          answer:
            'Yes—GIF/WebM/MP4 optimized per channel and weight.',
        },
        {
          question: 'SKU variants?',
          answer:
            'Yes—material and colour pipelines for product lines.',
        },
        {
          question: 'Realistic vs stylized?',
          answer:
            'Both—set in the initial moodboard.',
        },
        {
          question: 'Production timeline?',
          answer:
            'Tied to model complexity and duration—estimate after brief.',
        },
      ],
    },
    fr: {
      metaTitle: 'Animation 3D produit et rendus commerciaux',
      metaDescription:
        'Vue éclatée, variantes couleur avec Flow Productions à Faro pour web, salons, ads.',
      keywords: [
        'animation 3D produit Portugal',
        'rendu produit Faro',
        'e-commerce 3D',
      ],
      schemaFaqs: [
        {
          question: 'Fichiers CAD ?',
          answer:
            'Accélèrent ; modélisation depuis refs possible.',
        },
        {
          question: 'Loops PDP ?',
          answer:
            'Oui, formats optimisés.',
        },
        {
          question: 'Variantes SKU ?',
          answer:
            'Oui.',
        },
        {
          question: 'Réaliste ou stylisé ?',
          answer:
            'Moodboard initial.',
        },
        {
          question: 'Délais ?',
          answer:
            'Après brief.',
        },
      ],
    },
  },
  'animacao-publicitaria-social': {
    pt: {
      metaTitle: 'Animação para anúncios e redes sociais',
      metaDescription:
        'Bumps, stingers e criativos motion para feeds e paid. Flow Productions em Faro: formatos seguros, hooks fortes e variações para testes.',
      keywords: [
        'animação social ads',
        'motion ads Instagram',
        'bump publicitário',
        'criativo paid motion',
        'Faro motion ads',
        'UGC style motion',
      ],
      schemaFaqs: [
        {
          question: 'Que durações cobrem?',
          answer:
            'De 3–6s bumps a 15–30s para paid; múltiplos crops por rede.',
        },
        {
          question: 'Safe zones e som?',
          answer:
            'Layouts testados para UI nativa das redes; mix opcional.',
        },
        {
          question: 'Variações para creative testing?',
          answer:
            'Sim, hooks e CTAs alternados.',
        },
        {
          question: 'Trabalham com música trending?',
          answer:
            'Só com licenças válidas ou biblioteca acordada — evitamos riscos de direitos.',
        },
        {
          question: 'Cadência de entrega?',
          answer:
            'Sprints semanais ou packs mensais conforme calendário de media.',
        },
      ],
    },
    en: {
      metaTitle: 'Advertising & social motion animation',
      metaDescription:
        'Bumps, stingers and motion ads for feeds and paid. Flow Productions in Faro, Portugal: safe zones, strong hooks and variants for testing.',
      keywords: [
        'social motion ads Portugal',
        'Instagram motion creative',
        'advertising bump',
        'paid social animation',
        'Faro motion studio',
        'short form motion ads',
      ],
      schemaFaqs: [
        {
          question: 'Which durations do you cover?',
          answer:
            'From 3–6s bumps to 15–30s paid cuts; multiple crops per network.',
        },
        {
          question: 'Safe zones and sound?',
          answer:
            'Layouts tuned to native UIs; optional mix.',
        },
        {
          question: 'Variants for creative testing?',
          answer:
            'Yes—alternate hooks and CTAs.',
        },
        {
          question: 'Trending music?',
          answer:
            'Only licensed or approved libraries—we avoid rights risk.',
        },
        {
          question: 'Delivery cadence?',
          answer:
            'Weekly sprints or monthly packs aligned to media calendars.',
        },
      ],
    },
    fr: {
      metaTitle: 'Animation publicitaire et social media',
      metaDescription:
        'Bumps, stingers, ads motion avec Flow Productions à Faro : safe zones, hooks, tests.',
      keywords: [
        'animation ads social Portugal',
        'motion Instagram',
        'publicité courte',
        'Faro',
      ],
      schemaFaqs: [
        {
          question: 'Durées ?',
          answer:
            '3–6s à 15–30s, multi crops.',
        },
        {
          question: 'Safe zones ?',
          answer:
            'Oui, UI native.',
        },
        {
          question: 'Variantes tests ?',
          answer:
            'Oui.',
        },
        {
          question: 'Musique trending ?',
          answer:
            'Licences uniquement.',
        },
        {
          question: 'Cadence ?',
          answer:
            'Sprints ou packs mensuels.',
        },
      ],
    },
  },
};
