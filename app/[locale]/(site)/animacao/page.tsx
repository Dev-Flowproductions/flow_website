import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AnimateIn } from '@/components/ui/AnimateIn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: 'Animação - Flow Productions',
    description: 'Projetos de Animação 2D e 3D da Flow Productions',
  };
}

export default async function AnimacaoProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  let projects = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .contains('categories', ['animacao'])
        .order('published_at', { ascending: false });
      projects = data;
    } catch (error) {
      console.error('Error fetching animacao projects:', error);
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Image with Text Overlay */}
      <section className="relative min-h-[520px] bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/20">
            <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-sm uppercase tracking-wider">Animação Hero Image Placeholder</p>
          </div>
        </div>
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-4">
                QUANDO A IMAGINAÇÃO GANHA MOVIMENTO
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-8">
                Flow Animação
              </h1>
            </AnimateIn>
            
            <AnimateIn delay={0.2}>
              <div className="space-y-4 text-base md:text-lg leading-relaxed">
                <p>
                  Na <strong>Animação</strong>, damos vida a ideias que não cabem na realidade.
                </p>
                <p>
                  Criamos <strong>animações 2D, 3D e motion graphics</strong> que explicam conceitos complexos, contam histórias e conquistam públicos em segundos.
                </p>
                <p>
                  Seja em <strong>vídeos animados explicativos</strong>, peças para redes sociais ou campanhas institucionais, misturamos criatividade e técnica para que cada frame flua com energia e impacto. Aqui, o impossível torna-se visível.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Promotional Animations Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Animações <span className="text-gray-300">Promocionais</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Animações que transformam conceitos em experiências visuais impactantes
              </p>
            </div>
          </AnimateIn>
          
          {/* Animation placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <AnimateIn key={index} delay={0.1 * index}>
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                      </svg>
                      <p className="text-sm">Animação Promocional {index}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
