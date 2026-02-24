import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  const supabase = await createClient();

  let projects = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select(`
          *,
          project_project_tags (
            project_tags ( key, label )
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      projects = data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  return (
    <div>
      {/* Hero Image Section */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-100">
        <img
          src="/images/hero/project.jpg"
          alt="Projetos Flow Productions"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Text Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
              {t('pageLabel')}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              {t('title')} <span className="text-gray-300">{t('titleHighlight')}</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('description')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { slug: 'ultima-gota',                  title: 'Última Gota',                   tags: 'Animação',                       img: '/images/projects/Ultima-Gota.webp' },
              { slug: 'likewise',                     title: 'Likewise',                      tags: 'Animação',                       img: '/images/projects/likewise.jpg' },
              { slug: 'dias-medievais-de-castro-marim', title: 'Dias Medievais de Castro Marim', tags: 'Content Writing, Vídeo',        img: '/images/projects/dias-medievais-de-castro-marim.webp' },
              { slug: 'medwater',                     title: 'Medwater',                      tags: 'Animação',                       img: '/images/projects/medwater.webp' },
              { slug: 'one-select-properties',        title: 'One Select Properties',         tags: 'Animação',                       img: '/images/projects/one-select-properties.jpg' },
              { slug: 'neomarca',                     title: 'Neomarca',                      tags: 'Entrevistas',                    img: '/images/projects/neomarca.webp' },
              { slug: 'mia',                          title: 'MIA',                           tags: 'Animação, Content Writing',      img: '/images/projects/mia.webp' },
              { slug: 'witfy',                        title: 'Witfy',                         tags: 'Content Writing, Vídeo',         img: '/images/projects/witfy-video.jpg' },
              { slug: 'pro-am-vilamoura',             title: 'PRO AM – Vilamoura',            tags: 'Content Writing, Vídeo',         img: '/images/projects/pro-am-vilamoura.jpeg' },
              { slug: 'barturs',                      title: 'Barturs',                       tags: 'Animação',                       img: '/images/projects/barturs.png' },
              { slug: 'lets-communicate',             title: "Let's Communicate",             tags: 'Animação',                       img: '/images/projects/lets-communicate.jpg' },
              { slug: 'kipt',                         title: 'KIPT',                          tags: 'Animação',                       img: '/images/projects/kipt.webp' },
              { slug: 'dental-hpa',                   title: 'DENTAL HPA',                    tags: 'Marketing',                      img: '/images/projects/dental-hpa.jpg' },
              { slug: 'emjogo',                       title: 'EmJogo',                        tags: 'Animação',                       img: '/images/projects/emjogo.webp' },
              { slug: 'albufeira-digital-nomads',     title: 'Albufeira Digital Nomads',      tags: 'Marketing',                      img: '/images/projects/albufeira-marketing.png' },
              { slug: 'travel-tech-partners',         title: 'Travel Tech Partners',          tags: 'Animação',                       img: '/images/projects/travel-tech-partners.webp' },
              { slug: 'toma-la-da-ca',                title: 'Toma lá, dá cá',               tags: 'Animação',                       img: '/images/projects/toma-la-da-ca.webp' },
              { slug: 'kubidoce',                     title: 'Kubidoce',                      tags: 'Marketing',                      img: '/images/projects/kubidoce-marketing.png' },
              { slug: 'rb-woodfinish',                title: 'RB Woodfinish',                 tags: 'Marketing',                      img: '/images/projects/rb-woodfinish.jpg' },
              { slug: 'missao-conducao',              title: 'Missão Condução',               tags: 'Marketing',                      img: '/images/projects/missao-conducao.jpg' },
              { slug: 'adm-24',                       title: "ADM 24'",                       tags: 'Marketing',                      img: '/images/projects/adm-24.jpg' },
              { slug: 'nature-soul-food',             title: 'Nature Soul Food',              tags: 'Marketing',                      img: '/images/projects/nature-soul-food-marketing.jpg' },
              { slug: 'jardim-aurora',                title: 'Jardim Aurora',                 tags: 'Marketing',                      img: '/images/projects/jardim-aurora-marketing.jpg' },
              { slug: 'dom-jose-beach-hotel',         title: 'Dom José Beach Hotel',          tags: 'Content Writing, Vídeo',         img: '/images/projects/dom-jose-video.jpg' },
              { slug: 'designer-outlet-algarve',      title: 'Designer Outlet Algarve',       tags: 'Vídeo',                          img: '/images/projects/designer-outlet-algarve.jpg' },
              { slug: 'ibc-security',                 title: 'IBC Security',                  tags: 'Vídeo',                          img: '/images/projects/ibc-security.jpg' },
              { slug: 'indasa',                       title: 'Indasa',                        tags: 'Vídeo',                          img: '/images/projects/indasa.jpg' },
              { slug: 'rocamar-beach-hotel',          title: 'Rocamar Beach Hotel',           tags: 'Vídeo',                          img: '/images/projects/rocamar-beach-hotel.png' },
              { slug: 'kubidoce',                     title: 'Kubidoce',                      tags: 'Vídeo',                          img: '/images/projects/kubidoce-video.jpg' },
              { slug: 'odyssea',                      title: 'Odyssea',                       tags: 'Vídeo',                          img: '/images/projects/odyssea.jpg' },
              { slug: 'the-originals',                title: 'The Originals',                 tags: 'Vídeo',                          img: '/images/projects/the-originals.jpg' },
              { slug: 'ria-shopping',                 title: 'Ria Shopping',                  tags: 'Content Writing, Vídeo',         img: '/images/projects/ria-shopping.jpg' },
              { slug: 'albufeira-digital-nomads',     title: 'Albufeira Digital Nomads',      tags: 'Vídeo',                          img: '/images/projects/albufeira-video.jpg' },
              { slug: 'parque-mineiro-aljustrel',     title: 'Parque Mineiro Aljustrel',      tags: 'Vídeo',                          img: '/images/projects/parque-mineiro-aljustrel.webp' },
              { slug: 'fujifilm',                     title: 'Fujifilm',                      tags: 'Vídeo',                          img: '/images/projects/fujifilm.jpg' },
              { slug: 'algarseafood',                 title: 'Algarseafood',                  tags: 'Vídeo',                          img: '/images/projects/algarseafood.webp' },
              { slug: 'zion-creative-artisans',       title: 'ZION Creative Artisans',        tags: 'Design',                         img: '/images/projects/zion-creative-artisans.webp' },
              { slug: 'dom-jose-beach-hotel',         title: 'Dom José Beach Hotel',          tags: 'Design',                         img: '/images/projects/dom-jose-design.png' },
              { slug: '100lixo',                      title: '100LIXO',                       tags: 'Design',                         img: '/images/projects/100lixo.png' },
              { slug: 'witfy',                        title: 'Witfy',                         tags: 'Design',                         img: '/images/projects/witfy.png' },
              { slug: 'albufeira-digital-nomads',     title: 'Albufeira Digital Nomads',      tags: 'Design',                         img: '/images/projects/albufeira-digital-nomads.png' },
              { slug: 'urlegfix',                     title: 'URLEGFIX',                      tags: 'Design',                         img: '/images/projects/urlegfix.png' },
              { slug: 'cesarius',                     title: 'Cesarius',                      tags: 'Design',                         img: '/images/projects/cesarius.jpg' },
              { slug: 'jardim-aurora',                title: 'Jardim Aurora',                 tags: 'Design',                         img: '/images/projects/jardim-aurora-design.jpg' },
              { slug: 'nature-soul-food',             title: 'Nature Soul Food',              tags: 'Design',                         img: '/images/projects/nature-soul-food.png' },
              { slug: 'rocket-booster',               title: 'Rocket Booster',                tags: 'Design',                         img: '/images/projects/rocket-booster.png' },
              { slug: 'pizza-lab',                    title: 'Pizza Lab',                     tags: 'Design',                         img: '/images/projects/pizza-lab.jpg' },
            ].map((project, index) => (
              <Link key={index} href={`/projetos/${project.slug}`} className="group block relative overflow-hidden">
                <div className="aspect-[4/3] bg-gray-900 overflow-hidden relative">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center px-8">
                    <h3 className="text-white text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">{project.tags}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
