# Vedantu Test360: page-by-page design brief (for the next designer)

## What we are building
A free JEE Main test-series entry product. MVP is Maths, Calculus, Limits chapter. It must copy-paste to other exams later (Tamil Nadu State Board next, with solutions and an AI correction upsell).

## Rules that apply to EVERY page (from Vedans)
1. Nothing is locked. All chapters, all topics and all 5 levels are open. No "Coming soon", no greyed-out cards, no gates. Physics and Chemistry also show real chapters.
2. The test itself copies the Eklavya JEE test format exactly. Everywhere else the product has its own look.
3. The product should feel like an extension of the student (Apple idea): one clear action per screen, nothing in the middle. But a page must never look boring or basic.
4. Colour: one main deep terracotta (not bright orange). Level colours are soft shades only: L1 yellow, L2 green, L3 blue, L4 rose, L5 slate. Ved AI purple is used only on the AI result card.
5. Every chapter has an attractive symbol. Use real numbers, not made-up ones. Sample data must be labelled as sample.
6. Design phone-sized screens, shown in a numbered row, then web.

## The flow, in his order
JEE page > free test > chapter page (Physics / Chemistry / Maths) > chapter > topic summary (single tap = short, double-tap or visible "Full detail" button = full) > pick topics and level (all levels open, 3 questions per topic by default, adjustable) > test > result and analysis > upsell and what's next (same topic higher level, or next topic).
Journey Screens stages to keep: Video/Summary > Test > Result (Ved purple) > Pop-up > Fix > Plans > Retest > Progress.

## Moodboard sources (what we actually borrowed from)
- **Limits Mini Test** (his earlier design): the first test, the progress and syllabus screens, payment/bought/failed states.
- **Test360 Journey Screens**: the stage order Video > Summary > Test > Result > Pop-up > Fix > Plans > Retest > Progress. The Fix screen ranks topics by marks lost and points to the exact minute of the teacher's video.
- **Pop-ups canvas**: the pop-up that follows the result ("+N marks to recover").
- **Test360 Chapter Map Directions canvas**: the chapter-as-a-map idea, a symbol per chapter, level ladder.
- **His Calculus notes (GOAT book design)**: cream ruled paper, serif type, plum sticky slips. The topic summary copies this because it works as an ad for the notes.
- **Eklavya JEE test**: section tabs, Question Type bar, +4/-1, question palette, timer, instructions page, Exam Summary, "Are you sure" and success dialogs.
- **Ved ScoreBooster result** (existing Vedantu product): purple score card plus Easy Kill Topics, skipped questions, weakest topic, "How to improve".
- Books he works from: Hacking Growth (activation, habit loops, quick wins) and Hormozi $100M Offers (make the next step obvious, stack value, show the result before asking for money).

## PAGE 1. JEE home / Free tests
- **Purpose:** the student sees one thing: "take a free test". Pick Physics, Chemistry or Maths, see chapters.
- **Moodboard:** Chapter Map Directions (chapters as cards with symbols); Limits Mini Test header.
- **Content:** streak and XP chips at top; Continue card (resume the last topic); subject tabs; every chapter as a card with its symbol, topic count, a 5-segment level ladder (soft level colours).
- **Gamification:** streak flame; XP total; daily missions (read 2 sections, finish a test, score 60%+); level title (Rookie > Explorer > Aspirant > Ranker > Topper).
- **Engagement:** the Continue card is the biggest thing on the page, so the next tap is always obvious. Ladders show progress on every chapter so the student wants to fill them. Nothing locked, so curiosity always has somewhere to go.
- **What it must NOT be:** a list of greyed "Coming soon" cards (the first version did this, wrong).

## PAGE 2. Chapter page (topics)
- **Purpose:** show the chapter's 6 topics as a journey, read first and then test.
- **Moodboard:** Chapter Map Directions; Journey Screens "Video/Summary" stage.
- **Content:** chapter hero with symbol and overall progress; 6 topic nodes on a path (Algebraic Limits, Trigonometric Limits, Log and Exponential Limits, Expansions and L'Hopital, Continuity, Differentiability); each with its own 5-level ladder; a reward at the end of the path.
- **Gamification:** path nodes fill as levels are cleared; chapter chest/badge at the end; progress %.
- **Engagement:** "Resume" on the current node; the path shows what is next so the student binges topic after topic.

## PAGE 3. Topic summary (notes style)
- **Purpose:** a 2-minute read before the test. Doubles as an ad for the paid notes.
- **Moodboard:** his Calculus notes design (cream ruled paper, serif, plum slips); Journey Screens Summary stage (it used a mind map).
- **Behaviour:** single tap on a section opens the short version. Double-tap, or a visible "Full detail" button, opens the formula and the usual slip. Both must exist (double-tap is not discoverable alone).
- **Content:** "By the end you can..." list; sections as notes cards; formula box; "Usual slip" in a plum sticky slip.
- **Gamification:** +5 XP per section read; "Got it" / "Review later" chips per section (Got it gives XP and counts towards mastery); today's mission ticks.
- **Engagement:** a sticky "Test me on this" button. Reading feels like earning, not studying.

## PAGE 4. Build your test (pick topics and level)
- **Purpose:** the student designs their own test in 10 seconds.
- **Content:** topic checkboxes (multi-select); level 1-5 (all open, soft colour each, short name: Basic, Core, Mixed, Tough, Ranker); questions per topic stepper (default 3, adjustable); a live summary: number of questions, minutes, XP on offer.
- **Gamification:** higher level = higher XP multiplier (1x, 1.2x, 1.5x, 2x, 3x) shown before starting, so choosing a harder level is a visible reward.
- **Engagement:** the main button says exactly what will happen: "Start test, 6 questions, 14 min".
- **Honest note:** the question bank is not yet tagged by topic and level, so levels currently only re-order questions by difficulty in the demo. Real tagging is a content job.

## PAGES 5-7. The test (Eklavya format, do not redesign)
- 5 Instructions page; 6 Question window (section tab, Question Type bar, Marks +4 / Negative 1, question number, A+/A-, four options, Mark for Review and Next, Clear, Save and Next, palette with Answered / Not Answered / Marked / Not Visited colours, timer); 7 Exam Summary with the verification tick and Submit; then "Are you sure?" and the success dialog.
- **Purpose:** exam realism. The student practises in the real format.
- **Gamification:** none inside the test (it must stay clean). Rewards come on the result page.

## PAGE 8. Result and analysis (Ved ScoreBooster)
- **Purpose:** show the score, then tell the student exactly where marks were lost.
- **Moodboard:** Ved ScoreBooster result; Journey Screens Result stage (Ved purple).
- **Content:** purple score card (score / total, correct, wrong, accuracy, time); accuracy by topic bars; Ved panel: Easy Kill Topics, skipped questions, weakest topic, "gain up to N marks"; "How to improve"; Answers tab with solutions; What's next block.
- **Gamification:** XP earned (scaled by level), level badge, badges unlocked, level-up card, confetti when accuracy is good, points vs last attempt, streak hook ("test tomorrow to make it N days").
- **Engagement:** the result ends with two big next steps: "Next topic" and "Same topics, Level +1". The student never reaches a dead end.

## PAGE 9. Pop-up: how to improve
- **Purpose:** turn the result into a reason to act.
- **Moodboard:** the pop-ups canvas.
- **Content:** a big "+N marks to recover", what it is made of, time needed, one primary button.
- **Engagement:** quantified gain, short time, one tap.

## PAGE 10. Fix (Journey Screens stage)
- **Purpose:** free, specific help on the topic that cost the most marks.
- **Content:** topics ranked by marks lost; per topic: what went wrong, the rule to remember, and the exact minute range of the teacher's video ("Watch 12:40 to 24:15").
- **Gamification:** "Fixed" tick per topic and XP for watching.
- **Engagement:** personalised proof that the product understood the student's mistakes.

## PAGE 11. Plans (upsell)
- **Purpose:** sell after value is shown (Hormozi: show the result first).
- **Content:** Chapter pack (Rs 99) is the highlighted default; full JEE Main series (Rs 2,999) beside it; free option stays visible (rewatch, review answers). Checkout is demo only.
- **Engagement:** price tied to the student's own weak topics, not a generic list.

## PAGE 12. Retest
- **Purpose:** prove improvement.
- **Content:** same weak topic, one level higher; compare with the last attempt (before / target); XP on offer.
- **Gamification:** "beat your last score" challenge.

## PAGE 13. My progress
- **Purpose:** quantified proof that the student is improving, which is the reason to keep paying.
- **Content:** score trend, accuracy, streak calendar, level and XP, badges (earned and next), syllabus map with the level ladder per topic.
- **Honest note:** demo data is flagged as sample.

## Open items (not decided yet)
Real Level 1-5 question tagging; teacher check of answer keys; pass mark; free-test timer; login and payment; JEE Session 1 date; how Tamil is handled; the Tamil Nadu State Board version; the Eklavya export request and written approval are still unsent.
