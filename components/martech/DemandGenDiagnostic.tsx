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
      id: 'gated_dependency',
      question: 'Que percentagem dos teus leads vem de conteúdo bloqueado (ebooks, whitepapers, webinars com formulário)?',
      options: [
        { label: 'Menos de 20% — temos uma estratégia diversificada', score: 3 },
        { label: 'Entre 20% e 60% — mistura de gated e open', score: 2 },
        { label: 'Mais de 60% — dependemos muito de gated content', score: 1 },
      ],
    },
    {
      id: 'content_distribution',
      question: 'O teu conteúdo chega ao mercado de forma consistente e por múltiplos canais?',
      options: [
        { label: 'Sim — blog, social, email, parceiros e paid em cadência regular', score: 3 },
        { label: 'Publicamos às vezes, sem calendário definido', score: 2 },
        { label: 'Temos conteúdo no site mas pouca distribuição activa', score: 1 },
      ],
    },
    {
      id: 'lead_quality',
      question: 'Como caracterizas a qualidade dos leads que chegam à tua equipa comercial?',
      options: [
        { label: 'Chegam bem informados, com contexto sobre o nosso produto', score: 3 },
        { label: 'Às vezes chegam com contexto, outras vezes não', score: 2 },
        { label: 'A maioria chega fria — temos de explicar tudo de raiz', score: 1 },
      ],
    },
    {
      id: 'dark_funnel',
      question: 'Sabes que o teu público te conhece antes de preencher um formulário? (dark funnel / B2B social)',
      options: [
        { label: 'Sim — temos presença e reconhecimento antes do contacto', score: 3 },
        { label: 'Temos algumas iniciativas, mas não é sistemático', score: 2 },
        { label: 'Não — a maioria das pessoas descobre-nos pelo formulário ou ads', score: 1 },
      ],
    },
    {
      id: 'content_measurement',
      question: 'Consegues medir o impacto do teu conteúdo no pipeline — não só cliques, mas conversas e deals?',
      options: [
        { label: 'Sim — ligamos conteúdo a pipeline e receita', score: 3 },
        { label: 'Medimos tráfego e leads, mas não influência no deal', score: 2 },
        { label: 'Medimos pouco ou quase nada', score: 1 },
      ],
    },
    {
      id: 'sales_cycle',
      question: 'Quanto tempo demora tipicamente o teu ciclo de venda?',
      options: [
        { label: 'Menos de 2 semanas', score: 3 },
        { label: 'Entre 1 e 3 meses', score: 2 },
        { label: 'Mais de 3 meses', score: 1 },
      ],
    },
  ],
  en: [
    {
      id: 'gated_dependency',
      question: 'What percentage of your leads come from gated content (ebooks, whitepapers, webinars with forms)?',
      options: [
        { label: 'Less than 20% — we have a diversified strategy', score: 3 },
        { label: 'Between 20% and 60% — mix of gated and open', score: 2 },
        { label: 'More than 60% — we rely heavily on gated content', score: 1 },
      ],
    },
    {
      id: 'content_distribution',
      question: 'Does your content reach the market consistently and through multiple channels?',
      options: [
        { label: 'Yes — blog, social, email, partners and paid on regular cadence', score: 3 },
        { label: 'We publish sometimes, without a defined calendar', score: 2 },
        { label: 'We have content on the site but little active distribution', score: 1 },
      ],
    },
    {
      id: 'lead_quality',
      question: 'How would you describe the quality of leads that reach your sales team?',
      options: [
        { label: 'They arrive well-informed, with context about our product', score: 3 },
        { label: 'Sometimes they arrive with context, sometimes not', score: 2 },
        { label: 'Most arrive cold — we have to explain everything from scratch', score: 1 },
      ],
    },
    {
      id: 'dark_funnel',
      question: 'Do you know your audience knows you before filling a form? (dark funnel / B2B social)',
      options: [
        { label: 'Yes — we have presence and recognition before contact', score: 3 },
        { label: 'We have some initiatives, but it\'s not systematic', score: 2 },
        { label: 'No — most people discover us through forms or ads', score: 1 },
      ],
    },
    {
      id: 'content_measurement',
      question: 'Can you measure your content\'s impact on pipeline — not just clicks, but conversations and deals?',
      options: [
        { label: 'Yes — we connect content to pipeline and revenue', score: 3 },
        { label: 'We measure traffic and leads, but not influence on the deal', score: 2 },
        { label: 'We measure little or almost nothing', score: 1 },
      ],
    },
    {
      id: 'sales_cycle',
      question: 'How long does your typical sales cycle take?',
      options: [
        { label: 'Less than 2 weeks', score: 3 },
        { label: 'Between 1 and 3 months', score: 2 },
        { label: 'More than 3 months', score: 1 },
      ],
    },
  ],
  fr: [
    {
      id: 'gated_dependency',
      question: 'Quel pourcentage de vos leads vient de contenu bloqué (ebooks, whitepapers, webinaires avec formulaire)?',
      options: [
        { label: 'Moins de 20% — nous avons une stratégie diversifiée', score: 3 },
        { label: 'Entre 20% et 60% — mélange de gated et open', score: 2 },
        { label: 'Plus de 60% — nous dépendons beaucoup du gated content', score: 1 },
      ],
    },
    {
      id: 'content_distribution',
      question: 'Votre contenu atteint-il le marché de façon cohérente et par plusieurs canaux?',
      options: [
        { label: 'Oui — blog, social, email, partenaires et paid en cadence régulière', score: 3 },
        { label: 'Nous publions parfois, sans calendrier défini', score: 2 },
        { label: 'Nous avons du contenu sur le site mais peu de distribution active', score: 1 },
      ],
    },
    {
      id: 'lead_quality',
      question: 'Comment caractériseriez-vous la qualité des leads qui arrivent à votre équipe commerciale?',
      options: [
        { label: 'Ils arrivent bien informés, avec contexte sur notre produit', score: 3 },
        { label: 'Parfois avec contexte, parfois non', score: 2 },
        { label: 'La plupart arrivent froids — nous devons tout expliquer', score: 1 },
      ],
    },
    {
      id: 'dark_funnel',
      question: 'Savez-vous que votre audience vous connaît avant de remplir un formulaire? (dark funnel)',
      options: [
        { label: 'Oui — nous avons une présence et reconnaissance avant le contact', score: 3 },
        { label: 'Nous avons quelques initiatives, mais ce n\'est pas systématique', score: 2 },
        { label: 'Non — la plupart découvrent via formulaires ou ads', score: 1 },
      ],
    },
    {
      id: 'content_measurement',
      question: 'Pouvez-vous mesurer l\'impact de votre contenu sur le pipeline — pas seulement les clics?',
      options: [
        { label: 'Oui — nous relions le contenu au pipeline et aux revenus', score: 3 },
        { label: 'Nous mesurons le trafic et les leads, mais pas l\'influence sur les deals', score: 2 },
        { label: 'Nous mesurons peu ou presque rien', score: 1 },
      ],
    },
    {
      id: 'sales_cycle',
      question: 'Combien de temps dure votre cycle de vente typique?',
      options: [
        { label: 'Moins de 2 semaines', score: 3 },
        { label: 'Entre 1 et 3 mois', score: 2 },
        { label: 'Plus de 3 mois', score: 1 },
      ],
    },
  ],
};

const texts: Record<string, Record<string, string>> = {
  pt: {
    title: 'Diagnóstico Demand Gen',
    subtitle: 'Descobre onde estás a bloquear procura — e como criar mais pipeline sem gating',
    startButton: 'Começar diagnóstico',
    questionOf: 'Pergunta',
    of: 'de',
    resultTitle: 'O teu resultado',
    scoreLabel: 'Score de Demand Gen',
    levelBeginner: 'Alto potencial de melhoria',
    levelIntermediate: 'Em transição',
    levelAdvanced: 'Demand gen saudável',
    recommendationBeginner: 'Dependes demasiado de gated content e leads frias. Há uma oportunidade clara de criar mais procura orgânica e aquecer o mercado antes de pedir algo.',
    recommendationIntermediate: 'Tens alguns bons hábitos, mas falta consistência e distribuição. Com uma cadência editorial definida, podes aumentar a qualidade dos leads significativamente.',
    recommendationAdvanced: 'Ótimo trabalho! Vamos ver como medir melhor o impacto no pipeline e escalar o que está a funcionar.',
    flowiCta: 'Flowi, onde devo começar a melhorar?',
    ctaButton: 'Falar com a Flowi',
    restartButton: 'Fazer novamente',
    freeLabel: 'Grátis',
    noSignup: 'Sem registo',
    seconds: 'segundos',
  },
  en: {
    title: 'Demand Gen Diagnostic',
    subtitle: 'Find out where you\'re blocking demand — and how to build more pipeline without gating',
    startButton: 'Start diagnostic',
    questionOf: 'Question',
    of: 'of',
    resultTitle: 'Your result',
    scoreLabel: 'Demand Gen Score',
    levelBeginner: 'High improvement potential',
    levelIntermediate: 'In transition',
    levelAdvanced: 'Healthy demand gen',
    recommendationBeginner: 'You rely too much on gated content and cold leads. There\'s a clear opportunity to create more organic demand and warm up the market before asking for anything.',
    recommendationIntermediate: 'You have some good habits, but consistency and distribution are missing. With a defined editorial cadence, you can significantly improve lead quality.',
    recommendationAdvanced: 'Great work! Let\'s see how to better measure pipeline impact and scale what\'s working.',
    flowiCta: 'Flowi, where should I start improving?',
    ctaButton: 'Talk to Flowi',
    restartButton: 'Do it again',
    freeLabel: 'Free',
    noSignup: 'No signup',
    seconds: 'seconds',
  },
  fr: {
    title: 'Diagnostic Demand Gen',
    subtitle: 'Découvrez où vous bloquez la demande — et comment créer plus de pipeline sans gating',
    startButton: 'Commencer le diagnostic',
    questionOf: 'Question',
    of: 'de',
    resultTitle: 'Votre résultat',
    scoreLabel: 'Score Demand Gen',
    levelBeginner: 'Fort potentiel d\'amélioration',
    levelIntermediate: 'En transition',
    levelAdvanced: 'Demand gen sain',
    recommendationBeginner: 'Vous dépendez trop du gated content et des leads froids. Il y a une opportunité claire de créer plus de demande organique.',
    recommendationIntermediate: 'Vous avez de bonnes habitudes, mais il manque de cohérence et de distribution. Avec une cadence éditoriale définie, vous pouvez améliorer la qualité des leads.',
    recommendationAdvanced: 'Excellent travail! Voyons comment mieux mesurer l\'impact sur le pipeline et scaler ce qui fonctionne.',
    flowiCta: 'Flowi, par où commencer?',
    ctaButton: 'Parler à Flowi',
    restartButton: 'Refaire',
    freeLabel: 'Gratuit',
    noSignup: 'Sans inscription',
    seconds: 'secondes',
  },
};

export default function DemandGenDiagnostic({ locale }: DiagnosticProps) {
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
