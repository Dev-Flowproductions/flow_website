# Spec kit, AI Agents opportunity diagnostic tool

## Objective

Build a lightweight interactive diagnostic tool inside the **AI Agents for Marketing and Sales** service page.

The tool must help visitors quickly understand which AI agents would make the biggest difference in their business, where the most obvious automation and support opportunities are, and what practical next steps they should take.

This is **not** a full agent builder and not a technical workflow designer. It must be simple, fast, credible, multilingual, and useful.

The tool should generate:
- an on-page diagnostic result
- a short action plan
- a CTA into the AI chat bot agent
- a downloadable PDF report

The tool must be:
- lightweight
- embedded directly in the service page
- SEO-ready
- AEO-ready
- GEO-ready
- translated to the website's currently available languages
- powered by **Google Gemini API**, using **gemini-3.1-flash-lite-preview**

---

## Service page context

### Page title
AI Agents para Marketing e Vendas

### Subtitle
Respostas rápidas, qualificação melhor, menos tarefas repetidas.

### Service positioning
AI agents are assistants that execute tasks autonomously or semi-autonomously: answering questions, qualifying requests, supporting follow-ups, and helping internal teams. The value comes from doing this with context, rules, and control.

### What an AI agent is
A digital colleague that:
- answers with the right information
- follows rules about what it can and cannot say
- records what happened
- passes the case to a human when needed

### Target audience
This service is for companies that:
- receive many requests and cannot answer quickly enough
- have teams losing hours on repetitive tasks
- want to qualify leads better before passing them to sales
- need consistency in information
- want to use AI with rules and control, without unnecessary risk

### Promise on page
The page invites the user to complete a free diagnostic and receive a tailored action plan with recommendations on which AI agents would have the greatest impact in their operation.

### What the user should receive
- suggestions of AI agents by area, such as marketing, sales, support, and internal team
- the most obvious use cases
- what each agent needs to work well
- priorities, what to implement first and why
- a control note covering limits, human handoff, and recommended governance

### What the service delivers
- FAQ agents for website, product, service, and support
- initial lead qualification with defined criteria
- sales handoff with context
- internal agents for the team
- governance, including limits, validation, logs, and continuous improvement

---

## Tool name

Use this working name internally:

`aiAgentOpportunityDiagnostic`

Suggested user-facing labels:

### English
AI agent opportunity diagnostic

### Portuguese
Diagnóstico de oportunidades para AI Agents

---

## Core job of the tool

The tool should identify whether the business would benefit most from agents that:
- answer frequent questions
- qualify inbound leads
- support follow-up flows
- summarise, route, or log internal work
- reduce repetitive internal tasks
- improve consistency and speed without removing needed human control

The tool should then generate a concise, tailored result showing:
- the most relevant agent types
- why they matter
- what each one needs to work well
- recommended implementation priorities
- governance and handoff notes

---

## Main UX flow

### Step 1
User opens the service page and sees a short CTA block for the tool.

### Step 2
User answers a short guided diagnostic with around **8 to 10 questions**.

### Step 3
The system sends the answers to the backend.

### Step 4
Backend calls Gemini and asks it to return a structured JSON diagnostic.

### Step 5
Frontend displays:
- overall score
- readiness level
- top opportunity areas
- recommended AI agent types
- what each recommended agent needs
- implementation priorities
- governance and handoff note
- CTA to talk to the AI adviser
- button to download PDF

### Step 6
If the user clicks the CTA, the AI chat bot opens already preloaded with the diagnostic context.

---

## Tool format

This tool should be implemented as a **guided form-based opportunity diagnostic**, not as a generic AI maturity quiz.

Reason:
The page promise is very clear. The visitor wants to know which agents make sense for their business, which use cases are obvious, and what should come first.

---

## Inputs

Keep the form short and fast.

### Recommended fields

1. **Company website**
- type: URL
- required: no

2. **How many inbound requests or enquiries do you handle each week?**
- type: single select
- options:
  - less than 10
  - 10 to 50
  - 50 to 200
  - more than 200
- required: yes

3. **Which areas feel most overloaded today?**
- type: multi-select
- options:
  - answering recurring questions
  - qualifying leads
  - follow-up after first contact
  - internal admin tasks
  - support or customer service
  - routing requests to the right person
  - summarising meetings or conversations
- required: yes

4. **What happens most often today when a new lead or request arrives?**
- type: single select
- options:
  - a person handles it manually from start to finish
  - there is a partial process, but it is inconsistent
  - there is some automation, but it lacks context
  - not sure
- required: yes

5. **How clearly are your qualification criteria or response rules defined?**
- type: single select
- options:
  - very clearly defined
  - partly defined
  - mostly informal
  - not defined
- required: yes

6. **Where would consistency matter most?**
- type: multi-select
- options:
  - website and inbound questions
  - lead qualification
  - support responses
  - internal team requests
  - follow-up communication
  - handoff to sales
- required: yes

7. **What is your biggest current challenge?**
- type: single select
- options:
  - slow response time
  - poor lead quality
  - too much repetitive work
  - inconsistent information
  - missed follow-up
  - too much manual routing
  - concern about AI risk or loss of control
- required: yes

8. **How comfortable are you with human handoff when needed?**
- type: single select
- options:
  - essential in many cases
  - important in some cases
  - only needed occasionally
  - not sure
- required: yes

9. **Do you already have useful knowledge sources or process documents?**
- type: single select
- options:
  - yes, well organised
  - yes, but scattered
  - very limited
  - no
- required: yes

10. **What matters most in the first phase?**
- type: single select
- options:
  - saving time
  - improving lead quality
  - improving response speed
  - reducing inconsistency
  - reducing operational risk
- required: yes

---

## Output

The result must feel useful, concrete, and non-generic.

### Display on page

1. **Overall score**
- range: 0 to 100
- label example: AI agent opportunity score

2. **Readiness level**
- example values:
  - early
  - emerging
  - ready to pilot
  - ready to implement

3. **Short summary**
- 2 to 4 sentences
- tailored to the user's answers

4. **Top opportunity areas**
- 3 items max

5. **Recommended AI agents**
- 2 to 4 agent types max
- for each one include:
  - agent name
  - what it would do
  - why it fits
  - what it needs to work well

6. **Implementation priorities**
- 3 items max
- what to do first and why

7. **Governance and handoff note**
- one concise note on limits, validation, logs, and when a human should take over

8. **Suggested next step**
- one CTA sentence tied to the AI adviser

9. **PDF download**
- downloadable report with same result in clean branded format

---

## CTA behaviour

Below the result, show a clear CTA such as:

### English
Get a tailored AI agent action plan with our AI adviser

### Portuguese
Recebe um plano de ação ajustado para AI Agents com o nosso consultor de IA

When clicked:
- open the AI chat bot
- pass the diagnostic summary and structured findings into the chat context
- first assistant message should already reference the detected opportunity areas and recommended agents

Example:
- FAQ agent for recurring questions
- lead qualification agent with defined criteria
- internal routing or summarisation agent
- human handoff needed for edge cases and sensitive queries

---

## AI logic

### Model
Use:
`gemini-3.1-flash-lite-preview`

### Why
This tool is lightweight, structured, and high-frequency. It does not need a heavy reasoning model.

### Prompt strategy
Use a system prompt that frames the model as a B2B operations and AI agent strategist for SMEs in the UK and Portugal.

It must:
- analyse the user answers
- identify the most relevant AI agent opportunities
- recommend only a small number of high-impact agents
- explain what each one needs to work well
- include governance and handoff notes
- avoid generic fluff
- avoid exaggerated claims
- return structured JSON only
- write in the user's selected website language
- adapt wording to the user's market where relevant

---

## Required structured JSON output

Use a strict schema like this:

```json
{
  "toolName": "aiAgentOpportunityDiagnostic",
  "language": "en",
  "overallScore": 73,
  "readinessLevel": "ready to pilot",
  "summary": "Your business appears to have clear opportunities for AI agents, especially in repetitive inbound handling and lead qualification. The best starting point is to automate narrow, high-volume tasks with clear rules and human fallback.",
  "topOpportunityAreas": [
    {
      "title": "Recurring inbound questions",
      "explanation": "A large share of team time may be going into answering similar requests repeatedly."
    }
  ],
  "recommendedAgents": [
    {
      "agentName": "FAQ and enquiry agent",
      "whatItWouldDo": "Answer common questions using approved information and route complex cases to a person.",
      "whyItFits": "This is a strong fit where response speed and consistency matter.",
      "whatItNeeds": [
        "approved source content",
        "clear response boundaries",
        "handoff rules"
      ]
    }
  ],
  "implementationPriorities": [
    "Start with one narrow, high-volume use case",
    "Define response rules and escalation paths clearly",
    "Prepare the core knowledge sources before rollout"
  ],
  "governanceNote": "Use clear limits, keep logs, and hand off to a human for edge cases, sensitive questions, or unclear intent.",
  "ctaText": "Get a tailored AI agent action plan with our AI adviser",
  "pdfTitle": "AI agent opportunity diagnostic report"
}
```

---

## Language and localisation requirements

The tool must support all languages already available on the website.

At minimum, prepare the architecture so all labels, questions, validation messages, AI prompts, and output content are localised.

### Rules
- detect current website language from the page/app context
- render the form in that language
- ask Gemini to answer in that same language
- generate the PDF in that same language
- ensure button labels, headings, error states, and CTA text are translated too

Do not hardcode text in one language inside the component.

Use an i18n translation structure.

---

## SEO, AEO, GEO requirements

This tool must not harm page performance or crawlability.

### SEO
- render core page content server-side where possible
- keep the form lightweight
- do not block main content behind JS-only rendering
- keep a clean semantic heading structure
- make result sections index-safe only if desired, otherwise keep them user-session based
- ensure PDFs use meaningful filenames and metadata

### AEO
- tool copy must use clear natural-language phrasing
- results must be concise and direct
- summaries should be readable and answer-style, not jargon-heavy
- make key findings easy for AI systems and answer engines to interpret if surfaced in visible HTML

### GEO
- content should clearly reinforce the company’s expertise in AI agents for marketing and sales
- summaries and CTAs should use language that helps generative systems understand the service category and value
- keep terminology explicit, such as AI agent, lead qualification, follow-up, handoff, governance, logs, and control

---

## UI requirements

Keep UI compact and embedded in the page design.

### Suggested structure
- intro text
- form card
- submit button
- loading state
- result card
- CTA area
- PDF button

### UX rules
- no long wizard
- no more than 8 to 10 questions
- no unnecessary animations
- fast response
- mobile-friendly
- accessible labels and contrast
- clear error handling

### Loading copy example

#### English
Analysing your operation...

#### Portuguese
A analisar a sua operação...

---

## PDF export requirements

Create a simple branded PDF report.

### PDF should include
- tool title
- date
- user inputs summary
- overall score
- readiness level
- summary
- top opportunity areas
- recommended AI agents
- implementation priorities
- governance note
- CTA / next step

### PDF filename format
- english: `ai-agent-opportunity-diagnostic-report.pdf`
- portuguese: `relatorio-diagnostico-oportunidades-ai-agents.pdf`

The PDF does not need to be visually complex. Keep it clean and readable.

---

## Backend requirements

Create a backend endpoint such as:

`POST /api/tools/ai-agent-opportunity-diagnostic`

### Backend responsibilities
- validate payload
- normalise answers
- build Gemini prompt
- call Gemini API
- validate JSON response
- return structured result to frontend
- support PDF generation route if needed

### Validation
Use strict schema validation for request and response.

Recommended:
- Zod or equivalent

---

## Suggested request payload

```json
{
  "language": "en",
  "websiteUrl": "https://example.com",
  "weeklyInboundVolume": "50 to 200",
  "overloadedAreas": ["answering recurring questions", "qualifying leads", "follow-up after first contact"],
  "currentHandlingState": "a person handles it manually from start to finish",
  "ruleClarity": "mostly informal",
  "consistencyNeeds": ["website and inbound questions", "lead qualification", "handoff to sales"],
  "biggestChallenge": "too much repetitive work",
  "handoffImportance": "important in some cases",
  "knowledgeReadiness": "yes, but scattered",
  "firstPhasePriority": "saving time"
}
```

---

## Suggested system prompt

Use a prompt like this as a starting point:

You are a B2B operations and AI agent strategist focused on SMEs in the UK and Portugal.
Your job is to assess which AI agents would create the most impact in a business and what should be implemented first.
You must identify the most relevant agent types, explain what each one needs to work well, and include governance and human handoff notes.
Return only valid JSON matching the required schema.
Do not use hype, filler, or generic advice.
Be practical, concise, and specific.
Write in the requested language.

---

## Suggested scoring logic

The model can infer scoring, but guide it with weighted logic.

### Example scoring factors
- high repetitive inbound volume, positive opportunity signal
- manual handling from start to finish, positive opportunity signal
- poor rule definition, lowers readiness but increases need
- weak knowledge readiness, lowers implementation readiness
- clear need for consistency, positive opportunity signal
- realistic human handoff expectations, positive
- focus on one first-phase priority, positive

Do not expose internal scoring mechanics too aggressively in UI.

---

## Frontend implementation notes

### Component recommendation
Create a dedicated page component such as:

`AiAgentOpportunityDiagnostic.tsx`

### Internal modules
- form schema
- translations
- API client
- result renderer
- PDF trigger
- chatbot handoff helper

### Suggested result sections
- score badge
- readiness badge
- summary block
- opportunity areas list
- recommended agents cards
- priorities list
- governance note block
- CTA panel

---

## Chat bot handoff

When the user clicks the CTA:
- send structured context into the AI adviser chat
- include:
  - service name
  - language
  - score
  - readiness level
  - top opportunity areas
  - recommended agents
  - implementation priorities
  - website
  - biggest challenge

This avoids making the user repeat themselves.

---

## Analytics tracking

Track tool usage events.

### Minimum events
- diagnostic_started
- diagnostic_completed
- pdf_downloaded
- chatbot_cta_clicked

Include language and service page context.

---

## Performance guardrails

- do not load heavy libraries unless needed
- lazy load PDF generation if possible
- avoid blocking page render
- keep network payloads small
- cache static translations
- debounce submission if needed
- do not turn this into a multi-step SPA monster

---

## Accessibility

- all inputs must have labels
- support keyboard navigation
- use aria-live for result loading and success states
- ensure contrast is accessible
- ensure buttons and fields are usable on mobile

---

## Out of scope

Do not build:
- agent builder
- workflow canvas
- CRM integration layer
- knowledge base uploader
- orchestration dashboard
- long onboarding flow
- login area

This tool is a lightweight page-level opportunity diagnostic only.

---

## Definition of done

The feature is done when:

1. The tool is embedded in the AI Agents for Marketing and Sales page.
2. The form works in all currently available site languages.
3. Submission triggers the backend and Gemini analysis.
4. The result renders cleanly on the page.
5. The output is useful, concise, and non-generic.
6. The CTA opens the AI adviser with context.
7. The user can download a PDF report.
8. The page remains performant and mobile-friendly.
9. The implementation does not damage SEO, AEO, or GEO readiness.
10. All text is localised correctly.

---

## Final instruction to Cursor

Build this as a small, production-ready opportunity diagnostic tool embedded in the service page.
Keep the experience simple, fast, and credible.
Do not over-engineer it.
Do not create a full agent platform.
Recommend only a small number of high-impact agents.
Make the result feel genuinely helpful to a B2B SME buyer.
