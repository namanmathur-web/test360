You are my product-build partner. I am Vedans, from growth and marketing at Vedantu. I am NOT a programmer: explain every choice in plain words, tell me exactly what to click or paste, and never assume I know technical terms.

GOAL
Turn the attached design into a WORKING web app (mobile-first) called "Vedantu Test360" (the pop-ups also say "Vedantu Scorebook": ask me which name to use). First product: a JEE Main Maths chapter test for "Limits, Continuity and Differentiability" (6 topics). It will later be copied for other chapters, other exams (BITSAT, NDA) and a Tamil Nadu State Board 12th version.

WHAT I AM ATTACHING (read all of it before writing anything)
1. 00_PROMPT.md - this brief.
2. 01_screens/ - the full flow, 62 screens, in order. rows/row_01.png to row_16.png are 4 screens per image. SCREEN_LIST.md names every screen with a one-line purpose. board/jee8.html is the same design as one HTML file: use it only as a picture to match, NOT as code to reuse.
3. 02_banners/ - my 150 real banners and pop-ups (JEE, BITSAT, NDA; 11 types each, 2 designs, desktop and mobile). Open index.html. These are final designs: reproduce them faithfully, do not redraw them.
4. 03_reference/ - my own inspiration. walkthrough.pdf is the Eklavya JEE Mock Series test-taking flow that the test screens copy. The pop-up PNGs, Journey Screens, and the two .md files explain the page logic and pop-up triggers.
5. 04_my_earlier_work/ - my earlier handoff files: the Eklavya product spec and screen notes, the Limits question bank files, and the Vedantu result-page design notes.
6. 05_tamil_nadu/ - an older 17-screen draft of the Tamil Nadu 12th version. Do NOT build it now. Keep the app structure ready for it.

THE FLOW (follow the order in SCREEN_LIST.md)
Landing page (7 sections) -> onboarding pop-ups (grade, language) -> JEE home with subject tabs -> free tests page (Physics / Chemistry / Maths) -> chapter page (mind map) -> topic page and topic summary (short and full detail, "notes" design) -> build your test (pick topics and level; default 3 questions per topic, adjustable; all 5 levels open) -> test (Eklavya format: instructions, timer, question palette, Mark for Review and Next, Clear, Save and Next, numerical keypad, Exam Summary, Are you sure, completed) -> result and analysis (Performance, Answers, Ved AI) -> pop-ups and upsell -> fix what went wrong -> pack unlocked -> retest at the next level -> what to explore next -> progress, badges, My Learning.

RULES THAT MUST NEVER BREAK
- Chapter-wise tests only. No rank, no percentile, no predicted percentile for students.
- Nothing locked and no "coming soon". All 5 levels open. No daily cap on tests.
- Do not promise video solutions for questions. Teacher lesson clips for a topic are fine.
- Prices: Chapter pack Rs 99. JEE Main series Rs 2,999. BITSAT series Rs 599 and BITSAT combo Rs 2,999. NDA series Rs 499. My banner images still show older numbers (Rs 100, Rs 6,000, 90 chapters); the real numbers are Rs 99, Rs 2,999 and 54 chapters, so wherever a banner shows money, build it as live text with the correct numbers.
- Purple is only for Ved AI. Main look: background #F4F5FB, navy #141B4D, orange #FF6B35 buttons with accent text #B93A0B, white cards with a 1px #C9D3F0 border and 12px radius, green #0E9F6E for correct, font Plus Jakarta Sans. Avoid bright orange elsewhere. Topic summary uses the cream ruled-paper "notes" look (serif, red margin line).
- Gamification (XP, levels, streak, badges) and before/after proof are wanted. Build them as plain interface, with NO illustrations, trophies or generated art.
- Use only the images I give you. Do not generate images and do not use any paid AI image tool.
- Payments are a DEMO (no real money) until I say otherwise.
- Keep everything private. Do not publish or share any link.

REAL vs PLACEHOLDER
- The questions, answer keys, scores, topper numbers and the "sample report" values in my screens are placeholders. Build the app so real questions load from a file I can replace (see 04_my_earlier_work for the Limits question bank format). Mark placeholder questions clearly in the app. Answer keys must be checked by a teacher before launch.
- Notes and textbook prices are not decided: show "Rs --".
- Ved AI advice (ScoreBooster, Easy Kill Topics, 3-day plan, Ask Ved) can be rule-based for now (from topic scores, mistake types and time per question). Explain to me what you would need to make it real AI.

HOW TO WORK
Ask me up to 8 questions FIRST, in one message, as multiple-choice where possible, covering: tech stack in plain words (recommend one), login method, where progress is saved, name (Test360 or Scorebook), the open decisions below. Then build in phases, and after each phase tell me how to run it and what I should see:
 Phase 1: clickable front end with all 62 screens matching the design, using sample data.
 Phase 2: the real test engine (timer, palette, marking +4 / -1, numerical answers, submit).
 Phase 3: result and report logic (topic scores, marks lost, mistake types, Score Boost).
 Phase 4: every pop-up on its trigger (after the 4th answer, Formula sheet tap, End Test tap, on result, report ready, Answers tab, exit intent, checkout, pack unlocked, next chapter).
 Phase 5: demo checkout, pack unlock, retest at the next level, progress, badges, streak.
 Phase 6: accounts and saving progress.
Show me screenshots at the end of each phase and compare them to my design. If anything in my files conflicts, ask me. Do not guess.

OPEN DECISIONS (ask me, do not decide yourself)
- Name: Test360 or Scorebook. - Fix the old prices inside the banners. - Keep or reword the "video solutions" line in two banners. - Notes and textbook price. - Name and contents of the Rs 2,999 product. - Real payments or demo. - Login: phone number, Google, or none for the free test. - Language: my onboarding screen shows "coming soon" for Hinglish, Tamil and Telugu, which breaks the no-coming-soon rule; ask me what to show. - The result score card is purple (copied from the walkthrough); ask me whether to keep it given the purple rule. - Tamil Nadu 12th: later.
