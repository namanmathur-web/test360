# 07_GAPS_AND_UNKNOWNS.md — what we did NOT capture

**INTERNAL: contains Vedantu content. Not for public use.**

Read this before planning anything. Nothing below is guessed or filled in. Every count
was verified on disk on 19 October 2026.

---

## 1. Cohort, rank and percentile — PARTLY CAPTURED

This is more nuanced than our earlier notes said, so read it carefully.

**What we DO have**, inside `insights.json` on every paper:

| Field | Coverage | Range seen |
|---|---|---|
| `eaqInsight.averageEAQCohortAccuracy` | 103 of 105 papers | 73–86 |
| `eaqInsight.attemptPercentile` | 98 papers | 50–100 |
| `eaqInsight.accuracyPercentile` | 98 papers | 0–100 |
| `testAttemptInsightsSummary.attemptPercentile` | 105 papers | 79–80 |
| `testAttemptInsightsSummary.totalImprovePercentile` | 105 papers | — |

**What is NOT CAPTURED:**
- **Overall test percentile.** `review.json` has `testPercentile` and
  `aitsTestPercentile` fields and both are **0 on all 105 papers**. Never populated.
- **Per-question cohort accuracy.** No "what % of students got this right" anywhere.
- **The leaderboard.** No other student's name, score or rank was captured. The
  sections did not render on the papers we captured (bug #7).
- **Class average and topper scores per subject.** Visible in one earlier screenshot
  (`design_guide/03`, `04`) but the underlying numbers were never captured.
- **Any score→percentile or score→rank lookup table.**

**The important caveat:** the cohort numbers we do have describe **Vedantu's students
on Vedantu's papers**. They cannot be transferred to a new product. For a new product
they are a sanity check on plausible ranges, nothing more.

## 2. Payments and pricing — NOT CAPTURED

No pricing page, no plan comparison, no checkout flow, no payment provider, no
invoice, no refund policy, no coupon mechanics. We do not know what the Eklavya series
costs, whether it is sold separately or bundled with a course, or whether a free tier
exists. Nothing was purchased.

## 3. Accounts and sign-up — NOT CAPTURED

No sign-up flow, no email or OTP verification, no password-reset flow, no profile or
settings screen, no subscription state, no parent/guardian linkage. The capture used
one already-signed-in browser profile throughout. The only account-adjacent thing
recorded is that a **logged-out deep link to a test shows a generic marketing modal**
rather than a sign-in screen.

## 4. The admin and teacher side — NOT CAPTURED

Nothing at all. How papers are authored, how questions are tagged, who sets
difficulty, how a schedule is created, how results are released
(`doNotShowResultsTill` exists as a field but we never saw the control), how the
cohort is defined, any teacher dashboard, any content QA process. We only ever saw the
student view.

## 5. Paper PDFs — NOT CAPTURED (5 of 105 attempted, all failed)

`checkpoint_library.json` records **5 papers attempted, 5 failed, 0 succeeded**.
`getAttemptDetails` carries no PDF URL, and the "Download Pdf" control is a
`div.download-pdf` with no `href` — a JavaScript generate-and-download. It needs a
browser download interception that was never built. `library/papers/` is **empty**.

## 6. The 76 course tests — INDEX ONLY

`library/course_tests.csv` holds **76 rows** — the index of tests found inside the
course library, separate from the 105 Eklavya papers. **None of their content was
captured**: no questions, no answers, no insights. We have names and ids only.

## 7. The 501 LearnList playlists — IDS ONLY

**501 distinct `topicId`s** are referenced across the insight payloads, and
`checkpoint_library.json` confirms the same figure. **Not one playlist was captured.**
`library/learnlist/` is **empty**.

Why: no playlist id appears in any `insights.json` — the complete key set contains
only `topicId`, `topicIds`, `topicName`, `chapterName`, `subjectName`. A playlist is
created per (attemptId, topicId) by clicking **Start**, which full-page-navigates and
hides the creation call. Compounded by bug #8: the Level 1/2/3 cards on the playlist
page are not clickable at all. The estimated cost of brute-forcing it through the UI
was ~501 round trips, about 3 hours.

So: the **practice questions behind Easy Kill are entirely NOT CAPTURED**, including
the "Previous Year Questions, Level 1/2/3, 15 questions each" sets.

## 8. Per-class notes PDFs — NOT CAPTURED

`library/notes/` is **empty**. Blocked by the `getTestsAndSessions` quirk documented
in `05_API_AND_FLOW_NOTES.md` §3e — `contentType=SESSION` returns 500, every other
parameter combination returns `count: 0`, and `postSessionContents` was `[]` on every
session we could see because all were `SCHEDULED`.

## 9. Class recordings — INDEX ONLY

`library/recordings_index.csv` holds **1,420 rows**. No video was downloaded.

## 10. Other gaps found while writing this pack

- **No per-paper syllabus document exists.** What a paper covers can only be inferred
  from the topic tags on its questions. The `getTestSyllabusListFromEntityId` endpoint
  was observed but its output was never captured.
- **`pyq_year` is blank on all 23,447 bank rows.** Exam years exist only at
  paper/topic level in `pyqInsight.examYears`, on 58 of 105 papers.
- **`imageDetails` is empty on all 105 papers.** Test-question figures were recovered
  from URLs embedded in the page HTML, not from this field.
- **Figures behind presigned S3 URLs were deliberately skipped** — those URLs embed
  credentials. The bare S3 URLs 404 and the CloudFront host is dead. **198 rows still
  reference a figure that exists nowhere.**
- **Language options.** JEE Main is offered in 13 languages. No language selector was
  observed in the test window. We do not know whether one exists.
- **The "Download Pdf" and "Reattempt" buttons** on the result page were never clicked.
- **Accessibility.** Never tested. Solutions being images means screen readers cannot
  read them, but no audit was done.
- **`answerChangeRecords` and `questionChangeRecords`** are `[]` in all our data. The
  platform clearly intends to track answer changes; we never saw populated examples.
- **Low-time behaviour was never tested.** The paper is 3 hours and ~143 minutes
  remained at submit. The 5-minute warning, any colour change, and **auto-submit at
  00:00 are all untested and unknown.**
- **13 of 41 course batches return 404** on the curriculum endpoint — expected for
  completed/test-series batches, but it means their contents are unknown.
- **Biology.** 1,677 bank rows are Biology, held out of the JEE taxonomy deliberately.
  Not part of this test series.
- **Only one student's data exists** — one account, one set of attempts. Every
  behavioural observation is n=1.
- **The 3 `ATTEMPTED` papers** in `tests.json` were already attempted before our
  capture; 102 were `MISSED`. All attempts we recorded were made a year after the
  test windows closed, so **none were eligible for ranking** — which is part of why
  rank and percentile are empty.
