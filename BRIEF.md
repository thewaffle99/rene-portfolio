# BRIEF — Rene Marino personal site

DRAFT v0.1 (2026-09-14). Fields marked **[PENDING]** wait on answers in `content/intake.md`.
Full plan: `C:\Users\Rene\.claude\plans\i-am-looking-to-harmonic-token.md`

## Reference site
- Live URL: none
- Type of engagement: [x] Net-new build (no reference site, brief is the spec)
- Visual inspiration: Apple product pages (`design-references/apple.md`), used for pacing and
  pinned scroll sequences only. Do NOT copy Apple's palette or type. Brand below wins.

## Target stack
- [x] Override: Next.js (App Router, TypeScript) + Tailwind. shadcn/ui only for form primitives.
  Motion: GSAP ScrollTrigger + Lenis. Chat: Anthropic SDK, `claude-haiku-4-5-20251001`,
  server-only. MCP: read-only streamable-HTTP endpoint at `/mcp`. No database.

## Brand — "Poster" (approved 2026-09-14)
- Approved design canvas: https://claude.ai/artifact/1Rh2LvrbtJ2twLDbszjy4x (page "Site")
  - Visual direction C (Poster) with the copy from direction B (Editorial)
  - The stage-manager theme was rejected as too corny. Touring is one line in the
    background, never the theme.
- Colors:
  - paper `#F5F6F8`
  - ink `#0A0A0C`
  - ultramarine `#2B3BFF` (panels, primary CTA, accent words)
  - pale blue `#DCE3FF`
  - accent on black `#7C88FF`
  - body grey `#4A4E5C`
  - rule `#D9DBE2`
- Fonts:
  - Funnel Display (display, 600–800, tight negative tracking)
  - Funnel Sans (body)
  - Martian Mono (labels, chat trace, code; width 85)
- Logo: none. The wordmark is "RENE MARINO" in Martian Mono. The name is set oversized
  in the hero.
- Tone/voice: professional, first person, plain and specific. Hero line: "I build the
  platforms AI agents run on." No theatrical metaphors, no buzzwords.
- Section rhythm: hero (light + blue panel) → work (black) → about (light) → ask (blue)
  → contact (light).
- Motion rules:
  - Headlines reveal line by line (mask slide-up)
  - The blue panel wipes in
  - Supporting text fades in after
  - On the live site each section's headline plays the reveal on scroll
  - Honor `prefers-reduced-motion` (no animation). Mobile Lighthouse ≥ 90.

## Site map
1. `/` Home, one scrolling story:
   - Hero (name, positioning line, ask box)
   - Origin (cue sequence)
   - Selected work (pinned)
   - How I build with AI (agent pipeline diagram)
   - Ask about Rene (chat + "Show your work" + MCP connect)
   - Contact
2. `/work/[slug]` Case study (template below)
3. `/work/this-site` Meta case study: chat, MCP, security
4. `/resume` Web resume, printable
5. `/mcp` Read-only MCP endpoint + `/mcp/docs` page
6. `/privacy` Short privacy note (chat logging disclosure)
7. `/.well-known/security.txt`

## Global components
- Header: wordmark left. Links: Work, Ask, Resume. Single CTA: "Get in touch".
- Footer: LinkedIn, GitHub, privacy, "Built with Claude, here's how" link to `/work/this-site`.
- Repeated template: **Case study**
  - Fields: slug, title, one-line outcome, role, team size, timeframe, cue number
  - **Product half:** problem, evidence, options considered, decision + what was NOT
    built, metric, lesson
  - **Build half:** architecture diagram, key tradeoffs, stack, code/links
  - `publicSafe: true|false` gate; the page doesn't build unless true

## Known data (source of truth, use exactly)
- Name: Rene Marino
- Public location: **Orange County, CA** (never city, street, or zip)
- Title/positioning: Technical Product Manager, AI & API platforms, full-stack engineering background
- LinkedIn: https://www.linkedin.com/in/rene-marino-597b2665/
- GitHub: https://github.com/thewaffle99
- Experience:
  - Humana, Product Manager, June 2025 to present **[PENDING employer-safe wording]**
  - Dark Matter Technologies (Black Knight Financial), Software Engineer, Dec 2022 to Apr 2025
  - Coding Dojo, Software Teaching Assistant, Aug 2022 to Dec 2022
  - SAM Management, Stage Manager, Aug 2017 to Dec 2020 **[PENDING OK to name artists]**
- Education:
  - CSU Fullerton, BA **[PENDING Communications vs. RTVF wording]**
  - Coding Dojo MERN & Python certificates
- Certifications: CSPO (Scrum Alliance), Anthropic Claude Academy courses (2026)
- **FORBIDDEN on the site, in chat facts, in MCP data, in any build output:**
  - Phone number
  - Personal email address
  - Street address or city of residence
  - Non-public employer details
- External links only (do not rebuild): LinkedIn, GitHub

## SEO targets
- Primary schema type: Person (+ ProfilePage). `sameAs` = LinkedIn, GitHub.
- Keywords: technical product manager, AI product manager, MCP, API platform, Orange County
- Redirect map required: [x] No, net-new build

## Regulated industry flags
[x] Other: **Employer confidentiality** (Humana is a healthcare company). Every Humana
claim needs Rene's explicit sign-off before it ships. Case studies default to
`publicSafe: false`.

## Batch sequence
1. Shell, tokens, spotlight hero, cue-call scroll system
2. Origin + selected-work pinned sequence + case study template (placeholder copy)
3. `/api/ask` chat + guardrails + "Show your work" panel
4. `/mcp` read-only server + docs
5. Real case-study content, resume page, contact
6. Security headers/CSP, Turnstile, rate limits, privacy note, security.txt, PII sweep

## Notes / constraints
- Security controls (see plan §5):
  - Turnstile before chat
  - Upstash per-IP rate limit
  - Separate Anthropic workspace with a spend cap **[PENDING $ amount]**
  - Kill-switch env var
  - Plain-text chat rendering
  - ≤500 characters per message, ≤10 turns
  - Server-built conversation history
- Domain **[PENDING]**. Hosting: Vercel previews only. **Ask Rene before any production deploy.**
- Accounts are created by Rene; agents never handle credentials.
