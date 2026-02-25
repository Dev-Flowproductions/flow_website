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

  const sortedServices = [...services].sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
              {t('label')}
            </p>
            <h2 className="text-4xl md:text-6xl font-bold">
              {t('title')}
            </h2>
          </div>
        </AnimateIn>

        {/* Border Line */}
        <div className="border-t border-gray-200 mb-12" />

        {/* Services Grid - Centered */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {sortedServices.map((service, index) => {
            const title = service.title[locale] || service.title['pt'];
            const description = serviceDescriptions[service.key]?.[locale] || 
                              serviceDescriptions[service.key]?.['pt'] || '';
            const number = String(index + 1).padStart(2, '0');

            return (
              <StaggerItem key={service.id}>
                <Link href="/servicos" className="group block">
                  <div className="space-y-4 text-left">
                    {/* Number */}
                    <div className="text-7xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                      {number}
                    </div>
                    {/* Title */}
                    <h3 className="text-2xl font-bold group-hover:text-gray-700 transition-colors">
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
