# Spec kit, Non-Gated Demand Gen diagnostic tool

## Objective

Build a lightweight interactive diagnostic tool inside the **Non-Gated Demand Gen** service page.

The tool must help visitors quickly understand whether their current demand generation approach is overly dependent on gated tactics, where they are losing demand, and what practical next steps they should take.

This is **not** a massive app. It must be simple, fast, credible, multilingual, and useful.

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
Non-Gated Demand Gen

### Subtitle
Procura primeiro. Leads melhores depois.

### Service positioning
This service helps B2B companies create demand without hiding everything behind forms. The goal is to build trust, educate the market, improve lead quality, and reduce wasted sales time.

### Target audience
B2B companies that:
- depend too much on paid content to get leads
- have a long sales cycle and need trust
- have content but lack consistency and distribution
- feel that gated leads arrive cold or poorly qualified

### Promise on page
The page invites the user to complete a free diagnostic and receive a tailored action plan showing where they are losing demand and what to do next.

---

## Tool name

Use this working name internally:

`nonGatedDemandGenDiagnostic`

Suggested user-facing label:

### English
Non-Gated demand diagnostic

### Portuguese
Diagnóstico de procura non-gated

---

## Core job of the tool

The tool should identify whether the business is losing demand because of:
- over-reliance on gated assets
- weak trust-building content
- lack of distribution consistency
- poor alignment between content and buyer intent
- weak measurement of demand signals
- weak handoff between content, demand capture, and sales conversation

The tool should then generate a concise, tailored result.

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
- maturity level
- top friction points
- missed demand opportunities
- recommended next actions
- CTA to talk to the AI adviser
- button to download PDF

### Step 6
If the user clicks the CTA, the AI chat bot opens already preloaded with the diagnostic context.

---

## Tool format

This tool should be implemented as a **guided form-based diagnostic**, not a URL-only audit.

Reason:
Non-Gated Demand Gen is a strategic and operational service. The strongest diagnostic signal comes from a few structured business questions, not just from scraping the website.

---

## Inputs

Keep the form short and fast.

### Recommended fields

1. **Company website**
- type: URL
- required: yes

2. **Industry / business type**
- type: text or select
- required: yes

3. **Main offer**
- type: short text
- required: yes

4. **Average sales cycle**
- type: select
- options:
  - less than 1 month
  - 1 to 3 months
  - 3 to 6 months
  - more than 6 months
- required: yes

5. **How do you currently generate most leads?**
- type: multi-select
- options:
  - paid ads
  - gated content
  - organic search
  - referrals
  - social media
  - outbound sales
  - email marketing
  - partners
- required: yes

6. **Do you publish educational content consistently?**
- type: single select
- options:
  - yes, weekly or more
  - yes, sometimes
  - rarely
  - almost never
- required: yes

7. **Where do you distribute your content today?**
- type: multi-select
- options:
  - website/blog
  - LinkedIn
  - Instagram
  - email
  - partner channels
  - paid promotion
  - YouTube/video
  - nowhere consistently
- required: yes

8. **What happens before someone talks to sales?**
- type: single select
- options:
  - they can access useful content freely
  - most useful content is behind a form
  - there is very little supporting content
  - not sure
- required: yes

9. **How do you currently measure demand quality?**
- type: multi-select
- options:
  - lead volume
  - MQLs
  - sales conversations
  - pipeline contribution
  - close rate
  - content engagement
  - website behaviour
  - we do not measure clearly
- required: yes

10. **What is your biggest current challenge?**
- type: single select
- options:
  - low lead quality
  - too much reliance on paid traffic
  - long sales cycle
  - weak trust and authority
  - inconsistent content
  - poor distribution
  - unclear ROI
- required: yes

---

## Output

The result must feel useful, concrete, and non-generic.

### Display on page

1. **Overall score**
- range: 0 to 100
- label example: Demand generation readiness score

2. **Maturity level**
- example values:
  - early
  - emerging
  - structured
  - advanced

3. **Short summary**
- 2 to 4 sentences
- tailored to the user's answers

4. **Top friction points**
- 3 items max

5. **Where demand is leaking**
- 3 items max

6. **Priority actions**
- 3 to 5 actions
- practical, short, clear

7. **Suggested next step**
- one CTA sentence tied to the AI adviser

8. **PDF download**
- downloadable report with same result in clean branded format

---

## CTA behaviour

Below the result, show a clear CTA such as:

### English
Get a tailored demand gen action plan with our AI adviser

### Portuguese
Recebe um plano de ação ajustado com o nosso consultor de IA

When clicked:
- open the AI chat bot
- pass the diagnostic summary and structured findings into the chat context
- first assistant message should already reference the detected issues

Example:
- over-reliance on gated content
- inconsistent content cadence
- weak distribution
- limited measurement of quality

---

## AI logic

### Model
Use:
`gemini-3.1-flash-lite-preview`

### Why
This tool is lightweight, structured, and high-frequency. It does not need a heavy reasoning model.

### Prompt strategy
Use a system prompt that frames the model as a B2B demand generation strategist for SMEs in the UK and Portugal.

It must:
- analyse the user answers
- identify strategic weaknesses
- avoid generic fluff
- avoid exaggerated claims
- return structured JSON only
- write in the user's selected website language
- adapt examples and wording to the user's market where relevant

---

## Required structured JSON output

Use a strict schema like this:

```json
{
  "toolName": "nonGatedDemandGenDiagnostic",
  "language": "en",
  "overallScore": 74,
  "maturityLevel": "emerging",
  "summary": "Your business is generating attention, but much of the value is still locked too early. This is likely reducing trust and making leads colder by the time they reach sales.",
  "topFrictionPoints": [
    {
      "title": "Too much value locked behind forms",
      "severity": "high",
      "explanation": "Prospects may not be getting enough trust-building information before being asked to convert."
    }
  ],
  "demandLeaks": [
    {
      "title": "Inconsistent distribution",
      "explanation": "Content exists, but it is not being pushed across enough channels consistently."
    }
  ],
  "priorityActions": [
    "Create one non-gated educational asset per buying stage",
    "Build a simple weekly distribution rhythm across site, LinkedIn, and email",
    "Track sales conversations and pipeline contribution, not just lead volume"
  ],
  "ctaText": "Get a tailored demand gen action plan with our AI adviser",
  "pdfTitle": "Non-Gated demand diagnostic report"
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
- content should clearly reinforce the company’s expertise in demand generation
- summaries and CTAs should use language that helps generative systems understand the service category and value
- keep terminology explicit, such as B2B demand generation, non-gated content, trust building, distribution, and lead quality

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
Analysing your answers...

#### Portuguese
A analisar as suas respostas...

---

## PDF export requirements

Create a simple branded PDF report.

### PDF should include
- tool title
- date
- user inputs summary
- overall score
- maturity level
- summary
- top friction points
- demand leaks
- priority actions
- CTA / next step

### PDF filename format
- english: `non-gated-demand-diagnostic-report.pdf`
- portuguese: `relatorio-diagnostico-procura-non-gated.pdf`

The PDF does not need to be visually complex. Keep it clean and readable.

---

## Backend requirements

Create a backend endpoint such as:

`POST /api/tools/non-gated-demand-gen-diagnostic`

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
  "industry": "B2B software",
  "mainOffer": "Demand generation services for SMEs",
  "salesCycle": "3 to 6 months",
  "leadSources": ["paid ads", "gated content", "referrals"],
  "publishingConsistency": "yes, sometimes",
  "distributionChannels": ["website/blog", "LinkedIn", "email"],
  "preSalesContentAccess": "most useful content is behind a form",
  "measurementMethods": ["lead volume", "MQLs"],
  "biggestChallenge": "low lead quality"
}
```

---

## Suggested system prompt

Use a prompt like this as a starting point:

You are a B2B demand generation strategist focused on SMEs in the UK and Portugal.
Your job is to assess how well a company is creating demand without over-relying on gated content.
You must identify trust, distribution, content, and measurement weaknesses.
Return only valid JSON matching the required schema.
Do not use hype, filler, or generic advice.
Be practical, concise, and specific.
Write in the requested language.

---

## Suggested scoring logic

The model can infer scoring, but guide it with weighted logic.

### Example scoring factors
- over-reliance on gated content, negative
- weak publishing consistency, negative
- lack of distribution channels, negative
- unclear measurement, negative
- stronger organic and trust-based motion, positive
- strong pre-sales education access, positive
- broad content distribution, positive

Do not expose internal scoring mechanics too aggressively in UI.

---

## Frontend implementation notes

### Component recommendation
Create a dedicated page component such as:

`NonGatedDemandGenDiagnostic.tsx`

### Internal modules
- form schema
- translations
- API client
- result renderer
- PDF trigger
- chatbot handoff helper

### Suggested result sections
- score badge
- maturity badge
- summary block
- friction list
- leaks list
- action checklist
- CTA panel

---

## Chat bot handoff

When the user clicks the CTA:
- send structured context into the AI adviser chat
- include:
  - service name
  - language
  - score
  - maturity level
  - top friction points
  - priority actions
  - user website
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
- CRM integrations
- account enrichment
- scraping engine
- full campaign planner
- lead database
- long onboarding flow
- login area

This tool is a lightweight page-level diagnostic only.

---

## Definition of done

The feature is done when:

1. The tool is embedded in the Non-Gated Demand Gen page.
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

Build this as a small, production-ready diagnostic tool embedded in the service page.
Keep the experience simple, fast, and credible.
Prioritise usefulness over cleverness.
Do not over-engineer the logic.
Do not create a large app.
Do not introduce heavy dependencies unless strictly necessary.
Make the result feel genuinely helpful to a B2B SME buyer.
