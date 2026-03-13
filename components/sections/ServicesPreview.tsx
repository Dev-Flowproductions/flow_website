'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AnimateIn, StaggerContainer, StaggerItem } from '@/components/ui/AnimateIn';

interface Service {
  id: string;
  key: string;
  title: Record<string, string>;
  order: number;
}

interface ServicesPreviewProps {
  services: Service[];
  locale: string;
}

export default function ServicesPreview({ services, locale }: ServicesPreviewProps) {
  const t = useTranslations('home.servicesPreview');

  const serviceDescriptions: Record<string, Record<string, string>> = {
    design: {
      pt: 'Uma marca forte começa no design. Criamos identidades visuais e materiais gráficos que traduzem a essência do teu negócio.',
      en: 'A strong brand starts with design. We create visual identities and graphic materials that translate the essence of your business.',
      fr: 'Une marque forte commence par le design. Nous créons des identités visuelles et des matériaux graphiques qui traduisent l\'essence de votre entreprise.',
    },
    martech: {
      pt: 'Criamos infraestruturas digitais que ligam estratégia, tecnologia e dados. Tudo pensado para tornar o crescimento mais previsível.',
      en: 'We create digital infrastructures that connect strategy, technology and data. Everything designed to make growth more predictable.',
      fr: 'Nous créons des infrastructures digitales qui relient stratégie, technologie et données. Tout conçu pour rendre la croissance plus prévisible.',
    },
    marketing: {
      pt: 'Na Flow, o marketing combina a criatividade e os insights que te fazem chegar mais longe.',
      en: 'At Flow, marketing combines creativity and insights that take you further.',
      fr: 'Chez Flow, le marketing combine créativité et insights qui vous mènent plus loin.',
    },
    audiovisual: {
      pt: 'Histórias ganham outra força quando são vistas e ouvidas. Produzimos conteúdos que ficam na memória.',
      en: 'Stories gain strength when seen and heard. We produce content that stays in memory.',
      fr: 'Les histoires prennent force quand elles sont vues et entendues. Nous produisons du contenu qui reste en mémoire.',
    },
    animacao: {
      pt: 'Criamos peças que envolvem e conquistam, ajudando a tua marca a comunicar de forma simples, mas diferenciada.',
      en: 'We create pieces that engage and captivate, helping your brand communicate simply yet distinctively.',
      fr: 'Nous créons des pièces qui engagent et captivent, aidant votre marque à communiquer simplement mais distinctement.',
    },
  };

  const martechService: Service = {
    id: 'martech',
    key: 'martech',
    title: { pt: 'MarTech', en: 'MarTech', fr: 'MarTech' },
    order: 2,
  };

  const sortedDbServices = [...services].sort((a, b) => a.order - b.order);
  
  // Insert MarTech after Design (index 1)
  const allServices: Service[] = [];
  sortedDbServices.forEach((service, i) => {
    allServices.push(service);
    if (i === 0) {
      allServices.push(martechService);
    }
  });

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
              {t('title')}
            </h2>
          </div>
        </AnimateIn>

        {/* Border Line */}
        <div className="border-t border-gray-200 mb-12" />

        {/* Services Grid - 5 columns */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {allServices.map((service, index) => {
            const title = service.title[locale] || service.title['pt'];
            const description = serviceDescriptions[service.key]?.[locale] || 
                              serviceDescriptions[service.key]?.['pt'] || '';
            const number = String(index + 1).padStart(2, '0');
            const href = service.key === 'martech' ? '/martech' : '/servicos';

            return (
              <StaggerItem key={service.id}>
                <Link href={href} className="group block">
                  <div className="space-y-4 text-center sm:text-left">
                    {/* Number */}
                    <div className="text-6xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                      {number}
                    </div>
                    {/* Title */}
                    <h3 className="text-xl font-bold group-hover:text-gray-700 transition-colors">
                      {title}
                    </h3>
                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
