# Spec kit, LLM Advertisement & Paid Media audit tool

## Objective

Build a lightweight interactive audit tool inside the **LLM Advertisement & Paid Media** service page.

The tool must help visitors quickly understand whether their current paid media approach is wasting budget, where the biggest performance leaks are, and what practical next steps they should take.

This is **not** an ads platform and not a full media planner. It must be simple, fast, credible, multilingual, and useful.

The tool should generate:
- an on-page audit result
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
LLM Advertisement & Paid Media

### Subtitle
For entering, launching, or scaling without friction

### Service positioning
Paid media should follow one simple rule: every euro invested must teach something. The service focuses on strategy, properly structured tests, aligned landing pages, and clear reporting that shows what is working, what is not, and why.

### What this service includes
- campaign research and structure
- creatives and messaging by intent
- continuous testing
- landing pages aligned with ads
- reporting that answers real questions

### Target audience
- companies investing in ads without clear return visibility
- teams that need more predictability
- brands wanting to test emerging formats linked to AI engines with sound judgement

### Promise on page
The page invites the user to complete a free audit and receive a tailored action plan showing where budget is being wasted and what is most worth fixing first.

### What the service delivers
- campaign strategy and account structure
- testing plan for creative, message, targeting, and offer
- continuous optimisation using signals such as quality, intent, cost, and conversion
- CRM connection where possible, to focus on quality not only quantity
- offer and landing page recommendations to improve conversion

---

## Tool name

Use this working name internally:

`paidMediaWasteAudit`

Suggested user-facing label:

### English
Paid media waste audit

### Portuguese
Auditoria de desperdício em paid media

---

## Core job of the tool

The tool should identify whether the business is losing paid media performance because of:
- weak campaign structure
- poor targeting logic
- unclear offer
- weak creative and message testing
- landing page mismatch
- poor conversion tracking
- weak reporting focused only on surface metrics
- no feedback loop between media, sales, and CRM quality

The tool should then generate a concise, tailored result.

---

## Main UX flow

### Step 1
User opens the service page and sees a short CTA block for the tool.

### Step 2
User answers a short guided audit with around **8 to 10 questions**.

### Step 3
The system sends the answers to the backend.

### Step 4
Backend calls Gemini and asks it to return a structured JSON audit.

### Step 5
Frontend displays:
- overall score
- audit level
- top waste risks
- performance blockers
- recommended next actions
- CTA to talk to the AI adviser
- button to download PDF

### Step 6
If the user clicks the CTA, the AI chat bot opens already preloaded with the audit context.

---

## Tool format

This tool should be implemented as a **guided form-based audit**, optionally with one landing page URL field for context.

Reason:
Paid media problems are not visible from page scraping alone. The strongest signal comes from a few structured business and campaign questions.

---

## Inputs

Keep the form short and fast.

### Recommended fields

1. **Company website**
- type: URL
- required: yes

2. **Main landing page used in campaigns**
- type: URL
- required: no

3. **Monthly ad spend**
- type: single select
- options:
  - less than €1,000
  - €1,000 to €5,000
  - €5,000 to €15,000
  - more than €15,000
- required: yes

4. **Which channels are you currently using?**
- type: multi-select
- options:
  - Google Ads
  - LinkedIn Ads
  - Meta Ads
  - YouTube Ads
  - display/programmatic
  - other
- required: yes

5. **What is the main goal of your campaigns?**
- type: single select
- options:
  - lead generation
  - booked meetings
  - sales
  - awareness
  - traffic
  - not clearly defined
- required: yes

6. **How do you currently judge campaign success?**
- type: multi-select
- options:
  - clicks
  - CTR
  - CPC
  - leads
  - booked calls
  - pipeline
  - revenue
  - lead quality
  - we are not sure
- required: yes

7. **Are you testing creatives, messaging, or targeting regularly?**
- type: single select
- options:
  - yes, with a clear method
  - yes, but inconsistently
  - rarely
  - almost never
- required: yes

8. **How aligned are your ads and landing pages?**
- type: single select
- options:
  - highly aligned
  - somewhat aligned
  - often mismatched
  - not sure
- required: yes

9. **Do you track what happens after the lead is generated?**
- type: single select
- options:
  - yes, through CRM and sales stages
  - partly
  - only basic lead tracking
  - no
- required: yes

10. **What is your biggest current paid media challenge?**
- type: single select
- options:
  - high cost per lead
  - low lead quality
  - poor conversion rate
  - weak reporting clarity
  - unclear targeting
  - weak creatives
  - landing page underperformance
  - cannot scale predictably
- required: yes

---

## Output

The result must feel useful, concrete, and non-generic.

### Display on page

1. **Overall score**
- range: 0 to 100
- label example: Paid media efficiency score

2. **Audit level**
- example values:
  - inefficient
  - unstable
  - improving
  - efficient and scalable

3. **Short summary**
- 2 to 4 sentences
- tailored to the user's answers

4. **Top waste risks**
- 3 items max

5. **Performance blockers**
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
Get a tailored paid media action plan with our AI adviser

### Portuguese
Recebe um plano de ação de paid media ajustado com o nosso consultor de IA

When clicked:
- open the AI chat bot
- pass the audit summary and structured findings into the chat context
- first assistant message should already reference the detected issues

Example:
- weak testing discipline
- poor post-click alignment
- reporting focused on vanity metrics
- no visibility into lead quality

---

## AI logic

### Model
Use:
`gemini-3.1-flash-lite-preview`

### Why
This tool is lightweight, structured, and high-frequency. It does not need a heavy reasoning model.

### Prompt strategy
Use a system prompt that frames the model as a B2B paid media strategist for SMEs in the UK and Portugal.

It must:
- analyse the user answers
- identify strategic and operational weaknesses
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
  "toolName": "paidMediaWasteAudit",
  "language": "en",
  "overallScore": 61,
  "auditLevel": "unstable",
  "summary": "Your paid media setup is generating activity, but the current structure is likely wasting budget. The biggest issue appears to be weak visibility into what drives real quality after the click.",
  "topWasteRisks": [
    {
      "title": "Success is judged too high in the funnel",
      "severity": "high",
      "explanation": "The current reporting focus may be too dependent on clicks or leads rather than downstream quality and conversion."
    }
  ],
  "performanceBlockers": [
    {
      "title": "Ads and landing pages are not tightly aligned",
      "explanation": "This may be lowering conversion rates and making acquisition more expensive."
    }
  ],
  "priorityActions": [
    "Tighten the link between campaign message and landing page promise",
    "Create a simple testing cadence for creative, audience, and offer",
    "Track quality after lead capture, not only cost per lead"
  ],
  "ctaText": "Get a tailored paid media action plan with our AI adviser",
  "pdfTitle": "Paid media waste audit report"
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
- content should clearly reinforce the company’s expertise in paid media strategy and optimisation
- summaries and CTAs should use language that helps generative systems understand the service category and value
- keep terminology explicit, such as campaign structure, testing, targeting, landing page alignment, lead quality, and conversion

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
Analysing your audit...

#### Portuguese
A analisar a sua auditoria...

---

## PDF export requirements

Create a simple branded PDF report.

### PDF should include
- tool title
- date
- user inputs summary
- overall score
- audit level
- summary
- top waste risks
- performance blockers
- priority actions
- CTA / next step

### PDF filename format
- english: `paid-media-waste-audit-report.pdf`
- portuguese: `relatorio-auditoria-desperdicio-paid-media.pdf`

The PDF does not need to be visually complex. Keep it clean and readable.

---

## Backend requirements

Create a backend endpoint such as:

`POST /api/tools/paid-media-waste-audit`

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
  "landingPageUrl": "https://example.com/demo",
  "monthlyAdSpend": "€1,000 to €5,000",
  "channels": ["Google Ads", "LinkedIn Ads"],
  "campaignGoal": "lead generation",
  "successMetrics": ["leads", "CPC", "CTR"],
  "testingDiscipline": "yes, but inconsistently",
  "adLandingAlignment": "somewhat aligned",
  "postLeadTracking": "only basic lead tracking",
  "biggestChallenge": "low lead quality"
}
```

---

## Suggested system prompt

Use a prompt like this as a starting point:

You are a B2B paid media strategist focused on SMEs in the UK and Portugal.
Your job is to assess whether a business is wasting paid media budget and where performance is being blocked.
You must identify campaign structure, testing, message, landing page, measurement, and quality weaknesses.
Return only valid JSON matching the required schema.
Do not use hype, filler, or generic advice.
Be practical, concise, and specific.
Write in the requested language.

---

## Suggested scoring logic

The model can infer scoring, but guide it with weighted logic.

### Example scoring factors
- unclear campaign goal, negative
- judging success only by top-funnel metrics, negative
- weak testing discipline, negative
- poor landing page alignment, negative
- no post-lead quality tracking, negative
- structured testing and CRM feedback loop, positive
- clear goal and downstream metrics, positive
- strong alignment between ads and landing pages, positive

Do not expose internal scoring mechanics too aggressively in UI.

---

## Frontend implementation notes

### Component recommendation
Create a dedicated page component such as:

`PaidMediaWasteAudit.tsx`

### Internal modules
- form schema
- translations
- API client
- result renderer
- PDF trigger
- chatbot handoff helper

### Suggested result sections
- score badge
- audit level badge
- summary block
- waste risks list
- blockers list
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
  - audit level
  - top waste risks
  - priority actions
  - user website
  - biggest challenge

This avoids making the user repeat themselves.

---

## Analytics tracking

Track tool usage events.

### Minimum events
- audit_started
- audit_completed
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
- ad platform integrations
- media buying console
- keyword planner
- campaign builder
- full attribution platform
- long onboarding flow
- login area

This tool is a lightweight page-level audit only.

---

## Definition of done

The feature is done when:

1. The tool is embedded in the LLM Advertisement & Paid Media page.
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

Build this as a small, production-ready audit tool embedded in the service page.
Keep the experience simple, fast, and credible.
Prioritise usefulness over cleverness.
Do not over-engineer the logic.
Do not create a large app.
Do not introduce heavy dependencies unless strictly necessary.
Make the result feel genuinely helpful to a B2B SME buyer.
