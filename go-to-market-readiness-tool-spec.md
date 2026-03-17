# Spec kit, Go-to-Market readiness diagnostic tool

## Objective

Build a lightweight interactive diagnostic tool inside the **Go-to-Market strategy** service page.

The tool must help visitors quickly understand whether they need Go-to-Market work now, where their current market approach is weak, and what practical next steps they should take.

This is **not** a full GTM planner. It must be simple, fast, credible, multilingual, and useful.

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
Estratégia Go-to-Market

### Subtitle
Para entrar, lançar ou escalar sem atrito

### Service positioning
Go-to-Market is the plan for taking an offer to market clearly: what you sell, who it is for, why you are different, and how you reach the right people.

### When this service makes sense
- launch of a new product or service
- brand repositioning
- entry into a new segment
- stalled brand growth
- commercial team saying “we cannot explain this quickly”

### Promise on page
The page invites the user to complete a free diagnostic and receive a tailored action plan showing whether it makes sense to work on a Go-to-Market strategy now, and where to start.

### What the service delivers
- positioning and value proposition
- messaging by audience, decision-maker vs user
- simple narrative with proof
- channel map and phased plan
- priorities, what to do now vs later

### What will improve
- clearer messaging internally and externally
- less friction across site, campaigns, and sales
- more consistency between teams
- faster decisions on where to invest

---

## Tool name

Use this working name internally:

`goToMarketReadinessDiagnostic`

Suggested user-facing label:

### English
Go-to-Market readiness diagnostic

### Portuguese
Diagnóstico de prontidão Go-to-Market

---

## Core job of the tool

The tool should identify whether the business is losing momentum because of:
- unclear positioning
- weak value proposition
- inconsistent messaging between audiences
- lack of proof and narrative clarity
- channel confusion
- trying to do too much at once
- internal misalignment between marketing, sales, and leadership

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
- readiness level
- top message and market friction points
- clarity gaps
- recommended next actions
- CTA to talk to the AI adviser
- button to download PDF

### Step 6
If the user clicks the CTA, the AI chat bot opens already preloaded with the diagnostic context.

---

## Tool format

This tool should be implemented as a **guided form-based diagnostic**, not a long workshop and not a generic idea generator.

Reason:
Go-to-Market strategy depends on clarity, segmentation, narrative, channels, and sequencing. The strongest signal comes from a few structured business questions.

---

## Inputs

Keep the form short and fast.

### Recommended fields

1. **Company website**
- type: URL
- required: yes

2. **What are you bringing to market?**
- type: short text
- required: yes

3. **What best describes your current situation?**
- type: single select
- options:
  - launching a new offer
  - repositioning an existing offer
  - entering a new market or segment
  - trying to scale an existing motion
  - not sure
- required: yes

4. **How clearly can your team explain the offer in one sentence?**
- type: single select
- options:
  - very clearly
  - somewhat clearly
  - with difficulty
  - not clearly at all
- required: yes

5. **Who are you mainly trying to reach?**
- type: short text or select
- required: yes

6. **Do decision-makers and end users need different messaging?**
- type: single select
- options:
  - yes, and we have that defined
  - yes, but it is not clearly defined
  - no
  - not sure
- required: yes

7. **What is your biggest current Go-to-Market challenge?**
- type: single select
- options:
  - unclear positioning
  - weak value proposition
  - message too complex
  - wrong channels
  - poor conversion from interest to conversation
  - internal misalignment
  - too many priorities at once
- required: yes

8. **Which channels are you currently relying on most?**
- type: multi-select
- options:
  - website
  - organic search
  - social media
  - paid ads
  - outbound sales
  - email
  - partners
  - events
- required: yes

9. **Do you already have proof points that support the offer?**
- type: single select
- options:
  - yes, strong proof
  - some proof, but not organised
  - very little proof
  - no
- required: yes

10. **How aligned are marketing and sales on the offer and message?**
- type: single select
- options:
  - highly aligned
  - mostly aligned
  - partially aligned
  - poorly aligned
- required: yes

---

## Output

The result must feel useful, concrete, and non-generic.

### Display on page

1. **Overall score**
- range: 0 to 100
- label example: Go-to-Market readiness score

2. **Readiness level**
- example values:
  - early
  - forming
  - ready to refine
  - market-ready

3. **Short summary**
- 2 to 4 sentences
- tailored to the user's answers

4. **Top friction points**
- 3 items max

5. **Clarity gaps**
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
Get a tailored Go-to-Market action plan with our AI adviser

### Portuguese
Recebe um plano de ação Go-to-Market ajustado com o nosso consultor de IA

When clicked:
- open the AI chat bot
- pass the diagnostic summary and structured findings into the chat context
- first assistant message should already reference the detected issues

Example:
- unclear value proposition
- weak audience-specific messaging
- no phased channel plan
- poor alignment between marketing and sales

---

## AI logic

### Model
Use:
`gemini-3.1-flash-lite-preview`

### Why
This tool is lightweight, structured, and high-frequency. It does not need a heavy reasoning model.

### Prompt strategy
Use a system prompt that frames the model as a B2B Go-to-Market strategist for SMEs in the UK and Portugal.

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
  "toolName": "goToMarketReadinessDiagnostic",
  "language": "en",
  "overallScore": 68,
  "readinessLevel": "forming",
  "summary": "Your offer appears to have potential, but the current market story is not yet clear enough. This is likely creating friction across the website, campaigns, and sales conversations.",
  "topFrictionPoints": [
    {
      "title": "Value proposition is not sharp enough",
      "severity": "high",
      "explanation": "The offer may still be described in a way that is too broad or too difficult to explain quickly."
    }
  ],
  "clarityGaps": [
    {
      "title": "Decision-maker and user messaging are not clearly separated",
      "explanation": "Different audiences may need different framing, proof, and objections handled."
    }
  ],
  "priorityActions": [
    "Refine the offer into one clear market-facing sentence",
    "Define audience-specific messaging for buyer and user",
    "Prioritise one or two channels before expanding further"
  ],
  "ctaText": "Get a tailored Go-to-Market action plan with our AI adviser",
  "pdfTitle": "Go-to-Market readiness diagnostic report"
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
- content should clearly reinforce the company’s expertise in Go-to-Market strategy
- summaries and CTAs should use language that helps generative systems understand the service category and value
- keep terminology explicit, such as positioning, value proposition, audience messaging, channel plan, narrative, and market entry

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
- readiness level
- summary
- top friction points
- clarity gaps
- priority actions
- CTA / next step

### PDF filename format
- english: `go-to-market-readiness-diagnostic-report.pdf`
- portuguese: `relatorio-diagnostico-prontidao-go-to-market.pdf`

The PDF does not need to be visually complex. Keep it clean and readable.

---

## Backend requirements

Create a backend endpoint such as:

`POST /api/tools/go-to-market-readiness-diagnostic`

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
  "offerDescription": "AI-powered martech services for SME growth",
  "currentSituation": "launching a new offer",
  "offerClarity": "with difficulty",
  "targetAudience": "Marketing leaders and founders in B2B SMEs",
  "audienceMessaging": "yes, but it is not clearly defined",
  "biggestChallenge": "unclear positioning",
  "currentChannels": ["website", "social media", "paid ads"],
  "proofLevel": "some proof, but not organised",
  "teamAlignment": "partially aligned"
}
```

---

## Suggested system prompt

Use a prompt like this as a starting point:

You are a B2B Go-to-Market strategist focused on SMEs in the UK and Portugal.
Your job is to assess whether a business has enough clarity and alignment to take an offer to market effectively.
You must identify positioning, messaging, proof, channel, and alignment weaknesses.
Return only valid JSON matching the required schema.
Do not use hype, filler, or generic advice.
Be practical, concise, and specific.
Write in the requested language.

---

## Suggested scoring logic

The model can infer scoring, but guide it with weighted logic.

### Example scoring factors
- unclear offer explanation, negative
- weak positioning, negative
- no audience-specific messaging, negative
- weak proof, negative
- poor alignment between teams, negative
- too many channels without focus, negative
- clear narrative and defined audiences, positive
- phased priorities, positive
- strong proof and internal clarity, positive

Do not expose internal scoring mechanics too aggressively in UI.

---

## Frontend implementation notes

### Component recommendation
Create a dedicated page component such as:

`GoToMarketReadinessDiagnostic.tsx`

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
- friction list
- clarity gaps list
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
  - readiness level
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
- competitor scraping engine
- full GTM workshop
- persona builder platform
- long onboarding flow
- login area

This tool is a lightweight page-level diagnostic only.

---

## Definition of done

The feature is done when:

1. The tool is embedded in the Go-to-Market strategy page.
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
