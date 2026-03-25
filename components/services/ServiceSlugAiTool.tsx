'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import type { ServiceSlugAssessmentResponse } from '@/app/api/tools/service-slug-assessment/route';
import type { ServicePageSlug } from '@/lib/serviceItemRoutes';
import { getServicosAiSectionIdForSlug } from '@/lib/servicePagesMessages';
import { getServiceSlugDiagnostic } from '@/lib/serviceSlugDiagnostics/registry';
import type { SlugSelectBlock } from '@/lib/serviceSlugDiagnostics/types';
import {
  getServiceAiChrome,
  normalizeServiceAiLocale,
  type ServiceAiLocale,
} from '@/lib/serviceCategoryAiCopy';

const TOTAL_STEPS = 7;

interface Props {
  locale: string;
  serviceSlug: ServicePageSlug;
  serviceTitle: string;
}

type FormState = {
  websiteUrl: string;
  noWebsite: boolean;
  companyContext: string;
  industry: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
};

const initialForm: FormState = {
  websiteUrl: '',
  noWebsite: false,
  companyContext: '',
  industry: '',
  q1: null,
  q2: null,
  q3: null,
  q4: null,
};

export default function ServiceSlugAiTool({ locale, serviceSlug, serviceTitle }: Props) {
  const lang = normalizeServiceAiLocale(locale) as ServiceAiLocale;
  const chrome = getServiceAiChrome(locale);
  const def = getServiceSlugDiagnostic(serviceSlug);
  const sectionId = getServicosAiSectionIdForSlug(serviceSlug);

  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [quizStep, setQuizStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ServiceSlugAssessmentResponse | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const useWebsiteSuggest = def.useWebsiteSuggest;

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

  const fetchSuggestions = useCallback(
    async (websiteUrl: string) => {
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
        if (data.mainOffer) {
          setForm((prev) => ({
            ...prev,
            companyContext: prev.companyContext.trim() ? prev.companyContext : String(data.mainOffer),
          }));
        }
        autoAdvanceAfterSuggestRef.current = true;
      } catch {
        setSuggestError(chrome.suggestFromWebsiteError);
      } finally {
        setSuggestLoading(false);
      }
    },
    [lang, getSuggestedUrl, update, chrome.suggestFromWebsiteError]
  );

  const lastFetchedUrl = useRef<string | null>(null);
  const autoAdvanceAfterSuggestRef = useRef(false);

  useEffect(() => {
    if (!useWebsiteSuggest || form.noWebsite) return;
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
  }, [form.websiteUrl, form.noWebsite, getSuggestedUrl, fetchSuggestions, useWebsiteSuggest]);

  useEffect(() => {
    if (
      !suggestLoading &&
      autoAdvanceAfterSuggestRef.current &&
      step === 'quiz' &&
      quizStep === 1 &&
      !suggestError
    ) {
      autoAdvanceAfterSuggestRef.current = false;
      setQuizStep(2);
    }
  }, [suggestLoading, step, quizStep, suggestError]);

  const buildPayload = useCallback(() => {
    return {
      language: lang,
      serviceSlug,
      serviceTitle,
      websiteUrl: form.noWebsite ? undefined : form.websiteUrl.trim() || undefined,
      companyContext: form.companyContext.trim(),
      industry: form.industry.trim(),
      q1: form.q1 ?? 0,
      q2: form.q2 ?? 0,
      q3: form.q3 ?? 0,
      q4: form.q4 ?? 0,
    };
  }, [form, lang, serviceSlug, serviceTitle]);

  const canProceed = useCallback((): boolean => {
    switch (quizStep) {
      case 1:
        return form.noWebsite || form.websiteUrl.trim().length > 0;
      case 2:
        return form.companyContext.trim().length >= 8;
      case 3:
        return form.industry.trim().length >= 2;
      case 4:
        return form.q1 !== null;
      case 5:
        return form.q2 !== null;
      case 6:
        return form.q3 !== null;
      case 7:
        return form.q4 !== null;
      default:
        return false;
    }
  }, [quizStep, form]);

  const handleStart = () => {
    setStep('quiz');
    setQuizStep(1);
    setError(null);
  };

  const handleNext = useCallback(async () => {
    if (!canProceed()) return;
    if (quizStep === TOTAL_STEPS) {
      setError(null);
      setStep('loading');
      try {
        const res = await fetch('/api/tools/service-slug-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload()),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        setResult(data);
        setStep('result');
      } catch {
        setError(chrome.errorSubmit);
        setStep('quiz');
      }
      return;
    }
    setQuizStep((s) => s + 1);
  }, [quizStep, canProceed, buildPayload, chrome.errorSubmit]);

  const handleBack = () => {
    if (quizStep <= 1) return;
    setQuizStep((s) => s - 1);
    setError(null);
  };

  const openChat = useCallback(() => {
    if (!result) return;
    const diagnosticContext = {
      serviceName: serviceTitle,
      serviceSlug,
      category: def.category,
      language: result.language,
      score: result.overallScore,
      maturityLevel: result.maturityLevel,
      topFrictionPoints: result.topFrictionPoints,
      priorityActions: result.priorityActions,
      summary: result.summary,
      userWebsite: form.websiteUrl,
    };
    try {
      sessionStorage.setItem('sga-diagnostic-context', JSON.stringify(diagnosticContext));
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('open-sga-chat', { detail: { diagnosticContext } }));
  }, [result, serviceTitle, serviceSlug, def.category, form.websiteUrl]);

  const downloadPdf = useCallback(() => {
    if (!result) return;
    const doc = new jsPDF();
    const filename = chrome.pdfFilename;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    const smallLine = 5;
    let yPos = margin;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://flowproductions.pt';
    const pageUrl = `${baseUrl}/${locale}/servicos/${serviceSlug}`;

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
    doc.text(
      new Date().toLocaleDateString(result.language === 'pt' ? 'pt-PT' : result.language === 'fr' ? 'fr-FR' : 'en-GB'),
      margin,
      yPos
    );
    doc.setTextColor(0, 0, 0);
    yPos += lineHeight * 1.5;

    doc.text(`${chrome.result.scoreLabel}: ${result.overallScore}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`${chrome.result.maturityLabel}: ${result.maturityLevel}`, margin, yPos);
    yPos += lineHeight * 1.5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(chrome.result.summaryLabel, margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * lineHeight + lineHeight;

    if (result.topFrictionPoints.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(chrome.result.frictionsLabel, margin, yPos);
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
    }

    if (result.demandLeaks.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(chrome.result.leaksLabel, margin, yPos);
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
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(chrome.result.actionsLabel, margin, yPos);
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

    doc.text(result.ctaText || chrome.result.ctaButton, margin, yPos);
    yPos += lineHeight * 2;

    checkPageBreak(lineHeight * 4);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(pageUrl, margin, yPos);
    yPos += lineHeight * 2;

    const sgaUrl = 'https://sga.flowproductions.pt/';
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const hintLines = doc.splitTextToSize(chrome.result.pdfCtaHint, contentWidth);
    doc.text(hintLines, margin, yPos);
    yPos += hintLines.length * lineHeight + lineHeight * 0.5;
    const btnW = 72;
    const btnH = 11;
    const radius = 5;
    doc.setFillColor(91, 84, 160);
    doc.roundedRect(margin, yPos, btnW, btnH, radius, radius, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(chrome.result.pdfCtaButton, margin + btnW / 2, yPos + btnH / 2 + 1.5, { align: 'center' });
    doc.link(margin, yPos, btnW, btnH, { url: sgaUrl });
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    doc.save(filename);
  }, [result, chrome, locale, serviceSlug]);

  if (step === 'result' && result) {
    const maturityMap = {
      early: chrome.maturity.early,
      emerging: chrome.maturity.emerging,
      structured: chrome.maturity.structured,
      advanced: chrome.maturity.advanced,
    };
    const maturityKey = result.maturityLevel as keyof typeof maturityMap;
    const severityMap = { low: chrome.severity.low, medium: chrome.severity.medium, high: chrome.severity.high } as const;
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
      <section id={sectionId} className="py-20 px-4 bg-gray-100" aria-labelledby="servicos-ai-result-heading">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h2 id="servicos-ai-result-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                {chrome.title}
              </h2>
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
                    {result.overallScore}
                    <span className="text-lg font-medium text-gray-400">/100</span>
                  </span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{chrome.result.scoreLabel}</p>
                  <span
                    className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-semibold ring-2 ${style.bg} ${style.text} ${style.ring}`}
                  >
                    {maturityMap[maturityKey] ?? result.maturityLevel}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">{chrome.result.maturityLabel}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100"
            >
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-3">{chrome.result.summaryLabel}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{result.summary}</p>
            </motion.div>

            {result.topFrictionPoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{chrome.result.frictionsLabel}</h3>
                <div className="space-y-3">
                  {result.topFrictionPoints.map((f, i) => {
                    const sev = severityStyles[f.severity] ?? severityStyles.medium;
                    return (
                      <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-md shadow-gray-200/30 border border-gray-100 flex gap-4">
                        <span
                          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${sev.bg} ${sev.text}`}
                        >
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

            {result.demandLeaks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{chrome.result.leaksLabel}</h3>
                <div className="space-y-3">
                  {result.demandLeaks.map((l, i) => (
                    <div key={i} className="bg-amber-50/80 rounded-xl p-4 md:p-5 border border-amber-100 flex gap-4">
                      <span
                        className="shrink-0 w-8 h-8 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-800"
                        aria-hidden
                      >
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

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg shadow-gray-200/40 p-6 md:p-8 border border-gray-100"
            >
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-4">{chrome.result.actionsLabel}</h3>
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

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.24 }}
              className="bg-[#5b54a0] rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-[#5b54a0]/20"
            >
              <p className="text-white/90 text-center mb-6 text-lg font-medium">{result.ctaText || chrome.result.ctaButton}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={openChat}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#5b54a0] rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {chrome.result.ctaButton}
                </button>
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="w-full sm:w-auto px-8 py-3.5 border-2 border-white/80 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
                >
                  {chrome.result.downloadPdf}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const commonInput =
    'w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#5b54a0] focus:border-[#5b54a0]';
  const optionButton =
    'w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-[#5b54a0] hover:bg-[#5b54a0]/5 transition-all text-gray-700 font-medium text-sm';
  const optionButtonActive = 'border-[#5b54a0] bg-[#5b54a0]/10';

  const renderSelectBlock = (field: keyof Pick<FormState, 'q1' | 'q2' | 'q3' | 'q4'>, block: SlugSelectBlock) => (
    <div>
      <p className="block text-lg font-medium text-gray-900 mb-4">{block.label[lang]}</p>
      <div className="space-y-2">
        {block.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => update(field, idx)}
            className={`${optionButton} ${form[field] === idx ? optionButtonActive : ''}`}
          >
            {opt[lang]}
          </button>
        ))}
      </div>
    </div>
  );

  const renderQuizStep = () => {
    switch (quizStep) {
      case 1:
        return (
          <div className="space-y-4">
            <label htmlFor="svc-website" className="block text-lg font-medium text-gray-900">
              {chrome.fields.websiteUrl}
            </label>
            <input
              id="svc-website"
              type="url"
              disabled={form.noWebsite}
              value={form.websiteUrl}
              onChange={(e) => update('websiteUrl', e.target.value)}
              className={`${commonInput} disabled:opacity-50`}
              placeholder="https://"
            />
            {useWebsiteSuggest && suggestLoading && (
              <p className="text-sm text-gray-500 flex items-center gap-2">{chrome.suggestFromWebsiteLoading}</p>
            )}
            {useWebsiteSuggest && suggestError && <p className="text-sm text-amber-600">{suggestError}</p>}
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input type="checkbox" checked={form.noWebsite} onChange={(e) => update('noWebsite', e.target.checked)} />
              {chrome.fields.noWebsite}
            </label>
          </div>
        );
      case 2:
        return (
          <div>
            <label htmlFor="svc-context" className="block text-lg font-medium text-gray-900 mb-3">
              {chrome.fields.companyContext}
            </label>
            <textarea
              id="svc-context"
              rows={4}
              value={form.companyContext}
              onChange={(e) => update('companyContext', e.target.value)}
              className={commonInput}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <label htmlFor="svc-industry" className="block text-lg font-medium text-gray-900 mb-3">
              {chrome.fields.industry}
            </label>
            <input
              id="svc-industry"
              type="text"
              value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
              className={commonInput}
            />
          </div>
        );
      case 4:
        return renderSelectBlock('q1', def.selects[0]);
      case 5:
        return renderSelectBlock('q2', def.selects[1]);
      case 6:
        return renderSelectBlock('q3', def.selects[2]);
      case 7:
        return renderSelectBlock('q4', def.selects[3]);
      default:
        return null;
    }
  };

  const startSubtitleResolved = chrome.startHeroSubtitle.replaceAll('{service}', serviceTitle);

  return (
    <section
      id={sectionId}
      className="py-20 px-4 bg-gray-50"
      aria-labelledby={step === 'start' ? 'servicos-diagnostic-heading' : undefined}
    >
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 id="servicos-diagnostic-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {chrome.startHeroTitle}
              </h2>
              <p className="text-xl text-gray-600 mb-8">{startSubtitleResolved}</p>
              <div className="flex justify-center gap-6 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#5b54a0]">{TOTAL_STEPS}</div>
                  <div className="text-sm text-gray-500">{chrome.startQuestionsLabel}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStart}
                className="px-10 py-4 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-semibold text-lg shadow-lg"
              >
                {chrome.startButton}
              </button>
              <div className="flex justify-center gap-4 mt-6 text-sm text-gray-500">
                <span>{chrome.startFreeLabel}</span>
                <span aria-hidden>·</span>
                <span>{chrome.startNoSignup}</span>
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
                <span className="text-sm text-gray-500">
                  {chrome.stepOf} {quizStep} {chrome.of} {TOTAL_STEPS}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-1 rounded-full ${
                        i + 1 < quizStep ? 'bg-[#5b54a0]' : i + 1 === quizStep ? 'bg-[#5b54a0]/50' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={quizStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-h-[200px]"
                >
                  {renderQuizStep()}
                </motion.div>
              </AnimatePresence>
              {error && (
                <p className="mt-4 text-red-600 text-sm" role="alert">
                  {error}
                </p>
              )}
              <div className="flex gap-3 mt-8">
                {quizStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full hover:border-gray-400 transition-colors font-medium"
                  >
                    {chrome.back}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed() || (quizStep === 1 && useWebsiteSuggest && suggestLoading)}
                  aria-disabled={quizStep === 1 && useWebsiteSuggest && suggestLoading}
                  className="ml-auto px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors font-medium"
                >
                  {quizStep === TOTAL_STEPS ? chrome.submitButton : chrome.next}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-12 shadow-2xl text-center"
            >
              <div
                className="inline-block w-10 h-10 border-2 border-[#5b54a0] border-t-transparent rounded-full animate-spin mb-4"
                aria-hidden
              />
              <p className="text-lg text-gray-700">{chrome.loading}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
