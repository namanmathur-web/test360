# 05_API_AND_FLOW_NOTES.md — how the platform's data flows

**INTERNAL: contains Vedantu content. Not for public use.**

> **No credential of any kind appears in this file or anywhere in this pack.** No
> token, cookie, password, authorization header or presigned URL was recorded during
> the capture or is reproduced here. Every call below ran from inside an
> already-signed-in browser page, which supplied the session automatically.

Host: `lms.vedantu.com`. All calls are JSON over HTTPS.

---

## 1. The order of calls

This is the sequence that produces a complete, marked paper. It is also the sequence
you would implement in your own product.

```
1.  startAttempt            -> attemptId + ALL the questions (but NO answers)
2.  submitQuestionAttempt   -> save answers (one call can carry the whole paper)
3.  submitAttempt           -> evaluate
4.  getAttemptDetails       -> the answer key, per-question marks and timings
5.  getInsightsByAttemptId  -> the ScoreBooster analytics
```

**The single most important fact about this platform:** questions and options can be
read without submitting, but **correct answers and solutions cannot**. They only exist
after an attempt has been submitted and evaluated. There is no read-only path to an
answer key.

---

## 2. The calls

### 1. Start or resume an attempt — also returns the questions

```
POST /lms/cmds/test/startAttempt
{"testId": "<testId>", "contentInfoId": "<shareId>"}
```

**Idempotent.** Calling it twice returns the *same* `id` while an attempt is open.

Response (~27 KB for a 25-question paper):

| Field | What it holds |
|---|---|
| `id` | the **attemptId**, needed by every later call |
| `categories[]` | `{category: "CHEM SEC 1", questions: […]}`, one per section |
| `categories[].questions[]` | `questionId`, `questionText`, `options[{index,label,text}]`, `topics`, `mainTags`, `difficulty`, `questionType`, `marks`, `duration`, `analysisTags` |
| `resultEntries[]` | per-question `maxMarks`, `questionIndex`, `questionType` |
| `imageDetails` | image URLs where a question has one — **empty on all 105 of our papers** |

At this stage `correctness` is `"UNKNOWN"` and there is no `correctAnswer` field.

### 2. Save answers — one call can carry the whole paper

```
POST /lms/cmds/test/submitQuestionAttempt
{"testAttemptId": "<attemptId>",
 "questionAttemptsMap": {
   "<questionId>": {"attempt": ["2"], "duration": 18238,
                    "attemptStateOfQuestion": "ANSWERED", "section": "CHEM SEC 1"}
 }}
```

`attempt` is the option **index as a string** (`"1"`–`"4"`), or the typed value for a
numeric question. Because `questionAttemptsMap` is a map, the entire paper fits in a
single request — this is what made capturing 105 papers feasible (5 calls per paper
instead of ~28).

### 3. Submit

```
POST /lms/cmds/test/submitAttempt
{"attemptId": "<attemptId>"}
```

Returns the evaluated attempt: `attemptState: "EVALUATE_COMPLETE"`, `marksAcheived`,
`correct`, `incorrect`, `unattempted`.

### 4. The answer key

```
GET /lms/cmds/test/getAttemptDetails?attemptId=<attemptId>
```

`resultEntries[]` now carries `correctAnswer` and `answerGiven` per `questionId`, plus
`correctness`, `marksGiven` and `duration`. Also `categoryAnalyticsList[]` with
per-section marks and counts.

### 5. Insights

```
GET /lms/insights/getInsightsByAttemptId?attemptId=<attemptId>
```

Returns `{insights, hshwTopicDetails}` — the ScoreBooster content. Fully documented in
`03_INSIGHTS_CATALOG.md`.

### Other read-only result-page calls

`getTestBasicDetails?testId=` · `testAggregatedData?attemptId=` · `getChartAnalytics` ·
`getEvaluatedAttempts?userId=&testId=` · `getTableStats?attemptId=` ·
`getTestSyllabusListFromEntityId?entityId=<scheduleId>&entityType=TEST_SCHEDULE_SHARE`

---

## 3. The quirks — read these before building

**a. Field naming is inconsistent between two adjacent calls.**
`submitQuestionAttempt` takes `testAttemptId`; `submitAttempt` takes `attemptId` for
the same value. Passing the wrong one returns
`400 "attemptId cann't be null"` — including the typo, which is Vedantu's own.

**b. `startAttempt` is idempotent and has a side effect.**
Calling it immediately flips the test card to "Ongoing / Continue Test" — even for a
paper whose window closed months ago, and even though the listing API still reports
the test as `MISSED`. There is no way to cancel. See bug #4.

**c. `getTableStats` 400s on every topic test.**
Returns `400 {"errorMessage":"Non competitive test"}` for the single-subject papers,
while the result page calls it unconditionally.

**d. Solutions are not in any JSON.**
They are rendered into the result page's **Answers** tab as `.question-report-wrapper`
blocks, and had to be scraped from the DOM. That tab also carries difficulty, topic,
time spent and correctness. The solutions themselves are **images**, not text.

**e. `getTestsAndSessions` needs a cursor that must be present but empty.**

```
GET https://scheduling.vedantu.com/scheduling/onetofew/session/v1/schedule/getTestsAndSessions
    ?batchIds=<id>&size=<n>&entityType=SESSION&app=true
    &contentType=TEST&fromTime=<ms>|toTime=<ms>
    &lastFetchedSessionId=<cursor>
```

Observed behaviour:
- `contentType=SESSION` → **500**, a Spring field-validation error (invalid enum).
- `contentType` omitted, or `TEST`, or `VIDEO`, with `toTime=now` → **200 but `count: 0`**.
- The page's own working call pairs `fromTime` **or** `toTime` with a
  `lastFetchedSessionId` cursor, and that parameter must be **present but empty** on
  the first page.

That pairing was never fully reproduced, so per-session **Notes PDFs** and **replay
URLs** remain unreachable. NOT CAPTURED.

**f. Course library endpoints** (a separate scrape, the source of the 20,062
assignment questions):

```
GET /lms/curriculum/getCurriculumByEntity?entityName=OTF_BATCH&entityIds=<batchId>
GET /lms/curriculum/getBatchCurriculumProgress?batchIds=<batchId>
```

The curriculum call returns nested `nodes[]` with `contents[]` at the leaves.
`contentType` observed: `ASSIGNMENT` (1,688), `DOCUMENT` (93), `TEST` (76), `VIDEO` (3).
It **returns 404 for 13 of 41 batches** — all test-series or completed batches with no
curriculum tree. Expected, not a fault.

**g. The course listing is not paginated server-side.** All 41 courses are already in
the page on load, so there is no per-page API call to make.

**h. Paper PDFs cannot be fetched by API.** `getAttemptDetails` carries no PDF URL,
and the "Download Pdf" control is a `div.download-pdf` with no `href` — a
JavaScript generate-and-download. NOT CAPTURED.

**i. LearnList playlist ids were never resolved.** `insights.json` was key-dumped
across all 105 papers; the complete key set contains **no playlist id** — only
`topicId`, `topicIds`, `topicName`, `chapterName` and `subjectName`. A playlist is
created per (attemptId, topicId) by clicking **Start**, which full-page-navigates and
hides the creation call. The known-good URL shape is
`vedantu.com/playlist/<playlistId>`. The 501 distinct topicIds are recorded; the
playlists behind them are NOT CAPTURED.

---

## 4. Pacing used during the capture

Recorded for reference, not as a recommendation: writes 3 seconds apart, one at a
time, at most 2 tabs. Downloads up to 4 in parallel with 1 second between starts. On a
429 or an error burst: halve the parallelism and double the gap; on persistent
failure, stop, wait 5 minutes, retry once, then stop and report.

**Zero 429s and zero rate-limit responses were seen** across the whole capture.
105 papers took 25 minutes; 1,688 assignments ran with 0 failures.
