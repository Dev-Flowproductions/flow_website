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
      id: 'ai_visibility',
      question: 'O teu website aparece quando alguém faz uma pergunta ao ChatGPT, Gemini ou Perplexity sobre o teu sector?',
      options: [
        { label: 'Sim, já verificámos e somos citados por motores de IA', score: 3 },
        { label: 'Não sei, nunca testámos', score: 2 },
        { label: 'Não, e não sabemos como mudar isso', score: 1 },
      ],
    },
    {
      id: 'content_structure',
      question: 'O teu conteúdo está estruturado para responder perguntas diretas (FAQs, how-tos, definições)?',
      options: [
        { label: 'Sim, temos estrutura clara com perguntas e respostas', score: 3 },
        { label: 'Temos algum conteúdo assim, mas não é sistemático', score: 2 },
        { label: 'O nosso conteúdo é maioritariamente texto corrido', score: 1 },
      ],
    },
    {
      id: 'technical_seo',
      question: 'Qual é o estado do SEO técnico do teu site (velocidade, Core Web Vitals, schema markup)?',
      options: [
        { label: 'Tudo otimizado — passa em todos os testes do Google', score: 3 },
        { label: 'Sabemos que há problemas, mas ainda não corrigimos', score: 2 },
        { label: 'Nunca analisámos a parte técnica a fundo', score: 1 },
      ],
    },
    {
      id: 'keyword_intent',
      question: 'A tua estratégia de conteúdo é construída com base na intenção de pesquisa do utilizador?',
      options: [
        { label: 'Sim, mapeamos intenção (informacional, comercial, transacional)', score: 3 },
        { label: 'Usamos palavras-chave, mas não pensamos muito na intenção', score: 2 },
        { label: 'Criamos conteúdo sem estratégia de SEO definida', score: 1 },
      ],
    },
    {
      id: 'organic_performance',
      question: 'Como está o teu tráfego orgânico nos últimos 6 meses?',
      options: [
        { label: 'A crescer consistentemente', score: 3 },
        { label: 'Estável ou com ligeiras oscilações', score: 2 },
        { label: 'Em queda ou praticamente inexistente', score: 1 },
      ],
    },
    {
      id: 'entity_authority',
      question: 'O teu site tem autoridade de entidade — o Google (e a IA) sabe claramente quem és, o que fazes e para quem?',
      options: [
        { label: 'Sim, temos informação consistente e bem estruturada em todo o site', score: 3 },
        { label: 'Mais ou menos — há inconsistências entre páginas', score: 2 },
        { label: 'Não, cada página parece uma ilha', score: 1 },
      ],
    },
  ],
  en: [
    {
      id: 'ai_visibility',
      question: 'Does your website appear when someone asks ChatGPT, Gemini or Perplexity a question about your sector?',
      options: [
        { label: 'Yes, we\'ve verified and we\'re cited by AI engines', score: 3 },
        { label: 'I don\'t know, we\'ve never tested this', score: 2 },
        { label: 'No, and we don\'t know how to change that', score: 1 },
      ],
    },
    {
      id: 'content_structure',
      question: 'Is your content structured to answer direct questions (FAQs, how-tos, definitions)?',
      options: [
        { label: 'Yes, we have clear Q&A structure throughout', score: 3 },
        { label: 'We have some of this, but it\'s not systematic', score: 2 },
        { label: 'Our content is mostly long-form prose', score: 1 },
      ],
    },
    {
      id: 'technical_seo',
      question: 'What is the state of your technical SEO (speed, Core Web Vitals, schema markup)?',
      options: [
        { label: 'Fully optimised — passes all Google tests', score: 3 },
        { label: 'We know there are issues but haven\'t fixed them yet', score: 2 },
        { label: 'We\'ve never done a deep technical analysis', score: 1 },
      ],
    },
    {
      id: 'keyword_intent',
      question: 'Is your content strategy built around user search intent?',
      options: [
        { label: 'Yes, we map intent types (informational, commercial, transactional)', score: 3 },
        { label: 'We use keywords but don\'t think much about intent', score: 2 },
        { label: 'We create content without a defined SEO strategy', score: 1 },
      ],
    },
    {
      id: 'organic_performance',
      question: 'How has your organic traffic been in the last 6 months?',
      options: [
        { label: 'Growing consistently', score: 3 },
        { label: 'Stable or with slight fluctuations', score: 2 },
        { label: 'Declining or nearly non-existent', score: 1 },
      ],
    },
    {
      id: 'entity_authority',
      question: 'Does your site have entity authority — does Google (and AI) clearly know who you are, what you do and for whom?',
      options: [
        { label: 'Yes, consistent and well-structured info across the whole site', score: 3 },
        { label: 'Sort of — there are inconsistencies between pages', score: 2 },
        { label: 'No, each page feels like an island', score: 1 },
      ],
    },
  ],
  fr: [
    {
      id: 'ai_visibility',
      question: 'Votre site web apparaît-il quand quelqu\'un pose une question à ChatGPT, Gemini ou Perplexity sur votre secteur?',
      options: [
        { label: 'Oui, nous avons vérifié et nous sommes cités par les moteurs IA', score: 3 },
        { label: 'Je ne sais pas, nous n\'avons jamais testé cela', score: 2 },
        { label: 'Non, et nous ne savons pas comment changer ça', score: 1 },
      ],
    },
    {
      id: 'content_structure',
      question: 'Votre contenu est-il structuré pour répondre à des questions directes (FAQs, how-tos, définitions)?',
      options: [
        { label: 'Oui, nous avons une structure Q&R claire sur tout le site', score: 3 },
        { label: 'Nous en avons un peu, mais ce n\'est pas systématique', score: 2 },
        { label: 'Notre contenu est principalement du texte courant', score: 1 },
      ],
    },
    {
      id: 'technical_seo',
      question: 'Quel est l\'état de votre SEO technique (vitesse, Core Web Vitals, schema markup)?',
      options: [
        { label: 'Tout est optimisé — passe tous les tests Google', score: 3 },
        { label: 'Nous savons qu\'il y a des problèmes mais ne les avons pas corrigés', score: 2 },
        { label: 'Nous n\'avons jamais fait d\'analyse technique approfondie', score: 1 },
      ],
    },
    {
      id: 'keyword_intent',
      question: 'Votre stratégie de contenu est-elle construite autour de l\'intention de recherche?',
      options: [
        { label: 'Oui, nous cartographions les types d\'intention', score: 3 },
        { label: 'Nous utilisons des mots-clés mais ne pensons pas beaucoup à l\'intention', score: 2 },
        { label: 'Nous créons du contenu sans stratégie SEO définie', score: 1 },
      ],
    },
    {
      id: 'organic_performance',
      question: 'Comment a évolué votre trafic organique ces 6 derniers mois?',
      options: [
        { label: 'En croissance constante', score: 3 },
        { label: 'Stable ou avec de légères fluctuations', score: 2 },
        { label: 'En baisse ou pratiquement inexistant', score: 1 },
      ],
    },
    {
      id: 'entity_authority',
      question: 'Votre site a-t-il une autorité d\'entité — Google (et l\'IA) sait-il clairement qui vous êtes?',
      options: [
        { label: 'Oui, informations cohérentes et bien structurées sur tout le site', score: 3 },
        { label: 'Plus ou moins — il y a des incohérences entre les pages', score: 2 },
        { label: 'Non, chaque page semble une île', score: 1 },
      ],
    },
  ],
};

const texts: Record<string, Record<string, string>> = {
  pt: {
    title: 'Diagnóstico AEO, GEO & SEO',
    subtitle: 'Descobre em 30 segundos se o teu site está preparado para pesquisa e IA',
    startButton: 'Começar diagnóstico',
    questionOf: 'Pergunta',
    of: 'de',
    resultTitle: 'O teu resultado',
    scoreLabel: 'Score de Prontidão',
    levelBeginner: 'Precisas de base',
    levelIntermediate: 'No caminho certo',
    levelAdvanced: 'Bem posicionado',
    recommendationBeginner: 'O teu site tem oportunidades significativas para aparecer mais — tanto no Google como em respostas de IA. Vamos começar pela auditoria.',
    recommendationIntermediate: 'Tens uma base, mas há lacunas importantes em AEO/GEO que estão a limitar a tua visibilidade. Vamos identificar e priorizar.',
    recommendationAdvanced: 'Estás bem posicionado! Vamos ver como afinar a estratégia de GEO para seres citado ainda mais por motores de IA.',
    flowiCta: 'Flowi, o que devo melhorar primeiro?',
    ctaButton: 'Falar com a Flowi',
    restartButton: 'Fazer novamente',
    freeLabel: 'Grátis',
    noSignup: 'Sem registo',
    seconds: 'segundos',
  },
  en: {
    title: 'AEO, GEO & SEO Diagnostic',
    subtitle: 'Discover in 30 seconds if your site is ready for search and AI',
    startButton: 'Start diagnostic',
    questionOf: 'Question',
    of: 'of',
    resultTitle: 'Your result',
    scoreLabel: 'Readiness Score',
    levelBeginner: 'Needs foundation',
    levelIntermediate: 'On the right track',
    levelAdvanced: 'Well positioned',
    recommendationBeginner: 'Your site has significant opportunities to appear more — both on Google and in AI answers. Let\'s start with the audit.',
    recommendationIntermediate: 'You have a foundation, but there are important AEO/GEO gaps limiting your visibility. Let\'s identify and prioritise.',
    recommendationAdvanced: 'You\'re well positioned! Let\'s fine-tune the GEO strategy to get cited even more by AI engines.',
    flowiCta: 'Flowi, what should I improve first?',
    ctaButton: 'Talk to Flowi',
    restartButton: 'Do it again',
    freeLabel: 'Free',
    noSignup: 'No signup',
    seconds: 'seconds',
  },
  fr: {
    title: 'Diagnostic AEO, GEO & SEO',
    subtitle: 'Découvrez en 30 secondes si votre site est prêt pour la recherche et l\'IA',
    startButton: 'Commencer le diagnostic',
    questionOf: 'Question',
    of: 'de',
    resultTitle: 'Votre résultat',
    scoreLabel: 'Score de Préparation',
    levelBeginner: 'Besoin de fondations',
    levelIntermediate: 'Sur la bonne voie',
    levelAdvanced: 'Bien positionné',
    recommendationBeginner: 'Votre site a des opportunités significatives pour apparaître davantage — sur Google et dans les réponses IA. Commençons par l\'audit.',
    recommendationIntermediate: 'Vous avez une base, mais il y a des lacunes AEO/GEO importantes qui limitent votre visibilité. Identifions et priorisons.',
    recommendationAdvanced: 'Vous êtes bien positionné! Affinons la stratégie GEO pour être encore plus cité par les moteurs IA.',
    flowiCta: 'Flowi, que dois-je améliorer en premier?',
    ctaButton: 'Parler à Flowi',
    restartButton: 'Refaire',
    freeLabel: 'Gratuit',
    noSignup: 'Sans inscription',
    seconds: 'secondes',
  },
};

export default function AeoSeoGeoDiagnostic({ locale }: DiagnosticProps) {
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
