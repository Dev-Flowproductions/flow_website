import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const CopyPageAsMarkdown = dynamic(
  () => import('@/components/layout/CopyPageAsMarkdown'),
  { ssr: true }
);

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <GoogleAnalytics />
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale} />
      <CopyPageAsMarkdown />
    </>
  );
}
