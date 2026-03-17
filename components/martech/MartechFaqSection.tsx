import { AnimateIn } from '@/components/ui/AnimateIn';

interface FaqItem {
  question: string;
  answer: string;
}

interface MartechFaqSectionProps {
  faqs: FaqItem[];
  sectionTitle: string;
}

export default function MartechFaqSection({ faqs, sectionTitle }: MartechFaqSectionProps) {
  if (!faqs?.length) return null;

  return (
    <section
      id="faq"
      className="py-20 px-4 bg-gray-50"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto">
        <AnimateIn>
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold mb-10 text-center md:text-left"
          >
            {sectionTitle}
          </h2>
        </AnimateIn>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <AnimateIn key={i} delay={i * 0.05}>
              <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="p-5 cursor-pointer font-semibold text-gray-900 flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="text-[#5b54a0] shrink-0 transition-transform group-open:rotate-180">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-700 border-t border-gray-100">
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </details>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
