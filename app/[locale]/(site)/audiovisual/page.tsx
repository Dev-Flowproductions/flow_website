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
    title: 'Audiovisual - Flow Productions',
    description: 'Projetos Audiovisuais da Flow Productions',
  };
}

export default async function AudiovisualProjectsPage({
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
        .contains('categories', ['audiovisual'])
        .order('published_at', { ascending: false });
      projects = data;
    } catch (error) {
      console.error('Error fetching audiovisual projects:', error);
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Image with Text Overlay */}
      <section className="relative min-h-[520px] bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/20">
            <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm uppercase tracking-wider">Audiovisual Hero Image Placeholder</p>
          </div>
        </div>
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-4">
                HISTÓRIAS QUE SE VÊEM, SE SENTEM E FICAM NA MEMÓRIA
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-8">
                Flow Audiovisual
              </h1>
            </AnimateIn>
            
            <AnimateIn delay={0.2}>
              <div className="space-y-4 text-base md:text-lg leading-relaxed">
                <p>
                  No <strong>Audiovisual</strong>, transformamos momentos em narrativas com impacto.
                </p>
                <p>
                  Produzimos <strong>vídeos e fotografias publicitárias, institucionais, promocionais e de eventos</strong>, sempre com o objetivo de aproximar marcas de pessoas.
                </p>
                <p>
                  Da pré-produção à edição final, cuidamos de cada detalhe para que a mensagem flua com emoção, ritmo e autenticidade.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Promotional Videos Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Vídeos <span className="text-gray-300">Promocionais</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conteúdo audiovisual que conta histórias e conecta marcas ao seu público
              </p>
            </div>
          </AnimateIn>
          
          {/* Video placeholders will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <AnimateIn key={index} delay={0.1 * index}>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">Vídeo Promocional {index}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Photos Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Flow <span className="text-gray-300">Photos</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fotografia que captura momentos e cria memórias visuais autênticas
              </p>
            </div>
          </AnimateIn>
          
          {/* Photo placeholders will go here */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <AnimateIn key={index} delay={0.05 * index}>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-xs">Photo {index}</p>
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
