'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import type { PaidMediaWasteAuditResponse } from '@/app/api/tools/paid-media-waste-audit/route';

const API_VALUES = {
  monthlyAdSpend: {
    under1k: 'less than €1,000',
    '1kTo5k': '€1,000 to €5,000',
    '5kTo15k': '€5,000 to €15,000',
    over15k: 'more than €15,000',
  },
  channels: {
    googleAds: 'Google Ads',
    linkedInAds: 'LinkedIn Ads',
    metaAds: 'Meta Ads',
    youtubeAds: 'YouTube Ads',
    display: 'display/programmatic',
    other: 'other',
  },
  campaignGoal: {
    leads: 'lead generation',
    meetings: 'booked meetings',
    sales: 'sales',
    awareness: 'awareness',
    traffic: 'traffic',
    notDefined: 'not clearly defined',
  },
  successMetrics: {
    clicks: 'clicks',
    ctr: 'CTR',
    cpc: 'CPC',
    leads: 'leads',
    bookedCalls: 'booked calls',
    pipeline: 'pipeline',
    revenue: 'revenue',
    leadQuality: 'lead quality',
    notSure: 'we are not sure',
  },
  testingDiscipline: {
    yesClear: 'yes, with a clear method',
    yesInconsistent: 'yes, but inconsistently',
    rarely: 'rarely',
    almostNever: 'almost never',
  },
  adLandingAlignment: {
    highly: 'highly aligned',
    somewhat: 'somewhat aligned',
    mismatched: 'often mismatched',
    notSure: 'not sure',
  },
  postLeadTracking: {
    yesCrm: 'yes, through CRM and sales stages',
    partly: 'partly',
    basic: 'only basic lead tracking',
    no: 'no',
  },
  biggestChallenge: {
    highCpl: 'high cost per lead',
    lowQuality: 'low lead quality',
    poorConversion: 'poor conversion rate',
    weakReporting: 'weak reporting clarity',
    unclearTargeting: 'unclear targeting',
    weakCreatives: 'weak creatives',
    landingUnderperform: 'landing page underperformance',
    cannotScale: 'cannot scale predictably',
  },
} as const;

type FormState = {
  websiteUrl: string;
  landingPageUrl: string;
  industry: string;
  mainOffer: string;
  monthlyAdSpend: string;
  channels: string[];
  campaignGoal: string;
  successMetrics: string[];
  testingDiscipline: string;
  adLandingAlignment: string;
  postLeadTracking: string;
  biggestChallenge: string;
};

const initialForm: FormState = {
  websiteUrl: '',
  landingPageUrl: '',
  industry: '',
  mainOffer: '',
  monthlyAdSpend: '',
  channels: [],
  campaignGoal: '',
  successMetrics: [],
  testingDiscipline: '',
  adLandingAlignment: '',
  postLeadTracking: '',
  biggestChallenge: '',
};

const TOTAL_STEPS = 10;

interface Props {
  locale: string;
}

export default function PaidMediaWasteAudit({ locale }: Props) {
  const t = useTranslations('paidMediaWasteAudit');
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [quizStep, setQuizStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaidMediaWasteAuditResponse | null>(null);
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
      update('landingPageUrl', url);
    } catch {
      setSuggestError(t('suggestFromWebsiteError'));
    } finally {
      setSuggestLoading(false);
    }
  }, [lang, getSuggestedUrl, update, t]);

  const lastFetchedUrl = useRef<string | null>(null);

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

  const toggleChannels = useCallback((value: string) => {
    setForm((prev) => {
      const arr = prev.channels;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, channels: next };
    });
    setError(null);
  }, []);

  const toggleSuccessMetrics = useCallback((value: string) => {
    setForm((prev) => {
      const arr = prev.successMetrics;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, successMetrics: next };
    });
    setError(null);
  }, []);

  const buildPayload = useCallback(() => {
    const m = API_VALUES as Record<string, Record<string, string>>;
    const websiteUrlNorm = (() => {
      const s = form.websiteUrl.trim();
      return s ? (/^https?:\/\//i.test(s) ? s : `https://${s}`) : 'https://example.com';
    })();
    return {
      language: lang,
      websiteUrl: websiteUrlNorm,
      landingPageUrl: form.landingPageUrl.trim() || undefined,
      industry: form.industry.trim() || undefined,
      mainOffer: form.mainOffer.trim() || undefined,
      monthlyAdSpend: m.monthlyAdSpend[form.monthlyAdSpend] ?? form.monthlyAdSpend,
      channels: form.channels.map((k) => m.channels[k] ?? k),
      campaignGoal: m.campaignGoal[form.campaignGoal] ?? form.campaignGoal,
      successMetrics: form.successMetrics.map((k) => m.successMetrics[k] ?? k),
      testingDiscipline: m.testingDiscipline[form.testingDiscipline] ?? form.testingDiscipline,
      adLandingAlignment: m.adLandingAlignment[form.adLandingAlignment] ?? form.adLandingAlignment,
      postLeadTracking: m.postLeadTracking[form.postLeadTracking] ?? form.postLeadTracking,
      biggestChallenge: m.biggestChallenge[form.biggestChallenge] ?? form.biggestChallenge,
    };
  }, [form, lang]);

  const canProceed = useCallback((): boolean => {
    switch (quizStep) {
      case 1: return form.websiteUrl.trim().length > 0 && !suggestLoading;
      case 2: return true;
      case 3: return !!form.monthlyAdSpend;
      case 4: return form.channels.length > 0;
      case 5: return !!form.campaignGoal;
      case 6: return form.successMetrics.length > 0;
      case 7: return !!form.testingDiscipline;
      case 8: return !!form.adLandingAlignment;
      case 9: return !!form.postLeadTracking;
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
      setError(null);
      setStep('loading');
      try {
        const res = await fetch('/api/tools/paid-media-waste-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload()),
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
      serviceName: 'Paid Media Waste Audit',
      language: result.language,
      score: result.overallScore,
      auditLevel: result.auditLevel,
      topWasteRisks: result.topWasteRisks,
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
    const filename = lang === 'pt' ? 'relatorio-auditoria-desperdicio-paid-media.pdf' : lang === 'fr' ? 'rapport-audit-gaspillage-paid-media.pdf' : 'paid-media-waste-audit-report.pdf';
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let yPos = margin;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt');
    const pageUrl = `${baseUrl}/${locale}/martech/paid-media`;

    const checkPageBreak = (needed: number) => {
      if (yPos + needed > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    doc.setFontSize(18);
    doc.text(result.pdfTitle, margin, yPos);
    yPos += lineHeight * 2;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date().toLocaleDateString(result.language === 'pt' ? 'pt-PT' : result.language === 'fr' ? 'fr-FR' : 'en-GB'), margin, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += lineHeight * 1.5;
    doc.text(`${t('result.scoreLabel')}: ${result.overallScore}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`${t('result.auditLevelLabel')}: ${result.auditLevel}`, margin, yPos);
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
    doc.text(t('result.wasteRisksLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    result.topWasteRisks.forEach((f) => {
      checkPageBreak(lineHeight * 3);
      const lines = doc.splitTextToSize(`• ${f.title}: ${f.explanation}`, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + lineHeight;
    });
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.blockersLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    result.performanceBlockers.forEach((b) => {
      checkPageBreak(lineHeight * 3);
      const lines = doc.splitTextToSize(`• ${b.title}: ${b.explanation}`, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + lineHeight;
    });
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.actionsLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    result.priorityActions.forEach((a) => {
      checkPageBreak(lineHeight * 2);
      const lines = doc.splitTextToSize(`• ${a}`, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + lineHeight;
    });
    yPos += lineHeight;
    doc.text(result.ctaText, margin, yPos);
    yPos += lineHeight * 2;
    checkPageBreak(lineHeight * 3);
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 153);
    doc.textWithLink(t('result.pdfViewPageLink'), margin, yPos, { url: pageUrl });
    doc.setTextColor(0, 0, 0);
    yPos += lineHeight;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    const urlLines = doc.splitTextToSize(pageUrl, contentWidth);
    doc.text(urlLines, margin, yPos);
    doc.setTextColor(0, 0, 0);
    doc.save(filename);
  }, [result, lang, locale, t]);

  if (step === 'result' && result) {
    const auditLevelKey = result.auditLevel === 'efficient and scalable' ? 'efficientScalable' : result.auditLevel.replace(/\s+/g, '');
    const auditLevelMap: Record<string, string> = {
      inefficient: t('auditLevel.inefficient'),
      unstable: t('auditLevel.unstable'),
      improving: t('auditLevel.improving'),
      efficientScalable: t('auditLevel.efficientScalable'),
      'efficientandscalable': t('auditLevel.efficientScalable'),
    };
    const severityMap = { low: t('severity.low'), medium: t('severity.medium'), high: t('severity.high') } as const;
    const circumference = 2 * Math.PI * 54;
    const strokeDash = (result.overallScore / 100) * circumference;

    return (
      <section id="paid-media-waste-audit" className="py-20 px-4 bg-gray-100" aria-labelledby="paid-media-result-heading">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h2 id="paid-media-result-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h2>
              <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                <div className="relative shrink-0 w-36 h-36 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="-6 -6 132 132" aria-hidden>
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" className="text-gray-100" />
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - strokeDash} className="text-[#5b54a0] transition-all duration-700" />
                  </svg>
                  <span className="relative z-10 text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">{result.overallScore}<span className="text-lg font-medium text-gray-400">/100</span></span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{t('result.scoreLabel')}</p>
                  <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-800 ring-2 ring-violet-200">{auditLevelMap[auditLevelKey] ?? auditLevelMap[result.auditLevel.replace(/\s+/g, '')] ?? result.auditLevel}</span>
                  <p className="text-xs text-gray-500 mt-2">{t('result.auditLevelLabel')}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }} className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-3">{t('result.summaryLabel')}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{result.summary}</p>
            </motion.div>
            {result.topWasteRisks.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.wasteRisksLabel')}</h3>
                <div className="space-y-3">
                  {result.topWasteRisks.map((f, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-md border border-gray-100 flex gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{f.title}</p>
                        <p className="text-gray-600 text-sm mt-1">{f.explanation}</p>
                        <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">{severityMap[f.severity]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {result.performanceBlockers.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.blockersLabel')}</h3>
                <div className="space-y-3">
                  {result.performanceBlockers.map((b, i) => (
                    <div key={i} className="bg-amber-50/80 rounded-xl p-4 md:p-5 border border-amber-100">
                      <p className="font-semibold text-gray-900">{b.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{b.explanation}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-4">{t('result.actionsLabel')}</h3>
              <ol className="space-y-3">
                {result.priorityActions.map((a, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#5b54a0] text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <p className="text-gray-700 pt-1">{a}</p>
                  </li>
                ))}
              </ol>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.24 }} className="bg-[#5b54a0] rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-[#5b54a0]/20">
              <p className="text-white/90 text-center mb-6 text-lg font-medium">{result.ctaText || t('result.ctaButton')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button type="button" onClick={openChat} className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#5b54a0] rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">{t('result.ctaButton')}</button>
                <button type="button" onClick={downloadPdf} className="w-full sm:w-auto px-8 py-3.5 border-2 border-white/80 text-white rounded-full font-medium hover:bg-white/10 transition-colors">{t('result.downloadPdf')}</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const commonInput = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#5b54a0] focus:border-[#5b54a0]';
  const optionButton = 'w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-[#5b54a0] hover:bg-[#5b54a0]/5 transition-all text-gray-700 font-medium';
  const optionButtonActive = 'border-[#5b54a0] bg-[#5b54a0]/10';

  const channelKeys = ['googleAds', 'linkedInAds', 'metaAds', 'youtubeAds', 'display', 'other'] as const;
  const successMetricKeys = ['clicks', 'ctr', 'cpc', 'leads', 'bookedCalls', 'pipeline', 'revenue', 'leadQuality', 'notSure'] as const;

  const renderQuizStep = () => {
    switch (quizStep) {
      case 1:
        return (
          <div>
            <label htmlFor="pm-website" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.websiteUrl')}</label>
            <input id="pm-website" type="url" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} className={commonInput} placeholder="https://" />
            {suggestLoading && <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">{t('suggestFromWebsiteLoading')}</p>}
            {suggestError && <p className="text-sm text-amber-600 mt-2">{suggestError}</p>}
          </div>
        );
      case 2:
        return (
          <div>
            <label htmlFor="pm-landing" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.landingPageUrl')}</label>
            <input id="pm-landing" type="url" value={form.landingPageUrl} onChange={(e) => update('landingPageUrl', e.target.value)} className={commonInput} placeholder="https://" />
            <p className="text-sm text-gray-500 mt-1">{t('fields.landingPageUrlHint')}</p>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.monthlyAdSpend')}</p>
            <div className="space-y-3">
              {(['under1k', '1kTo5k', '5kTo15k', 'over15k'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('monthlyAdSpend', opt)} className={`${optionButton} ${form.monthlyAdSpend === opt ? optionButtonActive : ''}`}>{t(`options.monthlyAdSpend.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.channels')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {channelKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleChannels(k)} className={`${optionButton} ${form.channels.includes(k) ? optionButtonActive : ''}`}>{t(`options.channels.${k}`)}</button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.campaignGoal')}</p>
            <div className="space-y-3">
              {(['leads', 'meetings', 'sales', 'awareness', 'traffic', 'notDefined'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('campaignGoal', opt)} className={`${optionButton} ${form.campaignGoal === opt ? optionButtonActive : ''}`}>{t(`options.campaignGoal.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.successMetrics')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {successMetricKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleSuccessMetrics(k)} className={`${optionButton} ${form.successMetrics.includes(k) ? optionButtonActive : ''}`}>{t(`options.successMetrics.${k}`)}</button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.testingDiscipline')}</p>
            <div className="space-y-3">
              {(['yesClear', 'yesInconsistent', 'rarely', 'almostNever'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('testingDiscipline', opt)} className={`${optionButton} ${form.testingDiscipline === opt ? optionButtonActive : ''}`}>{t(`options.testingDiscipline.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.adLandingAlignment')}</p>
            <div className="space-y-3">
              {(['highly', 'somewhat', 'mismatched', 'notSure'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('adLandingAlignment', opt)} className={`${optionButton} ${form.adLandingAlignment === opt ? optionButtonActive : ''}`}>{t(`options.adLandingAlignment.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.postLeadTracking')}</p>
            <div className="space-y-3">
              {(['yesCrm', 'partly', 'basic', 'no'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('postLeadTracking', opt)} className={`${optionButton} ${form.postLeadTracking === opt ? optionButtonActive : ''}`}>{t(`options.postLeadTracking.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.biggestChallenge')}</p>
            <div className="space-y-3">
              {(['highCpl', 'lowQuality', 'poorConversion', 'weakReporting', 'unclearTargeting', 'weakCreatives', 'landingUnderperform', 'cannotScale'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('biggestChallenge', opt)} className={`${optionButton} ${form.biggestChallenge === opt ? optionButtonActive : ''}`}>{t(`options.biggestChallenge.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="paid-media-waste-audit" className="py-20 px-4 bg-gray-50" aria-labelledby="paid-media-diagnostic-heading">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <h2 id="paid-media-diagnostic-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
              <p className="text-xl text-gray-600 mb-8">{t('subtitle')}</p>
              <div className="flex justify-center gap-6 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#5b54a0]">{t('stepsCount')}</div>
                  <div className="text-sm text-gray-500">{t('questions')}</div>
                </div>
              </div>
              <button onClick={handleStart} className="px-10 py-4 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-semibold text-lg shadow-lg">{t('startButton')}</button>
              <div className="flex justify-center gap-4 mt-6 text-sm text-gray-500">
                <span>{t('freeLabel')}</span><span>·</span><span>{t('noSignup')}</span>
              </div>
            </motion.div>
          )}
          {step === 'quiz' && (
            <motion.div key={`quiz-${quizStep}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white rounded-2xl p-8 shadow-2xl">
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
                  <button type="button" onClick={handleBack} className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full hover:border-gray-400 transition-colors font-medium">{t('back')}</button>
                )}
                <button type="button" onClick={handleNext} disabled={!canProceed() || (quizStep === 1 && suggestLoading)} aria-disabled={quizStep === 1 && suggestLoading} className="ml-auto px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors font-medium">
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
