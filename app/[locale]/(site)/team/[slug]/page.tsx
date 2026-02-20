import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const teamMembers = [
  {
    slug: 'ricardo-pedro',
    name: 'Ricardo Pedro',
    role: 'CEO | 2D Animator',
    image: '/images/team/member-1.jpg',
    description: `Fundador da Flow Productions e verdadeiro motor do nosso movimento, o Ricardo é quem orienta a equipa com visão, cuidado e foco no crescimento da marca e das pessoas que a fazem acontecer.

A sua grande paixão é a animação 2D e motion graphics, área onde começou a dar forma ao sonho que hoje é a Flow. Sempre em busca de novas formas de evoluir, acredita no self-improvement constante e em manter a criatividade em fluxo.

O nosso boss é movido a cafeína e nunca recusa um docinho. Sempre em busca de novas formas de evoluir, acredita no self-improvement constante e em manter a criatividade em fluxo.

Com o Ricardo, a Flow nunca fica parada: há sempre uma nova ideia, um novo caminho e muita energia em movimento.`,
  },
  {
    slug: 'veronica-guerreiro',
    name: 'Verónica Guerreiro',
    role: 'Design Thinker | Project Manager',
    image: '/images/team/member-2.jpg',
    description: `Na Flow, a Verónica é quem transforma criatividade em forma e método. Especialista em design gráfico, domina o universo das gráficas e garante que todos os detalhes fluem com qualidade.

Mas o seu papel vai muito além do design. É quem organiza o caos criativo com método e empatia, assegurando que tudo corre bem para a equipa, para o cliente e para o utilizador.

No dia a dia, é conhecida como a "mãe do escritório". Entre um café com aroma inconfundível, o amor assumido pela cor rosa e uma paixão por comédias românticas, traz sempre um toque de cuidado e proximidade a cada projeto.

Com a Verónica, não é só o design que ganha consistência; é a equipa inteira que encontra alguém pronto a ouvir, organizar e manter o fluxo no caminho certo.`,
  },
  {
    slug: 'jose-carvalho',
    name: 'José Carvalho',
    role: 'CXO & UI Designer | AI Specialist',
    image: '/images/team/member-3.jpg',
    description: `O José é quem garante que a experiência do utilizador flui sempre no caminho certo. Com um olhar criativo e estratégico, idealiza designs cativantes e interfaces intuitivas que comunicam com impacto e tornam cada interação simples e memorável.

Motard assumido da Flow, fã de música rock e orgulhoso dono do melhor cabelo do escritório, traz sempre uma energia única à equipa. Entre layouts e batalhas de Pokémon, encontra o equilíbrio perfeito entre detalhe e imaginação.

Com o José, os projetos digitais ganham atitude e ritmo, fluindo de dentro para fora dos ecrãs.`,
  },
  {
    slug: 'mariana-rocha',
    name: 'Mariana Rocha',
    role: 'CMO | Social Media Manager',
    image: '/images/team/member-4.jpg',
    description: `A Mariana é a voz criativa da Flow. Especialista em copy e content writing, estratégia de conteúdo e storytelling, pega em ideias e transforma-as em palavras que fluem sempre com intenção.

Quando não está a escrever, está a viver histórias: devora todos os filmes e séries à face da terra, acompanha as trends e fofocas da pop culture como ninguém e tem sempre um meme ou uma resposta na ponta da língua.

Com a Mariana, cada palavra encontra o seu fluxo.`,
  },
  {
    slug: 'jessica-sousa',
    name: 'Jéssica Sousa',
    role: 'Social Media Manager',
    image: '/images/team/member-5.jpg',
    description: `A Jéssica é a mente analítica e criativa que mantém o digital da Flow sempre em movimento. Especialista em social media marketing, transforma briefings em ideias e ideias em conteúdo e estratégias em impacto. Do planeamento de campanhas às métricas, garante que cada conteúdo chega ao público certo.

No lado pessoal, é a protetora oficial dos animais, fã tanto de filmes de terror como de reality shows, não dispensa tempo em família e nunca acerta num provérbio.

Com a Jéssica, o digital deixa de ser apenas presença online para se tornar movimento, proximidade e resultados reais.`,
  },
  {
    slug: 'antonio-fernandes',
    name: 'António Fernandes',
    role: 'Design & Branding',
    image: '/images/team/member-6.jpg',
    description: `O António é quem dá identidade às ideias na Flow. Mestre do design editorial e do detalhe tipográfico, cria visuais com alma, consistência e aquele toque que faz a diferença.

Natural de Tavira (e com muito orgulho), fala fluentemente a língua da ironia, sendo o design a sua segunda língua oficial. Fã assumido do Lidl, não dispensa uma boa fofoca e tem o riso (e os espirros) mais reconhecíveis da equipa.

Com o António, cada projeto ganha personalidade e uma identidade visual que flui de forma única.`,
  },
  {
    slug: 'maeva-ferrand',
    name: 'Maeva Ferrand',
    role: 'Branding & Design',
    image: '/images/team/member-7.jpg',
    description: `A Maeva é quem mistura cor, equilíbrio e propósito em cada uma das suas criações. Com um olhar afinado para branding e social media design, aplica as suas ideias em peças que comunicam com clareza, harmonia e impacto. Pensa e prepara dos seus projetos ao detalhe, sempre com a missão de alinhar estética e estratégia.

Fora do ecrã, é especialista em journaling e scrapbooking, tem um conhecimento infindável sobre geografia e partilha o dia a dia com o seu companheiro de quatro patas, o Teo. É fã de saladinhas e comida saudável, além de leitora ávida, sempre em busca de inspiração nas páginas que percorre.

Com a Maeva, o design respira frescura, equilíbrio e detalhes que fazem a diferença tanto no feed como fora dele.`,
  },
  {
    slug: 'ines-navrat',
    name: 'Inês Navrat',
    role: 'Filmmaker & Photographer',
    image: '/images/team/member-8.jpg',
    description: `A Inês é quem dá vida e ritmo às histórias da Flow. Especialista em edição de vídeo, molda cada frame numa narrativa envolvente. Com um olhar cinematográfico, capta momentos autênticos e traduz emoções em imagens dignas de cinema.

A nossa Wednesday Addams é apaixonada por filmes da Disney, fã de dramas coreanos e, se ouvires um barulho inesperado no estúdio, há uma grande probabilidade de ter sido ela.

Com a Inês, as emoções não se cortam: fluem de cena em cena como se fosse magia.`,
  },
  {
    slug: 'guilherme-bordoni',
    name: 'Guilherme Bordoni',
    role: 'Video Producer',
    image: '/images/team/member-9.jpg',
    description: `O Guilherme é o tipo de pessoa que vê o mundo em frames. Movido por vídeo, música e cor, torna cada desafio audiovisual numa peça que se faz sentir. Do motion design à realização, passa os dias a traduzir emoções em imagem e a dar vida ao que antes existia só em ideia.

Apaixonado por música, toca saxofone e tem o dom de reconhecer uma canção logo nos primeiros acordes (não é mito, é mesmo talento). Fora das câmaras, troca o tripé pelos desportos de equipa: futebol, voleibol, natação ou dodgeball, vale tudo menos ginásio.

Com o Guilherme, as ideias ganham vida e uma boa dose de criatividade.`,
  },
];

export function generateStaticParams() {
  return teamMembers.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

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
                {member.description
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
