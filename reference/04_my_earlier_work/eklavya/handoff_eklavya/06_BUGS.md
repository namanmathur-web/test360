# 06_BUGS.md — the 15 defects found

**INTERNAL: contains Vedantu content. Not for public use.**

From `bugs_found.md` (the 11 October capture run) and `test-qa/test_log.md` (the
8 October hand-played QA pass). Every item was observed directly.

Severity: **Critical** = loses a student's work or breaks exam integrity ·
**High** = wrong or contradictory information · **Medium** = confusing ·
**Low** = cosmetic.

---

## 1. A failed answer-save blames the student and loses the answer — **Critical**

**What happens.** After selecting an answer and clicking *Save & Next*, a modal
appears: *"Please check your internet connection and retry again!"* with a single OK
button. The answer is **not saved** — the Answered counter does not move and the app
stays on the question.

**Why it is the platform's fault.** Each answer is persisted by an individual
`POST .../submitQuestionAttempt`. On manual retry the same call returned **200 in
307 ms**. The connection was fine; this was a transient server failure.

**Reproduce.** Answer a question and click Save & Next repeatedly during a graded
attempt until a save fails. Observed live on Q31 of a 75-question paper.

**Correct behaviour.** Buffer the answer locally the instant it is clicked, retry
automatically with backoff, and show a non-blocking "saving…" indicator until it
lands. Never tell a student their internet is broken when the server failed, and never
offer only OK on a dialog whose text says "retry".

---

## 2. Two questions in a 25-question paper are worth 3 marks, not 4 — **High**

**What happens.** Chem Highweightage Test-21 totals **98**, not 100, because
`maxMarks` is 3 on question indexes 3 and 20 and 4 on the other 23 (23×4 + 2×3 = 98).
Counted across all 105 papers: 3 papers total 96, 1 totals 98, 1 totals 297.

**Why it is wrong.** JEE Main is uniformly +4, and the paper's own instructions screen
says "4(Four) marks". The paper contradicts its own rubric.

**Reproduce.** Read `maxMarks` across `resultEntries[]` in any affected paper.

**Correct behaviour.** Put the marking scheme on the **paper**, not the question, so
the instructions screen and the marking are rendered from one number.

---

## 3. The marking-scheme table shows a placeholder instead of the marks — **High**

**What happens.** On the instructions page the table reads
*Correct Answer = "Full Marks"*, the literal placeholder string, where it should say
**+4**. The other two cells correctly read `-1` and `0`.

**Reproduce.** Open any paper's instructions page.
**Screenshot:** `test_screens/01b-instructions-marking-and-warnings.png`

**Correct behaviour.** Render the real number. A candidate cannot plan an attempt
without knowing what a question is worth.

---

## 4. Opening a test and not submitting leaves it stuck as "Ongoing" forever — **High**

**What happens.** `startAttempt` is idempotent and immediately flips the card to
**"Ongoing / Continue Test"**, even for a paper whose window closed months ago, and
even though the listing API still reports it `MISSED`. There is no way to cancel. The
counter and the card then disagree — "LIVE & Upcoming (0)" renders a card.

**Reproduce.** Open a missed test's syllabus page without submitting, return to My Tests.

**Correct behaviour.** Distinguish "opened" from "started". Always offer a way back to
a clean run.

---

## 5. Field naming is inconsistent between two adjacent API calls — **Medium**

**What happens.** `submitQuestionAttempt` takes `testAttemptId`; `submitAttempt` takes
`attemptId` for the same value. Passing the wrong one returns
`400 "attemptId cann't be null"` — with Vedantu's own typo in the error string.

**Correct behaviour.** One name for one concept, and error strings that are spelled
correctly.

---

## 6. `getTableStats` returns 400 on every topic test — **Medium**

**What happens.** Returns `400 {"errorMessage":"Non competitive test"}` for
single-subject papers, while the result page calls it unconditionally on every paper.

**Correct behaviour.** Do not call an endpoint that cannot apply, or handle the
rejection quietly instead of logging an error on every topic-test result page.

---

## 7. The result page advertises sections it does not render — **High**

**What happens.** A text scan of the hero result pages found **no Leaderboard, no
Comparative chart, no PYQ card, no LearnList link and no Percentile** anywhere in the
DOM. Only Score, ScoreBooster, Easy Kill, Chapter analysis, Accuracy and Time Taken
are present. Scroll positions below the fold are mostly empty page.

The screenshots `design_guide/03_leaderboard_and_subject_analysis.png` and
`04_comparative_chart.png` come from an earlier session on a different paper where
those sections *did* render — so the feature exists but did not appear on the papers
we captured.

**Correct behaviour.** Do not ship a layout that reserves space for sections that are
not wired up. If a section has no data, say so in one line.

---

## 8. The Easy Kill practice playlist cannot be opened — **High**

**What happens.** *View Topics → Start* correctly opens a LearnList playlist showing
**Previous Year Questions** with Level 1 / 2 / 3, 15 questions each. **The level cards
are not clickable.** Three separate attempts failed — the cards expose no anchor, no
button and no clickable class, and a synthetic click on the card body does nothing.

**Reproduce.** From any result page, ScoreBooster → View Topics → Start → try Level 1.
**Screenshots:** `ad_pack/screens/EASYKILL__01_topics_expanded.png`,
`design_guide/08_topic_start_playlist.png`

**Correct behaviour.** The primary call-to-action of the headline feature must be a
real link or button.

---

## 9. Full-page screenshots time out on the phone viewport — **Low**

At 393×852 @3x a full-page capture of a result page exceeds 60 seconds and aborts.
Desktop @2x is fine. Symptom of a very tall, heavy page.

---

## 10. MathJax typesetting stalls the renderer — **Medium**

Repeated question navigation froze the page long enough to blow a 45-second automation
timeout several times, while the clicks still registered. Visible as lag for a student
moving quickly through the palette.

**Correct behaviour.** Render maths once per page and do not re-typeset on navigation.
KaTeX is substantially faster than MathJax for this workload.

---

## 11. Refresh resets the anti-cheat warning counter — **Critical (integrity)**

**What happens.** Before a mid-test refresh the tester had been shown 5+ "Too many
warnings" modals. Immediately after re-entry the modal read **"Warning 1 of 3"**.

**Why it matters.** A student about to breach the tab-switch limit can simply refresh
the page to wipe their warning count. That is an exam-integrity hole, not a UX nit.

**Reproduce.** Trigger several tab-switch warnings, refresh, trigger one more.

**Correct behaviour.** Keep the counter on the attempt, server-side, where a page
reload cannot touch it.

---

## 12. Refresh silently loses "visited" state — **Medium**

**What happens.** After a refresh, "Not Answered" collapsed from **04 → 00** and "Not
Visited" jumped **50 → 54**. Four questions the student had deliberately visited and
skipped reverted from red to Not Visited.

**Correct behaviour.** Persist per-question state server-side. A student loses the
record of what they consciously chose to skip.

---

## 13. Refresh dumps the student back on the instructions page at Q1 — **Medium**

**What happens.** After confirming the browser's "Leave site?" prompt, the app shows
the **full General Instructions page again** — re-tick the agreement, re-click "I AM
READY TO BEGIN", sit through the late-attempt modal a second time — and then lands on
**Q1**, not the question they were on. The timer does correctly continue from real
elapsed time.

**Correct behaviour.** A resume screen saying plainly that answers are saved, with one
button returning to the question they left. Note the **browser Back button is handled
correctly** — it traps cleanly and loses nothing — so the refresh path is the odd one out.

---

## 14. The submit flow opens with a mandatory abandonment survey — **High**

**What happens.** Clicking SUBMIT shows *"Nn, you're leaving too soon!"* and
*"Can you tell us why? *"* with a **mandatory** reason, options being
*Questions are very easy / Questions are tough / Questions out of covered syllabus /
I want to attempt later / I've not prepared for the test / Internet Issue / Other*,
and a button reading **"Submit & Leave"**.

**Why it is wrong.** There is **no option meaning "I have finished the test"**. A
student who answered 60 of 75 cannot submit without picking a reason that misdescribes
what they did. "Submit & Leave" reads like abandoning rather than submitting for
evaluation, at the most critical moment of the session.

**Correct behaviour.** Confirm the submission, show what is unanswered, and ask for
feedback afterwards if at all — never as a gate.

---

## 15. The final Exam Summary does not reconcile — **High**

**What happens.** The pre-submit summary table has columns *No. of Questions /
Answered / Not Answered / Marked for Review / Answered & Marked* — and **no "Not
Visited" column**. Questions in that state vanish: PHY SEC 1 showed "20 questions" but
its row accounted for only **17**. The table also overflows horizontally, with the
last header clipped to "Answered and Mark…" and no visible scrollbar.

**Correct behaviour.** On the final irreversible screen, every row must add up to the
section total. Include every state.

---

## Also recorded, below bug level

- **Numeric input:** `1e99` silently becomes `199`; no maximum length (accepts 12 digits).
- **"Save & Next" is disabled when nothing is selected** — a blank question can only be
  passed via the much smaller "Next >" button.
- **Section change is not announced.** Finishing SEC 1 auto-advances into SEC 2
  (a different question type) with no notice.
- **Section tabs jump to the first question of a section**, not the first unanswered one.
- **Solutions are images** — not selectable, searchable, zoomable or screen-readable.
- **No visual state for "the correct answer you did not pick"** on a wrong question.
- **Topic tags are wrong** on 3 of 6 audited questions, and Ved AI repeats the error.
- **Figures are tiny** — one gate diagram is 261×63 px with no click-to-enlarge.
- **"Time Taken: 45.48 /180mins"** is ambiguous: decimal minutes or mm:ss?
- **"Ranks not available"** sits inches from "improve your Rank from 1.1L to 6.2K".
- **Three greens, three reds, three fonts, seven corner radii** for the same meanings.
- **8px badges and 13px chat body text** — below comfortable reading size.
- A **promotional carousel** floats over the test list and covers Attempt Now buttons.
- A **logged-out deep link** to a test shows a generic marketing modal, not a sign-in.

## What was verified as correct

Worth recording, because it is the part not to change:

- **Scoring is exactly right.** Every headline number on a hand-played 75-question
  paper matched an independently derived ground truth: score 90/300, 30 correct,
  30 incorrect, 15 unattempted, 50% accuracy.
- **Browser Back is trapped safely** — stays in the test, no answers lost.
- **The timer continues from real elapsed time** across a refresh; it does not reset.
- **Answer changes, Clear Selection, Mark for Review and skip-and-return all work.**
- **The state-aware Start → Continue → Done button** on topic cards is the single best
  control in the product. Copy it.
