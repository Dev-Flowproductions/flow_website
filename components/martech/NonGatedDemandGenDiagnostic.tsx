'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import type { DiagnosticResponse } from '@/app/api/tools/non-gated-demand-gen-diagnostic/route';

const API_VALUES = {
  salesCycle: { under1: 'less than 1 month', '1to3': '1 to 3 months', '3to6': '3 to 6 months', over6: 'more than 6 months' },
  leadSources: { paidAds: 'paid ads', gatedContent: 'gated content', organicSearch: 'organic search', referrals: 'referrals', socialMedia: 'social media', outboundSales: 'outbound sales', emailMarketing: 'email marketing', partners: 'partners' },
  publishingConsistency: { weekly: 'yes, weekly or more', sometimes: 'yes, sometimes', rarely: 'rarely', never: 'almost never' },
  distributionChannels: { website: 'website/blog', linkedin: 'LinkedIn', instagram: 'Instagram', email: 'email', partners: 'partner channels', paid: 'paid promotion', youtube: 'YouTube/video', nowhere: 'nowhere consistently' },
  preSalesContentAccess: { free: 'they can access useful content freely', behindForm: 'most useful content is behind a form', little: 'there is very little supporting content', notSure: 'not sure' },
  measurementMethods: { leadVolume: 'lead volume', mqls: 'MQLs', salesConversations: 'sales conversations', pipeline: 'pipeline contribution', closeRate: 'close rate', contentEngagement: 'content engagement', websiteBehaviour: 'website behaviour', notMeasured: 'we do not measure clearly' },
  biggestChallenge: { lowQuality: 'low lead quality', paidTraffic: 'too much reliance on paid traffic', longCycle: 'long sales cycle', weakTrust: 'weak trust and authority', inconsistentContent: 'inconsistent content', poorDistribution: 'poor distribution', unclearRoi: 'unclear ROI' },
} as const;

type FormState = {
  websiteUrl: string;
  industry: string;
  mainOffer: string;
  salesCycle: string;
  leadSources: string[];
  publishingConsistency: string;
  distributionChannels: string[];
  preSalesContentAccess: string;
  measurementMethods: string[];
  biggestChallenge: string;
};

const initialForm: FormState = {
  websiteUrl: '',
  industry: '',
  mainOffer: '',
  salesCycle: '',
  leadSources: [],
  publishingConsistency: '',
  distributionChannels: [],
  preSalesContentAccess: '',
  measurementMethods: [],
  biggestChallenge: '',
};

const TOTAL_STEPS = 10;

interface Props {
  locale: string;
}

export default function NonGatedDemandGenDiagnostic({ locale }: Props) {
  const t = useTranslations('demandGenTool');
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [quizStep, setQuizStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const lang = (locale === 'pt' || locale === 'fr' ? locale : 'en') as 'en' | 'pt' | 'fr';

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    if (key === 'websiteUrl') setSuggestError(null);
  }, []);

  const getSuggestedUrl = useCallback((url: string) => {
    const s = url.trim();
    if (!s) return '';
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
  }, []);

  const fetchSuggestions = useCallback(async (websiteUrl: string) => {
    const url = getSuggestedUrl(websiteUrl);
    if (!url) return;
    try {
      setSuggestError(null);
      setSuggestLoading(true);
      const res = await fetch('/api/tools/website-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language: lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      if (data.industry) update('industry', data.industry);
      if (data.mainOffer) update('mainOffer', data.mainOffer);
      autoAdvanceAfterSuggestRef.current = true;
    } catch {
      setSuggestError(t('suggestFromWebsiteError'));
    } finally {
      setSuggestLoading(false);
    }
  }, [lang, getSuggestedUrl, update, t]);

  const lastFetchedUrl = useRef<string | null>(null);
  const autoAdvanceAfterSuggestRef = useRef(false);

  useEffect(() => {
    const raw = form.websiteUrl.trim();
    if (!raw) {
      lastFetchedUrl.current = null;
      return;
    }
    const url = getSuggestedUrl(raw);
    if (!url) return;
    try {
      new URL(url);
    } catch {
      return;
    }
    if (lastFetchedUrl.current === url) return;
    const timer = setTimeout(() => {
      lastFetchedUrl.current = url;
      fetchSuggestions(raw);
    }, 1200);
    return () => clearTimeout(timer);
  }, [form.websiteUrl, getSuggestedUrl, fetchSuggestions]);

  useEffect(() => {
    if (!suggestLoading && autoAdvanceAfterSuggestRef.current && step === 'quiz' && quizStep === 1 && !suggestError) {
      autoAdvanceAfterSuggestRef.current = false;
      setQuizStep(2);
    }
  }, [suggestLoading, step, quizStep, suggestError]);

  const toggleMulti = useCallback((key: 'leadSources' | 'distributionChannels' | 'measurementMethods', value: string) => {
    setForm((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
    setError(null);
  }, []);

  const buildPayload = useCallback(() => {
    const salesCycleMap = API_VALUES.salesCycle as Record<string, string>;
    const leadSourcesMap = API_VALUES.leadSources as Record<string, string>;
    const publishingMap = API_VALUES.publishingConsistency as Record<string, string>;
    const distributionMap = API_VALUES.distributionChannels as Record<string, string>;
    const preSalesMap = API_VALUES.preSalesContentAccess as Record<string, string>;
    const measurementMap = API_VALUES.measurementMethods as Record<string, string>;
    const challengeMap = API_VALUES.biggestChallenge as Record<string, string>;
    return {
      language: lang,
      websiteUrl: form.websiteUrl.trim(),
      industry: form.industry.trim(),
      mainOffer: form.mainOffer.trim(),
      salesCycle: salesCycleMap[form.salesCycle] ?? form.salesCycle,
      leadSources: form.leadSources.map((k) => leadSourcesMap[k] ?? k),
      publishingConsistency: publishingMap[form.publishingConsistency] ?? form.publishingConsistency,
      distributionChannels: form.distributionChannels.map((k) => distributionMap[k] ?? k),
      preSalesContentAccess: preSalesMap[form.preSalesContentAccess] ?? form.preSalesContentAccess,
      measurementMethods: form.measurementMethods.map((k) => measurementMap[k] ?? k),
      biggestChallenge: challengeMap[form.biggestChallenge] ?? form.biggestChallenge,
    };
  }, [form, lang]);

  const canProceed = useCallback((): boolean => {
    switch (quizStep) {
      case 1: return form.websiteUrl.trim().length > 0 && !suggestLoading;
      case 2: return form.industry.trim().length > 0;
      case 3: return form.mainOffer.trim().length > 0;
      case 4: return !!form.salesCycle;
      case 5: return form.leadSources.length > 0;
      case 6: return !!form.publishingConsistency;
      case 7: return form.distributionChannels.length > 0;
      case 8: return !!form.preSalesContentAccess;
      case 9: return form.measurementMethods.length > 0;
      case 10: return !!form.biggestChallenge;
      default: return false;
    }
  }, [quizStep, form, suggestLoading]);

  const handleStart = () => {
    setStep('quiz');
    setQuizStep(1);
    setError(null);
  };

  const handleNext = useCallback(async () => {
    if (!canProceed() && quizStep !== 10) return;
    if (quizStep === 10) {
      const payload = buildPayload();
      setError(null);
      setStep('loading');
      try {
        const res = await fetch('/api/tools/non-gated-demand-gen-diagnostic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        setResult(data);
        setStep('result');
      } catch {
        setError(t('errorSubmit'));
        setStep('quiz');
      }
      return;
    }
    setQuizStep((s) => s + 1);
  }, [quizStep, canProceed, buildPayload, t]);

  const handleBack = () => {
    if (quizStep <= 1) return;
    setQuizStep((s) => s - 1);
    setError(null);
  };

  const openChat = useCallback(() => {
    if (!result) return;
    const diagnosticContext = {
      serviceName: 'Non-Gated Demand Gen',
      language: result.language,
      score: result.overallScore,
      maturityLevel: result.maturityLevel,
      topFrictionPoints: result.topFrictionPoints,
      priorityActions: result.priorityActions,
      summary: result.summary,
      userWebsite: form.websiteUrl,
      biggestChallenge: form.biggestChallenge,
    };
    try {
      sessionStorage.setItem('sga-diagnostic-context', JSON.stringify(diagnosticContext));
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('open-sga-chat', { detail: { diagnosticContext } }));
  }, [result, form.websiteUrl, form.biggestChallenge]);

  const downloadPdf = useCallback(() => {
    if (!result) return;
    const doc = new jsPDF();
    const filename = lang === 'pt' ? 'relatorio-diagnostico-procura-non-gated.pdf' : lang === 'fr' ? 'rapport-diagnostic-demande-non-gated.pdf' : 'non-gated-demand-diagnostic-report.pdf';

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    const smallLine = 5;
    let yPos = margin;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt');
    const pageUrl = `${baseUrl}/${locale}/martech/non-gated-demand-gen`;

    const checkPageBreak = (needed: number) => {
      if (yPos + needed > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    doc.setFontSize(18);
    const titleLines = doc.splitTextToSize(result.pdfTitle, contentWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * lineHeight * 1.5 + lineHeight * 0.5;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date().toLocaleDateString(result.language === 'pt' ? 'pt-PT' : result.language === 'fr' ? 'fr-FR' : 'en-GB'), margin, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += lineHeight * 1.5;

    doc.text(`${t('result.scoreLabel')}: ${result.overallScore}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`${t('result.maturityLabel')}: ${result.maturityLevel}`, margin, yPos);
    yPos += lineHeight * 1.5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.summaryLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * lineHeight + lineHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.frictionsLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    result.topFrictionPoints.forEach((f) => {
      checkPageBreak(lineHeight * 3);
      const frictionLines = doc.splitTextToSize(`• ${f.title}: ${f.explanation}`, contentWidth);
      doc.text(frictionLines, margin, yPos);
      yPos += frictionLines.length * smallLine + smallLine;
    });
    yPos += lineHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.leaksLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    result.demandLeaks.forEach((l) => {
      checkPageBreak(lineHeight * 3);
      const leakLines = doc.splitTextToSize(`• ${l.title}: ${l.explanation}`, contentWidth);
      doc.text(leakLines, margin, yPos);
      yPos += leakLines.length * smallLine + smallLine;
    });
    yPos += lineHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.actionsLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    result.priorityActions.forEach((a) => {
      checkPageBreak(lineHeight * 2);
      const actionLines = doc.splitTextToSize(`• ${a}`, contentWidth);
      doc.text(actionLines, margin, yPos);
      yPos += actionLines.length * lineHeight + smallLine;
    });
    yPos += lineHeight;

    doc.text(result.ctaText, margin, yPos);
    yPos += lineHeight * 2;

    checkPageBreak(lineHeight * 4);
    const sgaUrl = 'https://sga.flowproductions.pt/';
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const hintLines = doc.splitTextToSize(t('result.pdfCtaHint'), contentWidth);
    doc.text(hintLines, margin, yPos);
    yPos += hintLines.length * lineHeight + lineHeight * 0.5;
    const btnW = 72;
    const btnH = 11;
    const radius = 5;
    doc.setFillColor(91, 84, 160);
    doc.roundedRect(margin, yPos, btnW, btnH, radius, radius, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(t('result.pdfCtaButton'), margin + btnW / 2, yPos + btnH / 2 + 1.5, { align: 'center' });
    doc.link(margin, yPos, btnW, btnH, { url: sgaUrl });
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');

    doc.save(filename);
  }, [result, lang, locale, t]);

  // —— Result view ——
  if (step === 'result' && result) {
    const maturityMap = { early: t('maturity.early'), emerging: t('maturity.emerging'), structured: t('maturity.structured'), advanced: t('maturity.advanced') };
    const maturityKey = result.maturityLevel as keyof typeof maturityMap;
    const severityMap = { low: t('severity.low'), medium: t('severity.medium'), high: t('severity.high') } as const;
    const maturityStyles: Record<string, { bg: string; text: string; ring: string }> = {
      early: { bg: 'bg-amber-50', text: 'text-amber-800', ring: 'ring-amber-200' },
      emerging: { bg: 'bg-sky-50', text: 'text-sky-800', ring: 'ring-sky-200' },
      structured: { bg: 'bg-violet-50', text: 'text-violet-800', ring: 'ring-violet-200' },
      advanced: { bg: 'bg-emerald-50', text: 'text-emerald-800', ring: 'ring-emerald-200' },
    };
    const style = maturityStyles[result.maturityLevel] ?? maturityStyles.emerging;
    const severityStyles: Record<string, { bg: string; text: string }> = {
      low: { bg: 'bg-gray-100', text: 'text-gray-700' },
      medium: { bg: 'bg-amber-100', text: 'text-amber-800' },
      high: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const circumference = 2 * Math.PI * 54;
    const strokeDash = (result.overallScore / 100) * circumference;

    return (
      <section id="demand-gen-diagnostic" className="py-20 px-4 bg-gray-100" aria-labelledby="diagnostic-result-heading">
        {/* Single container: clear background so result has a clear start/end */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10 space-y-6">
            {/* Header + score card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h2 id="diagnostic-result-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h2>
              <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                <div className="relative shrink-0 w-36 h-36 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="-6 -6 132 132" aria-hidden>
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" className="text-gray-100" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - strokeDash}
                      className="text-[#5b54a0] transition-all duration-700"
                    />
                  </svg>
                  <span className="relative z-10 text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
                    {result.overallScore}<span className="text-lg font-medium text-gray-400">/100</span>
                  </span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{t('result.scoreLabel')}</p>
                  <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-semibold ring-2 ${style.bg} ${style.text} ${style.ring}`}>
                    {maturityMap[maturityKey] ?? result.maturityLevel}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">{t('result.maturityLabel')}</p>
                </div>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100"
            >
            <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-3">{t('result.summaryLabel')}</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{result.summary}</p>
          </motion.div>

          {/* Friction points */}
          {result.topFrictionPoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.frictionsLabel')}</h3>
              <div className="space-y-3">
                {result.topFrictionPoints.map((f, i) => {
                  const sev = severityStyles[f.severity] ?? severityStyles.medium;
                  return (
                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-md shadow-gray-200/30 border border-gray-100 flex gap-4">
                      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${sev.bg} ${sev.text}`}>
                        {severityMap[f.severity]?.slice(0, 1) ?? 'M'}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{f.title}</p>
                        <p className="text-gray-600 text-sm mt-1">{f.explanation}</p>
                        <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded ${sev.bg} ${sev.text}`}>
                          {severityMap[f.severity]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Demand leaks */}
          {result.demandLeaks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.leaksLabel')}</h3>
              <div className="space-y-3">
                {result.demandLeaks.map((l, i) => (
                  <div key={i} className="bg-amber-50/80 rounded-xl p-4 md:p-5 border border-amber-100 flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-800" aria-hidden>
                      →
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{l.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{l.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Priority actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/40 p-6 md:p-8 border border-gray-100"
          >
            <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-4">{t('result.actionsLabel')}</h3>
            <ol className="space-y-3">
              {result.priorityActions.map((a, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#5b54a0] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{a}</p>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* CTA block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.24 }}
            className="bg-[#5b54a0] rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-[#5b54a0]/20"
          >
            <p className="text-white/90 text-center mb-6 text-lg font-medium">
              {result.ctaText || t('result.ctaButton')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={openChat}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#5b54a0] rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {t('result.ctaButton')}
              </button>
              <button
                type="button"
                onClick={downloadPdf}
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-white/80 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                {t('result.downloadPdf')}
              </button>
            </div>
          </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const salesCycleOptions = ['under1', '1to3', '3to6', 'over6'] as const;
  const leadSourceKeys = ['paidAds', 'gatedContent', 'organicSearch', 'referrals', 'socialMedia', 'outboundSales', 'emailMarketing', 'partners'] as const;
  const publishingOptions = ['weekly', 'sometimes', 'rarely', 'never'] as const;
  const distributionKeys = ['website', 'linkedin', 'instagram', 'email', 'partners', 'paid', 'youtube', 'nowhere'] as const;
  const preSalesOptions = ['free', 'behindForm', 'little', 'notSure'] as const;
  const measurementKeys = ['leadVolume', 'mqls', 'salesConversations', 'pipeline', 'closeRate', 'contentEngagement', 'websiteBehaviour', 'notMeasured'] as const;
  const challengeOptions = ['lowQuality', 'paidTraffic', 'longCycle', 'weakTrust', 'inconsistentContent', 'poorDistribution', 'unclearRoi'] as const;

  const renderQuizStep = () => {
    const commonInput = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#5b54a0] focus:border-[#5b54a0]';
    const optionButton = 'w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-[#5b54a0] hover:bg-[#5b54a0]/5 transition-all text-gray-700 font-medium';
    const optionButtonActive = 'border-[#5b54a0] bg-[#5b54a0]/10';

    switch (quizStep) {
      case 1:
        return (
          <div>
            <label htmlFor="dg-website" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.websiteUrl')}</label>
            <input id="dg-website" type="url" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} className={commonInput} placeholder="https://" />
            {suggestLoading && <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">{t('suggestFromWebsiteLoading')}</p>}
            {suggestError && <p className="text-sm text-amber-600 mt-2">{suggestError}</p>}
          </div>
        );
      case 2:
        return (
          <div>
            <label htmlFor="dg-industry" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.industry')}</label>
            <input id="dg-industry" type="text" value={form.industry} onChange={(e) => update('industry', e.target.value)} className={commonInput} />
          </div>
        );
      case 3:
        return (
          <div>
            <label htmlFor="dg-offer" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.mainOffer')}</label>
            <input id="dg-offer" type="text" value={form.mainOffer} onChange={(e) => update('mainOffer', e.target.value)} className={commonInput} />
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.salesCycle')}</p>
            <div className="space-y-3">
              {salesCycleOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => update('salesCycle', opt)} className={`${optionButton} ${form.salesCycle === opt ? optionButtonActive : ''}`}>
                  {t(`options.salesCycle.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.leadSources')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {leadSourceKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleMulti('leadSources', k)} className={`${optionButton} ${form.leadSources.includes(k) ? optionButtonActive : ''}`}>
                  {t(`options.leadSources.${k}`)}
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.publishingConsistency')}</p>
            <div className="space-y-3">
              {publishingOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => update('publishingConsistency', opt)} className={`${optionButton} ${form.publishingConsistency === opt ? optionButtonActive : ''}`}>
                  {t(`options.publishingConsistency.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.distributionChannels')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {distributionKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleMulti('distributionChannels', k)} className={`${optionButton} ${form.distributionChannels.includes(k) ? optionButtonActive : ''}`}>
                  {t(`options.distributionChannels.${k}`)}
                </button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.preSalesContentAccess')}</p>
            <div className="space-y-3">
              {preSalesOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => update('preSalesContentAccess', opt)} className={`${optionButton} ${form.preSalesContentAccess === opt ? optionButtonActive : ''}`}>
                  {t(`options.preSalesContentAccess.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.measurementMethods')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {measurementKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleMulti('measurementMethods', k)} className={`${optionButton} ${form.measurementMethods.includes(k) ? optionButtonActive : ''}`}>
                  {t(`options.measurementMethods.${k}`)}
                </button>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.biggestChallenge')}</p>
            <div className="space-y-3">
              {challengeOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => update('biggestChallenge', opt)} className={`${optionButton} ${form.biggestChallenge === opt ? optionButtonActive : ''}`}>
                  {t(`options.biggestChallenge.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="demand-gen-diagnostic" className="py-20 px-4 bg-gray-50" aria-labelledby="diagnostic-heading">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <h2 id="diagnostic-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
              <p className="text-xl text-gray-600 mb-8">{t('subtitle')}</p>
              <div className="flex justify-center gap-6 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#5b54a0]">{t('stepsCount')}</div>
                  <div className="text-sm text-gray-500">{t('questions')}</div>
                </div>
              </div>
              <button onClick={handleStart} className="px-10 py-4 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-semibold text-lg shadow-lg">
                {t('startButton')}
              </button>
              <div className="flex justify-center gap-4 mt-6 text-sm text-gray-500">
                <span>{t('freeLabel')}</span>
                <span>·</span>
                <span>{t('noSignup')}</span>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div
              key={`quiz-${quizStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-500">{t('stepOf')} {quizStep} {t('of')} {TOTAL_STEPS}</span>
                <div className="flex gap-1">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div key={i} className={`w-6 h-1 rounded-full ${i + 1 < quizStep ? 'bg-[#5b54a0]' : i + 1 === quizStep ? 'bg-[#5b54a0]/50' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
              {renderQuizStep()}
              {error && <p className="mt-4 text-red-600 text-sm" role="alert">{error}</p>}
              <div className="flex gap-3 mt-8">
                {quizStep > 1 && (
                  <button type="button" onClick={handleBack} className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full hover:border-gray-400 transition-colors font-medium">
                    {t('back')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed() || (quizStep === 1 && suggestLoading)}
                  aria-disabled={quizStep === 1 && suggestLoading}
                  className="ml-auto px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors font-medium"
                >
                  {quizStep === 10 ? t('submit') : t('next')}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl p-12 shadow-2xl text-center">
              <div className="inline-block w-10 h-10 border-2 border-[#5b54a0] border-t-transparent rounded-full animate-spin mb-4" aria-hidden />
              <p className="text-lg text-gray-700">{t('loading')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
