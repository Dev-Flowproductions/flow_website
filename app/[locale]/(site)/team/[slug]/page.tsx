import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

const teamMembers = [
  {
    slug: 'ricardo-pedro',
    name: 'Ricardo Pedro',
    role: 'CEO | 2D Animator',
    image: '/images/team/member-1.jpg',
    description: {
      pt: `Fundador da Flow Productions e verdadeiro motor do nosso movimento, o Ricardo é quem orienta a equipa com visão, cuidado e foco no crescimento da marca e das pessoas que a fazem acontecer.

A sua grande paixão é a animação 2D e motion graphics, área onde começou a dar forma ao sonho que hoje é a Flow. Sempre em busca de novas formas de evoluir, acredita no self-improvement constante e em manter a criatividade em fluxo.

O nosso boss é movido a cafeína e nunca recusa um docinho. Sempre em busca de novas formas de evoluir, acredita no self-improvement constante e em manter a criatividade em fluxo.

Com o Ricardo, a Flow nunca fica parada: há sempre uma nova ideia, um novo caminho e muita energia em movimento.`,
      en: `Founder of Flow Productions and the true driving force behind our movement, Ricardo guides the team with vision, care, and a focus on brand growth and the people who make it happen.

His greatest passion is 2D animation and motion graphics — the area where he first began shaping the dream that is now Flow. Always seeking new ways to evolve, he believes in constant self-improvement and keeping creativity in flow.

Our boss runs on caffeine and never turns down a sweet treat. Always searching for new ways to grow, he believes in constant self-improvement and keeping creativity flowing.

With Ricardo, Flow never stands still: there's always a new idea, a new path, and plenty of energy in motion.`,
      fr: `Fondateur de Flow Productions et véritable moteur de notre mouvement, Ricardo guide l'équipe avec vision, bienveillance et focus sur la croissance de la marque et des personnes qui la font exister.

Sa grande passion est l'animation 2D et le motion graphics — le domaine dans lequel il a commencé à donner forme au rêve qui est aujourd'hui Flow. Toujours à la recherche de nouvelles façons d'évoluer, il croit en l'amélioration constante de soi et en maintenir la créativité en flux.

Notre boss fonctionne à la caféine et ne refuse jamais une douceur. Toujours en quête de nouvelles façons de progresser, il croit en l'amélioration constante et en la créativité en mouvement.

Avec Ricardo, Flow ne s'arrête jamais : il y a toujours une nouvelle idée, un nouveau chemin et beaucoup d'énergie en mouvement.`,
    },
  },
  {
    slug: 'veronica-guerreiro',
    name: 'Verónica Guerreiro',
    role: 'Design Thinker | Project Manager',
    image: '/images/team/member-2.jpg',
    description: {
      pt: `Na Flow, a Verónica é quem transforma criatividade em forma e método. Especialista em design gráfico, domina o universo das gráficas e garante que todos os detalhes fluem com qualidade.

Mas o seu papel vai muito além do design. É quem organiza o caos criativo com método e empatia, assegurando que tudo corre bem para a equipa, para o cliente e para o utilizador.

No dia a dia, é conhecida como a "mãe do escritório". Entre um café com aroma inconfundível, o amor assumido pela cor rosa e uma paixão por comédias românticas, traz sempre um toque de cuidado e proximidade a cada projeto.

Com a Verónica, não é só o design que ganha consistência; é a equipa inteira que encontra alguém pronto a ouvir, organizar e manter o fluxo no caminho certo.`,
      en: `At Flow, Verónica is the one who transforms creativity into form and method. A graphic design specialist, she masters the world of visual production and ensures every detail flows with quality.

But her role goes far beyond design. She organises the creative chaos with method and empathy, making sure everything runs smoothly for the team, the client, and the end user.

In day-to-day life, she's known as the "office mum". Between her unmistakable coffee aroma, her openly declared love for the colour pink, and a passion for romantic comedies, she always brings a touch of care and warmth to every project.

With Verónica, it's not just the design that gains consistency — it's the whole team that finds someone ready to listen, organise, and keep the flow on the right track.`,
      fr: `Chez Flow, Verónica est celle qui transforme la créativité en forme et en méthode. Spécialiste en design graphique, elle maîtrise l'univers de la production visuelle et veille à ce que chaque détail coule avec qualité.

Mais son rôle va bien au-delà du design. C'est elle qui organise le chaos créatif avec méthode et empathie, en s'assurant que tout se passe bien pour l'équipe, le client et l'utilisateur.

Au quotidien, elle est connue comme la "maman du bureau". Entre son café au parfum inimitable, son amour affiché pour la couleur rose et sa passion pour les comédies romantiques, elle apporte toujours une touche de soin et de proximité à chaque projet.

Avec Verónica, ce n'est pas seulement le design qui gagne en cohérence — c'est toute l'équipe qui trouve quelqu'un prêt à écouter, organiser et maintenir le flux sur la bonne voie.`,
    },
  },
  {
    slug: 'jose-carvalho',
    name: 'José Carvalho',
    role: 'CXO & UI Designer | AI Specialist',
    image: '/images/team/member-3.jpg',
    description: {
      pt: `O José é quem garante que a experiência do utilizador flui sempre no caminho certo. Com um olhar criativo e estratégico, idealiza designs cativantes e interfaces intuitivas que comunicam com impacto e tornam cada interação simples e memorável.

Motard assumido da Flow, fã de música rock e orgulhoso dono do melhor cabelo do escritório, traz sempre uma energia única à equipa. Entre layouts e batalhas de Pokémon, encontra o equilíbrio perfeito entre detalhe e imaginação.

Com o José, os projetos digitais ganham atitude e ritmo, fluindo de dentro para fora dos ecrãs.`,
      en: `José is the one who ensures the user experience always flows in the right direction. With a creative and strategic eye, he conceives captivating designs and intuitive interfaces that communicate with impact and make every interaction simple and memorable.

Flow's self-confessed motorcycle enthusiast, rock music fan, and proud owner of the best hair in the office, he always brings a unique energy to the team. Between layouts and Pokémon battles, he finds the perfect balance between detail and imagination.

With José, digital projects gain attitude and rhythm, flowing from inside the screens outward.`,
      fr: `José est celui qui s'assure que l'expérience utilisateur coule toujours dans la bonne direction. Avec un regard créatif et stratégique, il conçoit des designs captivants et des interfaces intuitives qui communiquent avec impact et rendent chaque interaction simple et mémorable.

Le motard assumé de Flow, fan de musique rock et fier propriétaire de la meilleure chevelure du bureau, il apporte toujours une énergie unique à l'équipe. Entre les mises en page et les batailles Pokémon, il trouve l'équilibre parfait entre détail et imagination.

Avec José, les projets digitaux gagnent en attitude et en rythme, coulant de l'intérieur des écrans vers l'extérieur.`,
    },
  },
  {
    slug: 'mariana-rocha',
    name: 'Mariana Rocha',
    role: 'CMO | Social Media Manager',
    image: '/images/team/member-4.jpg',
    description: {
      pt: `A Mariana é a voz criativa da Flow. Especialista em copy e content writing, estratégia de conteúdo e storytelling, pega em ideias e transforma-as em palavras que fluem sempre com intenção.

Quando não está a escrever, está a viver histórias: devora todos os filmes e séries à face da terra, acompanha as trends e fofocas da pop culture como ninguém e tem sempre um meme ou uma resposta na ponta da língua.

Com a Mariana, cada palavra encontra o seu fluxo.`,
      en: `Mariana is Flow's creative voice. A specialist in copywriting, content writing, content strategy, and storytelling, she takes ideas and turns them into words that always flow with intention.

When she's not writing, she's living stories: she devours every film and series on the planet, follows pop culture trends and gossip like no one else, and always has a meme or a comeback ready on the tip of her tongue.

With Mariana, every word finds its flow.`,
      fr: `Mariana est la voix créative de Flow. Spécialiste en copywriting, rédaction de contenu, stratégie de contenu et storytelling, elle prend des idées et les transforme en mots qui coulent toujours avec intention.

Quand elle n'écrit pas, elle vit des histoires : elle dévore tous les films et séries du monde, suit les tendances et les potins de la pop culture comme personne et a toujours un mème ou une réponse sur le bout de la langue.

Avec Mariana, chaque mot trouve son flux.`,
    },
  },
  {
    slug: 'jessica-sousa',
    name: 'Jéssica Sousa',
    role: 'Social Media Manager',
    image: '/images/team/member-5.jpg',
    description: {
      pt: `A Jéssica é a mente analítica e criativa que mantém o digital da Flow sempre em movimento. Especialista em social media marketing, transforma briefings em ideias e ideias em conteúdo e estratégias em impacto. Do planeamento de campanhas às métricas, garante que cada conteúdo chega ao público certo.

No lado pessoal, é a protetora oficial dos animais, fã tanto de filmes de terror como de reality shows, não dispensa tempo em família e nunca acerta num provérbio.

Com a Jéssica, o digital deixa de ser apenas presença online para se tornar movimento, proximidade e resultados reais.`,
      en: `Jéssica is the analytical and creative mind that keeps Flow's digital presence always in motion. A social media marketing specialist, she transforms briefs into ideas, ideas into content, and strategies into impact. From campaign planning to metrics, she ensures every piece of content reaches the right audience.

On a personal level, she's the official animal protector, a fan of both horror films and reality shows, never misses family time, and can never get a proverb quite right.

With Jéssica, digital stops being just an online presence and becomes movement, connection, and real results.`,
      fr: `Jéssica est l'esprit analytique et créatif qui maintient la présence digitale de Flow toujours en mouvement. Spécialiste en social media marketing, elle transforme les briefs en idées, les idées en contenu et les stratégies en impact. De la planification des campagnes aux métriques, elle s'assure que chaque contenu atteint le bon public.

Sur le plan personnel, c'est la protectrice officielle des animaux, fan autant de films d'horreur que de reality shows, ne manque jamais un moment en famille et ne réussit jamais un proverbe.

Avec Jéssica, le digital cesse d'être simplement une présence en ligne pour devenir mouvement, proximité et résultats réels.`,
    },
  },
  {
    slug: 'antonio-fernandes',
    name: 'António Fernandes',
    role: 'Design & Branding',
    image: '/images/team/member-6.jpg',
    description: {
      pt: `O António é quem dá identidade às ideias na Flow. Mestre do design editorial e do detalhe tipográfico, cria visuais com alma, consistência e aquele toque que faz a diferença.

Natural de Tavira (e com muito orgulho), fala fluentemente a língua da ironia, sendo o design a sua segunda língua oficial. Fã assumido do Lidl, não dispensa uma boa fofoca e tem o riso (e os espirros) mais reconhecíveis da equipa.

Com o António, cada projeto ganha personalidade e uma identidade visual que flui de forma única.`,
      en: `António is the one who gives identity to ideas at Flow. A master of editorial design and typographic detail, he creates visuals with soul, consistency, and that touch that makes all the difference.

Originally from Tavira (and proud of it), he speaks fluent irony, with design being his official second language. A self-confessed Lidl fan, he never passes up good gossip and has the most recognisable laugh (and sneezes) in the team.

With António, every project gains personality and a visual identity that flows in a unique way.`,
      fr: `António est celui qui donne une identité aux idées chez Flow. Maître du design éditorial et du détail typographique, il crée des visuels avec âme, cohérence et cette touche qui fait toute la différence.

Originaire de Tavira (et fier de l'être), il parle couramment l'ironie, le design étant sa deuxième langue officielle. Fan assumé du Lidl, il ne rate jamais un bon potins et a le rire (et les éternuements) les plus reconnaissables de l'équipe.

Avec António, chaque projet gagne en personnalité et une identité visuelle qui coule de façon unique.`,
    },
  },
  {
    slug: 'maeva-ferrand',
    name: 'Maeva Ferrand',
    role: 'Branding & Design',
    image: '/images/team/member-7.jpg',
    description: {
      pt: `A Maeva é quem mistura cor, equilíbrio e propósito em cada uma das suas criações. Com um olhar afinado para branding e social media design, aplica as suas ideias em peças que comunicam com clareza, harmonia e impacto. Pensa e prepara dos seus projetos ao detalhe, sempre com a missão de alinhar estética e estratégia.

Fora do ecrã, é especialista em journaling e scrapbooking, tem um conhecimento infindável sobre geografia e partilha o dia a dia com o seu companheiro de quatro patas, o Teo. É fã de saladinhas e comida saudável, além de leitora ávida, sempre em busca de inspiração nas páginas que percorre.

Com a Maeva, o design respira frescura, equilíbrio e detalhes que fazem a diferença tanto no feed como fora dele.`,
      en: `Maeva is the one who blends colour, balance, and purpose into each of her creations. With a refined eye for branding and social media design, she brings her ideas to life in pieces that communicate with clarity, harmony, and impact. She thinks through and prepares every project down to the last detail, always with the mission of aligning aesthetics and strategy.

Off-screen, she's an expert in journaling and scrapbooking, has an endless knowledge of geography, and shares her daily life with her four-legged companion, Teo. She's a fan of salads and healthy food, as well as an avid reader, always searching for inspiration in the pages she turns.

With Maeva, design breathes freshness, balance, and details that make a difference both in the feed and beyond it.`,
      fr: `Maeva est celle qui mélange couleur, équilibre et intention dans chacune de ses créations. Avec un œil aiguisé pour le branding et le social media design, elle concrétise ses idées dans des pièces qui communiquent avec clarté, harmonie et impact. Elle pense et prépare chaque projet dans les moindres détails, toujours avec la mission d'aligner esthétique et stratégie.

Hors écran, elle est experte en journaling et scrapbooking, possède une connaissance infinie de la géographie et partage son quotidien avec son compagnon à quatre pattes, Teo. Elle est fan de salades et de nourriture saine, et lectrice avide, toujours en quête d'inspiration dans les pages qu'elle parcourt.

Avec Maeva, le design respire fraîcheur, équilibre et des détails qui font la différence aussi bien dans le feed qu'en dehors.`,
    },
  },
  {
    slug: 'ines-navrat',
    name: 'Inês Navrat',
    role: 'Filmmaker & Photographer',
    image: '/images/team/member-8.jpg',
    description: {
      pt: `A Inês é quem dá vida e ritmo às histórias da Flow. Especialista em edição de vídeo, molda cada frame numa narrativa envolvente. Com um olhar cinematográfico, capta momentos autênticos e traduz emoções em imagens dignas de cinema.

A nossa Wednesday Addams é apaixonada por filmes da Disney, fã de dramas coreanos e, se ouvires um barulho inesperado no estúdio, há uma grande probabilidade de ter sido ela.

Com a Inês, as emoções não se cortam: fluem de cena em cena como se fosse magia.`,
      en: `Inês is the one who gives life and rhythm to Flow's stories. A video editing specialist, she shapes every frame into a compelling narrative. With a cinematic eye, she captures authentic moments and translates emotions into images worthy of the big screen.

Our very own Wednesday Addams, she's passionate about Disney films, a fan of Korean dramas, and if you hear an unexpected noise in the studio, there's a good chance it was her.

With Inês, emotions aren't cut — they flow from scene to scene as if by magic.`,
      fr: `Inês est celle qui donne vie et rythme aux histoires de Flow. Spécialiste en montage vidéo, elle façonne chaque image en un récit captivant. Avec un regard cinématographique, elle capte des moments authentiques et traduit des émotions en images dignes du grand écran.

Notre propre Wednesday Addams, elle est passionnée par les films Disney, fan de dramas coréens et, si vous entendez un bruit inattendu dans le studio, il y a de fortes chances que ce soit elle.

Avec Inês, les émotions ne se coupent pas : elles coulent de scène en scène comme par magie.`,
    },
  },
  {
    slug: 'guilherme-bordoni',
    name: 'Guilherme Bordoni',
    role: 'Video Producer',
    image: '/images/team/member-9.jpg',
    description: {
      pt: `O Guilherme é o tipo de pessoa que vê o mundo em frames. Movido por vídeo, música e cor, torna cada desafio audiovisual numa peça que se faz sentir. Do motion design à realização, passa os dias a traduzir emoções em imagem e a dar vida ao que antes existia só em ideia.

Apaixonado por música, toca saxofone e tem o dom de reconhecer uma canção logo nos primeiros acordes (não é mito, é mesmo talento). Fora das câmaras, troca o tripé pelos desportos de equipa: futebol, voleibol, natação ou dodgeball, vale tudo menos ginásio.

Com o Guilherme, as ideias ganham vida e uma boa dose de criatividade.`,
      en: `Guilherme is the kind of person who sees the world in frames. Driven by video, music, and colour, he turns every audiovisual challenge into a piece that makes itself felt. From motion design to directing, he spends his days translating emotions into images and bringing to life what once existed only as an idea.

Passionate about music, he plays the saxophone and has the gift of recognising a song from the very first notes (it's not a myth — it's genuine talent). Off-camera, he swaps the tripod for team sports: football, volleyball, swimming or dodgeball — anything but the gym.

With Guilherme, ideas come to life with a healthy dose of creativity.`,
      fr: `Guilherme est le genre de personne qui voit le monde en frames. Animé par la vidéo, la musique et la couleur, il transforme chaque défi audiovisuel en une pièce qui se fait ressentir. Du motion design à la réalisation, il passe ses journées à traduire des émotions en images et à donner vie à ce qui n'existait auparavant qu'en idée.

Passionné de musique, il joue du saxophone et a le don de reconnaître une chanson dès les premières notes (ce n'est pas un mythe — c'est un vrai talent). Hors caméra, il échange le trépied pour les sports collectifs : football, volleyball, natation ou dodgeball — tout sauf la salle de sport.

Avec Guilherme, les idées prennent vie avec une bonne dose de créativité.`,
    },
  },
];

export function generateStaticParams() {
  const locales = ['pt', 'en', 'fr'];
  return locales.flatMap((locale) =>
    teamMembers.map((m) => ({ locale, slug: m.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return {
      title: 'Team Member Not Found',
    };
  }

  return {
    title: `${member.name} - Flow Productions`,
    description: `${member.name}, ${member.role} at Flow Productions`,
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

  const description = member.description[locale as keyof typeof member.description] || member.description.pt;

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* Title block */}
        <div className="mb-8 lg:mb-10">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-500 mb-2">
            {member.role}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-black leading-tight">
            {member.name}
          </h1>
        </div>

        {/* Photo + overlapping grey bio box */}
        {/* On mobile: stacked. On desktop: photo left, grey box overlaps from mid-photo */}
        <div className="flex flex-col lg:block lg:relative lg:pb-16">

          {/* Photo */}
          <div className="lg:w-[48%] lg:relative lg:z-0">
            <div className="aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] bg-gray-100 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Grey bio box — on desktop: absolutely positioned, overlaps photo bottom-right */}
          <div className="mt-6 lg:mt-0 lg:absolute lg:top-[28%] lg:right-0 lg:w-[62%] lg:z-10">
            <div className="bg-[#ebebeb] p-7 sm:p-9 lg:p-10">
              <div className="space-y-5 text-[#3d3d3d] leading-relaxed text-base sm:text-[1.05rem]">
                {description
                  .split('\n\n')
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
