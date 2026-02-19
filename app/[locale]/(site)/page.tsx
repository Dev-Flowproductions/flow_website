import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import ServicesPreview from '@/components/sections/ServicesPreview';
import TestimonialCarousel from '@/components/sections/TestimonialCarousel';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import ContactCTA from '@/components/sections/ContactCTA';
import NewsletterInline from '@/components/layout/NewsletterInline';

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

      // Fetch featured projects
      const projectsResponse = await supabase
        .from('projects')
        .select('*')
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
          {/* Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-white/20">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm uppercase tracking-wider">Hero Video Placeholder</p>
            </div>
          </div>
          {/* Uncomment when video is ready:
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          */}
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
      {testimonials && testimonials.length > 0 && (
        <TestimonialCarousel testimonials={testimonials} locale={locale} />
      )}

      {/* Projects Preview Section */}
      {projects && (
        <ProjectsPreview projects={projects} locale={locale} />
      )}

      {/* Contact CTA Section */}
      <ContactCTA />

      {/* Newsletter Section */}
      <NewsletterInline />
    </div>
  );
}
