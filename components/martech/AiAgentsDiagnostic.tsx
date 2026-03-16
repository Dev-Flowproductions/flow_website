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
      id: 'repetitive_tasks',
      question: 'A tua equipa passa mais de 2h por dia a responder as mesmas perguntas ou a fazer tarefas repetidas (copiar, encaminhar, resumir)?',
      options: [
        { label: 'Não — temos processos e automações que eliminam isso', score: 3 },
        { label: 'Sim, em algumas áreas — não é sistemático mas acontece', score: 2 },
        { label: 'Sim, muito — é uma das principais queixas da equipa', score: 1 },
      ],
    },
    {
      id: 'lead_qualification',
      question: 'Como é feita a qualificação inicial de leads (antes de chegar ao comercial)?',
      options: [
        { label: 'Processo automatizado com critérios definidos e scoring', score: 3 },
        { label: 'Semi-manual — há algum processo mas com muito trabalho humano', score: 2 },
        { label: 'Manual — cada lead é avaliada individualmente sem critérios claros', score: 1 },
      ],
    },
    {
      id: 'response_time',
      question: 'Quanto tempo demora a tua empresa a responder a um pedido de informação ou contacto de um potencial cliente?',
      options: [
        { label: 'Minutos — resposta automática imediata com contexto', score: 3 },
        { label: 'Horas — durante o horário de trabalho', score: 2 },
        { label: 'Dias ou sem resposta consistente', score: 1 },
      ],
    },
    {
      id: 'knowledge_consistency',
      question: 'A informação que a tua equipa partilha com clientes e prospects é consistente entre membros?',
      options: [
        { label: 'Sim — temos uma base de conhecimento centralizada e actualizada', score: 3 },
        { label: 'Parcialmente — há documentação mas não é sempre usada', score: 2 },
        { label: 'Não — cada pessoa diz coisas diferentes ou tem versões diferentes', score: 1 },
      ],
    },
    {
      id: 'ai_governance',
      question: 'Se implementasses um agente de IA hoje, tens definido o que ele pode e não pode dizer/fazer?',
      options: [
        { label: 'Sim — temos processos de revisão e governance para IA definidos', score: 3 },
        { label: 'Temos algumas ideias, mas não está formalizado', score: 2 },
        { label: 'Não — é um território novo sem regras definidas', score: 1 },
      ],
    },
    {
      id: 'handoff_process',
      question: 'Quando um lead ou cliente precisa de falar com um humano, há um processo claro de handoff com contexto?',
      options: [
        { label: 'Sim — o humano recebe contexto completo da conversa anterior', score: 3 },
        { label: 'Às vezes — depende de quem está disponível e do canal', score: 2 },
        { label: 'Não — o cliente tem de repetir tudo quando fala com alguém', score: 1 },
      ],
    },
  ],
  en: [
    {
      id: 'repetitive_tasks',
      question: 'Does your team spend more than 2h/day answering the same questions or doing repetitive tasks (copy, route, summarise)?',
      options: [
        { label: 'No — we have processes and automations that eliminate that', score: 3 },
        { label: 'Yes, in some areas — not systematic but it happens', score: 2 },
        { label: 'Yes, a lot — it\'s one of the team\'s main complaints', score: 1 },
      ],
    },
    {
      id: 'lead_qualification',
      question: 'How is initial lead qualification done (before reaching the sales rep)?',
      options: [
        { label: 'Automated process with defined criteria and scoring', score: 3 },
        { label: 'Semi-manual — some process but a lot of human work', score: 2 },
        { label: 'Manual — each lead evaluated individually without clear criteria', score: 1 },
      ],
    },
    {
      id: 'response_time',
      question: 'How long does your company take to respond to an information request or contact from a potential customer?',
      options: [
        { label: 'Minutes — immediate automated response with context', score: 3 },
        { label: 'Hours — during working hours', score: 2 },
        { label: 'Days or no consistent response', score: 1 },
      ],
    },
    {
      id: 'knowledge_consistency',
      question: 'Is the information your team shares with customers and prospects consistent across team members?',
      options: [
        { label: 'Yes — we have a centralised and up-to-date knowledge base', score: 3 },
        { label: 'Partially — there\'s documentation but it\'s not always used', score: 2 },
        { label: 'No — each person says different things or has different versions', score: 1 },
      ],
    },
    {
      id: 'ai_governance',
      question: 'If you implemented an AI agent today, do you have defined what it can and can\'t say/do?',
      options: [
        { label: 'Yes — we have review processes and AI governance defined', score: 3 },
        { label: 'We have some ideas, but it\'s not formalised', score: 2 },
        { label: 'No — it\'s new territory without defined rules', score: 1 },
      ],
    },
    {
      id: 'handoff_process',
      question: 'When a lead or customer needs to speak with a human, is there a clear handoff process with context?',
      options: [
        { label: 'Yes — the human receives full context from the previous conversation', score: 3 },
        { label: 'Sometimes — depends on who\'s available and the channel', score: 2 },
        { label: 'No — the customer has to repeat everything when speaking to someone', score: 1 },
      ],
    },
  ],
  fr: [
    {
      id: 'repetitive_tasks',
      question: 'Votre équipe passe-t-elle plus de 2h/jour à répondre aux mêmes questions ou à faire des tâches répétitives?',
      options: [
        { label: 'Non — nous avons des processus et automatisations qui éliminent cela', score: 3 },
        { label: 'Oui, dans certains domaines — pas systématique mais ça arrive', score: 2 },
        { label: 'Oui, beaucoup — c\'est l\'une des principales plaintes de l\'équipe', score: 1 },
      ],
    },
    {
      id: 'lead_qualification',
      question: 'Comment se fait la qualification initiale des leads (avant d\'arriver au commercial)?',
      options: [
        { label: 'Processus automatisé avec critères définis et scoring', score: 3 },
        { label: 'Semi-manuel — quelques processus mais beaucoup de travail humain', score: 2 },
        { label: 'Manuel — chaque lead évalué individuellement sans critères clairs', score: 1 },
      ],
    },
    {
      id: 'response_time',
      question: 'Combien de temps votre entreprise met-elle pour répondre à une demande d\'information d\'un client potentiel?',
      options: [
        { label: 'Minutes — réponse automatique immédiate avec contexte', score: 3 },
        { label: 'Heures — pendant les heures de travail', score: 2 },
        { label: 'Jours ou pas de réponse cohérente', score: 1 },
      ],
    },
    {
      id: 'knowledge_consistency',
      question: 'L\'information que votre équipe partage avec clients et prospects est-elle cohérente entre membres?',
      options: [
        { label: 'Oui — nous avons une base de connaissances centralisée et à jour', score: 3 },
        { label: 'Partiellement — il y a de la documentation mais pas toujours utilisée', score: 2 },
        { label: 'Non — chaque personne dit des choses différentes', score: 1 },
      ],
    },
    {
      id: 'ai_governance',
      question: 'Si vous implémentiez un agent IA aujourd\'hui, avez-vous défini ce qu\'il peut et ne peut pas dire/faire?',
      options: [
        { label: 'Oui — nous avons des processus de révision et de gouvernance IA définis', score: 3 },
        { label: 'Nous avons quelques idées, mais ce n\'est pas formalisé', score: 2 },
        { label: 'Non — c\'est un territoire nouveau sans règles définies', score: 1 },
      ],
    },
    {
      id: 'handoff_process',
      question: 'Quand un lead ou client a besoin de parler à un humain, y a-t-il un processus de handoff clair avec contexte?',
      options: [
        { label: 'Oui — l\'humain reçoit le contexte complet de la conversation précédente', score: 3 },
        { label: 'Parfois — ça dépend de qui est disponible et du canal', score: 2 },
        { label: 'Non — le client doit tout répéter quand il parle à quelqu\'un', score: 1 },
      ],
    },
  ],
};

const texts: Record<string, Record<string, string>> = {
  pt: {
    title: 'Diagnóstico AI Agents',
    subtitle: 'Descobre quais agentes de IA teriam mais impacto no teu negócio agora',
    startButton: 'Começar diagnóstico',
    questionOf: 'Pergunta',
    of: 'de',
    resultTitle: 'O teu resultado',
    scoreLabel: 'Score de Prontidão para AI Agents',
    levelBeginner: 'Grande potencial imediato',
    levelIntermediate: 'Prontos para começar',
    levelAdvanced: 'Pronto para escalar',
    recommendationBeginner: 'Há tarefas repetidas e processos manuais que um agente de IA pode resolver rapidamente. Vamos identificar onde o impacto é mais imediato.',
    recommendationIntermediate: 'Tens uma boa base. Um agente bem configurado vai libertar tempo da equipa e melhorar a qualidade dos leads de forma visível.',
    recommendationAdvanced: 'Estás bem preparado! Vamos explorar como expandir os agentes e integrar com CRM para mais impacto no pipeline.',
    flowiCta: 'Flowi, que agentes me recomendas?',
    ctaButton: 'Falar com a Flowi',
    restartButton: 'Fazer novamente',
    freeLabel: 'Grátis',
    noSignup: 'Sem registo',
    seconds: 'segundos',
  },
  en: {
    title: 'AI Agents Diagnostic',
    subtitle: 'Find out which AI agents would have the most impact on your business now',
    startButton: 'Start diagnostic',
    questionOf: 'Question',
    of: 'of',
    resultTitle: 'Your result',
    scoreLabel: 'AI Agent Readiness Score',
    levelBeginner: 'High immediate potential',
    levelIntermediate: 'Ready to start',
    levelAdvanced: 'Ready to scale',
    recommendationBeginner: 'There are repetitive tasks and manual processes that an AI agent can solve quickly. Let\'s identify where the impact is most immediate.',
    recommendationIntermediate: 'You have a good foundation. A well-configured agent will free up team time and visibly improve lead quality.',
    recommendationAdvanced: 'You\'re well prepared! Let\'s explore how to expand agents and integrate with CRM for more pipeline impact.',
    flowiCta: 'Flowi, which agents do you recommend?',
    ctaButton: 'Talk to Flowi',
    restartButton: 'Do it again',
    freeLabel: 'Free',
    noSignup: 'No signup',
    seconds: 'seconds',
  },
  fr: {
    title: 'Diagnostic AI Agents',
    subtitle: 'Découvrez quels agents IA auraient le plus d\'impact sur votre entreprise maintenant',
    startButton: 'Commencer le diagnostic',
    questionOf: 'Question',
    of: 'de',
    resultTitle: 'Votre résultat',
    scoreLabel: 'Score de Préparation AI Agents',
    levelBeginner: 'Fort potentiel immédiat',
    levelIntermediate: 'Prêt à commencer',
    levelAdvanced: 'Prêt à scaler',
    recommendationBeginner: 'Il y a des tâches répétitives et des processus manuels qu\'un agent IA peut résoudre rapidement. Identifions où l\'impact est le plus immédiat.',
    recommendationIntermediate: 'Vous avez une bonne base. Un agent bien configuré va libérer du temps d\'équipe et améliorer visiblement la qualité des leads.',
    recommendationAdvanced: 'Vous êtes bien préparé! Explorons comment étendre les agents et intégrer avec le CRM pour plus d\'impact sur le pipeline.',
    flowiCta: 'Flowi, quels agents me recommandes-tu?',
    ctaButton: 'Parler à Flowi',
    restartButton: 'Refaire',
    freeLabel: 'Gratuit',
    noSignup: 'Sans inscription',
    seconds: 'secondes',
  },
};

export default function AiAgentsDiagnostic({ locale }: DiagnosticProps) {
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
