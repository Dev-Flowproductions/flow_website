'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import type { AiAgentOpportunityResponse } from '@/app/api/tools/ai-agent-opportunity-diagnostic/route';

const API_VALUES = {
  weeklyInboundVolume: {
    under10: 'less than 10',
    '10to50': '10 to 50',
    '50to200': '50 to 200',
    over200: 'more than 200',
  },
  overloadedAreas: {
    recurring: 'answering recurring questions',
    qualifying: 'qualifying leads',
    followUp: 'follow-up after first contact',
    admin: 'internal admin tasks',
    support: 'support or customer service',
    routing: 'routing requests to the right person',
    summarising: 'summarising meetings or conversations',
  },
  currentHandlingState: {
    manual: 'a person handles it manually from start to finish',
    partial: 'there is a partial process, but it is inconsistent',
    someAutomation: 'there is some automation, but it lacks context',
    notSure: 'not sure',
  },
  ruleClarity: {
    very: 'very clearly defined',
    partly: 'partly defined',
    informal: 'mostly informal',
    notDefined: 'not defined',
  },
  consistencyNeeds: {
    website: 'website and inbound questions',
    leadQual: 'lead qualification',
    support: 'support responses',
    internal: 'internal team requests',
    followUp: 'follow-up communication',
    handoff: 'handoff to sales',
  },
  biggestChallenge: {
    slowResponse: 'slow response time',
    poorQuality: 'poor lead quality',
    repetitive: 'too much repetitive work',
    inconsistent: 'inconsistent information',
    missedFollowUp: 'missed follow-up',
    manualRouting: 'too much manual routing',
    aiRisk: 'concern about AI risk or loss of control',
  },
  handoffImportance: {
    essential: 'essential in many cases',
    important: 'important in some cases',
    occasional: 'only needed occasionally',
    notSure: 'not sure',
  },
  knowledgeReadiness: {
    organised: 'yes, well organised',
    scattered: 'yes, but scattered',
    limited: 'very limited',
    no: 'no',
  },
  firstPhasePriority: {
    savingTime: 'saving time',
    leadQuality: 'improving lead quality',
    responseSpeed: 'improving response speed',
    reducingInconsistency: 'reducing inconsistency',
    reducingRisk: 'reducing operational risk',
  },
} as const;

type FormState = {
  websiteUrl: string;
  industry: string;
  mainOffer: string;
  weeklyInboundVolume: string;
  overloadedAreas: string[];
  currentHandlingState: string;
  ruleClarity: string;
  consistencyNeeds: string[];
  biggestChallenge: string;
  handoffImportance: string;
  knowledgeReadiness: string;
  firstPhasePriority: string;
};

const initialForm: FormState = {
  websiteUrl: '',
  industry: '',
  mainOffer: '',
  weeklyInboundVolume: '',
  overloadedAreas: [],
  currentHandlingState: '',
  ruleClarity: '',
  consistencyNeeds: [],
  biggestChallenge: '',
  handoffImportance: '',
  knowledgeReadiness: '',
  firstPhasePriority: '',
};

const TOTAL_STEPS = 10;

interface Props {
  locale: string;
}

export default function AiAgentOpportunityDiagnostic({ locale }: Props) {
  const t = useTranslations('aiAgentOpportunityTool');
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [quizStep, setQuizStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiAgentOpportunityResponse | null>(null);
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

  const toggleOverloaded = useCallback((value: string) => {
    setForm((prev) => {
      const arr = prev.overloadedAreas;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, overloadedAreas: next };
    });
    setError(null);
  }, []);

  const toggleConsistency = useCallback((value: string) => {
    setForm((prev) => {
      const arr = prev.consistencyNeeds;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, consistencyNeeds: next };
    });
    setError(null);
  }, []);

  const buildPayload = useCallback(() => {
    const m = API_VALUES as Record<string, Record<string, string>>;
    const websiteUrlNorm = form.websiteUrl.trim()
      ? (/^https?:\/\//i.test(form.websiteUrl) ? form.websiteUrl.trim() : `https://${form.websiteUrl.trim()}`)
      : undefined;
    return {
      language: lang,
      websiteUrl: websiteUrlNorm,
      industry: form.industry.trim() || undefined,
      mainOffer: form.mainOffer.trim() || undefined,
      weeklyInboundVolume: m.weeklyInboundVolume[form.weeklyInboundVolume] ?? form.weeklyInboundVolume,
      overloadedAreas: form.overloadedAreas.map((k) => m.overloadedAreas[k] ?? k),
      currentHandlingState: m.currentHandlingState[form.currentHandlingState] ?? form.currentHandlingState,
      ruleClarity: m.ruleClarity[form.ruleClarity] ?? form.ruleClarity,
      consistencyNeeds: form.consistencyNeeds.map((k) => m.consistencyNeeds[k] ?? k),
      biggestChallenge: m.biggestChallenge[form.biggestChallenge] ?? form.biggestChallenge,
      handoffImportance: m.handoffImportance[form.handoffImportance] ?? form.handoffImportance,
      knowledgeReadiness: m.knowledgeReadiness[form.knowledgeReadiness] ?? form.knowledgeReadiness,
      firstPhasePriority: m.firstPhasePriority[form.firstPhasePriority] ?? form.firstPhasePriority,
    };
  }, [form, lang]);

  const canProceed = useCallback((): boolean => {
    switch (quizStep) {
      case 1:
        return !suggestLoading;
      case 2:
        return !!form.weeklyInboundVolume;
      case 3:
        return form.overloadedAreas.length > 0;
      case 4:
        return !!form.currentHandlingState;
      case 5:
        return !!form.ruleClarity;
      case 6:
        return form.consistencyNeeds.length > 0;
      case 7:
        return !!form.biggestChallenge;
      case 8:
        return !!form.handoffImportance;
      case 9:
        return !!form.knowledgeReadiness;
      case 10:
        return !!form.firstPhasePriority;
      default:
        return false;
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
        const res = await fetch('/api/tools/ai-agent-opportunity-diagnostic', {
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
      serviceName: 'AI Agent Opportunity Diagnostic',
      language: result.language,
      score: result.overallScore,
      readinessLevel: result.readinessLevel,
      topOpportunityAreas: result.topOpportunityAreas,
      recommendedAgents: result.recommendedAgents,
      implementationPriorities: result.implementationPriorities,
      summary: result.summary,
      website: form.websiteUrl,
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
    const filename = lang === 'pt' ? 'relatorio-diagnostico-oportunidades-ai-agents.pdf' : lang === 'fr' ? 'rapport-diagnostic-opportunites-ai-agents.pdf' : 'ai-agent-opportunity-diagnostic-report.pdf';
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let yPos = margin;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt');
    const pageUrl = `${baseUrl}/${locale}/martech/ai-agents`;

    const checkPageBreak = (needed: number) => {
      if (yPos + needed > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    doc.setFontSize(18);
    const pdfTitle = result.pdfTitle ?? 'AI agent opportunity diagnostic report';
    const titleLines = doc.splitTextToSize(pdfTitle, contentWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * lineHeight * 1.5 + lineHeight * 0.5;
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
    doc.text(t('result.opportunitiesLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    result.topOpportunityAreas.forEach((o) => {
      checkPageBreak(lineHeight * 3);
      const lines = doc.splitTextToSize(`• ${o.title}: ${o.explanation}`, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + lineHeight;
    });
    yPos += lineHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.recommendedAgentsLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    result.recommendedAgents.forEach((a) => {
      checkPageBreak(lineHeight * 5);
      doc.setFont('helvetica', 'bold');
      doc.text(a.agentName, margin, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += lineHeight;
      const doLines = doc.splitTextToSize(a.whatItWouldDo, contentWidth);
      doc.text(doLines, margin, yPos);
      yPos += doLines.length * lineHeight + lineHeight;
      if (a.whatItNeeds?.length) {
        doc.text(a.whatItNeeds.map((n) => `• ${n}`).join('\n'), margin, yPos);
        yPos += a.whatItNeeds.length * lineHeight + lineHeight;
      }
      yPos += lineHeight;
    });
    yPos += lineHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('result.prioritiesLabel'), margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;
    doc.setFontSize(10);
    result.implementationPriorities.forEach((p) => {
      checkPageBreak(lineHeight * 2);
      const lines = doc.splitTextToSize(`• ${p}`, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + lineHeight;
    });
    yPos += lineHeight;

    if (result.governanceNote) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(t('result.governanceLabel'), margin, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += lineHeight;
      doc.setFontSize(10);
      const govLines = doc.splitTextToSize(result.governanceNote, contentWidth);
      doc.text(govLines, margin, yPos);
      yPos += govLines.length * lineHeight + lineHeight;
    }

    yPos += lineHeight;
    doc.text(result.ctaText ?? t('result.ctaButton'), margin, yPos);
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

  if (step === 'result' && result) {
    const readinessKey = result.readinessLevel.replace(/\s+/g, '');
    const readinessMap: Record<string, string> = {
      early: t('readinessLevel.early'),
      emerging: t('readinessLevel.emerging'),
      readytopilot: t('readinessLevel.readyToPilot'),
      readytoimplement: t('readinessLevel.readyToImplement'),
    };
    const circumference = 2 * Math.PI * 54;
    const strokeDash = (result.overallScore / 100) * circumference;

    return (
      <section id="ai-agent-opportunity-diagnostic" className="py-20 px-4 bg-gray-100" aria-labelledby="ai-agent-result-heading">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h2 id="ai-agent-result-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h2>
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
                  <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-800 ring-2 ring-violet-200">{readinessMap[readinessKey] ?? result.readinessLevel}</span>
                  <p className="text-xs text-gray-500 mt-2">{t('result.readinessLabel')}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }} className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-3">{t('result.summaryLabel')}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{result.summary}</p>
            </motion.div>
            {result.topOpportunityAreas.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.opportunitiesLabel')}</h3>
                <div className="space-y-3">
                  {result.topOpportunityAreas.map((o, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-md border border-gray-100">
                      <p className="font-semibold text-gray-900">{o.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{o.explanation}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {result.recommendedAgents.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.recommendedAgentsLabel')}</h3>
                <div className="space-y-4">
                  {result.recommendedAgents.map((a, i) => (
                    <div key={i} className="bg-violet-50/80 rounded-xl p-5 border border-violet-100">
                      <p className="font-semibold text-violet-900">{a.agentName}</p>
                      <p className="text-gray-700 text-sm mt-1">{a.whatItWouldDo}</p>
                      <p className="text-gray-600 text-sm mt-2">{a.whyItFits}</p>
                      {a.whatItNeeds?.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                          {a.whatItNeeds.map((n, j) => (
                            <li key={j}>{n}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-4">{t('result.prioritiesLabel')}</h3>
              <ol className="space-y-3">
                {result.implementationPriorities.map((p, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#5b54a0] text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <p className="text-gray-700 pt-1">{p}</p>
                  </li>
                ))}
              </ol>
            </motion.div>
            {result.governanceNote && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.22 }} className="bg-amber-50/80 rounded-xl p-6 border border-amber-100">
                <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide mb-2">{t('result.governanceLabel')}</h3>
                <p className="text-gray-700 text-sm">{result.governanceNote}</p>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.24 }} className="bg-[#5b54a0] rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-[#5b54a0]/20">
              <p className="text-white/90 text-center mb-6 text-lg font-medium">{result.ctaText ?? t('result.ctaButton')}</p>
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

  const overloadedKeys = ['recurring', 'qualifying', 'followUp', 'admin', 'support', 'routing', 'summarising'] as const;
  const consistencyKeys = ['website', 'leadQual', 'support', 'internal', 'followUp', 'handoff'] as const;

  const renderQuizStep = () => {
    switch (quizStep) {
      case 1:
        return (
          <div>
            <label htmlFor="ai-agent-website" className="block text-lg font-medium text-gray-900 mb-3">{t('fields.websiteUrl')}</label>
            <input id="ai-agent-website" type="url" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} className={commonInput} placeholder="https://" />
            <p className="text-sm text-gray-500 mt-1">{t('fields.websiteUrlHint')}</p>
            {suggestLoading && <p className="text-sm text-gray-500 mt-2">{t('suggestFromWebsiteLoading')}</p>}
            {suggestError && <p className="text-sm text-amber-600 mt-2">{suggestError}</p>}
          </div>
        );
      case 2:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.weeklyInboundVolume')}</p>
            <div className="space-y-3">
              {(['under10', '10to50', '50to200', 'over200'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('weeklyInboundVolume', opt)} className={`${optionButton} ${form.weeklyInboundVolume === opt ? optionButtonActive : ''}`}>{t(`options.weeklyInboundVolume.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.overloadedAreas')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {overloadedKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleOverloaded(k)} className={`${optionButton} ${form.overloadedAreas.includes(k) ? optionButtonActive : ''}`}>{t(`options.overloadedAreas.${k}`)}</button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.currentHandlingState')}</p>
            <div className="space-y-3">
              {(['manual', 'partial', 'someAutomation', 'notSure'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('currentHandlingState', opt)} className={`${optionButton} ${form.currentHandlingState === opt ? optionButtonActive : ''}`}>{t(`options.currentHandlingState.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.ruleClarity')}</p>
            <div className="space-y-3">
              {(['very', 'partly', 'informal', 'notDefined'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('ruleClarity', opt)} className={`${optionButton} ${form.ruleClarity === opt ? optionButtonActive : ''}`}>{t(`options.ruleClarity.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.consistencyNeeds')}</p>
            <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
            <div className="space-y-3">
              {consistencyKeys.map((k) => (
                <button key={k} type="button" onClick={() => toggleConsistency(k)} className={`${optionButton} ${form.consistencyNeeds.includes(k) ? optionButtonActive : ''}`}>{t(`options.consistencyNeeds.${k}`)}</button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.biggestChallenge')}</p>
            <div className="space-y-3">
              {(['slowResponse', 'poorQuality', 'repetitive', 'inconsistent', 'missedFollowUp', 'manualRouting', 'aiRisk'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('biggestChallenge', opt)} className={`${optionButton} ${form.biggestChallenge === opt ? optionButtonActive : ''}`}>{t(`options.biggestChallenge.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.handoffImportance')}</p>
            <div className="space-y-3">
              {(['essential', 'important', 'occasional', 'notSure'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('handoffImportance', opt)} className={`${optionButton} ${form.handoffImportance === opt ? optionButtonActive : ''}`}>{t(`options.handoffImportance.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.knowledgeReadiness')}</p>
            <div className="space-y-3">
              {(['organised', 'scattered', 'limited', 'no'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('knowledgeReadiness', opt)} className={`${optionButton} ${form.knowledgeReadiness === opt ? optionButtonActive : ''}`}>{t(`options.knowledgeReadiness.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{t('fields.firstPhasePriority')}</p>
            <div className="space-y-3">
              {(['savingTime', 'leadQuality', 'responseSpeed', 'reducingInconsistency', 'reducingRisk'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => update('firstPhasePriority', opt)} className={`${optionButton} ${form.firstPhasePriority === opt ? optionButtonActive : ''}`}>{t(`options.firstPhasePriority.${opt}`)}</button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="ai-agent-opportunity-diagnostic" className="py-20 px-4 bg-gray-50" aria-labelledby="ai-agent-diagnostic-heading">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <h2 id="ai-agent-diagnostic-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
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
