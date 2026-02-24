import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';

const postsList = [
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

const posts: Record<string, { title: string; date: string; img: string }> = {
  'o-marketing-ja-mudou-a-tua-marca-acompanhou': { title: 'O marketing já mudou. A tua marca acompanhou?', date: '2026-02-11', img: '/images/blog/marketing-supreme.jpg' },
  'marketing-supreme-como-a-promocao-do-filme-marty-supreme-nos-ensina-a-quebrar-a-formula': { title: 'Marketing Supreme', date: '2026-01-08', img: '/images/blog/marketing-supreme.jpg' },
  'fazer-marketing-para-humanos-e-nao-para-os-algoritmos': { title: 'FAZER MARKETING PARA HUMANOS (E NÃO PARA OS ALGORITMOS)', date: '2025-11-24', img: '/images/blog/marketing-humanos.jpg' },
  'gestao-de-equipas-pessoas-primeiro-resultados-depois': { title: 'Gestão de Equipas: Pessoas Primeiro, Resultados Depois', date: '2025-10-30', img: '/images/blog/gestao-equipas.jpg' },
  'desperte-o-seu-fluxo-criativo-com-passatempos': { title: 'Desperte o seu Fluxo Criativo com Passatempos', date: '2025-10-30', img: '/images/blog/fluxo-criativo.jpg' },
  'criacao-de-conteudos-em-p1-o-renascimento-da-formula-1': { title: 'Criação de Conteúdos em P1: O Renascimento da Fórmula 1', date: '2025-08-28', img: '/images/blog/formula-1.png' },
  'ferramentas-ai-para-designers-aliadas-ou-substitutas': { title: 'Ferramentas AI para Designers: Aliadas ou Substitutas?', date: '2025-08-28', img: '/images/blog/ai-designers.jpg' },
  'design-emocional': { title: 'Design Emocional', date: '2025-08-28', img: '/images/blog/design-emocional.jpg' },
  'os-10-mandamentos-do-marketing': { title: 'Os 10 Mandamentos do Marketing', date: '2025-08-28', img: '/images/blog/mandamentos-marketing.jpg' },
  'flow-no-websummit-2024': { title: 'Flow no WebSummit 2024', date: '2025-08-28', img: '/images/blog/websummit-2024.jpg' },
};

async function getPostContent(slug: string): Promise<string> {
  try {
    const res = await fetch(
      `https://flowproductions.pt/wp-json/wp/v2/posts?slug=${slug}&_fields=content`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return '';
    const data = await res.json();
    if (!data.length) return '';
    return data[0].content?.rendered || '';
  } catch {
    return '';
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: 'Blog Flow' };
  return { title: `${post.title} – Flow Productions` };
}


export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  const rawContent = await getPostContent(slug);

  const currentIndex = postsList.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex !== -1 ? postsList[(currentIndex + 1) % postsList.length] : postsList[0];
  const alsoLike = postsList.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero image — full width */}
      <div className="w-full pt-16 overflow-hidden">
        <img
          src={post.img}
          alt={post.title}
          className="w-full max-h-[70vh] object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-10">
          {post.title}
        </h1>

        {rawContent ? (
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
              prose-headings:font-bold prose-headings:text-black
              prose-p:mb-4 prose-strong:text-black"
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        ) : (
          <p className="text-gray-400">Conteúdo em breve.</p>
        )}
      </div>

      {/* Post navigation */}
      {nextPost && (
        <div className="border-t border-gray-100 py-8 px-4">
          <div className="max-w-3xl mx-auto flex justify-end">
            <Link href={`/blog/${nextPost.slug}`} className="group flex flex-col items-end gap-1">
              <span className="text-xs uppercase tracking-widest text-gray-400 flex items-center gap-1">Next <span className="text-gray-400">›</span></span>
              <span className="text-sm font-bold text-black group-hover:text-gray-500 transition-colors text-right max-w-xs leading-snug">
                {nextPost.title}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* You May Also Like */}
      <div className="border-t border-gray-100 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {alsoLike.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden mb-3 bg-gray-100">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-sm font-bold text-black group-hover:text-gray-500 transition-colors leading-snug">
                  {p.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
