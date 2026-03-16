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
      id: 'roi_clarity',
      question: 'Sabes qual é o custo por lead e custo por cliente adquirido (CAC) nas tuas campanhas actuais?',
      options: [
        { label: 'Sim — dados actualizados e segmentados por campanha e canal', score: 3 },
        { label: 'Temos uma ideia geral, mas os dados não são exactos', score: 2 },
        { label: 'Não temos esses dados ou são muito difíceis de calcular', score: 1 },
      ],
    },
    {
      id: 'landing_page_alignment',
      question: 'As tuas landing pages são específicas para cada campanha ou são páginas genéricas do site?',
      options: [
        { label: 'Páginas dedicadas por campanha, com mensagem alinhada ao anúncio', score: 3 },
        { label: 'Algumas campanhas têm páginas dedicadas, outras não', score: 2 },
        { label: 'Todas as campanhas apontam para a homepage ou página de serviços', score: 1 },
      ],
    },
    {
      id: 'testing_culture',
      question: 'Tens uma cadência regular de testes A/B (criativo, copy, segmentação, oferta)?',
      options: [
        { label: 'Sim — testes estruturados e sistemáticos em ciclos definidos', score: 3 },
        { label: 'Fazemos alguns testes quando há recursos ou tempo', score: 2 },
        { label: 'Raramente ou nunca testamos sistematicamente', score: 1 },
      ],
    },
    {
      id: 'ai_search_ads',
      question: 'As tuas campanhas incluem estratégias para performance em motores de IA (Microsoft Copilot, Google AI Overviews, Perplexity Ads)?',
      options: [
        { label: 'Sim — já estamos a testar e monitorizar estes formatos', score: 3 },
        { label: 'Estamos a acompanhar a evolução, mas ainda não activámos', score: 2 },
        { label: 'Não, focamo-nos apenas em Google/Meta tradicionais', score: 1 },
      ],
    },
    {
      id: 'attribution',
      question: 'Como é que atribuis receita às campanhas? Tens modelo de atribuição configurado?',
      options: [
        { label: 'Sim — modelo multi-touch ou data-driven configurado e em uso', score: 3 },
        { label: 'Usamos last-click ou atribuição básica da plataforma', score: 2 },
        { label: 'Não temos atribuição configurada — confiamos em "feeling"', score: 1 },
      ],
    },
    {
      id: 'budget_predictability',
      question: 'Consegues prever quanto investir para obter X leads ou X clientes no próximo trimestre?',
      options: [
        { label: 'Sim — temos benchmarks históricos e modelo de previsão', score: 3 },
        { label: 'Temos uma ideia aproximada mas com grande margem de erro', score: 2 },
        { label: 'Não — o investimento é definido sem base em resultados esperados', score: 1 },
      ],
    },
  ],
  en: [
    {
      id: 'roi_clarity',
      question: 'Do you know your cost per lead and cost per acquired customer (CAC) in your current campaigns?',
      options: [
        { label: 'Yes — up-to-date data segmented by campaign and channel', score: 3 },
        { label: 'We have a general idea, but the data isn\'t accurate', score: 2 },
        { label: 'We don\'t have this data or it\'s very hard to calculate', score: 1 },
      ],
    },
    {
      id: 'landing_page_alignment',
      question: 'Are your landing pages specific to each campaign or generic site pages?',
      options: [
        { label: 'Dedicated pages per campaign, message aligned to the ad', score: 3 },
        { label: 'Some campaigns have dedicated pages, others don\'t', score: 2 },
        { label: 'All campaigns point to the homepage or services page', score: 1 },
      ],
    },
    {
      id: 'testing_culture',
      question: 'Do you have a regular A/B testing cadence (creative, copy, segmentation, offer)?',
      options: [
        { label: 'Yes — structured and systematic tests in defined cycles', score: 3 },
        { label: 'We do some tests when we have resources or time', score: 2 },
        { label: 'Rarely or never test systematically', score: 1 },
      ],
    },
    {
      id: 'ai_search_ads',
      question: 'Do your campaigns include strategies for AI engine performance (Microsoft Copilot, Google AI Overviews, Perplexity Ads)?',
      options: [
        { label: 'Yes — we\'re already testing and monitoring these formats', score: 3 },
        { label: 'We\'re tracking the evolution, but haven\'t activated yet', score: 2 },
        { label: 'No — we focus only on traditional Google/Meta', score: 1 },
      ],
    },
    {
      id: 'attribution',
      question: 'How do you attribute revenue to campaigns? Do you have an attribution model configured?',
      options: [
        { label: 'Yes — multi-touch or data-driven model configured and in use', score: 3 },
        { label: 'We use last-click or basic platform attribution', score: 2 },
        { label: 'No attribution model — we rely on "gut feeling"', score: 1 },
      ],
    },
    {
      id: 'budget_predictability',
      question: 'Can you predict how much to invest to get X leads or X customers next quarter?',
      options: [
        { label: 'Yes — we have historical benchmarks and a forecast model', score: 3 },
        { label: 'We have a rough idea but with a large margin of error', score: 2 },
        { label: 'No — investment is defined without expected result basis', score: 1 },
      ],
    },
  ],
  fr: [
    {
      id: 'roi_clarity',
      question: 'Connaissez-vous votre coût par lead et coût par client acquis (CAC) dans vos campagnes actuelles?',
      options: [
        { label: 'Oui — données à jour et segmentées par campagne et canal', score: 3 },
        { label: 'Nous avons une idée générale, mais les données ne sont pas exactes', score: 2 },
        { label: 'Nous n\'avons pas ces données ou elles sont très difficiles à calculer', score: 1 },
      ],
    },
    {
      id: 'landing_page_alignment',
      question: 'Vos landing pages sont-elles spécifiques à chaque campagne ou des pages génériques du site?',
      options: [
        { label: 'Pages dédiées par campagne, message aligné avec l\'annonce', score: 3 },
        { label: 'Certaines campagnes ont des pages dédiées, d\'autres non', score: 2 },
        { label: 'Toutes les campagnes pointent vers la homepage ou page de services', score: 1 },
      ],
    },
    {
      id: 'testing_culture',
      question: 'Avez-vous une cadence régulière de tests A/B (créatif, copy, segmentation, offre)?',
      options: [
        { label: 'Oui — tests structurés et systématiques en cycles définis', score: 3 },
        { label: 'Nous faisons quelques tests quand nous avons des ressources', score: 2 },
        { label: 'Rarement ou jamais de tests systématiques', score: 1 },
      ],
    },
    {
      id: 'ai_search_ads',
      question: 'Vos campagnes incluent-elles des stratégies pour les moteurs IA (Microsoft Copilot, Google AI Overviews, Perplexity Ads)?',
      options: [
        { label: 'Oui — nous testons et monitorisons déjà ces formats', score: 3 },
        { label: 'Nous suivons l\'évolution, mais n\'avons pas encore activé', score: 2 },
        { label: 'Non — nous nous concentrons uniquement sur Google/Meta traditionnels', score: 1 },
      ],
    },
    {
      id: 'attribution',
      question: 'Comment attribuez-vous les revenus aux campagnes? Avez-vous un modèle d\'attribution configuré?',
      options: [
        { label: 'Oui — modèle multi-touch ou data-driven configuré et utilisé', score: 3 },
        { label: 'Nous utilisons le last-click ou l\'attribution basique de la plateforme', score: 2 },
        { label: 'Pas de modèle d\'attribution — on se fie à l\'intuition', score: 1 },
      ],
    },
    {
      id: 'budget_predictability',
      question: 'Pouvez-vous prédire combien investir pour obtenir X leads ou X clients le prochain trimestre?',
      options: [
        { label: 'Oui — nous avons des benchmarks historiques et un modèle de prévision', score: 3 },
        { label: 'Nous avons une idée approximative mais avec grande marge d\'erreur', score: 2 },
        { label: 'Non — l\'investissement est défini sans base de résultats attendus', score: 1 },
      ],
    },
  ],
};

const texts: Record<string, Record<string, string>> = {
  pt: {
    title: 'Auditoria Paid Media',
    subtitle: 'Descobre em 30 segundos onde estás a desperdiçar budget — e o que vale a pena corrigir primeiro',
    startButton: 'Começar auditoria',
    questionOf: 'Pergunta',
    of: 'de',
    resultTitle: 'O teu resultado',
    scoreLabel: 'Score de Maturidade Paid',
    levelBeginner: 'Budget a ser desperdiçado',
    levelIntermediate: 'Em optimização',
    levelAdvanced: 'Paid media eficiente',
    recommendationBeginner: 'Há problemas estruturais nas tuas campanhas que estão a custar dinheiro sem retorno claro. Vamos identificar as fugas e criar um plano de correcção.',
    recommendationIntermediate: 'Tens uma base, mas há gaps importantes em atribuição, testes e alinhamento com landing pages que estão a limitar o teu ROAS.',
    recommendationAdvanced: 'Excelente estrutura! Vamos ver como integrar formatos emergentes de IA e escalar o que está a funcionar com mais eficiência.',
    flowiCta: 'Flowi, onde estou a perder budget?',
    ctaButton: 'Falar com a Flowi',
    restartButton: 'Fazer novamente',
    freeLabel: 'Grátis',
    noSignup: 'Sem registo',
    seconds: 'segundos',
  },
  en: {
    title: 'Paid Media Audit',
    subtitle: 'Find out in 30 seconds where you\'re wasting budget — and what\'s worth fixing first',
    startButton: 'Start audit',
    questionOf: 'Question',
    of: 'of',
    resultTitle: 'Your result',
    scoreLabel: 'Paid Maturity Score',
    levelBeginner: 'Budget being wasted',
    levelIntermediate: 'In optimisation',
    levelAdvanced: 'Efficient paid media',
    recommendationBeginner: 'There are structural problems in your campaigns costing money without clear return. Let\'s identify the leaks and create a correction plan.',
    recommendationIntermediate: 'You have a foundation, but there are important gaps in attribution, testing and landing page alignment limiting your ROAS.',
    recommendationAdvanced: 'Excellent structure! Let\'s see how to integrate AI emerging formats and scale what\'s working more efficiently.',
    flowiCta: 'Flowi, where am I losing budget?',
    ctaButton: 'Talk to Flowi',
    restartButton: 'Do it again',
    freeLabel: 'Free',
    noSignup: 'No signup',
    seconds: 'seconds',
  },
  fr: {
    title: 'Audit Paid Media',
    subtitle: 'Découvrez en 30 secondes où vous gaspillez du budget — et ce qui vaut la peine d\'être corrigé en premier',
    startButton: 'Commencer l\'audit',
    questionOf: 'Question',
    of: 'de',
    resultTitle: 'Votre résultat',
    scoreLabel: 'Score de Maturité Paid',
    levelBeginner: 'Budget gaspillé',
    levelIntermediate: 'En optimisation',
    levelAdvanced: 'Paid media efficace',
    recommendationBeginner: 'Il y a des problèmes structurels dans vos campagnes qui coûtent de l\'argent sans retour clair. Identifions les fuites et créons un plan de correction.',
    recommendationIntermediate: 'Vous avez une base, mais il y a des lacunes importantes en attribution, tests et alignement landing page qui limitent votre ROAS.',
    recommendationAdvanced: 'Excellente structure! Voyons comment intégrer les formats émergents IA et scaler ce qui fonctionne.',
    flowiCta: 'Flowi, où est-ce que je perds du budget?',
    ctaButton: 'Parler à Flowi',
    restartButton: 'Refaire',
    freeLabel: 'Gratuit',
    noSignup: 'Sans inscription',
    seconds: 'secondes',
  },
};

export default function PaidMediaDiagnostic({ locale }: DiagnosticProps) {
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
