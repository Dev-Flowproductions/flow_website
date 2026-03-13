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
      id: 'visibility',
      question: 'Consegues ver de onde vêm os teus leads e clientes?',
      options: [
        { label: 'Sim, tenho dados claros por canal e campanha', score: 3 },
        { label: 'Mais ou menos, preciso juntar dados de vários sítios', score: 2 },
        { label: 'Não, é difícil saber o que funciona', score: 1 },
      ],
    },
    {
      id: 'automation',
      question: 'Que nível de automação tens no marketing?',
      options: [
        { label: 'Automações avançadas (lead scoring, nurturing, etc.)', score: 3 },
        { label: 'Algumas automações básicas (emails, alertas)', score: 2 },
        { label: 'Quase tudo é manual', score: 1 },
      ],
    },
    {
      id: 'ai_ready',
      question: 'O teu website está preparado para motores de IA (ChatGPT, Gemini)?',
      options: [
        { label: 'Sim, já otimizámos para AEO/GEO', score: 3 },
        { label: 'Temos SEO, mas não pensámos em IA', score: 2 },
        { label: 'Não sei o que isso significa', score: 1 },
      ],
    },
    {
      id: 'tools',
      question: 'As tuas ferramentas de marketing estão integradas?',
      options: [
        { label: 'Sim, tudo está ligado e sincronizado', score: 3 },
        { label: 'Algumas estão, outras não', score: 2 },
        { label: 'Cada ferramenta funciona isolada', score: 1 },
      ],
    },
    {
      id: 'reporting',
      question: 'Quanto tempo demoras a criar um relatório de marketing?',
      options: [
        { label: 'Minutos (dashboards automáticos)', score: 3 },
        { label: 'Horas (preciso juntar dados manualmente)', score: 2 },
        { label: 'Dias ou nem faço relatórios consistentes', score: 1 },
      ],
    },
    {
      id: 'demand_gen',
      question: 'Como captas leads atualmente?',
      options: [
        { label: 'Mix de conteúdo educativo + formulários estratégicos', score: 3 },
        { label: 'Principalmente formulários e gated content', score: 2 },
        { label: 'Dependo muito de ads e cold outreach', score: 1 },
      ],
    },
  ],
  en: [
    {
      id: 'visibility',
      question: 'Can you see where your leads and customers come from?',
      options: [
        { label: 'Yes, I have clear data by channel and campaign', score: 3 },
        { label: 'Sort of, I need to gather data from multiple places', score: 2 },
        { label: "No, it's hard to know what works", score: 1 },
      ],
    },
    {
      id: 'automation',
      question: 'What level of marketing automation do you have?',
      options: [
        { label: 'Advanced automations (lead scoring, nurturing, etc.)', score: 3 },
        { label: 'Some basic automations (emails, alerts)', score: 2 },
        { label: 'Almost everything is manual', score: 1 },
      ],
    },
    {
      id: 'ai_ready',
      question: 'Is your website ready for AI engines (ChatGPT, Gemini)?',
      options: [
        { label: "Yes, we've optimized for AEO/GEO", score: 3 },
        { label: "We have SEO, but haven't thought about AI", score: 2 },
        { label: "I don't know what that means", score: 1 },
      ],
    },
    {
      id: 'tools',
      question: 'Are your marketing tools integrated?',
      options: [
        { label: 'Yes, everything is connected and synced', score: 3 },
        { label: 'Some are, others are not', score: 2 },
        { label: 'Each tool works in isolation', score: 1 },
      ],
    },
    {
      id: 'reporting',
      question: 'How long does it take to create a marketing report?',
      options: [
        { label: 'Minutes (automatic dashboards)', score: 3 },
        { label: 'Hours (I need to gather data manually)', score: 2 },
        { label: "Days or I don't make consistent reports", score: 1 },
      ],
    },
    {
      id: 'demand_gen',
      question: 'How do you capture leads currently?',
      options: [
        { label: 'Mix of educational content + strategic forms', score: 3 },
        { label: 'Mainly forms and gated content', score: 2 },
        { label: 'I rely heavily on ads and cold outreach', score: 1 },
      ],
    },
  ],
  fr: [
    {
      id: 'visibility',
      question: "Pouvez-vous voir d'où viennent vos leads et clients?",
      options: [
        { label: 'Oui, j\'ai des données claires par canal et campagne', score: 3 },
        { label: 'Plus ou moins, je dois rassembler des données de plusieurs endroits', score: 2 },
        { label: 'Non, c\'est difficile de savoir ce qui fonctionne', score: 1 },
      ],
    },
    {
      id: 'automation',
      question: "Quel niveau d'automatisation avez-vous en marketing?",
      options: [
        { label: 'Automatisations avancées (lead scoring, nurturing, etc.)', score: 3 },
        { label: 'Quelques automatisations de base (emails, alertes)', score: 2 },
        { label: 'Presque tout est manuel', score: 1 },
      ],
    },
    {
      id: 'ai_ready',
      question: 'Votre site web est-il prêt pour les moteurs IA (ChatGPT, Gemini)?',
      options: [
        { label: 'Oui, nous avons optimisé pour AEO/GEO', score: 3 },
        { label: "Nous avons du SEO, mais n'avons pas pensé à l'IA", score: 2 },
        { label: 'Je ne sais pas ce que cela signifie', score: 1 },
      ],
    },
    {
      id: 'tools',
      question: 'Vos outils marketing sont-ils intégrés?',
      options: [
        { label: 'Oui, tout est connecté et synchronisé', score: 3 },
        { label: 'Certains le sont, d\'autres non', score: 2 },
        { label: 'Chaque outil fonctionne de manière isolée', score: 1 },
      ],
    },
    {
      id: 'reporting',
      question: 'Combien de temps mettez-vous pour créer un rapport marketing?',
      options: [
        { label: 'Minutes (dashboards automatiques)', score: 3 },
        { label: 'Heures (je dois rassembler les données manuellement)', score: 2 },
        { label: 'Jours ou je ne fais pas de rapports cohérents', score: 1 },
      ],
    },
    {
      id: 'demand_gen',
      question: 'Comment capturez-vous les leads actuellement?',
      options: [
        { label: 'Mix de contenu éducatif + formulaires stratégiques', score: 3 },
        { label: 'Principalement des formulaires et du contenu gated', score: 2 },
        { label: 'Je dépends beaucoup des ads et du cold outreach', score: 1 },
      ],
    },
  ],
};

const texts: Record<string, Record<string, string>> = {
  pt: {
    title: 'Diagnóstico MarTech',
    subtitle: 'Descobre em 30 segundos o nível de maturidade digital da tua empresa',
    startButton: 'Começar diagnóstico',
    questionOf: 'Pergunta',
    of: 'de',
    resultTitle: 'O teu resultado',
    scoreLabel: 'Score de Maturidade MarTech',
    levelBeginner: 'Iniciante',
    levelIntermediate: 'Intermédio',
    levelAdvanced: 'Avançado',
    recommendationBeginner: 'A tua empresa tem muito espaço para crescer com MarTech. Recomendamos começar por uma auditoria completa ao ecossistema digital.',
    recommendationIntermediate: 'Tens uma base, mas há oportunidades significativas de melhoria. Vamos identificar os quick wins e criar um roadmap.',
    recommendationAdvanced: 'Estás no bom caminho! Vamos ver como podemos otimizar ainda mais e preparar-te para o futuro com IA.',
    flowiCta: 'Fala com a Flowi para perceber melhor',
    ctaButton: 'Falar com a Flowi',
    restartButton: 'Fazer novamente',
    freeLabel: 'Grátis',
    noSignup: 'Sem cadastro',
    seconds: 'segundos',
  },
  en: {
    title: 'MarTech Diagnostic',
    subtitle: "Discover your company's digital maturity level in 30 seconds",
    startButton: 'Start diagnostic',
    questionOf: 'Question',
    of: 'of',
    resultTitle: 'Your result',
    scoreLabel: 'MarTech Maturity Score',
    levelBeginner: 'Beginner',
    levelIntermediate: 'Intermediate',
    levelAdvanced: 'Advanced',
    recommendationBeginner: 'Your company has a lot of room to grow with MarTech. We recommend starting with a complete audit of your digital ecosystem.',
    recommendationIntermediate: "You have a foundation, but there are significant improvement opportunities. Let's identify quick wins and create a roadmap.",
    recommendationAdvanced: "You're on the right track! Let's see how we can optimize further and prepare you for the future with AI.",
    flowiCta: 'Talk to Flowi to learn more',
    ctaButton: 'Talk to Flowi',
    restartButton: 'Do it again',
    freeLabel: 'Free',
    noSignup: 'No signup',
    seconds: 'seconds',
  },
  fr: {
    title: 'Diagnostic MarTech',
    subtitle: 'Découvrez le niveau de maturité digitale de votre entreprise en 30 secondes',
    startButton: 'Commencer le diagnostic',
    questionOf: 'Question',
    of: 'de',
    resultTitle: 'Votre résultat',
    scoreLabel: 'Score de Maturité MarTech',
    levelBeginner: 'Débutant',
    levelIntermediate: 'Intermédiaire',
    levelAdvanced: 'Avancé',
    recommendationBeginner: 'Votre entreprise a beaucoup de place pour grandir avec MarTech. Nous recommandons de commencer par un audit complet de votre écosystème digital.',
    recommendationIntermediate: 'Vous avez une base, mais il y a des opportunités d\'amélioration significatives. Identifions les quick wins et créons une roadmap.',
    recommendationAdvanced: 'Vous êtes sur la bonne voie! Voyons comment nous pouvons optimiser davantage et vous préparer pour l\'avenir avec l\'IA.',
    flowiCta: 'Parlez à Flowi pour en savoir plus',
    ctaButton: 'Parler à Flowi',
    restartButton: 'Refaire',
    freeLabel: 'Gratuit',
    noSignup: 'Sans inscription',
    seconds: 'secondes',
  },
};

export default function MartechDiagnostic({ locale }: DiagnosticProps) {
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

  const totalScore = answers.reduce((sum, score) => sum + score, 0);
  const maxScore = q.length * 3;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getLevel = () => {
    if (percentage >= 75) return { label: t.levelAdvanced, color: 'text-green-600', bg: 'bg-green-100', recommendation: t.recommendationAdvanced };
    if (percentage >= 45) return { label: t.levelIntermediate, color: 'text-yellow-600', bg: 'bg-yellow-100', recommendation: t.recommendationIntermediate };
    return { label: t.levelBeginner, color: 'text-red-600', bg: 'bg-red-100', recommendation: t.recommendationBeginner };
  };

  const level = getLevel();

  const openFlowi = () => {
    window.dispatchEvent(new Event('open-sga-chat'));
  };

  return (
    <section id="diagnostico" className="py-20 px-4 bg-gray-50">
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

              <button
                onClick={handleStart}
                className="px-10 py-4 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-semibold text-lg shadow-lg"
              >
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
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-500">
                  {t.questionOf} {currentQuestion + 1} {t.of} {q.length}
                </span>
                <div className="flex gap-1">
                  {q.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1 rounded-full ${
                        i < currentQuestion ? 'bg-[#5b54a0]' : i === currentQuestion ? 'bg-[#5b54a0]/50' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
                {q[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {q[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.score)}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-[#5b54a0] hover:bg-[#5b54a0]/5 transition-all text-gray-700 font-medium"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.resultTitle}</h3>

              <div className="mb-8">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#5b54a0"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * percentage) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{t.scoreLabel}</p>
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${level.bg} ${level.color}`}>
                  {level.label}
                </span>
              </div>

              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {level.recommendation}
              </p>

              <p className="text-gray-800 font-medium mb-6">
                {t.flowiCta}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openFlowi}
                  className="px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium"
                >
                  {t.ctaButton}
                </button>
                <button
                  onClick={handleStart}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-full hover:border-gray-400 transition-colors font-medium"
                >
                  {t.restartButton}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
