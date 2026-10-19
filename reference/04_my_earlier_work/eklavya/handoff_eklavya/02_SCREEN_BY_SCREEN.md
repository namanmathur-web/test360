# 02_SCREEN_BY_SCREEN.md — every screen a student sees

**INTERNAL: contains Vedantu content. Not for public use.**

In the order a student meets them. On-screen text is quoted **exactly** where we have
it recorded; anything we did not see is marked NOT CAPTURED.

Screenshots live in two folders and are referenced by filename:
- `test-qa/design_guide/` — 14 files, the post-test screens, measured for design
- `test_screens/` — 15 files, the in-test screens (one Maths topic test, 10 Oct 2026)
- `ad_pack/screens/` (64) and `ad_pack/mobile/` (33) — result pages for five papers

---

## 1. Test list — "My Tests"

**Screenshots:** NOT CAPTURED as a clean screenshot. Described in `test-qa/test_log.md`.

**What it shows:** cards, one per paper, grouped by status. The entry path recorded was
**My Tests → Missed (105) → first card → "Attempt Now"**.

| Control | What it does |
|---|---|
| Status tabs incl. **"Missed (105)"** | filters the list; the count is in the tab label |
| **"Attempt Now"** | opens the instructions page for that paper |
| **"LIVE & Upcoming (0)"** | a counter that can read 0 while still rendering a card — bug #4 |

Each card carries the paper name, and once an attempt exists the card flips to
**"Ongoing / Continue Test"** — permanently, even for a paper whose window closed
months ago, and even while the listing API still reports it `MISSED`.

**Known problems here:** a promotional carousel banner floats over the bottom of the
list and covers the Attempt Now button of the card beneath it. Opening a test deep link
while logged out shows a generic marketing modal, not a "sign in to continue to your
test" screen.

---

## 2. Instructions / start page

**Screenshots:** `test_screens/01-instructions-page.png`,
`test_screens/01b-instructions-marking-and-warnings.png`

**Top half** shows: duration, question count, the Section 1 versus Section 2 split,
the rounding rule for numeric answers, and the palette colour legend.

**Bottom half** shows navigation rules, the marking-scheme table, the fullscreen and
tab-switch warning, a consent checkbox, and the start button labelled
**"I AM READY TO BEGIN"**.

**The marking-scheme table** has three columns — *Correct Answer / Incorrect Answer /
Unanswered* — and its value row reads:

| Correct Answer | Incorrect Answer | Unanswered |
|---|---|---|
| `Full Marks` | `-1` | `0` |

The first cell renders the literal placeholder string **"Full Marks"** instead of
**+4**. A student cannot find out what a question is worth. This is bug #3.

Other exact wording recorded:
- "Marks awarded or deducted may vary by section or question type" — with no
  per-section scheme shown anywhere.
- the test "should be attempted in fullscreen mode", and leaving fullscreen or
  switching tabs is "recorded as a violation" — **the consequence is never stated**.
- "Do not press the browser Back button, refresh, or close the tab - it will be
  treated as an attempt to leave the test" — again no consequence given.

**A late-start warning** also appears: *"you are trying to attempt the test after the
permitted time… will not be considered for ranking purposes"*
(`test_screens/06a-warning-late-attempt-not-ranked.png`).

---

## 3. The test window

**Screenshots:** `test_screens/02-first-question-mcq-with-palette.png`,
`test_screens/03-numerical-question-sec2.png`,
`test_screens/05-palette-answered-green-and-review-purple.png`,
`test_screens/07-question-palette-cropped.png`,
`test_screens/06b-timer-and-practice-replica-disclaimer.png`

**Layout:** question on the left, question palette on the right, section tabs across
the top, timer top-right.

### Controls

| Control | What it does | Notes |
|---|---|---|
| **Save & Next** | saves the answer, advances one question | **Disabled when nothing is selected** — a blank question can only be passed with the smaller "Next >" |
| **Next >** | advances without saving an answer | the only way past an unanswered question |
| **Mark for Review & Next** | flags the question and advances | works both with and without an answer |
| **Clear Selection** | removes the chosen option | verified working |
| Section tabs (e.g. `PHY SEC 1`) | jump between sections | jumps to the **first** question of that section, not the first unanswered |
| Question palette | jump to any question | |
| **SUBMIT** | starts the submit flow | see §4 |
| **"Time Left 49:40"** | countdown | counts real elapsed time; survives a refresh |

**Language options: NOT CAPTURED.** No language selector was observed or recorded on
any screen. JEE Main itself is offered in 13 languages, so one may exist — we did not
see it.

### Question palette states

Five states, observed directly:

| State | Colour | Counter label |
|---|---|---|
| Answered | green | "Answered" |
| Not Answered (visited, skipped) | red | "Not Answered" |
| Not Visited | plain / grey | "Not Visited" |
| Marked for review, no answer | plain purple | "To be reviewed" |
| Answered **and** marked | purple with a green tick | "Answered & Marked for Review" |

The palette legend shows live counts beside each colour.

### Answer inputs

- **SEC 1 (SCQ):** four options, pick one. Changing a selection works cleanly.
- **SEC 2 (NUMERIC):** a free-text box labelled **"Enter your answer"**, with
  "Question Type: Numerical" shown above it. Validation strips letters
  (`abc` → empty, `12abc` → `12`) and accepts negatives (`−5.75`). Two defects:
  `1e99` silently becomes `199`, and there is no maximum length — it accepts 12 digits.

### Persistent banner

A **"Practice Replica Disclaimer"** banner sits under the header on every screen of
the test window.

### Behaviour worth copying, and not copying

- **Browser Back is trapped correctly** — stays in the test, loses nothing.
- **Refresh is handled badly** — fires a native "Leave site?" confirm, then drops the
  student on the full instructions page again at Q1, loses the visited-state of
  skipped questions, and **resets the anti-cheat warning counter**. Bugs #3 in the
  QA log and #2/#3 in `06_BUGS.md`.
- An answer save can fail with *"Please check your internet connection and retry
  again!"* and a single OK button, losing the answer. Bug #1 — the most serious.

---

## 4. Submit flow — three dialogs

**Screenshots:** `test_screens/08-submit-confirmation-exit-survey.png`,
`08b-submit-survey-other-freetext.png`, `08c-exam-summary-final-confirmation.png`,
`08d-final-are-you-sure-confirm.png`, `10a-submitted-success-dialog.png`

**Step 1 — an abandonment survey, not a confirmation.** Exact copy:

> "Nn, you're leaving too soon!" — "Can you tell us why? *"

Options: *Questions are very easy / Questions are tough / Questions out of covered
syllabus / I want to attempt later / I've not prepared for the test / Internet Issue /
Other*. Button: **"Submit & Leave"**.

Three problems: the reason is **mandatory**, there is **no option meaning "I have
finished"**, and "Submit & Leave" is ambiguous at the most critical moment. Choosing
"Other" reveals a free-text box.

**Step 2 — Exam Summary.** A per-section table with columns *No. of Questions /
Answered / Not Answered / Marked for Review / Answered & Marked*, an explicit
"Evaluation rule" note, a mandatory **"I have verified all my responses"** checkbox
that gates the Submit button, and a Back escape.

The table has **no "Not Visited" column**, so questions in that state vanish from the
count — a section can show "20 questions" and account for only 17. On the final
irreversible screen the numbers must reconcile. The table also overflows horizontally
with the last header clipped to "Answered and Mark…" and no visible scrollbar.

**Step 3 — "Are you sure you want to end the test?"** Then
**"You have successfully completed the test"**.

---

## 5. Result page — Performance tab

**Screenshots:** `design_guide/01_result_top.png`, `design_guide/02_scorebooster_cards.png`,
`design_guide/05_chapter_level_analysis_expanded.png`,
`test_screens/10b-first-screen-after-submit-result.png`,
plus `ad_pack/screens/*__01_score_card.png` and `*__02_scorebooster.png` for five papers.

Top of the page: test title, marks and time meta, **Download Pdf** and **Reattempt**
buttons, and **Performance / Answers** tabs plus an attempt picker.

**The score card** (a purple gradient panel) shows: a greeting, the score as a large
number over the total, a status pill reading **"Ranks not available"**, a stacked
segment bar for correct/wrong/unattempted, four stat cells (total questions,
attempted, correct/incorrect/unattempted, accuracy) and the time taken.

Verified: every number on this card was **exactly correct** against an independently
derived ground truth.

Two faults: **"Time Taken: 45.48 /180mins"** is ambiguous — decimal minutes or mm:ss?
And "Ranks not available" sits inches from a ScoreBooster line promising to "improve
your Rank from 1.1L to 6.2K".

**ScoreBooster panel** — see `03_INSIGHTS_CATALOG.md` for the full list.

**Chapter Level Analysis** — collapsed by default behind a link reading
**"View Chapter Level Analysis"**. Expanded, it lists chapters with score, attempted
and a mini segment bar. In the audited paper it covered only about 5 of 75 questions.

**Sections the page advertises but does not render:** a DOM text scan of the hero
result pages found **no Leaderboard, no Comparative chart, no PYQ card, no LearnList
link and no Percentile** anywhere on the page. The screenshots
`design_guide/03_leaderboard_and_subject_analysis.png` and
`design_guide/04_comparative_chart.png` were captured in an earlier session on a
different paper where those sections *did* render — so the feature exists, but it did
not render on the papers we captured. Bug #7.

---

## 6. Answers tab — solution review

**Screenshots:** `design_guide/10_answers_correct_question.png`,
`design_guide/11_answers_wrong_question_solution_open.png`,
`ad_pack/screens/*__08_answers_*.png`

One card per question showing: question number, type, a kebab menu, the question stem,
the option list with state colours, a status strip (**YOUR ANSWER**, difficulty, time
spent, topic) and a collapsible solution.

Status labels are **"CORRECT"** / **"INCORRECT"**. Difficulty appears as a word such
as **"MODERATE"**. Time per question is shown for all questions.

Three faults:
- **Solutions are images**, not text — not selectable, searchable, zoomable or
  readable by a screen reader. 73 of 75 questions in the audited paper had one.
- There is **no visual state for "the correct answer you did not pick"**. The option
  list colours your answer and nothing else, so on a wrong question the student cannot
  see which option was right.
- Topic tags shown here are sometimes wrong (3 of 6 audited).

---

## 7. Ved AI — the chat assistant

**Screenshots:** `design_guide/09_ved_chat_conversation.png`,
`design_guide/13_mobile_ved_chat.png`, `ad_pack/screens/VED__01..04`

A chat panel. It opens with a summary line — *"Here's a summary of your last 5 test
performances"* — then takes free-text questions. Controls: a composer box, a send
button, a **"New Chat"** button, and thumbs up/down on each reply.

Two serious faults:
- **"Last 5 tests" is not the last 5.** It lists the earliest-scheduled attempts, not
  the most recent, so the showcase feature opened with scores of 10/100, 5/100 and
  −10/100.
- **It repeats the content database's tagging errors.** It recommended revising
  "Work, energy and power", a topic not present on the paper at all.

Everything Ved produced in chat was a lookup over numbers already on the result page.
See `03_INSIGHTS_CATALOG.md`.

---

## 8. Easy Kill topics → practice playlist

**Screenshots:** `design_guide/06_easy_kill_topics_expanded.png`,
`design_guide/07_questions_popup_loading.png`, `design_guide/08_topic_start_playlist.png`,
`ad_pack/screens/EASYKILL__01_topics_expanded.png`, `EASYKILL__02_practice_start.png`

From ScoreBooster, **"View Topics"** expands a list of topic cards. Each card has a
title, a subject chip (PHY/CHE/MAT), the chapter name, a **"Questions ›"** link and a
state-aware button that moves **Start → Continue → Done**. That state-aware button is
the single best-designed control in the product.

**"Start"** opens a LearnList playlist page showing **Previous Year Questions** with
**Level 1 / Level 2 / Level 3**, 15 questions each.

**The level cards could not be opened.** Three separate attempts failed — the cards
expose no anchor, no button and no clickable class, and a synthetic click on the card
body does nothing. The practice sets themselves are therefore **NOT CAPTURED**.
Bug #8.

A **progress modal** with a determinate bar also appears when loading the questions
popup, and was observed stuck at 90%.

---

## 9. Mobile

**Screenshots:** `design_guide/12_mobile_result_page.png`,
`design_guide/13_mobile_ved_chat.png`, `ad_pack/mobile/` (33 files)

Captured at iPhone 14 Pro, 393×852 @3x. The result page and Ved chat both render.
Full-page screenshots at that density time out after 60 seconds, so the mobile
captures are scroll positions rather than single tall images.

---

## 10. Design system as measured

From `test-qa/design_guide/design_notes.md`, read from the live page's computed styles
rather than eyeballed. The full detail is in that file; the headlines:

- **Primary colour** `#FF693D`; accent purple `#6825E5`; score-card gradient
  `linear-gradient(339deg, #110A6A 8.97%, #7A42B0 91.02%)`.
- **Three different greens and three different reds** are used for the same two
  meanings (correct / incorrect). Pick one of each.
- **Three font families** in use — Poppins, Open Sans, Raleway — sometimes for the
  same role. Poppins dominates.
- **Seven corner radii** (2/3/10/16/20/24/28). Recommend 4/8/16/28/pill.
- Hero number is 60px/700. Smallest text is an **8px badge** and 13px chat body —
  below comfortable reading size. Use a 12px floor for metadata, 14px for body.
- Chart series colours: `#3C6F9C` Topper, `#512C96` Class AVG, `#F8C7B9` You.
