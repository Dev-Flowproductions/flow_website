import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    pt: 'Blog — Artigos sobre Design, Marketing e Criatividade',
    en: 'Blog — Articles on Design, Marketing & Creativity',
    fr: 'Blog — Articles sur le Design, Marketing et Créativité',
  };
  const descs: Record<string, string> = {
    pt: 'Lê os artigos da Flow Productions sobre design, marketing digital, audiovisual, animação e criatividade. Insights e tendências do setor criativo.',
    en: 'Read Flow Productions articles on design, digital marketing, audiovisual, animation and creativity. Insights and trends from the creative industry.',
    fr: 'Lisez les articles de Flow Productions sur le design, marketing digital, audiovisuel, animation et créativité.',
  };
  return getPageMetadata(locale, {
    title: titles[locale] || titles.pt,
    description: descs[locale] || descs.pt,
    path: 'blog',
  });
}

const posts = [
  { slug: 'o-marketing-ja-mudou-a-tua-marca-acompanhou', title: 'O marketing já mudou. A tua marca acompanhou?', date: '2026-02-11', img: '/images/blog/marketing-supreme.jpg' },
  { slug: 'marketing-supreme-como-a-promocao-do-filme-marty-supreme-nos-ensina-a-quebrar-a-formula', title: 'Marketing Supreme', date: '2026-01-08', img: '/images/blog/marketing-supreme.jpg' },
  { slug: 'fazer-marketing-para-humanos-e-nao-para-os-algoritmos', title: 'FAZER MARKETING PARA HUMANOS (E NÃO PARA OS ALGORITMOS)', date: '2025-11-24', img: '/images/blog/marketing-humanos.jpg' },
  { slug: 'gestao-de-equipas-pessoas-primeiro-resultados-depois', title: 'Gestão de Equipas: Pessoas Primeiro, Resultados Depois', date: '2025-10-30', img: '/images/blog/gestao-equipas.jpg' },
  { slug: 'desperte-o-seu-fluxo-criativo-com-passatempos', title: 'Desperte o seu Fluxo Criativo com Passatempos', date: '2025-10-30', img: '/images/blog/fluxo-criativo.jpg' },
  { slug: 'criacao-de-conteudos-em-p1-o-renascimento-da-formula-1', title: 'Criação de Conteúdos em P1: O Renascimento da Fórmula 1', date: '2025-08-28', img: '/images/blog/formula-1.png' },
  { slug: 'ferramentas-ai-para-designers-aliadas-ou-substitutas', title: 'Ferramentas AI para Designers: Aliadas ou Substitutas?', date: '2025-08-28', img: '/images/blog/ai-designers.jpg' },
  { slug: 'design-emocional', title: 'Design Emocional', date: '2025-08-28', img: '/images/blog/design-emocional.jpg' },
  { slug: 'os-10-mandamentos-do-marketing', title: 'Os 10 Mandamentos do Marketing', date: '2025-08-28', img: '/images/blog/mandamentos-marketing.jpg' },
  { slug: 'flow-no-websummit-2024', title: 'Flow no WebSummit 2024', date: '2025-08-28', img: '/images/blog/websummit-2024.jpg' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'Blog', url: `${SITE_URL}/${locale}/blog` },
  ]);

  return (
    <div className="pt-24 pb-20 px-4 bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-16">Blog Flow</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              {/* Thumbnail */}
              <div className="aspect-[16/10] overflow-hidden mb-4 bg-gray-100">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Date + Comments */}
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs text-gray-400">{formatDate(post.date)}</p>
                <span className="text-xs text-gray-400">0 Comments</span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-black group-hover:text-gray-500 transition-colors leading-snug">
                {post.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
