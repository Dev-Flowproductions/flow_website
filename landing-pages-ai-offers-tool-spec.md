# Spec kit, Landing Pages & AI Offers diagnostic tool

## Objective

Build a lightweight interactive tool inside the **Landing Pages & AI Offers** service page.

This page needs a dual-path experience:

1. **Landing page audit mode**
For users who already have a landing page and want to know why it is not converting well.

2. **Landing page action plan mode**
For users who do not yet have a landing page and want a simple, tailored plan for creating one properly.

This is **not** a full landing page builder and not a giant AI app. It must be simple, fast, credible, multilingual, and useful.

The tool should generate:
- an on-page diagnostic or action-plan result
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
Landing Pages & AI Offers

### Subtitle
Tráfego sem ação é só movimento.

### Service positioning
The service creates landing pages focused on one action and offers that actually help the user move forward. When useful, it uses AI offers, simple AI-powered experiences, to improve clarity, utility, and conversion.

### What is an AI Offer
An AI offer is a quick experience that helps a person make a decision, whether that means running a diagnostic, buying something, generating a brief, or getting a personalised guide.

### Target audience
This service is for companies that:
- have traffic, organic or paid, but conversion is weak
- feel the landing page is not explaining or persuading well
- run several campaigns that all point to a generic page
- need a clear offer, such as a diagnostic, proposal, demo, or contact path, but do not know what to choose
- want to test AI offers

### Promise on page
The page offers:
- a free diagnostic for users who already have a landing page
- a free action plan for users who do not yet have one and want to build it properly

### What the service delivers
- fast, clear, action-oriented landing pages
- simple and direct copy
- AEO-aware structure where relevant
- an offer with real value
- AI offers when they add genuine usefulness

---

## Tool name

Use this working name internally:

`landingPageAndAiOfferPlanner`

Suggested user-facing labels:

### English
Landing page diagnostic and action plan

### Portuguese
Diagnóstico e plano de ação para landing page

---

## Core job of the tool

The tool should identify whether the business is losing conversion because of:
- weak page focus
- unclear offer
- poor page structure
- weak message hierarchy
- generic campaign destination pages
- poor CTA clarity
- mismatch between audience intent and page content
- missing AI offer opportunity where useful

It should then generate either:
- a concise landing page audit, or
- a tailored landing page action plan

---

## Main UX flow

### Step 1
User opens the service page and sees a short CTA block for the tool.

### Step 2
User chooses one of two paths:

#### Path A
**I already have a landing page**

#### Path B
**I do not have a landing page yet**

### Step 3
User answers a short guided form with around **6 to 10 questions**, depending on path.

### Step 4
The system sends the answers to the backend.

### Step 5
Backend calls Gemini and asks it to return a structured JSON result.

### Step 6
Frontend displays:
- overall score or readiness score
- short summary
- main issues or missing essentials
- recommended next actions
- AI offer recommendation when relevant
- CTA to talk to the AI adviser
- button to download PDF

### Step 7
If the user clicks the CTA, the AI chat bot opens already preloaded with the result context.

---

## Tool format

This tool should be implemented as a **dual-path guided diagnostic**, not as a builder, editor, or page generator.

Reason:
The page serves two distinct visitor states:
- people trying to improve an existing landing page
- people trying to figure out what a good landing page should contain

Trying to force both into one single audit without branching would be sloppy and less useful.

---

## Path A, landing page audit mode

### Use case
The user already has a landing page and wants to know whether it is doing its job.

### Recommended fields

1. **Landing page URL**
- type: URL
- required: yes

2. **Main goal of the page**
- type: single select
- options:
  - lead generation
  - booked meeting
  - demo request
  - purchase
  - download
  - contact request
- required: yes

3. **Main traffic source**
- type: multi-select
- options:
  - Google Ads
  - LinkedIn Ads
  - Meta Ads
  - organic search
  - email
  - social media
  - direct
  - partner traffic
- required: yes

4. **What is your biggest issue right now?**
- type: single select
- options:
  - low conversion rate
  - too many drop-offs
  - message is unclear
  - offer is weak
  - page feels generic
  - traffic does not match the page
  - not sure
- required: yes

5. **Do you send multiple campaigns to the same page?**
- type: single select
- options:
  - yes
  - sometimes
  - no
- required: yes

6. **Do you currently test headlines, offers, or CTAs?**
- type: single select
- options:
  - yes, regularly
  - yes, occasionally
  - rarely
  - no
- required: yes

7. **How clear is the page action for the visitor?**
- type: single select
- options:
  - very clear
  - somewhat clear
  - unclear
  - not sure
- required: yes

---

## Path B, landing page action plan mode

### Use case
The user does not yet have a landing page and wants a practical plan for creating one.

### Recommended fields

1. **Company website**
- type: URL
- required: no

2. **What is the main thing you want the page to achieve?**
- type: single select
- options:
  - generate leads
  - book meetings
  - sell a product or service
  - promote a demo
  - validate an offer
  - capture interest for a new launch
- required: yes

3. **What are you offering?**
- type: short text
- required: yes

4. **Who is the page for?**
- type: short text
- required: yes

5. **What traffic will come to this page?**
- type: multi-select
- options:
  - paid ads
  - organic search
  - social media
  - email
  - outbound campaigns
  - referrals
  - not sure yet
- required: yes

6. **What do you think the user should do next?**
- type: single select
- options:
  - request a quote
  - book a call
  - request a demo
  - buy now
  - get a guide or plan
  - complete a short diagnostic
  - not sure
- required: yes

7. **How clear is your current offer?**
- type: single select
- options:
  - very clear
  - somewhat clear
  - unclear
  - still exploring
- required: yes

8. **Are you interested in using an AI Offer?**
- type: single select
- options:
  - yes
  - maybe
  - no
  - not sure what that means
- required: yes

---

## Output

The result must feel useful, concrete, and non-generic.

### For Path A, landing page audit
Display:
1. **Overall score**
- range: 0 to 100
- label example: Landing page effectiveness score

2. **Audit level**
- example values:
  - weak
  - mixed
  - promising
  - strong

3. **Short summary**
- 2 to 4 sentences

4. **Top conversion blockers**
- 3 items max

5. **Priority actions**
- 3 to 5 actions

6. **AI offer opportunity**
- optional recommendation when relevant

7. **CTA to AI adviser**

8. **PDF download**

### For Path B, landing page action plan
Display:
1. **Readiness score**
- range: 0 to 100
- label example: Landing page planning score

2. **Short summary**
- 2 to 4 sentences

3. **Essential topics your page should include**
- 4 to 6 items

4. **Suggested page structure**
- section order with short explanations

5. **Copy recommendations**
- 3 to 5 short recommendations

6. **Offer recommendation**
- what to ask, promise, or deliver

7. **AI offer recommendation**
- if relevant, suggest the most useful type of AI offer

8. **CTA to AI adviser**

9. **PDF download**

---

## CTA behaviour

Below the result, show a clear CTA such as:

### English
Get a tailored landing page action plan with our AI adviser

### Portuguese
Recebe um plano de ação ajustado para a tua landing page com o nosso consultor de IA

When clicked:
- open the AI chat bot
- pass the result summary and structured findings into the chat context
- first assistant message should already reference the detected issues or recommended structure

Example:
- page too generic for campaign intent
- weak offer clarity
- CTA not strong enough
- diagnostic AI offer would improve utility

---

## AI logic

### Model
Use:
`gemini-3.1-flash-lite-preview`

### Why
This tool is lightweight, structured, and high-frequency. It does not need a heavy reasoning model.

### Prompt strategy
Use a system prompt that frames the model as a B2B landing page and conversion strategist for SMEs in the UK and Portugal.

It must:
- analyse the user inputs
- identify structure, copy, offer, and conversion weaknesses
- recommend an AI offer only when it genuinely adds value
- avoid generic fluff
- avoid exaggerated claims
- return structured JSON only
- write in the user's selected website language
- adapt wording to the user's market where relevant

---

## Required structured JSON output

Use a strict schema with a `mode` field.

```json
{
  "toolName": "landingPageAndAiOfferPlanner",
  "language": "en",
  "mode": "audit",
  "overallScore": 66,
  "resultLevel": "mixed",
  "summary": "Your landing page appears to be getting attention, but the current structure may not be doing enough to explain the offer and drive action clearly.",
  "topBlockers": [
    {
      "title": "The page is too generic for the traffic intent",
      "severity": "high",
      "explanation": "Sending different campaigns to the same page can weaken clarity and conversion."
    }
  ],
  "priorityActions": [
    "Create a more specific headline tied to the traffic source",
    "Tighten the page around one clear action",
    "Test a stronger value-led CTA"
  ],
  "aiOfferRecommendation": {
    "recommended": true,
    "type": "short diagnostic",
    "reason": "A simple diagnostic could help visitors understand their problem before booking a conversation."
  },
  "ctaText": "Get a tailored landing page action plan with our AI adviser",
  "pdfTitle": "Landing page diagnostic report"
}
```

For action-plan mode:

```json
{
  "toolName": "landingPageAndAiOfferPlanner",
  "language": "en",
  "mode": "plan",
  "overallScore": 71,
  "resultLevel": "promising",
  "summary": "You have the basis for a focused landing page, but the offer and next action need to be made clearer to increase conversion potential.",
  "essentialTopics": [
    "Clear problem statement",
    "Simple explanation of the offer",
    "Proof or credibility signals",
    "One strong call to action"
  ],
  "suggestedStructure": [
    {
      "section": "Hero",
      "purpose": "Explain what the offer is and what the visitor should do next"
    },
    {
      "section": "Problem and stakes",
      "purpose": "Show why the issue matters now"
    }
  ],
  "copyRecommendations": [
    "Use one sentence to explain the offer clearly",
    "Avoid broad claims without proof",
    "Make the CTA action-specific"
  ],
  "offerRecommendation": "A short free diagnostic is the strongest offer for this use case.",
  "aiOfferRecommendation": {
    "recommended": true,
    "type": "brief generator",
    "reason": "A simple AI brief generator could help visitors move forward with less friction."
  },
  "ctaText": "Get a tailored landing page action plan with our AI adviser",
  "pdfTitle": "Landing page action plan"
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
- content should clearly reinforce the company’s expertise in landing pages, conversion, and AI offers
- summaries and CTAs should use language that helps generative systems understand the service category and value
- keep terminology explicit, such as landing page, CTA, offer, conversion, structure, user intent, and AI offer

---

## UI requirements

Keep UI compact and embedded in the page design.

### Suggested structure
- intro text
- mode selector
- form card
- submit button
- loading state
- result card
- CTA area
- PDF button

### UX rules
- no long wizard
- keep the branching simple
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
- selected mode
- user inputs summary
- overall score
- result level
- summary
- key findings or essential topics
- priority actions or suggested structure
- AI offer recommendation if relevant
- CTA / next step

### PDF filename format
- english audit: `landing-page-diagnostic-report.pdf`
- english plan: `landing-page-action-plan.pdf`
- portuguese audit: `relatorio-diagnostico-landing-page.pdf`
- portuguese plan: `plano-acao-landing-page.pdf`

The PDF does not need to be visually complex. Keep it clean and readable.

---

## Backend requirements

Create a backend endpoint such as:

`POST /api/tools/landing-page-and-ai-offer-planner`

### Backend responsibilities
- validate payload
- normalise answers
- detect selected mode
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

## Suggested request payloads

### Audit mode

```json
{
  "language": "en",
  "mode": "audit",
  "landingPageUrl": "https://example.com/demo",
  "pageGoal": "demo request",
  "trafficSources": ["Google Ads", "LinkedIn Ads"],
  "biggestIssue": "low conversion rate",
  "multipleCampaignsToSamePage": "yes",
  "testingDiscipline": "yes, occasionally",
  "actionClarity": "somewhat clear"
}
```

### Plan mode

```json
{
  "language": "en",
  "mode": "plan",
  "websiteUrl": "https://example.com",
  "pageGoal": "generate leads",
  "offerDescription": "AI-powered martech strategy sessions for B2B SMEs",
  "targetAudience": "Founders and marketing leads",
  "trafficSources": ["paid ads", "organic search"],
  "desiredNextAction": "book a call",
  "offerClarity": "somewhat clear",
  "aiOfferInterest": "maybe"
}
```

---

## Suggested system prompt

Use a prompt like this as a starting point:

You are a B2B landing page and conversion strategist focused on SMEs in the UK and Portugal.
Your job is to assess either an existing landing page or a landing page plan.
You must identify structure, offer, copy, conversion, and AI offer opportunities.
Only recommend an AI offer when it clearly adds utility and helps the visitor move forward.
Return only valid JSON matching the required schema.
Do not use hype, filler, or generic advice.
Be practical, concise, and specific.
Write in the requested language.

---

## Suggested scoring logic

The model can infer scoring, but guide it with weighted logic.

### Example scoring factors
- page too generic for campaign intent, negative
- unclear offer, negative
- weak CTA clarity, negative
- multiple campaigns driving to same generic page, negative
- poor testing discipline, negative
- strong page goal, positive
- clear action path, positive
- relevant AI offer fit, positive only when justified

Do not expose internal scoring mechanics too aggressively in UI.

---

## Frontend implementation notes

### Component recommendation
Create a dedicated page component such as:

`LandingPageAndAiOfferPlanner.tsx`

### Internal modules
- mode selector
- form schema
- translations
- API client
- result renderer
- PDF trigger
- chatbot handoff helper

### Suggested result sections
- score badge
- result level badge
- summary block
- blockers or essentials list
- structure or action list
- AI offer recommendation card
- CTA panel

---

## Chat bot handoff

When the user clicks the CTA:
- send structured context into the AI adviser chat
- include:
  - service name
  - language
  - mode
  - score
  - result level
  - top blockers or essentials
  - priority actions or suggested structure
  - website or landing page URL
  - biggest issue or desired outcome

This avoids making the user repeat themselves.

---

## Analytics tracking

Track tool usage events.

### Minimum events
- tool_mode_selected
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
- landing page builder
- visual editor
- AI copywriting studio
- page publishing system
- CRM integrations
- long onboarding flow
- login area

This tool is a lightweight page-level diagnostic and planning tool only.

---

## Definition of done

The feature is done when:

1. The tool is embedded in the Landing Pages & AI Offers page.
2. The user can choose audit mode or action-plan mode.
3. The form works in all currently available site languages.
4. Submission triggers the backend and Gemini analysis.
5. The result renders cleanly on the page.
6. The output is useful, concise, and non-generic.
7. The CTA opens the AI adviser with context.
8. The user can download a PDF report.
9. The page remains performant and mobile-friendly.
10. The implementation does not damage SEO, AEO, or GEO readiness.
11. All text is localised correctly.

---

## Final instruction to Cursor

Build this as a small, production-ready dual-path tool embedded in the service page.
Keep the experience simple, fast, and credible.
Do not over-engineer it.
Do not create a full landing page app.
Only recommend AI offers when they genuinely improve usefulness and conversion.
Make the result feel genuinely helpful to a B2B SME buyer.
