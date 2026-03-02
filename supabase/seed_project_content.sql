-- =============================================================================
-- PROJECT CONTENT: descriptions, client names, year labels
-- Source: https://flowproductions.pt/portfolio/<slug>/
--
-- Run AFTER seed.sql.
-- For video_url: replace NULL values with the YouTube URL for each project
-- e.g. UPDATE projects SET gallery = '{"video_url":"https://youtu.be/XXXXX"}'
--      WHERE slug->>'pt' = 'ultima-gota';
-- =============================================================================

CREATE OR REPLACE FUNCTION _update_project(
  p_slug        text,
  p_summary_pt  text,
  p_content_pt  text,
  p_client      text,
  p_year        text,
  p_video_url   text
) RETURNS void AS $$
BEGIN
  UPDATE projects SET
    summary     = jsonb_build_object('pt', p_summary_pt, 'en', p_summary_pt, 'fr', p_summary_pt),
    content     = jsonb_build_object('pt', p_content_pt, 'en', p_content_pt, 'fr', p_content_pt),
    client_name = p_client,
    year_label  = CASE WHEN p_year IS NOT NULL THEN to_jsonb(p_year) ELSE NULL END,
    gallery     = CASE WHEN p_video_url IS NOT NULL
                       THEN jsonb_build_object('video_url', p_video_url)
                       ELSE gallery END   -- keep existing value if NULL passed
  WHERE slug->>'pt' = p_slug;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ANIMAÇÃO
-- =============================================================================

SELECT _update_project(
  'ultima-gota',
  'Animação nomeada para a 28ª Edição do Suncine – Festival Internacional de Cinema do Meio Ambiente em Barcelona e no México.',
  'Animação nomeada para a 28ª Edição do Suncine – Festival Internacional de Cinema do Meio Ambiente em Barcelona e no México, e também selecionada para a 7ª edição do Concurso Internacional de Curtas-Metragens, CCineEco em Seia.',
  'Festival Suncine', 'Setembro, 2023',
  NULL
);

SELECT _update_project(
  'likewise',
  'Flow foi responsável pela produção desta animação, na qual tínhamos de provar ao cliente as vantagens positivas do produto.',
  'Flow foi responsável pela produção desta animação, na qual tínhamos de provar ao cliente as vantagens positivas do produto.',
  'Festival Suncine', 'Setembro, 2023',
  NULL
);

SELECT _update_project(
  'medwater',
  'Animação 2D desenvolvida para a Medwater, comunicando as suas soluções de tratamento de água de forma clara e acessível.',
  'Animação explicativa criada para a Medwater, comunicando as soluções técnicas da empresa de forma clara e acessível ao público geral.',
  'Medwater', NULL,
  NULL
);

SELECT _update_project(
  'one-select-properties',
  'Imobiliário é mais do que apenas uma transação comercial. Este serviço personalizado começa por construir uma ideia abrangente dos seus desejos e aspirações.',
  'Imobiliário é mais do que apenas uma transação comercial. Este serviço personalizado começa por construir uma ideia abrangente dos seus desejos e aspirações.',
  'ZERO', 'Março, 2024',
  NULL
);

SELECT _update_project(
  'neomarca',
  'Série de entrevistas institucionais desenvolvidas para a Neomarca, reforçando a credibilidade e o posicionamento da agência.',
  'Produção e edição de entrevistas corporativas para a Neomarca, criando conteúdos que reforçam a credibilidade e posicionamento da marca.',
  'Neomarca', NULL,
  NULL
);

SELECT _update_project(
  'mia',
  'A MIA é uma mentora virtual criada para tornar o ensino da programação mais intuitivo e envolvente.',
  'A MIA é uma mentora virtual criada para tornar o ensino da programação mais intuitivo e envolvente. A Flow foi responsável por desenvolver o guião e a animação que apresentaram esta ferramenta educativa ao público. O desafio era comunicar tecnologia e aprendizagem de forma leve, humana e inspiradora. Criámos uma narrativa que une didática e emoção, resultando num guia que acompanha, motiva e simplifica o processo de aprendizagem. Com este projeto, demos vida a uma história que mostra como a animação e o storytelling podem tornar o conhecimento acessível, cativante e memorável.',
  'MIA', 'Dezembro, 2024',
  NULL
);

SELECT _update_project(
  'barturs',
  'Como transformar dados complexos em comunicação clara e apelativa? Foi esse o desafio proposto pelo KIPT para promover o Barturs.',
  'Como transformar dados complexos em comunicação clara e apelativa? Foi esse o desafio proposto pelo KIPT para promover o Barturs, o barómetro estatístico que analisa em tempo real o setor do turismo e da hospitalidade em Portugal. A Flow criou uma animação motion graphic que explica a plataforma de forma acessível e visualmente envolvente. Com gráficos dinâmicos e uma narrativa fluida, o vídeo tornou-se uma ferramenta de comunicação essencial — simples, moderna e cheia de ritmo.',
  'KIPT', 'Março, 2025',
  NULL
);

SELECT _update_project(
  'lets-communicate',
  'Animação desenvolvida para a Let''s Communicate, com o cliente XEQ.',
  'Animação desenvolvida para a Let''s Communicate, comunicando de forma clara a proposta de valor da empresa através de motion graphics.',
  'XEQ', 'Março, 2022',
  NULL
);

SELECT _update_project(
  'kipt',
  'Animação institucional sobre sustentabilidade e turismo para o KIPT, primeiro Laboratório Colaborativo na área do turismo em Portugal.',
  'O KIPT, primeiro Laboratório Colaborativo na área do turismo em Portugal, quis apresentar um projeto que avalia a sustentabilidade das regiões do Alentejo e Algarve. O objetivo era claro: traduzir ciência em emoção. A Flow desenvolveu uma animação institucional que mostra como a colaboração entre universidades e empresas pode gerar um turismo mais sustentável e inovador. Com uma estética leve e uma narrativa inspiradora, o vídeo une informação e propósito num formato que se move e emociona.',
  'KIPT', 'Setembro, 2023',
  NULL
);

SELECT _update_project(
  'emjogo',
  'No mundo do desporto, tempo é energia — e o EMJOGO veio para simplificar tudo.',
  'No mundo do desporto, tempo é energia — e o EMJOGO veio para simplificar tudo. A Flow criou uma animação narrativa que acompanha o dia de um gestor sobrecarregado até descobrir uma ferramenta que o liberta da papelada e o aproxima da equipa. Com storytelling leve e ritmo dinâmico, o vídeo mostra que tecnologia e desporto podem jogar do mesmo lado.',
  'EmJogo', 'Janeiro, 2023',
  NULL
);

SELECT _update_project(
  'travel-tech-partners',
  'Animação que destaca o acompanhamento aos viajantes pela Travel Tech Partners, desde a reserva até ao feedback pós-estadia.',
  'Tivemos o prazer de desenvolver uma animação para a Travel Tech Partners, pretendemos destacar o seu acompanhamento aos viajantes, desde a reserva até ao feedback pós-estadia. O objetivo da animação foi comunicar de forma clara e atrativa de que forma a Travel Tech Partners oferece uma experiência única e integrada, enriquecendo a jornada dos turistas em cada etapa.',
  'Geotravel', 'Março, 2024',
  NULL
);

SELECT _update_project(
  'toma-la-da-ca',
  'Animação integrada na campanha "Pega, Dá Aqui" para apoiar o comércio local de Loulé.',
  'Quando o comércio local voltou a abrir portas, a Câmara Municipal de Loulé quis reaproximar os consumidores das lojas da sua terra. A Flow criou uma animação integrada na campanha "Pega, Dá Aqui", com o objetivo de mostrar que comprar local é apoiar a economia, os vizinhos e o coração da cidade. Com cores vibrantes, humor e ritmo, o vídeo convidou o público a participar de forma leve e otimista. Uma animação com energia, empatia e um toque bem algarvio.',
  'CM Loulé', 'Novembro, 2021',
  NULL
);

-- =============================================================================
-- MARKETING
-- =============================================================================

SELECT _update_project(
  'dental-hpa',
  'Conteúdos que abrem sorrisos: estratégia de social media para a Dental HPA e Dental HPA Madeira.',
  'A Dental HPA e a Dental HPA Madeira queriam reforçar a sua presença online e criar uma comunicação capaz de transmitir não só confiança e profissionalismo, mas também proximidade e humanismo. Para a Dental HPA e a Dental HPA Madeira, a Flow desenvolveu as seguintes atividades: Definição de estratégia de conteúdos alinhada com os objetivos da marca. Criação de identidade visual para redes sociais (feed harmonioso, clean e reconhecível). Content writing e social copywriting para posts, carrosséis e vídeos. Desenvolvimento de scripts para conteúdos em vídeo. Elaboração de calendários editoriais mensais de conteúdos. Agendamento de conteúdos e gestão de publicações. Meta Ads (planeamento e execução de campanhas pagas). Relatórios e análise de resultados para otimização contínua.',
  'Dental HPA', NULL,
  NULL
);

SELECT _update_project(
  'albufeira-digital-nomads',
  'Identidade que transmite comunidade: branding para o projeto Albufeira Digital Nomads.',
  'O projeto Albufeira Digital Nomads nasceu com uma ambição dupla: atrair nómadas digitais para o município e, ao mesmo tempo, criar pontes com a comunidade local. A Flow propôs-se a desenvolver uma identidade visual e digital que refletisse esta simbiose na qual trabalho, partilha e companheirismo coexistem. Desenhámos um logótipo exclusivo, moderno e envolvente, que traduz os valores do projeto. Para além do branding, trabalhámos em materiais editoriais, design do website e space branding para eventos, garantindo uma comunicação coesa e atrativa em todos os pontos de contacto. O Albufeira Digital Nomads ganhou um branding que respira movimento e comunidade.',
  'CM Albufeira', 'Maio, 2023',
  NULL
);

SELECT _update_project(
  'kubidoce',
  'Quando o digital te faz querer comer e chorar por mais, a nossa missão está cumprida!',
  'Quando o digital te faz querer comer e chorar por mais, a nossa missão está cumprida! Para reforçar a comunicação direta com os clientes e estabelecer a Kubidoce como referência no setor, propusemos uma estratégia que humanizasse a marca e refletisse a sua essência através de uma presença ativa, conteúdos diversificados e um storytelling cativante. Esta abordagem incluiu o reforço da marca na comunidade, a criação de uma imagem apelativa e com foco no produto e o desenvolvimento de uma voz envolvente e descritiva, garantindo que cada mensagem transmitisse os valores e a identidade da marca.',
  'Kubidoce', NULL,
  NULL
);

SELECT _update_project(
  'rb-woodfinish',
  'Qualidade, experiência e dedicação que passam do ecrã para a sua casa!',
  'Qualidade, experiência e dedicação que passam do ecrã para a sua casa! A estratégia desenvolvida para a RB Woodfinish teve como objetivo refletir a sua história, valores e domínio em carpintaria técnica no digital. Os conteúdos que criámos destacam a excelência dos serviços e produtos, apostando numa imagem sofisticada e clean e numa comunicação humanizada, informativa e leve que transmite a essência de um negócio construído com base na dedicação e profissionalismo.',
  'RB Woodfinish', NULL,
  NULL
);

SELECT _update_project(
  'missao-conducao',
  'Uma presença online que acelera notoriedade, confiança e resultados para a Missão Condução.',
  'A Missão Condução é uma entidade formadora certificada na área dos transportes, reconhecida pela excelência e pela inovação na formação de motoristas e instrutores. Na Flow, desenhámos um plano de comunicação que coloca a Missão Condução em movimento também no digital: Desenvolvimento de uma estratégia de conteúdos multicanal, centrada em notoriedade e geração de leads. Criação de uma identidade visual para social media coerente e profissional. Calendários editoriais mensais com foco em formação, segurança rodoviária e inovação. Produção de textos e guiões para conteúdos em vídeo. Gestão de publicações, social copywriting e agendamento. Implementação e otimização de campanhas Meta Ads.',
  'Missão Condução', NULL,
  NULL
);

SELECT _update_project(
  'adm-24',
  'Impulsionar o melhor do design no digital? Feito!',
  'Impulsionar o melhor do design no digital? Feito! Fomos responsáveis por criar uma estratégia de divulgação nas redes sociais para promover a 13ª Edição do Algarve Design Meeting. Através de conteúdos dinâmicos e copy criativo, maximizámos o alcance deste evento e tornamos Faro na capital do Design.',
  'Algarve Design Meeting', NULL,
  NULL
);

SELECT _update_project(
  'nature-soul-food',
  'Branding e Web Design com raiz no afeto para a Nature Soul Food.',
  'A Nature Soul Food nasceu para inspirar uma relação mais consciente com a alimentação e com a vida. É um projeto que fala de nutrição, bem-estar e equilíbrio, onde cada escolha é feita com propósito. A Flow quis criar um branding e website que refletissem essa filosofia. No branding, desenvolvemos uma identidade visual limpa e orgânica, guiada por tons naturais e tipografia fluida, que espelham o universo calmo e positivo da marca. Para o website, desenhámos uma experiência digital intuitiva e acolhedora. O layout moderno e o uso equilibrado de espaços em branco reforçam a sensação de harmonia, enquanto o conteúdo visual e textual guia o utilizador através da essência da marca.',
  'Nature Soul Food', 'Maio, 2023',
  NULL
);

SELECT _update_project(
  'jardim-aurora',
  'Presença digital para o Jardim Aurora, espaço educativo rural inspirado na pedagogia Waldorf.',
  'O Jardim Aurora é um espaço educativo rural inspirado na pedagogia Waldorf, onde aprender é um processo vivo e natural. Aqui, cada criança cresce ao seu ritmo, em ligação com a natureza e com o mundo que a rodeia. A Flow foi convidada a cuidar da presença digital do projeto com o mesmo carinho com que o Jardim Aurora cuida da infância: com propósito, escuta e intenção. Para tal, criámos uma linguagem visual suave e orgânica para as redes sociais, em sintonia com o universo do projeto. Desenvolvimento de calendários editoriais mensais, alinhados com o ritmo das estações e das atividades do espaço. Escrita de textos e guiões para publicações que comunicam de forma simples, sensível e inspiradora.',
  'Jardim Aurora', NULL,
  NULL
);

-- =============================================================================
-- AUDIOVISUAL / VÍDEO
-- =============================================================================

SELECT _update_project(
  'dias-medievais-de-castro-marim',
  'Storytelling visual imersivo que revive a magia medieval de Castro Marim.',
  'Entre espadas, capas e memórias, os Dias Medievais de Castro Marim são mais do que um evento; são uma viagem no tempo. Desde 2019, a Flow está no terreno a acompanhar o evento, garantindo a cobertura audiovisual completa e a produção de conteúdos para as redes sociais. Estes registos contribuem para prolongar a magia medieval muito para lá das muralhas. Criámos também o conceito e o guião do vídeo promocional de encerramento da edição, captando a essência do festival e traduzindo-a numa narrativa visual que celebrasse a experiência. A produção e realização do vídeo final deram vida à história que construímos, num equilíbrio entre ritmo, emoção e autenticidade. Para reforçar a identidade do festival, desenvolvemos ainda animações originais para a identidade visual do evento, aplicadas a materiais e conteúdos promocionais, criando uma linguagem gráfica coerente e cheia de energia.',
  'CM Castro Marim', 'Agosto, 2025',
  NULL
);

SELECT _update_project(
  'witfy',
  'Branding tech com flow humano para a Witfy, plataforma de gestão de conteúdos com IA.',
  'A Witfy é uma plataforma de gestão e criação de conteúdos digitais com inteligência artificial integrada, desenvolvida para ajudar criativos, PMEs e equipas a trabalharem de forma mais rápida, fluida e inteligente. O desafio da Flow foi criar uma identidade que traduzisse esse ADN tecnológico sem perder o lado humano da marca. Desenhámos um branding modular, dinâmico e cheio de personalidade, capaz de se adaptar a diferentes formatos e contextos digitais. Além da identidade visual, desenvolvemos apresentações editoriais, materiais de merchandising e UX/UI design para a plataforma, garantindo consistência entre o produto e a sua comunicação. O resultado é uma marca com visual forte, tech-driven e acessível, que reflete a capacidade da Witfy de expandir ideias e simplificar a gestão de conteúdos para redes sociais. Uma identidade que comunica não só inovação, mas também proximidade.',
  'Witfy', 'Setembro, 2025',
  NULL
);

SELECT _update_project(
  'pro-am-vilamoura',
  '365 dias de dedicação resumidos em momentos de pura arte visual.',
  'Acompanhámos a equipa da Vilamoura Golf na contagem decrescente para o Pro-Am. Capturar o foco, os ajustes finos e a alma do Old Course, Victoria e Pinhal é o que nos move na Flow Productions. Onde há paixão e consistência, a nossa câmara encontra a história perfeita.',
  'Old Course', 'Janeiro, 2026',
  NULL
);

SELECT _update_project(
  'dom-jose-beach-hotel',
  'Produção de vídeo, content writing e design para o Dom José Beach Hotel.',
  'Projeto completo de comunicação para o Dom José Beach Hotel, incluindo produção audiovisual, gestão de conteúdos e design gráfico para posicionar o hotel no mercado premium.',
  'Dom José Beach Hotel', NULL,
  NULL
);

SELECT _update_project(
  'designer-outlet-algarve',
  'Através do storytelling de várias personas que se cruzam no shopping, colocamos o DOA como 1ª opção na mente dos consumidores.',
  'Através do storytelling de várias personas que se cruzam no shopping, pretendemos maximizar a marca e colocar o DOA como 1ª opção para fazer compras na mente dos consumidores estrangeiros e nacionais. Utilizamos energia, felicidade, glamour e uma pitada de humor.',
  'Designer Outlet Algarve', 'Outubro, 2023',
  NULL
);

SELECT _update_project(
  'ibc-security',
  'Através do storytelling, pretendemos maximizar a marca e demonstrar o perfil da IBC Security como empresa.',
  'Através do storytelling, pretendemos maximizar a marca e demonstrar o perfil da IBC Security como empresa.',
  'IBC Security', 'Agosto, 2024',
  NULL
);

SELECT _update_project(
  'indasa',
  'Vídeo corporativo para a Indasa, empresa de referência no setor dos abrasivos.',
  'Produção de vídeo corporativo para a Indasa, destacando a inovação e qualidade dos seus produtos no setor dos abrasivos.',
  'Indasa', 'Dezembro, 2025',
  NULL
);

SELECT _update_project(
  'rocamar-beach-hotel',
  'Conteúdos que contam uma história à beira-mar para o Rocamar Beach Hotel.',
  'Com uma vista de cortar a respiração e uma história que atravessa gerações, o Rocamar Beach Hotel é um dos nomes mais emblemáticos de Albufeira. A Flow foi chamada a dar um novo olhar sobre o vídeo promocional do hotel, atualizando-o com uma linguagem visual mais moderna e emocional. O objetivo? Mostrar o Rocamar como uma experiência completa à beira-mar. Além do vídeo, realizámos uma nova sessão fotográfica: dos quartos às áreas exteriores, passando pelos pequenos detalhes que tornam o Rocamar único. As imagens foram pensadas para elevar a presença digital do hotel, em plataformas como o Booking, redes sociais e website.',
  'Rocamar', 'Junho, 2025',
  NULL
);

SELECT _update_project(
  'odyssea',
  'Cobertura audiovisual das experiências marítimas únicas da Odyssea na Ria Formosa.',
  'Produção audiovisual para a Odyssea, transmitindo a emoção e a aventura das experiências marítimas únicas que a empresa oferece no Algarve, em parceria com a Câmara Municipal de Faro para dar visibilidade às riquezas naturais da Ria Formosa.',
  'CM Faro', 'Fevereiro, 2024',
  NULL
);

SELECT _update_project(
  'the-originals',
  'Onde a música encontra a câmara: videoclipe oficial dos The Originals Algarve.',
  'Com os The Originals Algarve, a música ganhou imagem, ritmo e atitude. A Flow esteve por trás da realização e produção do videoclipe oficial da banda, traduzindo a sua energia contagiante num registo visual cheio de movimento, luz e personalidade. Quisemos criar uma narrativa visual que acompanhasse o som: intensa, espontânea e com aquele toque cru que faz parte do ADN da banda. O resultado? Um videoclipe com alma algarvia, feito de música, ritmo e flow.',
  'The Originals', 'Setembro, 2025',
  NULL
);

SELECT _update_project(
  'ria-shopping',
  'Uma campanha que celebra o ADN olhanense: "Onde Olhão se Encontra".',
  'O Ria Shopping queria voltar a ser parte viva da comunidade de Olhão: um espaço de encontro, cultura e memória coletiva. A Flow desenvolveu o conceito criativo, storytelling, slogan e roteiro da campanha "Onde Olhão se Encontra", uma homenagem às histórias e símbolos que definem o ADN olhanense. Inspirámo-nos nas figuras e lendas que habitam o imaginário local — a Floripes, o Arraúl, o Menino dos Olhos Grandes, os Pescadores, as Conserveiras e o Sporting Clube Olhanense — e trouxemo-las de volta ao presente. Criámos também a identidade gráfica da campanha, fundindo a estética tradicional de Olhão com a identidade contemporânea do Ria Shopping.',
  'Ria Shopping', 'Julho, 2024',
  NULL
);

SELECT _update_project(
  'parque-mineiro-aljustrel',
  'Onde a história volta a respirar: vídeo para a inauguração do Parque Mineiro de Aljustrel.',
  'O Parque Mineiro de Aljustrel é o coração de uma comunidade que vive e trabalha em sintonia com a terra. Desde o Calcolítico até aos dias de hoje, as suas minas guardam histórias de esforço, resiliência e esperança, passadas de geração em geração. A Flow teve o privilégio de criar o vídeo promocional para a inauguração deste espaço, dando forma a uma narrativa que honra o passado e celebra o presente. Através de um olhar cinematográfico, captámos as paisagens únicas, o património industrial e a força humana que definem Aljustrel. O resultado é um filme que respira identidade e emoção — uma homenagem à alma mineira e à comunidade que transforma o trabalho em legado.',
  'Parque Mineiro Aljustrel', 'Setembro, 2023',
  NULL
);

SELECT _update_project(
  'fujifilm',
  'Tecnologia em movimento: filme promocional para o FDR Xair da Fujifilm no Autódromo Internacional do Algarve.',
  'O FDR Xair, da Fujifilm, é uma unidade portátil de raios X concebida para oferecer imagens de alta qualidade num formato compacto, leve e versátil, pensado para diferentes contextos de saúde. A Flow foi responsável pela produção e realização do filme promocional para o mercado português, apresentando o equipamento em ação num cenário inesperado: o Autódromo Internacional do Algarve. O vídeo traduz o espírito do FDR Xair: mobilidade, inovação e confiança. Com uma abordagem cinematográfica e ritmo dinâmico, o filme posiciona o produto não apenas como uma solução médica, mas também como um exemplo do que acontece quando design, engenharia e propósito se movem em perfeita harmonia.',
  'Fujifilm', 'Outubro, 2023',
  NULL
);

SELECT _update_project(
  'algarseafood',
  'Filme sobre o mar que nos liga: documentário para a Algarseafood, empresa de polvo de Olhão.',
  'A Algarseafood é uma empresa portuguesa sediada em Olhão, dedicada ao comércio e exportação de polvo — um produto que reflete a essência do Algarve e o respeito pelo mar que o sustenta. A Flow foi responsável pela produção e realização de um filme documental e promocional que mergulha nas origens da marca, nas pessoas que lhe dão vida e na importância de uma pesca sustentável e consciente. Gravado entre o porto de Olhão e as águas do Atlântico, o filme mostra de perto o cuidado em cada etapa do processo — da captura ao produto final — revelando o equilíbrio entre tradição, inovação e responsabilidade ambiental.',
  'Algarseafood', 'Setembro, 2023',
  NULL
);

-- =============================================================================
-- DESIGN
-- =============================================================================

SELECT _update_project(
  'zion-creative-artisans',
  'Identidade visual completa para a ZION Creative Artisans.',
  'A Flow Productions desenvolveu a identidade visual completa da ZION Creative Artisans, criando um branding que reflete a criatividade e o espírito artesanal do estúdio.',
  'ZION Creative Artisans', NULL,
  NULL
);

SELECT _update_project(
  '100lixo',
  'Branding para um futuro mais sustentável: identidade do Projeto 100LIXO da Inframoura.',
  'A Inframoura lançou o Projeto 100LIXO com uma missão: transformar resíduos em recursos valiosos através da recolha seletiva de biorresíduos. O desafio da Flow foi criar uma identidade visual forte e intuitiva que educasse, envolvesse e inspirasse a comunidade a aderir à causa. Desenvolvemos todo o branding do projeto, desde o naming e logótipo até à produção de materiais de comunicação. Criámos flyers editoriais, merchandising, ecopontos, mupis, outdoors e marcadores de livro, garantindo consistência visual em todos os pontos de contacto. Também tratámos da personalização e caracterização da frota de viaturas, transformando cada elemento num veículo de comunicação para a sustentabilidade.',
  'Inframoura', 'Abril, 2024',
  NULL
);

SELECT _update_project(
  'urlegfix',
  'Transformar desafios em soluções com um branding inclusivo para a URLEGFIX.',
  'O URLEGFIX nasceu de uma experiência pessoal difícil que revelou uma necessidade global: a falta de têxteis adaptativos para utilizadores de cateteres e pessoas com incontinência. A partir desse desafio, surgiu a ideia de criar tights adaptativas e inclusivas que combinam conforto, funcionalidade e dignidade. A missão da Flow foi dar forma visual a este propósito. Criámos um branding humano, inclusivo e com um toque fun, uma identidade que comunica confiança e cuidado, sem perder a força de uma marca inovadora. Desenvolvemos também o packaging e os materiais de comunicação, sempre com foco na clareza e na proximidade com o utilizador final.',
  'URLEGFIX', 'Setembro, 2024',
  NULL
);

SELECT _update_project(
  'cesarius',
  'Logótipo e rótulo com raízes algarvias para a aguardente de medronho Cesarius.',
  'O nome Cesarius nasce em homenagem ao avô do cliente, Cesário, que cultivava medronheiros nos terrenos do interior do Algarve e do Alentejo. Da tradição do medronho — fruto que dá origem à aguardente típica da região — surgiu a vontade de criar uma marca que preservasse esta herança e a transportasse para o presente. Para atingir este fim, a Flow criou um logótipo e um rótulo que unissem o rústico ao moderno. O objetivo era traduzir a autenticidade e a história do produto num design atual, capaz de se destacar nas prateleiras e ao mesmo tempo transmitir a profundidade cultural desta bebida algarvia.',
  'Cesarius', 'Agosto, 2025',
  NULL
);

SELECT _update_project(
  'rocket-booster',
  'Logótipo centrado na letra "R" com um foguete no seu interior — inovação e progresso em movimento.',
  'O logotipo da identidade "Rocket Booster" é uma representação visual impressionante que captura a essência da inovação e do progresso. É centrado na letra "R", que é habilmente estilizada para incorporar um foguete no seu interior, criando uma imagem poderosa e memorável. A escolha do azul transmite a ideia de uma jornada ascendente em direção ao sucesso, enquanto também sugere um ambiente de confiança e estabilidade.',
  'Rocket Booster', 'Maio, 2023',
  NULL
);

SELECT _update_project(
  'pizza-lab',
  'Menus com sabor a design para o Pizza Lab do chef José Domingos no MAR Shopping Algarve.',
  'O Pizza Lab, restaurante do chef José Domingos no MAR Shopping Algarve, nasceu para ser um espaço de criatividade gastronómica, onde todas as pizzas são pensadas como uma experiência para o cliente. A Flow criou menus editoriais que refletissem esse espírito, tornando a carta tão apelativa como os produtos que apresenta. Desenvolvemos menus que valorizam a identidade do restaurante, com uma apresentação clara e apelativa dos pratos. O layout combina modernidade com a autenticidade da cozinha de autor, garantindo uma leitura funcional, aliada a uma experiência visual que acompanha o sabor.',
  'Pizza Lab', 'Fevereiro, 2025',
  NULL
);

-- =============================================================================
-- SOCIAL PROJECTS
-- =============================================================================

SELECT _update_project(
  'liga-portuguesa-contra-o-cancro',
  'Apoio a um evento para comunicar com propósito: cobertura audiovisual da Liga Portuguesa Contra o Cancro.',
  'A Flow teve o privilégio de acompanhar e apoiar um evento promovido pela Liga Portuguesa Contra o Cancro – Núcleo Regional do Sul, em Faro, juntando-se à causa como entidade patrocinadora e responsável pela cobertura audiovisual. Mais do que registar momentos, quisemos dar visibilidade ao impacto real de quem trabalha todos os dias pela prevenção, apoio e sensibilização. Foi uma experiência que nos recordou que comunicar também é um ato de empatia e compromisso com a comunidade.',
  'Liga Portuguesa Contra o Cancro', 'Setembro, 2025',
  NULL
);

SELECT _update_project(
  'aequum',
  'Produção pro-bono de 4 vídeos para o primeiro Centro Comunitário LGBTI+ do sul de Portugal.',
  'A Associação AeQuum, nascida em Faro em novembro de 2021, preparou a abertura do primeiro Centro Comunitário LGBTI+ do sul, localizado na baixa de Faro. A Flow Productions associou-se a esta causa através da doação da produção e realização de 4 vídeos, dedicados a dar visibilidade ao projeto, promover os artistas participantes e amplificar as histórias e pessoas que este centro pretendeu apoiar. Artistas convidados: Corpo Atelier · Miguel Martins · Tomas Castro Neves · Sena Architects · Palmas Douradas · David Afonso · Joana Bragança.',
  'AeQuum', NULL,
  NULL
);

SELECT _update_project(
  'hackathon',
  'Produção de vídeo-entrevistas e fotografia para o Hackathon Ibérico GREENER.',
  'Para o Hackaton Green, a Flow assegurou a produção de conteúdos visuais focados em dar rosto e voz ao projeto. Desenvolvemos um conjunto de vídeo-entrevistas com participantes e intervenientes, captando as ideias, a motivação e a energia do evento em formatos dinâmicos e fáceis de partilhar. Em paralelo, realizámos fotografia de cobertura para documentar os momentos-chave — equipas em ação, interação, apresentações e bastidores — criando uma biblioteca de imagens autênticas e versátil para comunicação futura.',
  NULL, NULL,
  NULL
);

SELECT _update_project(
  'social-hackathon',
  'Produção de vídeo e fotografia num hackathon onde a tecnologia serve o impacto social.',
  'No Social Hackathon, estivemos responsáveis pela produção de vídeo e fotografia, acompanhando de perto um evento onde a tecnologia se coloca ao serviço do impacto social. Esta edição contou com a participação da AIPAR (Associação de Proteção à Rapariga e à Família), uma Instituição Particular de Solidariedade Social sediada em Faro desde 1988. A AIPAR dedica-se ao apoio de jovens raparigas e das suas famílias, incluindo pessoas em situação de vulnerabilidade decorrente de violência, abandono ou exclusão social. Através da nossa cobertura audiovisual, procurámos captar não só os momentos de trabalho e colaboração, mas também a missão e os valores da AIPAR.',
  NULL, NULL,
  NULL
);

SELECT _update_project(
  'refood',
  'Apoio audiovisual à ReFood, associação de combate ao desperdício alimentar.',
  'A Flow Productions apoiou a ReFood, associação dedicada ao combate ao desperdício alimentar e à solidariedade social, com a produção de conteúdos audiovisuais para dar visibilidade à missão e ao impacto da organização na comunidade.',
  'ReFood', 'Junho, 2020',
  NULL
);

-- Clean up helper function
DROP FUNCTION IF EXISTS _update_project(text,text,text,text,text,text);
