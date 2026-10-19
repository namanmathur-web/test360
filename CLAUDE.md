# Vedantu Test360 - project context

Owner: Naman (Vedantu growth/marketing). Not a programmer: explain things in plain words, make decisions with sensible defaults, and tell him what you decided. Show results he can open and click, not code.

## What this is
Mobile-first chapter-wise test product for JEE Main. First chapter: Maths "Limits, Continuity and Differentiability" (6 topics). A working clickable demo already exists: `demo/Vedantu_Test360_demo.html` (source in `demo/source/`, built by `demo/source/assemble.py`). Treat the demo as the reference for look and behaviour.

## Source of truth
- `MVP_FLOW.md` - the 7-page flow and each page's purpose.
- `reference/00_PROMPT.md`, `reference/03_reference/` - original brief, page brief, popups.
- `reference/01_screens/SCREEN_LIST.md` - the 62 screens.
- `reference/04_my_earlier_work/qbank/` - question bank CSV (`limits_bank.csv`).
- `demo/source/app1.js` has the `PRICE` constant: every price comes from there.

## Hard rules
- Chapter-wise tests only. No rank, percentile or predicted percentile.
- Nothing locked, no "coming soon". All 5 levels open, no daily cap.
- Do not promise video solutions for questions (teacher lesson clips are fine).
- Pass mark 60%. Marking +4 / -1; numerical questions have no negative marking.
- Prices: Chapter pack Rs 99, JEE Main series Rs 2,999, BITSAT Rs 599, BITSAT combo Rs 2,999, NDA Rs 499, 54 chapters. Never hardcode prices elsewhere.
- Ignore Tamil Nadu State Board for now.
- Colours: bg #F4F5FB, navy #141B4D, orange #FF6B35 (accent text #B93A0B), green #0E9F6E, white cards with 1px #C9D3F0 border and 12px radius. Font: Plus Jakarta Sans. Purple is ONLY for Ved AI.
- Topic summary uses the cream ruled-paper notes look (serif, red margin line).
- Gamification is plain interface: no illustrations, trophies or badges art. Use only images the user supplied; do not generate images.
- Placeholder questions, scores and sample reports must be labelled as samples. Notes and textbook prices show "Rs --".
- Keep everything private. Do not publish or share links.

## Demo-only today (to make real, in this order, confirming each with Naman)
1. Student login and saving progress (currently browser localStorage).
2. Real question bank with Level 1-5 tags (currently tagged easy/medium/hard).
3. Payments (currently fake; plan: Razorpay).
4. Ved AI answering with the real Claude API (currently rule-based).
5. Hosting.

## Working style
Start by reading this file and MVP_FLOW.md, open the demo, then propose a short plan before building. Test in a browser (Playwright) and fix errors before reporting.
