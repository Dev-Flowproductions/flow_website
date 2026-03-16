'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  options: { label: string; score: number }[];
}

interface DiagnosticProps {
  locale: string;
}

const questions: Record<string, Question[]> = {
  pt: [
    {
      id: 'single_action',
      question: 'A tua landing page está focada numa única acção (uma oferta, um botão, um objectivo)?',
      options: [
        { label: 'Sim — uma acção clara, sem distrações', score: 3 },
        { label: 'Mais ou menos — temos a acção principal mas também alguns links e opções', score: 2 },
        { label: 'Não — a página tem vários CTAs e opções diferentes', score: 1 },
      ],
    },
    {
      id: 'message_match',
      question: 'A mensagem do anúncio ou da campanha está alinhada com o que a pessoa vê na landing page?',
      options: [
        { label: 'Sim — headline e oferta reflectem exactamente o que prometemos no anúncio', score: 3 },
        { label: 'Parcialmente — há algum alinhamento mas a mensagem muda', score: 2 },
        { label: 'Não — as pessoas chegam a uma página genérica independentemente do anúncio', score: 1 },
      ],
    },
    {
      id: 'conversion_rate',
      question: 'Qual é a taxa de conversão da tua melhor landing page?',
      options: [
        { label: 'Acima de 8% — sabemos o que funciona e optimizamos continuamente', score: 3 },
        { label: 'Entre 2% e 8% — há margem de melhoria', score: 2 },
        { label: 'Abaixo de 2% ou não medimos', score: 1 },
      ],
    },
    {
      id: 'offer_clarity',
      question: 'A oferta da tua landing page tem valor claro e imediato para o visitante (diagnóstico, plano, demo, guia)?',
      options: [
        { label: 'Sim — oferta específica com valor concreto e entrega clara', score: 3 },
        { label: 'Temos algo, mas é vago ("contacta-nos", "sabe mais")', score: 2 },
        { label: 'A oferta é genérica ou não está clara', score: 1 },
      ],
    },
    {
      id: 'ai_offer_readiness',
      question: 'Já usas ou consideras usar experiências com IA (diagnósticos automáticos, calculadoras, agentes) para aumentar conversão?',
      options: [
        { label: 'Sim — já temos AI offers implementadas ou em desenvolvimento', score: 3 },
        { label: 'Estamos a explorar a ideia, mas ainda não activámos', score: 2 },
        { label: 'Não, ficámos por formulários e PDFs tradicionais', score: 1 },
      ],
    },
    {
      id: 'load_speed',
      question: 'A tua landing page carrega em menos de 2.5 segundos no mobile?',
      options: [
        { label: 'Sim — optimizada para velocidade, LCP abaixo de 2.5s', score: 3 },
        { label: 'Não sei exactamente, mas deve ser aceitável', score: 2 },
        { label: 'É lenta — sabemos que há problemas de velocidade', score: 1 },
      ],
    },
  ],
  en: [
    {
      id: 'single_action',
      question: 'Is your landing page focused on a single action (one offer, one button, one objective)?',
      options: [
        { label: 'Yes — one clear action, no distractions', score: 3 },
        { label: 'Sort of — we have the main action but also some links and options', score: 2 },
        { label: 'No — the page has several CTAs and different options', score: 1 },
      ],
    },
    {
      id: 'message_match',
      question: 'Does the ad or campaign message align with what the person sees on the landing page?',
      options: [
        { label: 'Yes — headline and offer reflect exactly what we promised in the ad', score: 3 },
        { label: 'Partially — some alignment but the message changes', score: 2 },
        { label: 'No — people land on a generic page regardless of the ad', score: 1 },
      ],
    },
    {
      id: 'conversion_rate',
      question: 'What is the conversion rate of your best landing page?',
      options: [
        { label: 'Above 8% — we know what works and continuously optimise', score: 3 },
        { label: 'Between 2% and 8% — room for improvement', score: 2 },
        { label: 'Below 2% or we don\'t measure', score: 1 },
      ],
    },
    {
      id: 'offer_clarity',
      question: 'Does your landing page offer have clear and immediate value for the visitor (diagnostic, plan, demo, guide)?',
      options: [
        { label: 'Yes — specific offer with concrete value and clear delivery', score: 3 },
        { label: 'We have something, but it\'s vague ("contact us", "learn more")', score: 2 },
        { label: 'The offer is generic or not clear', score: 1 },
      ],
    },
    {
      id: 'ai_offer_readiness',
      question: 'Do you use or consider using AI experiences (automatic diagnostics, calculators, agents) to increase conversion?',
      options: [
        { label: 'Yes — we already have AI offers implemented or in development', score: 3 },
        { label: 'We\'re exploring the idea, but haven\'t activated yet', score: 2 },
        { label: 'No, we stick to traditional forms and PDFs', score: 1 },
      ],
    },
    {
      id: 'load_speed',
      question: 'Does your landing page load in under 2.5 seconds on mobile?',
      options: [
        { label: 'Yes — optimised for speed, LCP below 2.5s', score: 3 },
        { label: 'Not sure exactly, but it should be acceptable', score: 2 },
        { label: 'It\'s slow — we know there are speed issues', score: 1 },
      ],
    },
  ],
  fr: [
    {
      id: 'single_action',
      question: 'Votre landing page est-elle focalisée sur une seule action (une offre, un bouton, un objectif)?',
      options: [
        { label: 'Oui — une action claire, sans distractions', score: 3 },
        { label: 'Plus ou moins — nous avons l\'action principale mais aussi quelques liens', score: 2 },
        { label: 'Non — la page a plusieurs CTAs et différentes options', score: 1 },
      ],
    },
    {
      id: 'message_match',
      question: 'Le message de l\'annonce ou de la campagne est-il aligné avec ce que la personne voit sur la landing page?',
      options: [
        { label: 'Oui — headline et offre reflètent exactement ce que nous avons promis', score: 3 },
        { label: 'Partiellement — il y a un certain alignement mais le message change', score: 2 },
        { label: 'Non — les gens arrivent sur une page générique quelle que soit l\'annonce', score: 1 },
      ],
    },
    {
      id: 'conversion_rate',
      question: 'Quel est le taux de conversion de votre meilleure landing page?',
      options: [
        { label: 'Au-dessus de 8% — nous savons ce qui fonctionne', score: 3 },
        { label: 'Entre 2% et 8% — marge d\'amélioration', score: 2 },
        { label: 'En dessous de 2% ou nous ne mesurons pas', score: 1 },
      ],
    },
    {
      id: 'offer_clarity',
      question: 'L\'offre de votre landing page a-t-elle une valeur claire et immédiate pour le visiteur?',
      options: [
        { label: 'Oui — offre spécifique avec valeur concrète et livraison claire', score: 3 },
        { label: 'Nous avons quelque chose, mais c\'est vague ("contactez-nous")', score: 2 },
        { label: 'L\'offre est générique ou pas claire', score: 1 },
      ],
    },
    {
      id: 'ai_offer_readiness',
      question: 'Utilisez-vous ou considérez-vous des expériences IA (diagnostics automatiques, calculateurs) pour augmenter la conversion?',
      options: [
        { label: 'Oui — nous avons déjà des AI offers implémentées ou en développement', score: 3 },
        { label: 'Nous explorons l\'idée, mais n\'avons pas encore activé', score: 2 },
        { label: 'Non, nous restons avec des formulaires et PDFs traditionnels', score: 1 },
      ],
    },
    {
      id: 'load_speed',
      question: 'Votre landing page se charge-t-elle en moins de 2,5 secondes sur mobile?',
      options: [
        { label: 'Oui — optimisée pour la vitesse, LCP en dessous de 2,5s', score: 3 },
        { label: 'Pas sûr exactement, mais ça devrait être acceptable', score: 2 },
        { label: 'C\'est lent — nous savons qu\'il y a des problèmes de vitesse', score: 1 },
      ],
    },
  ],
};

const texts: Record<string, Record<string, string>> = {
  pt: {
    title: 'Diagnóstico Landing Page',
    subtitle: 'Descobre em 30 segundos se a tua landing page está a fazer o trabalho dela',
    startButton: 'Começar diagnóstico',
    questionOf: 'Pergunta',
    of: 'de',
    resultTitle: 'O teu resultado',
    scoreLabel: 'Score de Conversão',
    levelBeginner: 'Tráfego a ser desperdiçado',
    levelIntermediate: 'Conversão a melhorar',
    levelAdvanced: 'Landing page a converter bem',
    recommendationBeginner: 'A tua landing page está a receber tráfego mas não está a converter. Há mudanças estruturais urgentes — vamos começar pelo que tem mais impacto.',
    recommendationIntermediate: 'Tens alguns elementos certos, mas faltam clareza da oferta, message match e possivelmente uma AI offer para qualificar melhor.',
    recommendationAdvanced: 'Boa conversão! Vamos ver como AI offers e testes contínuos podem levar os números ainda mais acima.',
    flowiCta: 'Flowi, o que está a bloquear as minhas conversões?',
    ctaButton: 'Falar com a Flowi',
    restartButton: 'Fazer novamente',
    freeLabel: 'Grátis',
    noSignup: 'Sem registo',
    seconds: 'segundos',
  },
  en: {
    title: 'Landing Page Diagnostic',
    subtitle: 'Find out in 30 seconds if your landing page is doing its job',
    startButton: 'Start diagnostic',
    questionOf: 'Question',
    of: 'of',
    resultTitle: 'Your result',
    scoreLabel: 'Conversion Score',
    levelBeginner: 'Traffic being wasted',
    levelIntermediate: 'Conversion to improve',
    levelAdvanced: 'Landing page converting well',
    recommendationBeginner: 'Your landing page is getting traffic but not converting. There are urgent structural changes — let\'s start with the highest impact.',
    recommendationIntermediate: 'You have some right elements, but offer clarity, message match and possibly an AI offer to qualify better are missing.',
    recommendationAdvanced: 'Good conversion! Let\'s see how AI offers and continuous testing can push numbers even higher.',
    flowiCta: 'Flowi, what\'s blocking my conversions?',
    ctaButton: 'Talk to Flowi',
    restartButton: 'Do it again',
    freeLabel: 'Free',
    noSignup: 'No signup',
    seconds: 'seconds',
  },
  fr: {
    title: 'Diagnostic Landing Page',
    subtitle: 'Découvrez en 30 secondes si votre landing page fait son travail',
    startButton: 'Commencer le diagnostic',
    questionOf: 'Question',
    of: 'de',
    resultTitle: 'Votre résultat',
    scoreLabel: 'Score de Conversion',
    levelBeginner: 'Trafic gaspillé',
    levelIntermediate: 'Conversion à améliorer',
    levelAdvanced: 'Landing page qui convertit bien',
    recommendationBeginner: 'Votre landing page reçoit du trafic mais ne convertit pas. Il y a des changements structurels urgents — commençons par le plus impactant.',
    recommendationIntermediate: 'Vous avez quelques bons éléments, mais la clarté de l\'offre, le message match et une AI offer manquent.',
    recommendationAdvanced: 'Bonne conversion! Voyons comment les AI offers et les tests continus peuvent encore améliorer les chiffres.',
    flowiCta: 'Flowi, qu\'est-ce qui bloque mes conversions?',
    ctaButton: 'Parler à Flowi',
    restartButton: 'Refaire',
    freeLabel: 'Gratuit',
    noSignup: 'Sans inscription',
    seconds: 'secondes',
  },
};

export default function LandingPagesDiagnostic({ locale }: DiagnosticProps) {
  const [step, setStep] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const t = texts[locale] || texts.pt;
  const q = questions[locale] || questions.pt;

  const handleStart = () => {
    setStep('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQuestion < q.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const totalScore = answers.reduce((sum, s) => sum + s, 0);
  const maxScore = q.length * 3;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getLevel = () => {
    if (percentage >= 75) return { label: t.levelAdvanced, color: 'text-green-600', bg: 'bg-green-100', recommendation: t.recommendationAdvanced };
    if (percentage >= 45) return { label: t.levelIntermediate, color: 'text-yellow-600', bg: 'bg-yellow-100', recommendation: t.recommendationIntermediate };
    return { label: t.levelBeginner, color: 'text-red-600', bg: 'bg-red-100', recommendation: t.recommendationBeginner };
  };

  const level = getLevel();
  const openFlowi = () => window.dispatchEvent(new Event('open-sga-chat'));

  return (
    <section id="diagnostico" className="py-20 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.title}</h2>
              <p className="text-xl text-gray-600 mb-8">{t.subtitle}</p>
              <div className="flex justify-center gap-6 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#5b54a0]">30s</div>
                  <div className="text-sm text-gray-500">{t.seconds}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#5b54a0]">6</div>
                  <div className="text-sm text-gray-500">{t.questionOf.toLowerCase()}s</div>
                </div>
              </div>
              <button onClick={handleStart} className="px-10 py-4 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-semibold text-lg shadow-lg">
                {t.startButton}
              </button>
              <div className="flex justify-center gap-4 mt-6 text-sm text-gray-500">
                <span>{t.freeLabel}</span>
                <span>·</span>
                <span>{t.noSignup}</span>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key={`question-${currentQuestion}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-500">{t.questionOf} {currentQuestion + 1} {t.of} {q.length}</span>
                <div className="flex gap-1">
                  {q.map((_, i) => (
                    <div key={i} className={`w-8 h-1 rounded-full ${i < currentQuestion ? 'bg-[#5b54a0]' : i === currentQuestion ? 'bg-[#5b54a0]/50' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">{q[currentQuestion].question}</h3>
              <div className="space-y-3">
                {q[currentQuestion].options.map((option, i) => (
                  <button key={i} onClick={() => handleAnswer(option.score)} className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-[#5b54a0] hover:bg-[#5b54a0]/5 transition-all text-gray-700 font-medium">
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl p-8 shadow-2xl text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.resultTitle}</h3>
              <div className="mb-8">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke="#5b54a0" strokeWidth="12" fill="none" strokeDasharray={440} strokeDashoffset={440 - (440 * percentage) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{t.scoreLabel}</p>
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${level.bg} ${level.color}`}>{level.label}</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{level.recommendation}</p>
              <p className="text-gray-800 font-medium mb-6">{t.flowiCta}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={openFlowi} className="px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium">{t.ctaButton}</button>
                <button onClick={handleStart} className="px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-full hover:border-gray-400 transition-colors font-medium">{t.restartButton}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
