'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import type { LandingPageAuditResponse, LandingPagePlanResponse, LandingPagePlannerResponse } from '@/app/api/tools/landing-page-and-ai-offer-planner/route';

const AUDIT_PAGE_GOAL = { leads: 'lead generation', meeting: 'booked meeting', demo: 'demo request', purchase: 'purchase', download: 'download', contact: 'contact request' } as const;
const AUDIT_TRAFFIC = { googleAds: 'Google Ads', linkedInAds: 'LinkedIn Ads', metaAds: 'Meta Ads', organic: 'organic search', email: 'email', social: 'social media', direct: 'direct', partner: 'partner traffic' } as const;
const AUDIT_ISSUE = { lowConversion: 'low conversion rate', dropoffs: 'too many drop-offs', unclearMessage: 'message is unclear', weakOffer: 'offer is weak', generic: 'page feels generic', trafficMismatch: 'traffic does not match the page', notSure: 'not sure' } as const;
const AUDIT_MULTIPLE = { yes: 'yes', sometimes: 'sometimes', no: 'no' } as const;
const AUDIT_TESTING = { regularly: 'yes, regularly', occasionally: 'yes, occasionally', rarely: 'rarely', no: 'no' } as const;
const AUDIT_ACTION_CLARITY = { very: 'very clear', somewhat: 'somewhat clear', unclear: 'unclear', notSure: 'not sure' } as const;

const PLAN_PAGE_GOAL = { leads: 'generate leads', meetings: 'book meetings', sell: 'sell a product or service', demo: 'promote a demo', validate: 'validate an offer', launch: 'capture interest for a new launch' } as const;
const PLAN_TRAFFIC = { paid: 'paid ads', organic: 'organic search', social: 'social media', email: 'email', outbound: 'outbound campaigns', referrals: 'referrals', notSure: 'not sure yet' } as const;
const PLAN_NEXT_ACTION = { quote: 'request a quote', call: 'book a call', demo: 'request a demo', buy: 'buy now', guide: 'get a guide or plan', diagnostic: 'complete a short diagnostic', notSure: 'not sure' } as const;
const PLAN_OFFER_CLARITY = { very: 'very clear', somewhat: 'somewhat clear', unclear: 'unclear', exploring: 'still exploring' } as const;
const PLAN_AI_INTEREST = { yes: 'yes', maybe: 'maybe', no: 'no', notSure: 'not sure what that means' } as const;

type AuditForm = {
  landingPageUrl: string;
  pageGoal: string;
  trafficSources: string[];
  biggestIssue: string;
  multipleCampaignsToSamePage: string;
  testingDiscipline: string;
  actionClarity: string;
};

type PlanForm = {
  websiteUrl: string;
  offerDescription: string;
  targetAudience: string;
  industry: string;
  mainOffer: string;
  pageGoal: string;
  trafficSources: string[];
  desiredNextAction: string;
  offerClarity: string;
  aiOfferInterest: string;
};

const initialAuditForm: AuditForm = {
  landingPageUrl: '',
  pageGoal: '',
  trafficSources: [],
  biggestIssue: '',
  multipleCampaignsToSamePage: '',
  testingDiscipline: '',
  actionClarity: '',
};

const initialPlanForm: PlanForm = {
  websiteUrl: '',
  offerDescription: '',
  targetAudience: '',
  industry: '',
  mainOffer: '',
  pageGoal: '',
  trafficSources: [],
  desiredNextAction: '',
  offerClarity: '',
  aiOfferInterest: '',
};

const AUDIT_STEPS = 7;
const PLAN_STEPS = 8;

interface Props {
  locale: string;
}

export default function LandingPageAndAiOfferPlanner({ locale }: Props) {
  const t = useTranslations('landingPageAiOfferTool');
  const [path, setPath] = useState<'audit' | 'plan' | null>(null);
  const [auditForm, setAuditForm] = useState<AuditForm>(initialAuditForm);
  const [planForm, setPlanForm] = useState<PlanForm>(initialPlanForm);
  const [step, setStep] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [quizStep, setQuizStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LandingPagePlannerResponse | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const lang = (locale === 'pt' || locale === 'fr' ? locale : 'en') as 'en' | 'pt' | 'fr';

  const updateAudit = useCallback(<K extends keyof AuditForm>(key: K, value: AuditForm[K]) => {
    setAuditForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const updatePlan = useCallback(<K extends keyof PlanForm>(key: K, value: PlanForm[K]) => {
    setPlanForm((prev) => ({ ...prev, [key]: value }));
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
      if (data.mainOffer) updatePlan('offerDescription', data.mainOffer);
      if (data.industry) updatePlan('targetAudience', data.industry);
    } catch {
      setSuggestError(t('suggestFromWebsiteError'));
    } finally {
      setSuggestLoading(false);
    }
  }, [lang, getSuggestedUrl, updatePlan, t]);

  const lastFetchedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (path !== 'plan') return;
    const raw = planForm.websiteUrl.trim();
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
  }, [path, planForm.websiteUrl, getSuggestedUrl, fetchSuggestions]);

  const toggleAuditTraffic = useCallback((value: string) => {
    setAuditForm((prev) => {
      const arr = prev.trafficSources;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, trafficSources: next };
    });
    setError(null);
  }, []);

  const togglePlanTraffic = useCallback((value: string) => {
    setPlanForm((prev) => {
      const arr = prev.trafficSources;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, trafficSources: next };
    });
    setError(null);
  }, []);

  const totalSteps = path === 'audit' ? AUDIT_STEPS : path === 'plan' ? PLAN_STEPS : 0;

  const canProceed = useCallback((): boolean => {
    if (path === 'audit') {
      switch (quizStep) {
        case 1: return !!auditForm.landingPageUrl.trim();
        case 2: return !!auditForm.pageGoal;
        case 3: return auditForm.trafficSources.length > 0;
        case 4: return !!auditForm.biggestIssue;
        case 5: return !!auditForm.multipleCampaignsToSamePage;
        case 6: return !!auditForm.testingDiscipline;
        case 7: return !!auditForm.actionClarity;
        default: return false;
      }
    }
    if (path === 'plan') {
      switch (quizStep) {
        case 1: return !suggestLoading;
        case 2: return !!planForm.pageGoal;
        case 3: return planForm.offerDescription.trim().length > 0;
        case 4: return planForm.targetAudience.trim().length > 0;
        case 5: return planForm.trafficSources.length > 0;
        case 6: return !!planForm.desiredNextAction;
        case 7: return !!planForm.offerClarity;
        case 8: return !!planForm.aiOfferInterest;
        default: return false;
      }
    }
    return false;
  }, [path, quizStep, auditForm, planForm, suggestLoading]);

  const buildAuditPayload = useCallback(() => {
    const m = { pageGoal: AUDIT_PAGE_GOAL, trafficSources: AUDIT_TRAFFIC, biggestIssue: AUDIT_ISSUE, multipleCampaignsToSamePage: AUDIT_MULTIPLE, testingDiscipline: AUDIT_TESTING, actionClarity: AUDIT_ACTION_CLARITY } as const;
    const norm = (s: string) => (!s.trim() ? s : /^https?:\/\//i.test(s) ? s : `https://${s}`);
    return {
      mode: 'audit' as const,
      language: lang,
      landingPageUrl: norm(auditForm.landingPageUrl.trim()),
      pageGoal: m.pageGoal[auditForm.pageGoal as keyof typeof m.pageGoal] ?? auditForm.pageGoal,
      trafficSources: auditForm.trafficSources.map((k) => AUDIT_TRAFFIC[k as keyof typeof AUDIT_TRAFFIC] ?? k),
      biggestIssue: m.biggestIssue[auditForm.biggestIssue as keyof typeof m.biggestIssue] ?? auditForm.biggestIssue,
      multipleCampaignsToSamePage: m.multipleCampaignsToSamePage[auditForm.multipleCampaignsToSamePage as keyof typeof m.multipleCampaignsToSamePage] ?? auditForm.multipleCampaignsToSamePage,
      testingDiscipline: m.testingDiscipline[auditForm.testingDiscipline as keyof typeof m.testingDiscipline] ?? auditForm.testingDiscipline,
      actionClarity: m.actionClarity[auditForm.actionClarity as keyof typeof m.actionClarity] ?? auditForm.actionClarity,
    };
  }, [auditForm, lang]);

  const buildPlanPayload = useCallback(() => {
    const m = { pageGoal: PLAN_PAGE_GOAL, trafficSources: PLAN_TRAFFIC, desiredNextAction: PLAN_NEXT_ACTION, offerClarity: PLAN_OFFER_CLARITY, aiOfferInterest: PLAN_AI_INTEREST } as const;
    const websiteUrl = planForm.websiteUrl.trim() ? (/^https?:\/\//i.test(planForm.websiteUrl) ? planForm.websiteUrl : `https://${planForm.websiteUrl}`) : undefined;
    return {
      mode: 'plan' as const,
      language: lang,
      websiteUrl,
      industry: planForm.industry.trim() || undefined,
      mainOffer: planForm.mainOffer.trim() || undefined,
      pageGoal: m.pageGoal[planForm.pageGoal as keyof typeof m.pageGoal] ?? planForm.pageGoal,
      offerDescription: planForm.offerDescription.trim(),
      targetAudience: planForm.targetAudience.trim(),
      trafficSources: planForm.trafficSources.map((k) => PLAN_TRAFFIC[k as keyof typeof PLAN_TRAFFIC] ?? k),
      desiredNextAction: m.desiredNextAction[planForm.desiredNextAction as keyof typeof m.desiredNextAction] ?? planForm.desiredNextAction,
      offerClarity: m.offerClarity[planForm.offerClarity as keyof typeof m.offerClarity] ?? planForm.offerClarity,
      aiOfferInterest: m.aiOfferInterest[planForm.aiOfferInterest as keyof typeof m.aiOfferInterest] ?? planForm.aiOfferInterest,
    };
  }, [planForm, lang]);

  const handleChoosePath = (p: 'audit' | 'plan') => {
    setPath(p);
    setStep('quiz');
    setQuizStep(1);
    setError(null);
    if (p === 'plan') {
      setPlanForm(initialPlanForm);
    } else {
      setAuditForm(initialAuditForm);
    }
  };

  const handleNext = useCallback(async () => {
    if (!canProceed() && (path === 'audit' ? quizStep !== AUDIT_STEPS : quizStep !== PLAN_STEPS)) return;
    const isLastStep = path === 'audit' ? quizStep === AUDIT_STEPS : quizStep === PLAN_STEPS;
    if (isLastStep) {
      setError(null);
      setStep('loading');
      try {
        const body = path === 'audit' ? buildAuditPayload() : buildPlanPayload();
        const res = await fetch('/api/tools/landing-page-and-ai-offer-planner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
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
  }, [path, quizStep, canProceed, buildAuditPayload, buildPlanPayload, t]);

  const handleBack = () => {
    if (quizStep <= 1) return;
    setQuizStep((s) => s - 1);
    setError(null);
  };

  const openChat = useCallback(() => {
    if (!result) return;
    const diagnosticContext = {
      serviceName: 'Landing Page & AI Offer',
      language: result.language,
      mode: result.mode,
      score: result.overallScore,
      resultLevel: result.resultLevel,
      summary: result.summary,
      ...(result.mode === 'audit'
        ? { topBlockers: result.topBlockers, priorityActions: result.priorityActions, landingPageUrl: auditForm.landingPageUrl }
        : { essentialTopics: (result as LandingPagePlanResponse).essentialTopics, suggestedStructure: (result as LandingPagePlanResponse).suggestedStructure, websiteUrl: planForm.websiteUrl }),
    };
    try {
      sessionStorage.setItem('sga-diagnostic-context', JSON.stringify(diagnosticContext));
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('open-sga-chat', { detail: { diagnosticContext } }));
  }, [result, auditForm.landingPageUrl, planForm.websiteUrl]);

  const downloadPdf = useCallback(() => {
    if (!result) return;
    const doc = new jsPDF();
    const isAudit = result.mode === 'audit';
    const filename = lang === 'pt' ? (isAudit ? 'relatorio-diagnostico-landing-page.pdf' : 'plano-acao-landing-page.pdf') : lang === 'fr' ? (isAudit ? 'rapport-diagnostic-landing-page.pdf' : 'plan-action-landing-page.pdf') : isAudit ? 'landing-page-diagnostic-report.pdf' : 'landing-page-action-plan.pdf';
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let yPos = margin;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt');
    const pageUrl = `${baseUrl}/${locale}/martech/landing-pages`;

    const checkPageBreak = (needed: number) => {
      if (yPos + needed > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    doc.setFontSize(18);
    doc.text(result.pdfTitle ?? (isAudit ? 'Landing page diagnostic report' : 'Landing page action plan'), margin, yPos);
    yPos += lineHeight * 2;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date().toLocaleDateString(result.language === 'pt' ? 'pt-PT' : result.language === 'fr' ? 'fr-FR' : 'en-GB'), margin, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += lineHeight * 1.5;
    doc.text(`${t('result.scoreLabel')}: ${result.overallScore}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`${t('result.resultLevelLabel')}: ${result.resultLevel}`, margin, yPos);
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

    if (result.mode === 'audit') {
      const audit = result as LandingPageAuditResponse;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(t('result.blockersLabel'), margin, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += lineHeight;
      doc.setFontSize(10);
      audit.topBlockers.forEach((b) => {
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
      audit.priorityActions.forEach((a) => {
        checkPageBreak(lineHeight * 2);
        const lines = doc.splitTextToSize(`• ${a}`, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * lineHeight + lineHeight;
      });
    } else {
      const plan = result as LandingPagePlanResponse;
      if (plan.essentialTopics?.length) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(t('result.essentialTopicsLabel'), margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;
        doc.setFontSize(10);
        plan.essentialTopics.forEach((topic) => {
          checkPageBreak(lineHeight * 2);
          const lines = doc.splitTextToSize(`• ${topic}`, contentWidth);
          doc.text(lines, margin, yPos);
          yPos += lines.length * lineHeight + lineHeight;
        });
        yPos += lineHeight;
      }
      if (plan.suggestedStructure?.length) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(t('result.structureLabel'), margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;
        doc.setFontSize(10);
        plan.suggestedStructure.forEach((s) => {
          checkPageBreak(lineHeight * 3);
          const lines = doc.splitTextToSize(`${s.section}: ${s.purpose}`, contentWidth);
          doc.text(lines, margin, yPos);
          yPos += lines.length * lineHeight + lineHeight;
        });
        yPos += lineHeight;
      }
      if (plan.copyRecommendations?.length) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(t('result.copyLabel'), margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;
        doc.setFontSize(10);
        plan.copyRecommendations.forEach((c) => {
          checkPageBreak(lineHeight * 2);
          const lines = doc.splitTextToSize(`• ${c}`, contentWidth);
          doc.text(lines, margin, yPos);
          yPos += lines.length * lineHeight + lineHeight;
        });
        yPos += lineHeight;
      }
      if (plan.offerRecommendation) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(t('result.offerRecLabel'), margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;
        doc.setFontSize(10);
        const offerLines = doc.splitTextToSize(plan.offerRecommendation, contentWidth);
        doc.text(offerLines, margin, yPos);
        yPos += offerLines.length * lineHeight + lineHeight;
      }
    }

    if (result.aiOfferRecommendation?.recommended) {
      yPos += lineHeight;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(t('result.aiOfferLabel'), margin, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += lineHeight;
      doc.setFontSize(10);
      const rec = result.aiOfferRecommendation;
      const aiLines = doc.splitTextToSize(`${rec.type}: ${rec.reason}`, contentWidth);
      doc.text(aiLines, margin, yPos);
      yPos += aiLines.length * lineHeight + lineHeight;
    }

    yPos += lineHeight;
    doc.text(result.ctaText ?? t('result.ctaButton'), margin, yPos);
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
    const levelKey = result.resultLevel;
    const levelMap = { weak: t('resultLevel.weak'), mixed: t('resultLevel.mixed'), promising: t('resultLevel.promising'), strong: t('resultLevel.strong') };
    const severityMap = { low: t('severity.low'), medium: t('severity.medium'), high: t('severity.high') } as const;
    const circumference = 2 * Math.PI * 54;
    const strokeDash = (result.overallScore / 100) * circumference;

    return (
      <section id="landing-page-ai-offer-planner" className="py-20 px-4 bg-gray-100" aria-labelledby="lp-result-heading">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h2 id="lp-result-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h2>
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
                  <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-800 ring-2 ring-violet-200">{levelMap[levelKey as keyof typeof levelMap] ?? result.resultLevel}</span>
                  <p className="text-xs text-gray-500 mt-2">{t('result.resultLevelLabel')}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }} className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-3">{t('result.summaryLabel')}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{result.summary}</p>
            </motion.div>

            {result.mode === 'audit' && (result as LandingPageAuditResponse).topBlockers.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.blockersLabel')}</h3>
                <div className="space-y-3">
                  {(result as LandingPageAuditResponse).topBlockers.map((b, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-md border border-gray-100">
                      <p className="font-semibold text-gray-900">{b.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{b.explanation}</p>
                      <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">{severityMap[b.severity]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {result.mode === 'plan' && (
              <>
                {(result as LandingPagePlanResponse).essentialTopics?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.essentialTopicsLabel')}</h3>
                    <ul className="space-y-2">
                      {(result as LandingPagePlanResponse).essentialTopics.map((topic, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-[#5b54a0] shrink-0">•</span>
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {(result as LandingPagePlanResponse).suggestedStructure?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.14 }} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.structureLabel')}</h3>
                    <div className="space-y-3">
                      {(result as LandingPagePlanResponse).suggestedStructure.map((s, i) => (
                        <div key={i} className="bg-amber-50/80 rounded-xl p-4 border border-amber-100">
                          <p className="font-semibold text-gray-900">{s.section}</p>
                          <p className="text-gray-600 text-sm mt-1">{s.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {(result as LandingPagePlanResponse).copyRecommendations?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-1">{t('result.copyLabel')}</h3>
                    <ul className="space-y-2">
                      {(result as LandingPagePlanResponse).copyRecommendations.map((c, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-[#5b54a0] shrink-0">•</span>
                          <span className="text-gray-700">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {(result as LandingPagePlanResponse).offerRecommendation && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.18 }} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-2">{t('result.offerRecLabel')}</h3>
                    <p className="text-gray-700">{(result as LandingPagePlanResponse).offerRecommendation}</p>
                  </motion.div>
                )}
              </>
            )}

            {result.mode === 'audit' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }} className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
                <h3 className="text-sm font-semibold text-[#5b54a0] uppercase tracking-wide mb-4">{t('result.actionsLabel')}</h3>
                <ol className="space-y-3">
                  {(result as LandingPageAuditResponse).priorityActions.map((a, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-[#5b54a0] text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <p className="text-gray-700 pt-1">{a}</p>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}

            {result.aiOfferRecommendation?.recommended && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-violet-50 rounded-xl p-6 border border-violet-100">
                <h3 className="text-sm font-semibold text-violet-800 uppercase tracking-wide mb-2">{t('result.aiOfferLabel')}</h3>
                <p className="font-medium text-gray-900">{result.aiOfferRecommendation.type}</p>
                <p className="text-gray-600 text-sm mt-1">{result.aiOfferRecommendation.reason}</p>
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

  const renderQuizStep = () => {
    if (path === 'audit') {
      switch (quizStep) {
        case 1:
          return (
            <div>
              <label htmlFor="lp-audit-url" className="block text-lg font-medium text-gray-900 mb-3">{t('audit.fields.landingPageUrl')}</label>
              <input id="lp-audit-url" type="url" value={auditForm.landingPageUrl} onChange={(e) => updateAudit('landingPageUrl', e.target.value)} className={commonInput} placeholder="https://" />
            </div>
          );
        case 2:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('audit.fields.pageGoal')}</p>
              <div className="space-y-3">
                {(['leads', 'meeting', 'demo', 'purchase', 'download', 'contact'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updateAudit('pageGoal', opt)} className={`${optionButton} ${auditForm.pageGoal === opt ? optionButtonActive : ''}`}>{t(`audit.options.pageGoal.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        case 3:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('audit.fields.trafficSources')}</p>
              <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
              <div className="space-y-3">
                {(['googleAds', 'linkedInAds', 'metaAds', 'organic', 'email', 'social', 'direct', 'partner'] as const).map((k) => (
                  <button key={k} type="button" onClick={() => toggleAuditTraffic(k)} className={`${optionButton} ${auditForm.trafficSources.includes(k) ? optionButtonActive : ''}`}>{t(`audit.options.traffic.${k}`)}</button>
                ))}
              </div>
            </div>
          );
        case 4:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('audit.fields.biggestIssue')}</p>
              <div className="space-y-3">
                {(['lowConversion', 'dropoffs', 'unclearMessage', 'weakOffer', 'generic', 'trafficMismatch', 'notSure'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updateAudit('biggestIssue', opt)} className={`${optionButton} ${auditForm.biggestIssue === opt ? optionButtonActive : ''}`}>{t(`audit.options.biggestIssue.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        case 5:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('audit.fields.multipleCampaignsToSamePage')}</p>
              <div className="space-y-3">
                {(['yes', 'sometimes', 'no'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updateAudit('multipleCampaignsToSamePage', opt)} className={`${optionButton} ${auditForm.multipleCampaignsToSamePage === opt ? optionButtonActive : ''}`}>{t(`audit.options.multiple.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        case 6:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('audit.fields.testingDiscipline')}</p>
              <div className="space-y-3">
                {(['regularly', 'occasionally', 'rarely', 'no'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updateAudit('testingDiscipline', opt)} className={`${optionButton} ${auditForm.testingDiscipline === opt ? optionButtonActive : ''}`}>{t(`audit.options.testing.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        case 7:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('audit.fields.actionClarity')}</p>
              <div className="space-y-3">
                {(['very', 'somewhat', 'unclear', 'notSure'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updateAudit('actionClarity', opt)} className={`${optionButton} ${auditForm.actionClarity === opt ? optionButtonActive : ''}`}>{t(`audit.options.actionClarity.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    if (path === 'plan') {
      switch (quizStep) {
        case 1:
          return (
            <div>
              <label htmlFor="lp-plan-website" className="block text-lg font-medium text-gray-900 mb-3">{t('plan.fields.websiteUrl')}</label>
              <input id="lp-plan-website" type="url" value={planForm.websiteUrl} onChange={(e) => updatePlan('websiteUrl', e.target.value)} className={commonInput} placeholder="https://" />
              <p className="text-sm text-gray-500 mt-1">{t('plan.fields.websiteUrlHint')}</p>
              {suggestLoading && <p className="text-sm text-gray-500 mt-2">{t('suggestFromWebsiteLoading')}</p>}
              {suggestError && <p className="text-sm text-amber-600 mt-2">{suggestError}</p>}
            </div>
          );
        case 2:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('plan.fields.pageGoal')}</p>
              <div className="space-y-3">
                {(['leads', 'meetings', 'sell', 'demo', 'validate', 'launch'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updatePlan('pageGoal', opt)} className={`${optionButton} ${planForm.pageGoal === opt ? optionButtonActive : ''}`}>{t(`plan.options.pageGoal.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        case 3:
          return (
            <div>
              <label htmlFor="lp-plan-offer" className="block text-lg font-medium text-gray-900 mb-3">{t('plan.fields.offerDescription')}</label>
              <input id="lp-plan-offer" type="text" value={planForm.offerDescription} onChange={(e) => updatePlan('offerDescription', e.target.value)} className={commonInput} />
            </div>
          );
        case 4:
          return (
            <div>
              <label htmlFor="lp-plan-audience" className="block text-lg font-medium text-gray-900 mb-3">{t('plan.fields.targetAudience')}</label>
              <input id="lp-plan-audience" type="text" value={planForm.targetAudience} onChange={(e) => updatePlan('targetAudience', e.target.value)} className={commonInput} />
            </div>
          );
        case 5:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('plan.fields.trafficSources')}</p>
              <p className="text-sm text-gray-500 mb-3">{t('selectAllApply')}</p>
              <div className="space-y-3">
                {(['paid', 'organic', 'social', 'email', 'outbound', 'referrals', 'notSure'] as const).map((k) => (
                  <button key={k} type="button" onClick={() => togglePlanTraffic(k)} className={`${optionButton} ${planForm.trafficSources.includes(k) ? optionButtonActive : ''}`}>{t(`plan.options.traffic.${k}`)}</button>
                ))}
              </div>
            </div>
          );
        case 6:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('plan.fields.desiredNextAction')}</p>
              <div className="space-y-3">
                {(['quote', 'call', 'demo', 'buy', 'guide', 'diagnostic', 'notSure'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updatePlan('desiredNextAction', opt)} className={`${optionButton} ${planForm.desiredNextAction === opt ? optionButtonActive : ''}`}>{t(`plan.options.nextAction.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        case 7:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('plan.fields.offerClarity')}</p>
              <div className="space-y-3">
                {(['very', 'somewhat', 'unclear', 'exploring'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updatePlan('offerClarity', opt)} className={`${optionButton} ${planForm.offerClarity === opt ? optionButtonActive : ''}`}>{t(`plan.options.offerClarity.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        case 8:
          return (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-4">{t('plan.fields.aiOfferInterest')}</p>
              <div className="space-y-3">
                {(['yes', 'maybe', 'no', 'notSure'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => updatePlan('aiOfferInterest', opt)} className={`${optionButton} ${planForm.aiOfferInterest === opt ? optionButtonActive : ''}`}>{t(`plan.options.aiInterest.${opt}`)}</button>
                ))}
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    return null;
  };

  if (step === 'start' && !path) {
    return (
      <section id="landing-page-ai-offer-planner" className="py-20 px-4 bg-gray-50" aria-labelledby="lp-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="lp-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-xl text-gray-600 mb-8">{t('subtitle')}</p>
          <p className="text-lg font-medium text-gray-900 mb-6">{t('choosePath')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button type="button" onClick={() => handleChoosePath('audit')} className="px-8 py-4 bg-[#5b54a0] text-white rounded-xl hover:bg-[#4a4480] transition-colors font-semibold text-lg shadow-lg">
              {t('pathAudit')}
            </button>
            <button type="button" onClick={() => handleChoosePath('plan')} className="px-8 py-4 border-2 border-[#5b54a0] text-[#5b54a0] rounded-xl hover:bg-[#5b54a0]/5 transition-colors font-semibold text-lg">
              {t('pathPlan')}
            </button>
          </div>
          <div className="flex justify-center gap-4 mt-6 text-sm text-gray-500">
            <span>{t('freeLabel')}</span><span>·</span><span>{t('noSignup')}</span>
          </div>
        </div>
      </section>
    );
  }

  if (step === 'quiz' && path) {
    const isLastStep = path === 'audit' ? quizStep === AUDIT_STEPS : quizStep === PLAN_STEPS;
    const disableNext = path === 'plan' && quizStep === 1 && suggestLoading;

    return (
      <section id="landing-page-ai-offer-planner" className="py-20 px-4 bg-gray-50" aria-labelledby="lp-quiz-heading">
        <div className="max-w-3xl mx-auto">
          <motion.div key={`quiz-${path}-${quizStep}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500">{t('stepOf')} {quizStep} {t('of')} {totalSteps}</span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
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
              <button type="button" onClick={handleNext} disabled={!canProceed() || disableNext} aria-disabled={disableNext} className="ml-auto px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors font-medium">
                {isLastStep ? t('submit') : t('next')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (step === 'loading') {
    return (
      <section id="landing-page-ai-offer-planner" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-12 shadow-2xl text-center">
            <div className="inline-block w-10 h-10 border-2 border-[#5b54a0] border-t-transparent rounded-full animate-spin mb-4" aria-hidden />
            <p className="text-lg text-gray-700">{t('loading')}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return null;
}
