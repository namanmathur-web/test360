# 03_INSIGHTS_CATALOG.md — every post-test insight

**INTERNAL: contains Vedantu content. Not for public use.**

Two sources: the `insights.json` file saved for each of the 105 papers (which is the
server's own payload, so it is **observed**, not guessed), and the on-screen behaviour
recorded in `test-qa/comparison.md`.

**Levels used throughout:**
- **Level 1** — needs only the marked answer sheet: marks, right/wrong/blank, time, chapter.
- **Level 2** — needs per-question metadata: difficulty, sub-topic, mistake type.
- **Level 3** — needs other students: cohort, percentile, rank, topper.

---

## 1. What the server actually sends

Each paper's `insights.json` has two top-level keys, `insights` and
`hshwTopicDetails`. Inside `insights` are four payload blocks. Counted across all 105
papers:

| Block | Present on | What it is |
|---|---:|---|
| `testAttemptInsightsSummary` | 105 / 105 | the headline numbers |
| `pyqInsight` | 105 / 105 | previous-year-question analysis |
| `eaqInsight` | 103 / 105 | "Easy Kill" — easy questions you got wrong |
| `hshwTopicsInsight` | 103 / 105 | high-scoring-high-weightage topic analysis |

`hshwTopicDetails` is a list naming the topics, with `topicId`, `topicName`,
`chapterName` and `subjectName`. Its length varies 0–9 per paper (most commonly 3).
Across all papers these blocks reference **501 distinct topicIds** — the same 501 that
map to LearnList practice playlists.

### Field by field, with real observed ranges

**`testAttemptInsightsSummary`** — 4 fields:

| Field | Example | Observed range | Level |
|---|---|---|---|
| `possibleMarksGain` | 72 | — | 1 |
| `attemptPercentile` | 80 | 79–80 across all 105 | **3** |
| `attemptAccuracy` | 20 | — | 1 |
| `totalImprovePercentile` | 72 | — | **3** |

**`pyqInsight`** — which questions were previous-year questions and how you did:

| Field | Example | Level |
|---|---|---|
| `topicIds` | list of ids | 2 |
| `totalQuestionCount` / `attemptQuestionCount` | 1 / 1 | 1 |
| `correctQuestionCount` / `incorrectQuestionCount` / `missedQuestionCount` | 0 / 1 / 0 | 1 |
| `accuracy`, `attemptPercentage` | 0, 100 | 1 |
| `possibleMarksGain` | 4 | 1 |
| **`examYears`** | `[2025]` | **2** |

`examYears` is populated on **58 of 105** papers. Years seen, with how many papers
reference each: 2015 ×9, 2016 ×3, 2017 ×5, 2018 ×19, 2019 ×31, 2020 ×21, 2021 ×35,
2022 ×13, 2023 ×7, 2024 ×4, 2025 ×7.

**`eaqInsight`** — "Easy Kill", the easy marks you dropped:

| Field | Example | Observed range | Level |
|---|---|---|---|
| `attemptPercentile` | 77 | 50–100 (n=98) | **3** |
| `accuracyPercentile` | 28 | 0–100 (n=98) | **3** |
| **`averageEAQCohortAccuracy`** | 80 | **73–86 across 103 papers** | **3** |
| `possibleMarksGain` | 28 | — | 1 |
| question counts (total/attempt/missed/incorrect/correct) | 9/7/2/5/2 | — | 1 |

**`hshwTopicsInsight`** — high-weightage topics:

| Field | Example | Level |
|---|---|---|
| `topicIds` | list | 2 |
| `accuracy` | 11 | 1 |
| `totalQuestionCount` / `incorrectQuestionCount` / `missedQuestionCount` | 12 / 8 / 3 | 1 |
| `possibleMarksGain` | 44 | 1 |

> **This is the single most valuable finding in the pack.** Cohort data *is* present in
> the captured files — `averageEAQCohortAccuracy` is a real cohort average on 103 of
> 105 papers, and three different percentile fields are populated. Our earlier project
> notes said cohort and percentile were "not available". They were, at topic level.
> See `08_DISCREPANCIES.md`.
>
> What is still missing is **per-question** cohort accuracy and any **leaderboard**.
> `review.json`'s own `testPercentile` and `aitsTestPercentile` fields are **0 on all
> 105 papers**, so the overall percentile was never filled in.

---

## 2. What the student sees, and whether plain arithmetic can reproduce it

From `test-qa/comparison.md`: a ~250-line stdlib Python engine with no AI was run
against one 75-question paper and compared, insight by insight, with what Ved AI showed.

**Scoreboard: 10 of 16 insights matched or beaten by plain arithmetic.**

| # | Insight | Verdict | Level | What it needs |
|---|---|---|---|---|
| 1 | Total score | **Same** | 1 | nothing |
| 2 | Subject scores | **Same** | 1 | nothing |
| 3 | Correct / wrong / skipped / accuracy | **Same** | 1 | nothing |
| 4 | Skipped count + potential marks | **Better** | 1 | ours also showed the 150 marks lost to *wrong* answers, which Ved never mentions |
| 5 | Weak chapters | **Better** | 1 | ours mapped 68 of 75 questions, Ved's "Chapter Level Analysis" mapped about 5 |
| 6 | Easy Kill topics (9 sub-topics) | **Partly** | 2 | needs a **sub-topic** tag per question; we only had chapter. Overlap 5 of 8 |
| 7 | "37 high-weight, high-scoring questions" | **Missing** | 2 | a per-question weight / exam-frequency flag |
| 8 | Previous Year Questions ("19 from 2015…2025") | **Missing** | 2 | a `pyq_year` per question — see the note below |
| 9 | Performance label ("Balanced Learner") | **Better** | 1 | a 2-line if/else does it |
| 10 | Predicted JEE Main percentile (~89.50) | **Missing** | 3 | a score→percentile lookup table |
| 11 | Rank projection ("1.1L to 6.2K") | **Missing** | 3 | same table + candidate count |
| 12 | "2 quick actions to gain 104 marks" | **Same/Better** | 1 | ours showed the arithmetic; Ved's 104 is unexplained |
| 13 | Time insights | **Better** | 1–2 | Ved shows per-question time and **derives nothing from it**. Ours flagged 4 rushed wrong answers |
| 14 | Study plan | **Better** | 1 | Ved named a topic not on the paper |
| 15 | Vs topper / class average | **Missing** | 3 | cohort aggregates per test |
| 16 | Leaderboard (top 10 by name) | **Missing** | 3 | cohort result table + a privacy decision |

### The four conclusions that matter

1. **The expensive-looking part is the cheap part.** Score, splits, counts,
   marks-lost, weak chapters and the study plan are arithmetic over a correctly
   tagged answer sheet. No model is needed for any of them.
2. **The engine beat Ved where Ved's *data* was wrong, not where its *AI* was weak.**
   Ved recommended "Work, energy and power" — absent from the paper — because the
   question was mis-tagged. **Fixing tags is worth more than any model upgrade.**
3. **A rules engine cannot hallucinate.** Where it lacks data it prints "cannot
   reproduce" and names the missing field. That is strictly safer than a fluent wrong
   answer a student cannot detect.
4. **The AI-ish feature is the chat interface, not the insight.** Every insight Ved
   produced in chat was a lookup over the same numbers.

### On PYQ years

`comparison.md` recorded row 8 as "Missing — needs a `pyq_year` per question", and the
master bank's `pyq_year` column is indeed **blank on all 23,447 rows**. But
`insights.json` carries `pyqInsight.examYears` on 58 papers. The years exist at
**paper/topic level**, not per question. Both statements are true; they describe
different granularities.

---

## 3. What each level costs to build

| Level | Reproducible from the captured data? | What it costs |
|---|---|---|
| **Level 1** | Yes, completely | arithmetic. A few hundred lines |
| **Level 2** | Partly | needs a **sub-topic tag** and a **difficulty** per question. We have 764 topic tags (inconsistent) and a difficulty field that is 90% one value, so a derived difficulty is required |
| **Level 3** | No, not for a new product | needs real students sitting the same paper. The captured topic-level cohort numbers describe **Vedantu's** students on **Vedantu's** papers and cannot be transferred |

**Recommendation for whoever builds this:** ship Level 1 and Level 2 from day one, and
show nothing at Level 3 until real students exist — but **put the empty columns in the
schema now** (`pyq_year`, `weight_tag`, `cohort_accuracy`). In `comparison.md` every
insight that could not be reproduced was a missing column, not a missing model.
