import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
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
    skills: [
      { name: 'Design', level: 80 },
      { name: 'Branding', level: 90 },
      { name: 'Marketing', level: 88 },
    ],
  },
  {
    slug: 'veronica-guerreiro',
    name: 'Verónica Guerreiro',
    role: 'Design Thinker | Project Manager',
    image: '/images/team/member-2.jpg',
    description: 'Descrição da Verónica em breve...',
    skills: [],
  },
  {
    slug: 'jose-carvalho',
    name: 'José Carvalho',
    role: 'CXO & UI Designer | AI Specialist',
    image: '/images/team/member-3.jpg',
    description: 'Descrição do José em breve...',
    skills: [],
  },
  {
    slug: 'mariana-rocha',
    name: 'Mariana Rocha',
    role: 'CMO | Social Media Manager',
    image: '/images/team/member-4.jpg',
    description: 'Descrição da Mariana em breve...',
    skills: [],
  },
  {
    slug: 'jessica-sousa',
    name: 'Jéssica Sousa',
    role: 'Social Media Manager',
    image: '/images/team/member-5.jpg',
    description: 'Descrição da Jéssica em breve...',
    skills: [],
  },
  {
    slug: 'antonio-fernandes',
    name: 'António Fernandes',
    role: 'Design & Branding',
    image: '/images/team/member-6.jpg',
    description: 'Descrição do António em breve...',
    skills: [],
  },
  {
    slug: 'maeva-ferrand',
    name: 'Maeva Ferrand',
    role: 'Branding & Design',
    image: '/images/team/member-7.jpg',
    description: 'Descrição da Maeva em breve...',
    skills: [],
  },
  {
    slug: 'ines-navrat',
    name: 'Inês Navrat',
    role: 'Filmmaker & Photographer',
    image: '/images/team/member-8.jpg',
    description: 'Descrição da Inês em breve...',
    skills: [],
  },
  {
    slug: 'guilherme-bordoni',
    name: 'Guilherme Bordoni',
    role: 'Video Producer',
    image: '/images/team/member-9.jpg',
    description: 'Descrição do Guilherme em breve...',
    skills: [],
  },
];

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
    <div className="pt-20">
      {/* Hero Section with Image */}
      <section className="relative min-h-[520px] bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
        />
        {/* Overlay with Name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-12">
          <div className="max-w-7xl mx-auto w-full">
            <AnimateIn>
              <p className="text-white/90 text-lg mb-2">{member.role}</p>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                {member.name}
              </h1>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Description */}
            <div className="lg:col-span-2">
              <AnimateIn>
                <div className="prose prose-lg max-w-none">
                  {member.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </AnimateIn>
            </div>

            {/* Right Column - Skills */}
            {member.skills.length > 0 && (
              <div className="lg:col-span-1">
                <AnimateIn delay={0.2}>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-6">Skills</h3>
                    <div className="space-y-4">
                      {member.skills.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {skill.name}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-black h-2 rounded-full transition-all duration-500"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateIn>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
