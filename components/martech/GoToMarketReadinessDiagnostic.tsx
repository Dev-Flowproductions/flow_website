'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import type { GtmReadinessResponse } from '@/app/api/tools/go-to-market-readiness-diagnostic/route';

const API_VALUES = {
  currentSituation: { launching: 'launching a new offer', repositioning: 'repositioning an existing offer', entering: 'entering a new market or segment', scaling: 'trying to scale an existing motion', notSure: 'not sure' },
  offerClarity: { very: 'very clearly', somewhat: 'somewhat clearly', difficulty: 'with difficulty', notClearly: 'not clearly at all' },
  audienceMessaging: { yesDefined: 'yes, and we have that defined', yesNotDefined: 'yes, but it is not clearly defined', no: 'no', notSure: 'not sure' },
  biggestChallenge: { positioning: 'unclear positioning', valueProp: 'weak value proposition', complex: 'message too complex', channels: 'wrong channels', conversion: 'poor conversion from interest to conversation', misalignment: 'internal misalignment', priorities: 'too many priorities at once' },
  currentChannels: { website: 'website', organic: 'organic search', social: 'social media', paid: 'paid ads', outbound: 'outbound sales', email: 'email', partners: 'partners', events: 'events' },
  proofLevel: { strong: 'yes, strong proof', some: 'some proof, but not organised', little: 'very little proof', no: 'no' },
  teamAlignment: { highly: 'highly aligned', mostly: 'mostly aligned', partially: 'partially aligned', poorly: 'poorly aligned' },
} as const;

type FormState = {
  websiteUrl: string;
  offerDescription: string;
  currentSituation: string;
  offerClarity: string;
  targetAudience: string;
  audienceMessaging: string;
  biggestChallenge: string;
  currentChannels: string[];
  proofLevel: string;
  teamAlignment: string;
};

const initialForm: FormState = {
  websiteUrl: '',
  offerDescription: '',
  currentSituation: '',
  offerClarity: '',
  targetAudience: '',
  audienceMessaging: '',
  biggestChallenge: '',
  currentChannels: [],
  proofLevel: '',
  teamAlignment: '',
};

const TOTAL_STEPS = 10;

interface Props {
  locale: string;
}

export default function GoToMarketReadinessDiagnostic({ locale }: Props) {
  const t = useTranslations('gtmReadinessTool');
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [quizStep, setQuizStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GtmReadinessResponse | null>(null);
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
      if (data.mainOffer) update('offerDescription', data.mainOffer);
      if (data.industry) update('targetAudience', data.industry);
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
      const arr = prev.currentChannels;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, currentChannels: next };
    });
    setError(null);
  }, []);

  const buildPayload = useCallback(() => {
    const m = API_VALUES as Record<string, Record<string, string>>;
    return {
      language: lang,
      websiteUrl: (() => { const s = form.websiteUrl.trim(); return s ? (/^https?:\/\//i.test(s) ? s : `https://${s}`) : 'https://example.com'; })(),
      offerDescription: form.offerDescription.trim(),
      currentSituation: m.currentSituation[form.currentSituation] ?? form.currentSituation,
      offerClarity: m.offerClarity[form.offerClarity] ?? form.offerClarity,
      targetAudience: form.targetAudience.trim(),
      audienceMessaging: m.audienceMessaging[form.audienceMessaging] ?? form.audienceMessaging,
      biggestChallenge: m.biggestChallenge[form.biggestChallenge] ?? form.biggestChallenge,
      currentChannels: form.currentChannels.map((k) => m.currentChannels[k] ?? k),
      proofLevel: m.proofLevel[form.proofLevel] ?? form.proofLevel,
      teamAlignment: m.teamAlignment[form.teamAlignment] ?? form.teamAlignment,
    };
  }, [form, lang]);

  const canProceed = useCallback((): boolean => {
    switch (quizStep) {
      case 1: return form.websiteUrl.trim().length > 0 && !suggestLoading;
      case 2: return form.offerDescription.trim().length > 0;
      case 3: return !!form.currentSituation;
      case 4: return !!form.offerClarity;
      case 5: return form.targetAudience.trim().length > 0;
      case 6: return !!form.audienceMessaging;
      case 7: return !!form.biggestChallenge;
      case 8: return form.currentChannels.length > 0;
      case 9: return !!form.proofLevel;
      case 10: return !!form.teamAlignment;
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
        const res = await fetch('/api/tools/go-to-market-readiness-diagnostic', {
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
      serviceName: 'Go-to-Market Strategy',
      language: result.language,
      score: result.overallScore,
      readinessLevel: result.readinessLevel,
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
    const filename = lang === 'pt' ? 'relatorio-diagnostico-prontidao-go-to-market.pdf' : lang === 'fr' ? 'rapport-diagnostic-preparation-go-to-market.pdf' : 'go-to-market-readiness-diagnostic-report.pdf';
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let yPos = margin;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt');
    const pageUrl = `${baseUrl}/${locale}/martech/go-to-market`;

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
    doc.text(`${t('result.readinessLabel')}: ${result.readinessLevel}`, margin, yPos);
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
      const lines = doc.splitTextToSize(`• ${f.title}: ${f.explanation}`, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + lineHeight;
    });
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.clarityGapsLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    result.clarityGaps.forEach((c) => {
      checkPageBreak(lineHeight * 3);
      const lines = doc.splitTextToSize(`• ${c.title}: ${c.explanation}`, contentWidth);
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
    const readinessKey = result.readinessLevel === 'ready to refine' ? 'readyToRefine' : result.readinessLevel === 'market-ready' ? 'marketReady' : result.readinessLevel;
    const readinessMap = { early: t('readinessLevel.early'), forming: t('readinessLevel.forming'), readyToRefine: t('readinessLevel.readyToRefine'), marketReady: t('readinessLevel.marketReady') };
    const severityMap = { low: t('severity.low'), medium: t('severity.medium'), high: t('severity.high') } as const;
    const circumference = 2 * Math.PI * 54;
    const strokeDash = (result.overallScore / 100) * circumference;

    return (
      <section id="gtm-readiness-diagnostic" className="py-20 px-4 bg-gray-100" aria-labelledby="gtm-result-heading">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h2 id="gtm-result-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h2>
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
                  <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-800 ring-2 ring-violet-200">{readinessMap[readinessKey as keyof typeof readinessMap] ?? result.readinessLevel}</span>
                  <p className="text-xs text-gray-500 mt-2">{t('result.readinessLabel')}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }} className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-3">{t('result.summaryLabel')}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{result.summary}</p>
            </motion.div>
            {result.topFrictionPoints.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.frictionsLabel')}</h3>
                <div className="space-y-3">
                  {result.topFrictionPoints.map((f, i) => (
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
            {result.clarityGaps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.clarityGapsLabel')}</h3>
                <div className="space-y-3">
                  {result.clarityGaps.map((c, i) => (
                    <div key={i} className="bg-amber-50/80 rounded-xl p-4 md:p-5 border border-amber-100">
                      <p className="font-semibold text-gray-900">{c.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{c.explanation}</p>
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

  const situationOpts = ['launching', 'repositioning', 'entering', 'scaling', 'notSure'] as const;
  const clarityOpts = ['very', 'somewhat', 'difficulty', 'notClearly'] as const;
  const audienceMsgOpts = ['yesDefined', 'yesNotDefined', 'no', 'notSure'] as const;
  const challengeOpts = ['positioning', 'valueProp', 'complex', 'channels', 'conversion', 'misalignment', 'priorities'] as const;
  const channelKeys = ['website', 'organic', 'social', 'paid', 'outbound', 'email', 'partners', 'events'] as const;
  const proofOpts = ['strong', 'some', 'little', 'no'] as const;
  const alignmentOpts = ['highly', 'mostly', 'partially', 'poorly'] as const;

  const renderQuizStep = () => {
    switch (quizStep) {
      case 1:
        return (
          <div>
            <label htmlFor="gtm-website" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.websiteUrl')}</label>
            <input id="gtm-website" type="url" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} className={commonInput} placeholder="https://" />
            {suggestLoading && <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">{t('suggestFromWebsiteLoading')}</p>}
            {suggestError && <p className="text-sm text-amber-600 mt-2">{suggestError}</p>}
          </div>
        );
      case 2:
        return (
          <div>
            <label htmlFor="gtm-offer" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.offerDescription')}</label>
            <input id="gtm-offer" type="text" value={form.offerDescription} onChange={(e) => update('offerDescription', e.target.value)} className={commonInput} />
          </div>
        );
      case 3:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.currentSituation')}</p>
            <div className="space-y-3">
              {situationOpts.map((opt) => (
                <button key={opt} type="button" onClick={() => update('currentSituation', opt)} className={`${optionButton} ${form.currentSituation === opt ? optionButtonActive : ''}`}>{t(`options.currentSituation.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.offerClarity')}</p>
            <div className="space-y-3">
              {clarityOpts.map((opt) => (
                <button key={opt} type="button" onClick={() => update('offerClarity', opt)} className={`${optionButton} ${form.offerClarity === opt ? optionButtonActive : ''}`}>{t(`options.offerClarity.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <label htmlFor="gtm-audience" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.targetAudience')}</label>
            <input id="gtm-audience" type="text" value={form.targetAudience} onChange={(e) => update('targetAudience', e.target.value)} className={commonInput} />
          </div>
        );
      case 6:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.audienceMessaging')}</p>
            <div className="space-y-3">
              {audienceMsgOpts.map((opt) => (
                <button key={opt} type="button" onClick={() => update('audienceMessaging', opt)} className={`${optionButton} ${form.audienceMessaging === opt ? optionButtonActive : ''}`}>{t(`options.audienceMessaging.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.biggestChallenge')}</p>
            <div className="space-y-3">
              {challengeOpts.map((opt) => (
                <button key={opt} type="button" onClick={() => update('biggestChallenge', opt)} className={`${optionButton} ${form.biggestChallenge === opt ? optionButtonActive : ''}`}>{t(`options.biggestChallenge.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.currentChannels')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {channelKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleChannels(k)} className={`${optionButton} ${form.currentChannels.includes(k) ? optionButtonActive : ''}`}>{t(`options.currentChannels.${k}`)}</button>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.proofLevel')}</p>
            <div className="space-y-3">
              {proofOpts.map((opt) => (
                <button key={opt} type="button" onClick={() => update('proofLevel', opt)} className={`${optionButton} ${form.proofLevel === opt ? optionButtonActive : ''}`}>{t(`options.proofLevel.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.teamAlignment')}</p>
            <div className="space-y-3">
              {alignmentOpts.map((opt) => (
                <button key={opt} type="button" onClick={() => update('teamAlignment', opt)} className={`${optionButton} ${form.teamAlignment === opt ? optionButtonActive : ''}`}>{t(`options.teamAlignment.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="gtm-readiness-diagnostic" className="py-20 px-4 bg-gray-50" aria-labelledby="gtm-diagnostic-heading">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <h2 id="gtm-diagnostic-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
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
