import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import SGAChatWidgetLoader from '@/components/widgets/SGAChatWidgetLoader';
import DeferredCopyPageAsMarkdown from '@/components/layout/DeferredCopyPageAsMarkdown';
import HashScrollOnLoad from '@/components/ui/HashScrollOnLoad';
import { MobileMenuProvider } from '@/components/context/MobileMenuContext';
import { SlugMapProvider } from '@/components/context/SlugMapContext';

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
      <HashScrollOnLoad />
      <SlugMapProvider>
        <MobileMenuProvider>
          <Header locale={locale} />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer locale={locale} />
          <DeferredCopyPageAsMarkdown />
          <SGAChatWidgetLoader />
        </MobileMenuProvider>
      </SlugMapProvider>
    </>
  );
}
