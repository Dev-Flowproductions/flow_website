import type { ServicePageSeoMap } from './types';

/** Design-category service pages: SEO + AEO (FAQ) + GEO (Portugal / Faro signals). */
export const DESIGN_SERVICE_SEO: Pick<
  ServicePageSeoMap,
  | 'branding'
  | 'web-design'
  | 'packaging-design'
  | 'ilustracao'
  | 'design-editorial'
  | 'ux-ui-design'
  | 'social-media-design'
  | 'space-branding'
> = {
  branding: {
    pt: {
      metaTitle: 'Branding e identidade visual em Portugal',
      metaDescription:
        'Branding, identidade visual e guidelines com a Flow Productions em Faro. Marcas em Portugal e na UE: posicionamento, sistema gráfico e aplicação multicanal. Fale connosco.',
      keywords: [
        'branding Portugal',
        'identidade visual',
        'guidelines de marca',
        'agência branding Faro',
        'rebranding Portugal',
        'design de marca Algarve',
      ],
      schemaFaqs: [
        {
          question: 'O que é branding na prática?',
          answer:
            'Branding é o conjunto de decisões que definem como a marca é percebida: nome, posicionamento, voz, identidade visual e regras de aplicação. Na Flow Productions, em Faro (Portugal), alinhamos estratégia e execução para consistência em digital, impresso e espaço físico.',
        },
        {
          question: 'A Flow Productions faz rebranding completo?',
          answer:
            'Sim. Trabalhamos refresh e rebranding: auditoria da identidade atual, proposta de conceito, sistema visual, manuais ou guias de aplicação e apoio à implementação com equipas internas ou parceiros. Atendemos marcas em Portugal e remotamente na UE.',
        },
        {
          question: 'Quanto tempo demora um projeto de branding?',
          answer:
            'O prazo depende do âmbito (identidade mínima vs sistema completo), número de touchpoints e rondas de revisão. Após o brief inicial apresentamos um calendário com marcos; projetos típicos levam de várias semanas a alguns meses.',
        },
        {
          question: 'Onde está a Flow Productions e atendem fora do Algarve?',
          answer:
            'A sede fica em Faro, Algarve, Portugal. Trabalhamos com clientes em todo o país e no estrangeiro com reuniões online, partilha de ficheiros centralizada e aprovações assíncronas.',
        },
        {
          question: 'Entregam apenas o logótipo?',
          answer:
            'Podemos focar num símbolo ou logótipo, mas recomendamos um sistema mínimo (cores, tipografia, espaçamentos, exemplos de aplicação) para a marca funcionar em equipas e fornecedores. A proposta é acordada no arranque do projeto.',
        },
      ],
    },
    en: {
      metaTitle: 'Branding & visual identity services in Portugal',
      metaDescription:
        'Brand identity, guidelines and visual systems by Flow Productions in Faro, Portugal. Positioning, design craft and multi-channel consistency for teams across Portugal and the EU. Get in touch.',
      keywords: [
        'branding Portugal',
        'visual identity agency',
        'brand guidelines',
        'Faro creative agency',
        'rebrand Portugal',
        'corporate identity EU',
      ],
      schemaFaqs: [
        {
          question: 'What is branding in practice?',
          answer:
            'Branding is the set of choices that shape how a company is perceived: positioning, voice, visual identity and application rules. Flow Productions, based in Faro, Portugal, connects strategy and craft so your brand stays consistent across digital, print and physical touchpoints.',
        },
        {
          question: 'Do you handle full rebranding projects?',
          answer:
            'Yes. We support refresh and full rebrands: audit, concept routes, visual system, brand manuals or application guides, and rollout support with internal teams or partners. We work with clients in Portugal and remotely across the EU.',
        },
        {
          question: 'How long does a branding project take?',
          answer:
            'Timelines depend on scope, number of touchpoints and feedback rounds. After the kickoff brief we propose milestones; typical projects range from several weeks to a few months.',
        },
        {
          question: 'Where is Flow Productions based and do you work outside the Algarve?',
          answer:
            'Our studio is in Faro, Algarve, Portugal. We serve clients across Portugal and internationally using online workshops, centralized file delivery and clear approval workflows.',
        },
        {
          question: 'Do you deliver only a logo?',
          answer:
            'We can focus on a mark, but we usually recommend a minimum system—colour, type, spacing and sample applications—so teams and vendors can apply the brand consistently. Scope is agreed at project start.',
        },
      ],
    },
    fr: {
      metaTitle: 'Branding et identité visuelle au Portugal',
      metaDescription:
        'Identité de marque, charte graphique et système visuel avec Flow Productions à Faro, Portugal. Positionnement et cohérence multicanal pour marques au Portugal et en Europe. Contactez-nous.',
      keywords: [
        'branding Portugal',
        'identité visuelle',
        'charte graphique',
        'agence créative Faro',
        'rebranding Portugal',
        'design de marque',
      ],
      schemaFaqs: [
        {
          question: 'Qu’est-ce que le branding concrètement ?',
          answer:
            'Le branding regroupe les choix qui façonnent la perception d’une marque : positionnement, ton, identité visuelle et règles d’application. Flow Productions, à Faro au Portugal, aligne stratégie et exécution pour une cohérence digital, print et physique.',
        },
        {
          question: 'Réalisez-vous des rebranding complets ?',
          answer:
            'Oui. Nous couvrons refresh et rebranding : audit, concepts, système visuel, manuel ou guide d’application, et accompagnement de déploiement. Nous travaillons avec des marques au Portugal et à distance en Europe.',
        },
        {
          question: 'Combien de temps dure un projet de branding ?',
          answer:
            'Cela dépend du périmètre, des points de contact et des cycles de validation. Après le brief, nous proposons un calendrier avec jalons ; les projets vont souvent de quelques semaines à quelques mois.',
        },
        {
          question: 'Où êtes-vous situés et travaillez-vous hors Algarve ?',
          answer:
            'Notre studio est à Faro, en Algarve, Portugal. Nous accompagnons des clients dans tout le pays et à l’international en visio, avec livraison centralisée des fichiers et validations claires.',
        },
        {
          question: 'Livrez-vous seulement un logo ?',
          answer:
            'Nous pouvons nous concentrer sur un signe, mais nous recommandons un socle minimum (couleurs, typo, marges, exemples) pour une application fiable par les équipes. Le périmètre est défini au lancement.',
        },
      ],
    },
  },
  'web-design': {
    pt: {
      metaTitle: 'Web design e sites WordPress em Portugal',
      metaDescription:
        'Web design orientado a conversão, performance e SEO técnico. Flow Productions em Faro: UX/UI, desenvolvimento e páginas rápidas para marcas em Portugal. Peça proposta.',
      keywords: [
        'web design Portugal',
        'design de websites',
        'SEO técnico',
        'UX UI Faro',
        'site responsivo',
        'agência web Algarve',
      ],
      schemaFaqs: [
        {
          question: 'O que inclui um projeto de web design convosco?',
          answer:
            'Inclui arquitetura de informação e UX, UI e componentes, integração com desenvolvimento conforme o stack acordado, boas práticas de performance, acessibilidade e SEO técnico on-page. O detalhe do âmbito (páginas, CMS, integrações) define-se no brief.',
        },
        {
          question: 'Fazem SEO além do web design?',
          answer:
            'Garantimos bases técnicas sólidas (estrutura, metadados, performance, HTML semântico). SEO de conteúdo, link building ou campanhas podem ser planeados em paralelo ou com parceiros — alinhamos expectativas na proposta.',
        },
        {
          question: 'Trabalham com empresas fora de Faro?',
          answer:
            'Sim. A equipa está em Faro, Portugal, mas o processo é remoto-first: workshops online, protótipos partilhados e QA antes do lançamento. Atendemos clientes em todo o país e na UE.',
        },
        {
          question: 'Quanto tempo leva lançar um novo site?',
          answer:
            'Depende do número de templates, integrações (CRM, analytics, formulários) e revisões de conteúdo. Após o kickoff damos um cronograma realista; projetos médios costumam levar de semanas a poucos meses.',
        },
        {
          question: 'Os sites são responsivos e acessíveis?',
          answer:
            'Sim, é padrão: layouts adaptam-se a mobile, tablet e desktop e seguimos boas práticas de contraste, hierarquia e componentes reutilizáveis. Requisitos WCAG específicos devem ser indicados no brief.',
        },
      ],
    },
    en: {
      metaTitle: 'Web design & UX/UI agency in Faro, Portugal',
      metaDescription:
        'Conversion-focused web design, performance and technical SEO. Flow Productions in Faro builds fast, accessible sites and UX/UI systems for brands in Portugal and the EU. Request a proposal.',
      keywords: [
        'web design Portugal',
        'UX UI agency Faro',
        'technical SEO',
        'responsive website',
        'WordPress design Portugal',
        'creative agency Algarve',
      ],
      schemaFaqs: [
        {
          question: 'What does a web design project include?',
          answer:
            'We cover information architecture and UX, UI design and components, development handoff or build depending on stack, plus performance, accessibility and technical on-page SEO foundations. Page count, CMS and integrations are scoped in the brief.',
        },
        {
          question: 'Do you provide SEO beyond design?',
          answer:
            'We deliver strong technical foundations—structure, metadata, performance, semantic markup. Content SEO, link building or paid campaigns can be planned separately or with partners; we align expectations in the proposal.',
        },
        {
          question: 'Do you work with companies outside Faro?',
          answer:
            'Yes. We are based in Faro, Portugal, but the process is remote-first: online workshops, shared prototypes and pre-launch QA. We support clients across Portugal and the EU.',
        },
        {
          question: 'How long does it take to launch a new website?',
          answer:
            'It depends on templates, integrations (CRM, analytics, forms) and content rounds. After kickoff we share a realistic timeline; typical projects run from several weeks to a few months.',
        },
        {
          question: 'Are sites responsive and accessible?',
          answer:
            'Yes by default: layouts adapt to mobile, tablet and desktop with solid contrast, hierarchy and reusable components. Specific WCAG targets should be stated in the brief.',
        },
      ],
    },
    fr: {
      metaTitle: 'Web design et UX/UI au Portugal',
      metaDescription:
        'Web design centré conversion, performance et SEO technique. Flow Productions à Faro : sites rapides, UX/UI et bonnes pratiques pour marques au Portugal et en Europe. Demandez un devis.',
      keywords: [
        'web design Portugal',
        'UX UI Faro',
        'SEO technique',
        'site responsive',
        'agence web Portugal',
        'création site Algarve',
      ],
      schemaFaqs: [
        {
          question: 'Que comprend un projet de web design ?',
          answer:
            'Architecture d’information et UX, UI et composants, intégration ou développement selon le stack, performance, accessibilité et bases de SEO technique on-page. Le périmètre (pages, CMS, intégrations) est fixé au brief.',
        },
        {
          question: 'Proposez-vous du SEO au-delà du design ?',
          answer:
            'Nous assurons des fondations techniques solides. Le SEO éditorial, netlinking ou paid peut être planifié en parallèle ; nous alignons les attentes dans la proposition.',
        },
        {
          question: 'Travaillez-vous hors de Faro ?',
          answer:
            'Oui. Studio à Faro, Portugal, processus remote : ateliers en ligne, prototypes partagés et QA avant mise en ligne. Clients au Portugal et en Europe.',
        },
        {
          question: 'Combien de temps pour lancer un site ?',
          answer:
            'Cela dépend des gabarits, intégrations et cycles de contenu. Après le kickoff nous proposons un planning réaliste, souvent de quelques semaines à quelques mois.',
        },
        {
          question: 'Les sites sont-ils responsive et accessibles ?',
          answer:
            'Oui par défaut : adaptation mobile, tablette, desktop, contraste et hiérarchie. Précisez des objectifs WCAG dans le brief si nécessaire.',
        },
      ],
    },
  },
  'packaging-design': {
    pt: {
      metaTitle: 'Design de embalagem e packaging em Portugal',
      metaDescription:
        'Packaging que destaca em prateleira e e-commerce. Flow Productions em Faro: estrutura, gráfica, provas de cor e fichas técnicas para marcas em Portugal e UE.',
      keywords: [
        'design embalagem Portugal',
        'packaging design',
        'rótulos Portugal',
        'PDP design',
        'Faro agência design',
        'embalagem sustentável',
      ],
      schemaFaqs: [
        {
          question: 'Fazem design de embalagem para retalho e online?',
          answer:
            'Sim. Desenvolvemos conceito visual, dielines em colaboração com fornecedores, hierarquia de informação regulamentar e variantes para canais físicos e PDP. A Flow Productions está em Faro e trabalha com marcas em Portugal e na UE.',
        },
        {
          question: 'Ajudam com regulamentação e claims na embalagem?',
          answer:
            'Apoiamos na clareza de mensagem e layout; validação legal final de claims nutricionais ou industriais deve ser confirmada com assessores regulatórios do cliente. Indicamos riscos comuns no brief.',
        },
        {
          question: 'Entregam ficheiros prontos para impressão?',
          answer:
            'Sim: artes finais, marcas de corte quando aplicável e especificações de cor acordadas (Pantone, perfis). Trabalhamos com feedback da gráfica ou conversor para fechar provas.',
        },
        {
          question: 'Fazem apenas redesign visual mantendo a forma?',
          answer:
            'Sim, quando a estrutura física se mantém. Reduzimos custo e prazo focando gráfica, hierarquia e série de SKU; o âmbito é definido na proposta.',
        },
        {
          question: 'Atendem marcas fora do Algarve?',
          answer:
            'Sim. Reuniões e aprovações podem ser remotas; deslocações para shooting ou provas podem ser orçamentadas conforme o projeto.',
        },
      ],
    },
    en: {
      metaTitle: 'Packaging design agency in Portugal',
      metaDescription:
        'Shelf-ready and e-commerce packaging design from Flow Productions in Faro, Portugal. Structure, graphics, colour proofs and production files for brands in Portugal and the EU.',
      keywords: [
        'packaging design Portugal',
        'label design',
        'retail packaging',
        'Faro design agency',
        'sustainable packaging EU',
        'product packaging',
      ],
      schemaFaqs: [
        {
          question: 'Do you design packaging for retail and e-commerce?',
          answer:
            'Yes. We develop visual concepts, coordinate dielines with converters, regulatory information hierarchy and variants for shelf and PDP. Flow Productions is based in Faro, Portugal, and works with brands across Portugal and the EU.',
        },
        {
          question: 'Can you help with regulatory claims on pack?',
          answer:
            'We support clarity and layout; final legal validation of regulated claims should be confirmed with the client’s regulatory advisors. We flag common risks during briefing.',
        },
        {
          question: 'Do you deliver print-ready files?',
          answer:
            'Yes: final artwork, die lines when applicable and agreed colour specifications (Pantone, profiles). We iterate with the printer or converter to approve proofs.',
        },
        {
          question: 'Can you refresh graphics without changing structure?',
          answer:
            'Yes when the physical structure stays the same. We focus on graphics, hierarchy and SKU ranges—scope is defined in the proposal.',
        },
        {
          question: 'Do you work with brands outside the Algarve?',
          answer:
            'Yes. Reviews can be remote; travel for shoots or press checks can be quoted per project.',
        },
      ],
    },
    fr: {
      metaTitle: 'Design packaging et emballage au Portugal',
      metaDescription:
        'Packaging linéaire et e-commerce avec Flow Productions à Faro, Portugal. Graphisme, épreuves couleur et fichiers production pour marques au Portugal et en Europe.',
      keywords: [
        'design packaging Portugal',
        'emballage produit',
        'étiquettes',
        'agence design Faro',
        'PDP e-commerce',
        'Algarve créatif',
      ],
      schemaFaqs: [
        {
          question: 'Concevez-vous du packaging retail et e-commerce ?',
          answer:
            'Oui. Concept visuel, gabarits avec le convertisseur, hiérarchie d’informations et variantes rayon / PDP. Flow Productions est à Faro, Portugal, et travaille avec des marques au Portugal et en UE.',
        },
        {
          question: 'Aidez-vous sur les mentions réglementaires ?',
          answer:
            'Nous aidons sur la lisibilité et la mise en page ; la validation juridique finale revient aux experts du client. Nous signalons les risques courants au brief.',
        },
        {
          question: 'Livrez-vous des fichiers prêt à imprimer ?',
          answer:
            'Oui : arts finaux, traits de coupe si besoin, couleurs convenues. Itérations avec l’imprimeur pour valider les épreuves.',
        },
        {
          question: 'Faites-vous un refresh graphique sans changer la forme ?',
          answer:
            'Oui si la structure reste identique. Périmètre fixé dans la proposition.',
        },
        {
          question: 'Travaillez-vous hors Algarve ?',
          answer:
            'Oui, en remote ; déplacements possibles selon devis.',
        },
      ],
    },
  },
  ilustracao: {
    pt: {
      metaTitle: 'Ilustração editorial e de marca em Portugal',
      metaDescription:
        'Ilustração para marcas, editoriais e campanhas. Flow Productions em Faro: estilo consistente, direitos de uso e ficheiros para digital e impresso.',
      keywords: [
        'ilustração Portugal',
        'ilustração editorial',
        'brand illustration',
        'ícones personalizados',
        'Faro ilustrador',
        'infografia ilustrada',
      ],
      schemaFaqs: [
        {
          question: 'Que tipo de ilustração produzem?',
          answer:
            'Ilustração de marca, editorial, ícones e pictogramas, infografias ilustradas e peças de campanha. Definimos estilo, paleta e traço num guia curto para reutilização. Estamos em Faro, Portugal, com entregas remotas.',
        },
        {
          question: 'Os direitos de uso ficam claros no contrato?',
          answer:
            'Sim. Acordamos território, duração, canais (web, social, print, paid) e exclusividade. Entregamos ficheiros fonte quando contratado.',
        },
        {
          question: 'Ilustram a partir de fotografia ou apenas conceito?',
          answer:
            'Ambos: podemos trabalhar de referências fotográficas licenciadas ou de brief aberto com moodboards. Direitos de referência são responsabilidade do cliente salvo acordo em contrário.',
        },
        {
          question: 'Entregam em que formatos?',
          answer:
            'SVG, PDF, PNG alta resolução, ou nativos de acordo com o fluxo (Figma, Adobe). O pack de exportação é alinhado ao canal final.',
        },
        {
          question: 'Atendem clientes internacionais?',
          answer:
            'Sim. Briefs e revisões em inglês, português ou francês; fuso horário da Europa é o nosso padrão operacional.',
        },
      ],
    },
    en: {
      metaTitle: 'Brand & editorial illustration in Portugal',
      metaDescription:
        'Custom illustration for brands, editorial and campaigns. Flow Productions in Faro, Portugal: distinctive style, clear usage rights and files for digital and print.',
      keywords: [
        'illustration Portugal',
        'editorial illustration',
        'brand illustration',
        'custom icons',
        'Faro illustrator',
        'infographic illustration',
      ],
      schemaFaqs: [
        {
          question: 'What illustration work do you produce?',
          answer:
            'Brand illustration, editorial art, icon sets, illustrated infographics and campaign pieces. We define palette and stroke in a short guide for reuse. Based in Faro, Portugal, with remote delivery.',
        },
        {
          question: 'Are usage rights spelled out in the contract?',
          answer:
            'Yes. We agree territory, term, channels (web, social, print, paid) and exclusivity. Source files are delivered when contracted.',
        },
        {
          question: 'Do you illustrate from photos or from concept only?',
          answer:
            'Both: we can work from licensed references or open briefs with moodboards. Reference rights remain with the client unless otherwise agreed.',
        },
        {
          question: 'Which file formats do you deliver?',
          answer:
            'SVG, PDF, high-res PNG, or native files per workflow (Figma, Adobe). Export packs match the final channel.',
        },
        {
          question: 'Do you work with international clients?',
          answer:
            'Yes. Briefs and reviews in English, Portuguese or French; European time zones are our default.',
        },
      ],
    },
    fr: {
      metaTitle: 'Illustration éditoriale et de marque au Portugal',
      metaDescription:
        'Illustration sur mesure pour marques et éditions. Flow Productions à Faro : style cohérent, droits d’usage clairs, fichiers print et digital.',
      keywords: [
        'illustration Portugal',
        'illustration éditoriale',
        'illustration de marque',
        'icônes sur mesure',
        'Faro illustration',
        'infographie illustrée',
      ],
      schemaFaqs: [
        {
          question: 'Quels types d’illustration produisez-vous ?',
          answer:
            'Illustration de marque, éditoriale, pictogrammes, infographies illustrées et campagnes. Guide court de style. Basés à Faro, Portugal, livraison à distance.',
        },
        {
          question: 'Les droits d’usage sont-ils contractuels ?',
          answer:
            'Oui : territoire, durée, canaux et exclusivité. Fichiers sources si prévu au contrat.',
        },
        {
          question: 'Travaillez-vous depuis photo ou concept ?',
          answer:
            'Les deux, avec moodboards ou références licenciées selon le brief.',
        },
        {
          question: 'Quels formats livrez-vous ?',
          answer:
            'SVG, PDF, PNG haute résolution ou natifs (Figma, Adobe) selon le flux.',
        },
        {
          question: 'Clients internationaux ?',
          answer:
            'Oui, briefs en PT/EN/FR, fuseaux Europe.',
        },
      ],
    },
  },
  'design-editorial': {
    pt: {
      metaTitle: 'Design editorial: relatórios, livros e revistas',
      metaDescription:
        'Design editorial para relatórios anuais, revistas e publicações longas. Flow Productions em Faro: grelhas, tipografia e preparação para impressão ou digital.',
      keywords: [
        'design editorial Portugal',
        'relatório anual design',
        'catalogo design',
        'tipografia editorial',
        'Faro design',
        'publicação impressa',
      ],
      schemaFaqs: [
        {
          question: 'Que publicações cobrem em design editorial?',
          answer:
            'Relatórios e ESG, revistas, catálogos, manuais de marca longos e documentação técnica. Trabalhamos grelha, estilos de parágrafo, imagens e fluxo de revisão. Sede em Faro, Portugal.',
        },
        {
          question: 'Preparam ficheiros para impressão?',
          answer:
            'Sim: PDF/X ou pacotes conforme a gráfica, sangramentos, marcas de corte quando necessário e provas digitais.',
        },
        {
          question: 'Aceitam texto em fluxo contínuo do cliente?',
          answer:
            'Sim, com modelo de estilos e convenções de markup. Alterações grandes de texto podem impactar paginação — gerimos versões com numeração clara.',
        },
        {
          question: 'Fazem versões digitais interativas?',
          answer:
            'Sim quando o projeto pede: PDF interativo, spreads para tablet ou adaptação para leitura online. O âmbito é definido no brief.',
        },
        {
          question: 'Prazos típicos para um relatório anual?',
          answer:
            'Dependem de páginas, revisões e disponibilidade de conteúdo final. Após inventário de capítulos propomos calendário com marcos de conteúdo e fecho de artes.',
        },
      ],
    },
    en: {
      metaTitle: 'Editorial design for reports, books & magazines',
      metaDescription:
        'Editorial design for annual reports, magazines and long-form publications. Flow Productions in Faro, Portugal: grids, typography and print or digital production files.',
      keywords: [
        'editorial design Portugal',
        'annual report design',
        'catalogue layout',
        'typography design',
        'Faro design studio',
        'print production',
      ],
      schemaFaqs: [
        {
          question: 'Which publications do you cover?',
          answer:
            'Annual and ESG reports, magazines, catalogues, long brand manuals and technical documentation. We handle grids, paragraph styles, imagery and review workflows from Faro, Portugal.',
        },
        {
          question: 'Do you prepare print-ready files?',
          answer:
            'Yes: PDF/X or packages per printer specs, bleed, crop marks when needed and digital proofs.',
        },
        {
          question: 'Can we supply flowing copy from Word?',
          answer:
            'Yes with a style model and markup conventions. Large text changes can affect pagination—we version files with clear numbering.',
        },
        {
          question: 'Do you create interactive digital versions?',
          answer:
            'Yes when scoped: interactive PDF, tablet spreads or online reading adaptations—defined in the brief.',
        },
        {
          question: 'Typical timelines for an annual report?',
          answer:
            'They depend on page count, feedback rounds and final content readiness. After a chapter inventory we propose milestones for copy lock and artwork freeze.',
        },
      ],
    },
    fr: {
      metaTitle: 'Design éditorial : rapports, livres, magazines',
      metaDescription:
        'Mise en page pour rapports annuels, magazines et éditions longues. Flow Productions à Faro : grilles typo, préparation print ou digital.',
      keywords: [
        'design éditorial Portugal',
        'rapport annuel design',
        'catalogue mise en page',
        'typographie',
        'Faro studio',
        'print',
      ],
      schemaFaqs: [
        {
          question: 'Quelles publications couvrez-vous ?',
          answer:
            'Rapports et ESG, magazines, catalogues, manuels longs, documentation technique. Studio à Faro, Portugal.',
        },
        {
          question: 'Fichiers prêt à imprimer ?',
          answer:
            'Oui : PDF/X, fonds perdus, traits de coupe si besoin.',
        },
        {
          question: 'Texte fourni en flux ?',
          answer:
            'Oui avec styles et conventions ; grosses modifications peuvent impacter la pagination.',
        },
        {
          question: 'Versions digitales interactives ?',
          answer:
            'Oui si prévu au brief (PDF interactif, liseuse, etc.).',
        },
        {
          question: 'Délais pour un rapport annuel ?',
          answer:
            'Selon pagination et cycles de relecture ; calendrier après inventaire.',
        },
      ],
    },
  },
  'ux-ui-design': {
    pt: {
      metaTitle: 'UX/UI design e produto digital em Portugal',
      metaDescription:
        'UX research, UI e design systems para apps e websites. Flow Productions em Faro: fluxos, protótipos testáveis e handoff para desenvolvimento.',
      keywords: [
        'UX UI Portugal',
        'design de produto',
        'protótipo Figma',
        'design system',
        'Faro UX',
        'pesquisa utilizador',
      ],
      schemaFaqs: [
        {
          question: 'Fazem pesquisa com utilizadores?',
          answer:
            'Sim quando o projeto inclui discovery: entrevistas, testes de usabilidade em protótipo ou análise heurística. O nível de research acordamos no arranque com objetivos e prazo.',
        },
        {
          question: 'Entregam design system para developers?',
          answer:
            'Sim: componentes, tokens de cor e tipo, estados e documentação mínima para handoff (Figma, specs, links). Integração com código pode ser feita com a vossa equipa ou parceiros.',
        },
        {
          question: 'Trabalham só em Figma?',
          answer:
            'Figma é o padrão; podemos adaptar entregáveis se o cliente usar outra ferramenta acordada.',
        },
        {
          question: 'Ajudam a priorizar backlog de produto?',
          answer:
            'Podemos apoiar com mapas de jornada, oportunidades e recomendações de MVP; ownership do backlog é da equipa de produto.',
        },
        {
          question: 'Onde está a equipa?',
          answer:
            'Flow Productions em Faro, Algarve, Portugal; colaboração remota com equipas nacionais e europeias.',
        },
      ],
    },
    en: {
      metaTitle: 'UX/UI & digital product design in Portugal',
      metaDescription:
        'UX, UI and design systems for web and apps. Flow Productions in Faro, Portugal: flows, testable prototypes and developer-ready handoff.',
      keywords: [
        'UX UI Portugal',
        'product design',
        'Figma prototype',
        'design system',
        'Faro UX agency',
        'usability testing',
      ],
      schemaFaqs: [
        {
          question: 'Do you run user research?',
          answer:
            'Yes when discovery is in scope: interviews, usability tests on prototypes or heuristic reviews. Research depth is agreed at kickoff with goals and timeline.',
        },
        {
          question: 'Do you deliver design systems for developers?',
          answer:
            'Yes: components, colour and type tokens, states and handoff docs (Figma, specs, links). Code integration can sit with your team or partners.',
        },
        {
          question: 'Is Figma the only tool?',
          answer:
            'Figma is default; we can align outputs if another tool is contracted.',
        },
        {
          question: 'Can you help prioritize a product backlog?',
          answer:
            'We can support with journey maps, opportunity themes and MVP recommendations; backlog ownership stays with product.',
        },
        {
          question: 'Where is the team located?',
          answer:
            'Flow Productions is in Faro, Algarve, Portugal, collaborating remotely with national and European teams.',
        },
      ],
    },
    fr: {
      metaTitle: 'UX/UI et design produit digital au Portugal',
      metaDescription:
        'UX, UI et design systems pour web et apps. Flow Productions à Faro : parcours, prototypes testables et handoff développeurs.',
      keywords: [
        'UX UI Portugal',
        'design produit',
        'prototype Figma',
        'design system',
        'Faro UX',
        'tests utilisateurs',
      ],
      schemaFaqs: [
        {
          question: 'Faites-vous de la recherche utilisateur ?',
          answer:
            'Oui si discovery au scope : entretiens, tests sur prototype ou revue heuristique.',
        },
        {
          question: 'Design system pour devs ?',
          answer:
            'Oui : composants, tokens, états, documentation Figma.',
        },
        {
          question: 'Uniquement Figma ?',
          answer:
            'Par défaut Figma ; autre outil si convenu.',
        },
        {
          question: 'Priorisation backlog ?',
          answer:
            'Cartes de parcours et recommandations MVP ; ownership produit chez vous.',
        },
        {
          question: 'Localisation ?',
          answer:
            'Faro, Algarve, Portugal ; collaboration remote Europe.',
        },
      ],
    },
  },
  'social-media-design': {
    pt: {
      metaTitle: 'Design para redes sociais e criativos paid',
      metaDescription:
        'Templates e criativos para feeds, stories e anúncios. Flow Productions em Faro: identidade consistente, formatos seguros e variações para testes.',
      keywords: [
        'design redes sociais',
        'criativos Facebook Instagram',
        'templates social media',
        'paid social creative',
        'Faro design',
        'motion stills',
      ],
      schemaFaqs: [
        {
          question: 'Criam templates reutilizáveis para a equipa interna?',
          answer:
            'Sim: estruturas em Figma ou Canva conforme competências da equipa, com guia de uso, zonas seguras e exemplos por formato (1:1, 4:5, 9:16).',
        },
        {
          question: 'Fazem variações para A/B testing em paid?',
          answer:
            'Sim: hooks, headlines e crops alternativos dentro da mesma linha criativa, exportados nos pesos e formatos da rede.',
        },
        {
          question: 'Incluem legendas ou só visual?',
          answer:
            'Por defeito foco em visual; copy curta pode ser acordada como add-on ou com equipa de conteúdos.',
        },
        {
          question: 'Trabalham com identidade já existente?',
          answer:
            'Sim, aplicamos guidelines existentes ou estendemos o sistema com novos templates alinhados à marca.',
        },
        {
          question: 'Prazo para um pack mensal?',
          answer:
            'Depende do número de peças e canais. Após calendário editorial fechamos entregas semanais ou em lote.',
        },
      ],
    },
    en: {
      metaTitle: 'Social media design & paid ad creatives',
      metaDescription:
        'Feed, story and paid social templates from Flow Productions in Faro, Portugal. Consistent brand identity, safe zones and variants for testing.',
      keywords: [
        'social media design',
        'Instagram creative',
        'paid social templates',
        'Facebook ads design',
        'Faro creative agency',
        'ad creative testing',
      ],
      schemaFaqs: [
        {
          question: 'Can you build reusable templates for our team?',
          answer:
            'Yes: Figma or Canva structures aligned to your skills, with usage notes, safe zones and examples per ratio (1:1, 4:5, 9:16).',
        },
        {
          question: 'Do you create variants for paid A/B tests?',
          answer:
            'Yes: alternate hooks, headlines and crops within one creative line, exported to platform specs.',
        },
        {
          question: 'Visual only or captions too?',
          answer:
            'Default focus is visual; short copy can be scoped as an add-on or with your content team.',
        },
        {
          question: 'Do you work with an existing brand system?',
          answer:
            'Yes—we apply current guidelines or extend the system with new on-brand templates.',
        },
        {
          question: 'Timelines for a monthly pack?',
          answer:
            'Depends on piece count and channels. After the editorial calendar we batch or deliver weekly drops.',
        },
      ],
    },
    fr: {
      metaTitle: 'Design social media et créas publicitaires',
      metaDescription:
        'Templates flux, stories et paid social avec Flow Productions à Faro. Identité cohérente, zones sécurisées et variantes pour tests.',
      keywords: [
        'design social media',
        'créatifs Instagram',
        'templates paid social',
        'Faro agence',
        'publicité social',
      ],
      schemaFaqs: [
        {
          question: 'Templates réutilisables pour l’équipe ?',
          answer:
            'Oui, Figma ou Canva, zones safe, ratios 1:1, 4:5, 9:16.',
        },
        {
          question: 'Variantes pour A/B paid ?',
          answer:
            'Oui, hooks et crops selon specs réseaux.',
        },
        {
          question: 'Visuel seul ou légendes ?',
          answer:
            'Focus visuel ; copy en option.',
        },
        {
          question: 'Charte existante ?',
          answer:
            'Application ou extension de guidelines.',
        },
        {
          question: 'Délais pack mensuel ?',
          answer:
            'Selon volume ; calendrier éditorial requis.',
        },
      ],
    },
  },
  'space-branding': {
    pt: {
      metaTitle: 'Space branding e sinalética em Portugal',
      metaDescription:
        'Ambientação de espaços, sinalética e experiência de marca física. Flow Productions em Faro: conceito, especificações e apoio a produção.',
      keywords: [
        'space branding Portugal',
        'sinalética',
        'ambientação loja',
        'evento branding',
        'Faro design espaço',
        'retail design',
      ],
      schemaFaqs: [
        {
          question: 'O que é space branding?',
          answer:
            'É a aplicação da marca em ambientes físicos: sinalética, cores, materiais, iluminação e pontos de contacto que reforçam narrativa. A Flow Productions, em Faro, desenvolve conceito e especificações e coordena com fornecedores.',
        },
        {
          question: 'Fazem apenas conceito ou também acompanhamento de obra?',
          answer:
            'Podemos ficar em conceito e manuais de aplicação ou acompanhar amostras, provas e instalação conforme contrato. Deslocações fora do Algarve são orçamentadas.',
        },
        {
          question: 'Trabalham com normas de acessibilidade em sinalética?',
          answer:
            'Sim, integramos contraste, alturas de leitura e pictogramas quando o projeto exige; requisitos legais locais devem ser validados com o cliente.',
        },
        {
          question: 'Servem para eventos temporários?',
          answer:
            'Sim: materiais desmontáveis, vinil, backdrops e wayfinding para feiras ou lançamentos.',
        },
        {
          question: 'Atendem cadeias com várias lojas?',
          answer:
            'Sim, com kits modulares e manuais por formato de loja para escalar com consistência.',
        },
      ],
    },
    en: {
      metaTitle: 'Space branding & environmental design, Portugal',
      metaDescription:
        'Branded environments, signage and spatial experience. Flow Productions in Faro, Portugal: concept, specifications and production support for retail, HQ and events.',
      keywords: [
        'space branding Portugal',
        'environmental graphics',
        'retail signage',
        'event branding',
        'Faro spatial design',
        'wayfinding design',
      ],
      schemaFaqs: [
        {
          question: 'What is space branding?',
          answer:
            'It is how brand identity shows up physically: signage, colour, materials, lighting and touchpoints that reinforce the story. Flow Productions in Faro develops concepts and specs and coordinates with fabricators.',
        },
        {
          question: 'Concept only or site support too?',
          answer:
            'We can stop at concept and application manuals or support samples, proofs and install per contract. Travel outside the Algarve is quoted.',
        },
        {
          question: 'Do you follow accessibility guidance for signage?',
          answer:
            'Yes—contrast, viewing heights and pictograms when required. Local legal requirements should be validated with the client.',
        },
        {
          question: 'Do you cover temporary events?',
          answer:
            'Yes: modular graphics, vinyl, backdrops and wayfinding for fairs or launches.',
        },
        {
          question: 'Can you support multi-store rollouts?',
          answer:
            'Yes with modular kits and manuals per store format for consistent scale.',
        },
      ],
    },
    fr: {
      metaTitle: 'Space branding et signalétique au Portugal',
      metaDescription:
        'Espaces de marque, signalétique et expérience physique. Flow Productions à Faro : concept, cahier des charges et suivi de production.',
      keywords: [
        'space branding Portugal',
        'signalétique',
        'retail design',
        'événementiel',
        'Faro design espace',
      ],
      schemaFaqs: [
        {
          question: 'Qu’est-ce que le space branding ?',
          answer:
            'Application de la marque dans l’espace : signalétique, matériaux, lumière, parcours. Flow Productions à Faro.',
        },
        {
          question: 'Concept ou suivi chantier ?',
          answer:
            'Les deux possibles selon contrat ; déplacements devisés.',
        },
        {
          question: 'Accessibilité signalétique ?',
          answer:
            'Contrastes et pictogrammes ; validation réglementaire chez le client.',
        },
        {
          question: 'Événements temporaires ?',
          answer:
            'Oui, vinyles, backdrops, wayfinding.',
        },
        {
          question: 'Réseaux multi-magasins ?',
          answer:
            'Kits modulaires et manuels par format.',
        },
      ],
    },
  },
};
