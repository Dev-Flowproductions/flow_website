import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import ServicesPreview from '@/components/sections/ServicesPreview';
import TestimonialCarousel from '@/components/sections/TestimonialCarousel';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import ContactCTA from '@/components/sections/ContactCTA';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: 'Flow Productions',
    description: t('hero.description'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const supabase = await createClient();

  let services = null;
  let testimonials = null;
  let projects = null;

  // Only fetch data if Supabase is configured
  if (supabase) {
    try {
      // Fetch services for preview
      const servicesResponse = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });
      services = servicesResponse.data;

      // Fetch testimonials
      const testimonialsResponse = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('order', { ascending: true });
      testimonials = testimonialsResponse.data;

      // Fetch featured projects with tags
      const projectsResponse = await supabase
        .from('projects')
        .select('id, title, slug, client_name, featured_image_path, gallery, project_project_tags(project_tags(key, label))')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(6);
      projects = projectsResponse.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div>
      {/* Hero Section - Video Only */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gray-900">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero/home.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Team Section - "Somos Flow" */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Team Image */}
            <AnimateIn>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg overflow-hidden">
                <img
                  src="/images/team/team-1.jpg"
                  alt="Flow Productions Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimateIn>

            {/* Content */}
            <AnimateIn delay={0.2}>
              <div>
                <p className="text-sm uppercase tracking-wider mb-2 text-gray-600">
                  {t('team.label')}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {t('team.title')}<br />
                  <span className="text-gray-400">{t('team.subtitle')}</span>
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {t('team.description')}
                </p>
                <Link href="/sobre-nos">
                  <button className="px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-colors text-lg font-medium">
                    {t('team.cta')}
                  </button>
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      {services && services.length > 0 && (
        <ServicesPreview services={services} locale={locale} />
      )}

      {/* Testimonials Section */}
      <TestimonialCarousel
        testimonials={testimonials && testimonials.length > 0 ? testimonials : [
          { id: '1', quote: { pt: 'Obrigado pela abordagem profissional da Flow ao nosso projeto! Foi um prazer trabalhar com a equipa!', en: 'Thank you for Flow\'s professional approach to our project! It was a pleasure working with the team!', fr: 'Merci pour l\'approche professionnelle de Flow sur notre projet ! Ce fut un plaisir de travailler avec l\'équipe !' }, person_name: 'André Oliveira', company_name: 'Zion Creative Artisans', avatar_path: '/images/testimonials/zion.png', order: 1 },
          { id: '2', quote: { pt: 'Recebi muito mais do que estava à espera — encontrei uma identidade única para a minha marca.', en: 'I received much more than I expected — I found a unique identity for my brand.', fr: 'J\'ai reçu bien plus que ce à quoi je m\'attendais — j\'ai trouvé une identité unique pour ma marque.' }, person_name: 'Sandra Romão', company_name: 'Nature Soul Food', avatar_path: '/images/testimonials/nature-soul-food.jpg', order: 2 },
          { id: '3', quote: { pt: 'Obrigado por conseguirem transmitir a nossa visão de forma tão acertiva.', en: 'Thank you for managing to convey our vision so precisely.', fr: 'Merci d\'avoir su transmettre notre vision de manière si précise.' }, person_name: 'Flávio Peña', company_name: 'Indassa', avatar_path: '/images/testimonials/indassa.png', order: 3 },
          { id: '4', quote: { pt: 'Uma equipa extremamente criativa com ideias muito dinâmicas!', en: 'An extremely creative team with very dynamic ideas!', fr: 'Une équipe extrêmement créative avec des idées très dynamiques !' }, person_name: 'Margarida', company_name: 'Missão Condução', avatar_path: '/images/testimonials/missao.png', order: 4 },
        ]}
        locale={locale}
      />

      {/* Projects Preview Section */}
      <ProjectsPreview projects={[]} locale={locale} columns={2} showTitles={false} />

      {/* Contact CTA Section */}
      <ContactCTA />
    </div>
  );
}
