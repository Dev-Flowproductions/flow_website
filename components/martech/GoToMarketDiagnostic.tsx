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
      id: 'positioning_clarity',
      question: 'Consegues explicar a tua proposta de valor numa frase — e toda a equipa diz o mesmo?',
      options: [
        { label: 'Sim — frase clara, consistente em toda a equipa e materiais', score: 3 },
        { label: 'Temos algo escrito, mas a equipa não diz todos o mesmo', score: 2 },
        { label: 'Cada pessoa explica de forma diferente', score: 1 },
      ],
    },
    {
      id: 'icp_definition',
      question: 'Tens o teu perfil de cliente ideal (ICP) definido com critérios concretos (sector, tamanho, triggers)?',
      options: [
        { label: 'Sim — ICP documentado com critérios específicos e validado', score: 3 },
        { label: 'Temos uma ideia geral mas não está documentado', score: 2 },
        { label: 'Tentamos vender a toda a gente', score: 1 },
      ],
    },
    {
      id: 'market_entry_trigger',
      question: 'Qual é o principal motivo que está a levar-te a pensar em Go-to-Market agora?',
      options: [
        { label: 'Lançamento de produto / novo segmento / reposicionamento planeado', score: 3 },
        { label: 'Crescimento travado ou resultados abaixo do esperado', score: 2 },
        { label: 'Não sei bem — sinto que "algo não está a funcionar"', score: 1 },
      ],
    },
    {
      id: 'sales_friction',
      question: 'Quanto tempo demora um comercial a explicar o que faz a tua empresa a um prospect novo?',
      options: [
        { label: 'Menos de 2 minutos — narrativa clara e estruturada', score: 3 },
        { label: '5 a 10 minutos com muitas perguntas pelo caminho', score: 2 },
        { label: 'Muito tempo — é difícil simplificar sem perder nuance', score: 1 },
      ],
    },
    {
      id: 'channel_strategy',
      question: 'Tens clareza sobre quais canais de aquisição fazem sentido para a tua oferta e momento?',
      options: [
        { label: 'Sim — canais definidos com base em dados e testes', score: 3 },
        { label: 'Usamos vários canais, mas sem priorização clara', score: 2 },
        { label: 'Seguimos o que parece funcionar para os concorrentes', score: 1 },
      ],
    },
    {
      id: 'buyer_journey',
      question: 'Tens mensagens diferenciadas para quem decide (C-level) vs quem usa (equipa)?',
      options: [
        { label: 'Sim — mensagens e materiais diferentes por persona', score: 3 },
        { label: 'Temos algo, mas não é muito diferenciado', score: 2 },
        { label: 'Uma mensagem única para toda a gente', score: 1 },
      ],
    },
  ],
  en: [
    {
      id: 'positioning_clarity',
      question: 'Can you explain your value proposition in one sentence — and does everyone on the team say the same thing?',
      options: [
        { label: 'Yes — clear sentence, consistent across the team and materials', score: 3 },
        { label: 'We have something written, but the team doesn\'t all say the same', score: 2 },
        { label: 'Each person explains it differently', score: 1 },
      ],
    },
    {
      id: 'icp_definition',
      question: 'Do you have your ideal customer profile (ICP) defined with concrete criteria (sector, size, triggers)?',
      options: [
        { label: 'Yes — documented ICP with specific criteria, validated', score: 3 },
        { label: 'We have a general idea but it\'s not documented', score: 2 },
        { label: 'We try to sell to everyone', score: 1 },
      ],
    },
    {
      id: 'market_entry_trigger',
      question: 'What is the main reason driving you to think about Go-to-Market now?',
      options: [
        { label: 'Product launch / new segment / planned repositioning', score: 3 },
        { label: 'Stalled growth or results below expectations', score: 2 },
        { label: 'I\'m not sure — I feel "something isn\'t working"', score: 1 },
      ],
    },
    {
      id: 'sales_friction',
      question: 'How long does it take a sales rep to explain what your company does to a new prospect?',
      options: [
        { label: 'Less than 2 minutes — clear and structured narrative', score: 3 },
        { label: '5 to 10 minutes with lots of questions along the way', score: 2 },
        { label: 'A long time — hard to simplify without losing nuance', score: 1 },
      ],
    },
    {
      id: 'channel_strategy',
      question: 'Do you have clarity on which acquisition channels make sense for your offer and current stage?',
      options: [
        { label: 'Yes — channels defined based on data and tests', score: 3 },
        { label: 'We use several channels, but without clear prioritisation', score: 2 },
        { label: 'We follow what seems to work for competitors', score: 1 },
      ],
    },
    {
      id: 'buyer_journey',
      question: 'Do you have differentiated messages for decision-makers (C-level) vs users (team)?',
      options: [
        { label: 'Yes — different messages and materials per persona', score: 3 },
        { label: 'We have something, but it\'s not very differentiated', score: 2 },
        { label: 'One message for everyone', score: 1 },
      ],
    },
  ],
  fr: [
    {
      id: 'positioning_clarity',
      question: 'Pouvez-vous expliquer votre proposition de valeur en une phrase — et toute l\'équipe dit-elle la même chose?',
      options: [
        { label: 'Oui — phrase claire, cohérente dans toute l\'équipe et les supports', score: 3 },
        { label: 'Nous avons quelque chose d\'écrit, mais l\'équipe ne dit pas tous la même chose', score: 2 },
        { label: 'Chaque personne l\'explique différemment', score: 1 },
      ],
    },
    {
      id: 'icp_definition',
      question: 'Avez-vous votre profil de client idéal (ICP) défini avec des critères concrets?',
      options: [
        { label: 'Oui — ICP documenté avec critères spécifiques et validé', score: 3 },
        { label: 'Nous avons une idée générale mais ce n\'est pas documenté', score: 2 },
        { label: 'Nous essayons de vendre à tout le monde', score: 1 },
      ],
    },
    {
      id: 'market_entry_trigger',
      question: 'Quelle est la principale raison qui vous pousse à penser au Go-to-Market maintenant?',
      options: [
        { label: 'Lancement de produit / nouveau segment / repositionnement planifié', score: 3 },
        { label: 'Croissance bloquée ou résultats en dessous des attentes', score: 2 },
        { label: 'Je ne suis pas sûr — j\'ai le sentiment que "quelque chose ne fonctionne pas"', score: 1 },
      ],
    },
    {
      id: 'sales_friction',
      question: 'Combien de temps faut-il à un commercial pour expliquer ce que fait votre entreprise à un nouveau prospect?',
      options: [
        { label: 'Moins de 2 minutes — narrative claire et structurée', score: 3 },
        { label: '5 à 10 minutes avec beaucoup de questions en chemin', score: 2 },
        { label: 'Longtemps — difficile de simplifier sans perdre la nuance', score: 1 },
      ],
    },
    {
      id: 'channel_strategy',
      question: 'Avez-vous de la clarté sur les canaux d\'acquisition qui ont du sens pour votre offre?',
      options: [
        { label: 'Oui — canaux définis sur la base de données et de tests', score: 3 },
        { label: 'Nous utilisons plusieurs canaux, mais sans priorisation claire', score: 2 },
        { label: 'Nous suivons ce qui semble fonctionner pour les concurrents', score: 1 },
      ],
    },
    {
      id: 'buyer_journey',
      question: 'Avez-vous des messages différenciés pour les décideurs (C-level) vs les utilisateurs (équipe)?',
      options: [
        { label: 'Oui — messages et supports différents par persona', score: 3 },
        { label: 'Nous avons quelque chose, mais ce n\'est pas très différencié', score: 2 },
        { label: 'Un seul message pour tout le monde', score: 1 },
      ],
    },
  ],
};

const texts: Record<string, Record<string, string>> = {
  pt: {
    title: 'Diagnóstico Go-to-Market',
    subtitle: 'Descobre se tens o que é preciso para entrar, lançar ou escalar sem atrito',
    startButton: 'Começar diagnóstico',
    questionOf: 'Pergunta',
    of: 'de',
    resultTitle: 'O teu resultado',
    scoreLabel: 'Score GTM',
    levelBeginner: 'GTM precisa de base',
    levelIntermediate: 'Parcialmente alinhado',
    levelAdvanced: 'Pronto para escalar',
    recommendationBeginner: 'Há lacunas fundamentais no teu posicionamento e clareza de mercado. Uma estratégia GTM bem desenhada pode transformar a forma como cresces.',
    recommendationIntermediate: 'Tens parte do puzzle, mas falta consistência e alinhamento entre equipas. Vamos identificar os gaps e criar uma narrativa comum.',
    recommendationAdvanced: 'Ótima base! Vamos afinar a segmentação, o canal mix e a mensagem por persona para maximizar o crescimento.',
    flowiCta: 'Flowi, o que devo resolver primeiro?',
    ctaButton: 'Falar com a Flowi',
    restartButton: 'Fazer novamente',
    freeLabel: 'Grátis',
    noSignup: 'Sem registo',
    seconds: 'segundos',
  },
  en: {
    title: 'Go-to-Market Diagnostic',
    subtitle: 'Find out if you have what it takes to enter, launch or scale without friction',
    startButton: 'Start diagnostic',
    questionOf: 'Question',
    of: 'of',
    resultTitle: 'Your result',
    scoreLabel: 'GTM Score',
    levelBeginner: 'GTM needs foundation',
    levelIntermediate: 'Partially aligned',
    levelAdvanced: 'Ready to scale',
    recommendationBeginner: 'There are fundamental gaps in your positioning and market clarity. A well-designed GTM strategy can transform the way you grow.',
    recommendationIntermediate: 'You have part of the puzzle, but consistency and team alignment are missing. Let\'s identify gaps and create a common narrative.',
    recommendationAdvanced: 'Great foundation! Let\'s refine segmentation, channel mix and message per persona to maximise growth.',
    flowiCta: 'Flowi, what should I resolve first?',
    ctaButton: 'Talk to Flowi',
    restartButton: 'Do it again',
    freeLabel: 'Free',
    noSignup: 'No signup',
    seconds: 'seconds',
  },
  fr: {
    title: 'Diagnostic Go-to-Market',
    subtitle: 'Découvrez si vous avez ce qu\'il faut pour entrer, lancer ou scaler sans friction',
    startButton: 'Commencer le diagnostic',
    questionOf: 'Question',
    of: 'de',
    resultTitle: 'Votre résultat',
    scoreLabel: 'Score GTM',
    levelBeginner: 'GTM a besoin de fondations',
    levelIntermediate: 'Partiellement aligné',
    levelAdvanced: 'Prêt à scaler',
    recommendationBeginner: 'Il y a des lacunes fondamentales dans votre positionnement et clarté de marché. Une stratégie GTM bien conçue peut transformer votre croissance.',
    recommendationIntermediate: 'Vous avez une partie du puzzle, mais la cohérence et l\'alignement entre équipes manquent. Identifions les gaps.',
    recommendationAdvanced: 'Excellente base! Affinons la segmentation, le mix de canaux et les messages par persona.',
    flowiCta: 'Flowi, que dois-je résoudre en premier?',
    ctaButton: 'Parler à Flowi',
    restartButton: 'Refaire',
    freeLabel: 'Gratuit',
    noSignup: 'Sans inscription',
    seconds: 'secondes',
  },
};

export default function GoToMarketDiagnostic({ locale }: DiagnosticProps) {
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
