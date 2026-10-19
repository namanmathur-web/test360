# 04_DATA_DICTIONARY.md — what every file and field holds

**INTERNAL: contains Vedantu content. Not for public use.**

Examples below are short and generic. Full question text is never reproduced here.

---

## 1. `all_tests/` — the captured test series

```
all_tests/
  index.csv                     105 rows, one per paper, our own summary
  tests.json                    105 records, the platform's own listing payload
  <testId>/                     one folder per paper — 105 of them
    questions.json              the paper: sections, questions, options
    review.json                 the marked attempt: answers, keys, per-section stats
    insights.json               the ScoreBooster payload
    summary.md                  a 6-line human summary we wrote
```

**432 files, 23.2 MB.** A `<testId>` is a 24-character hex string, e.g.
`68ce2a86d104af2979852b27`. That id is the join key for everything.

### `index.csv` — our summary index

| Column | Example | Meaning |
|---|---|---|
| `title` | `Chem Highweightage Test-1` | paper name |
| `testId` | `68ce2a86…` | folder name and join key |
| `subjects` | `Chemistry` | semicolon-separated |
| `questions` | `25` | questions in the paper |
| `with_correct_answer` | `25` | how many have a key recorded |
| `marks` | `0` | marks the attempt scored |
| `total` | `100` | paper total |
| `correct` / `incorrect` / `unattempted` | `4` / `16` / `5` | attempt outcome |
| `has_insights` | `True` | whether `insights.json` exists |
| `path` | `all_tests/68ce…` | folder |

### `tests.json` — the platform's listing

| Field | Example | Meaning |
|---|---|---|
| `title` | `EklavyATS-2026-Part-Test-9-Paper 1(JEE MAIN)` | paper name |
| `status` | `MISSED` | `MISSED` (102) or `ATTEMPTED` (3) at capture time |
| `testId` | 24-hex | the paper |
| `shareId` | 24-hex | needed to start an attempt — the `contentInfoId` |
| `scheduleId` | 24-hex | the scheduled sitting |
| `subjects` | `["Chemistry","Mathematics","Physics"]` | |
| `q` | `75` | question count |
| `durMs` | `10800000` | duration in milliseconds (180 min) |
| `marks` | `300` | paper total |
| `pattern` | `JEE_MAINS_2024` | **the test type.** `JEE_MAINS` = topic (94), `JEE_MAINS_2024` = full (11) |
| `link` | a `vedantu.com/cmds/test/<testId>` URL | |
| `minStart` | `1766601120000` | **scheduled date**, epoch ms. All 105 present |
| `reattempt` | `true` | whether a retake is allowed |

### `questions.json` — the paper itself

Top level: `categories`, `imageDetails`, `resultEntries`, `totalMarks`, `testName`,
`duration`.

`categories[]` is one entry per section:

| Field | Example |
|---|---|
| `category` | `CHEM SEC 1` |
| `questions` | a list of question objects |

`categories[].questions[]`:

| Field | Example | Meaning |
|---|---|---|
| `questionId` | `5cf10dcf8f08bab22fede162` | **the question's own id, stable across papers** |
| `questionText` | `"Calculate the no. of moles of \\[F{e_2}{O_3}\\]…"` | LaTeX inside `\[…\]` or `$…$` |
| `options` | `[{"index":"1","label":"a","text":"1.5"}, …]` | `index` is what you submit, `label` is what is shown |
| `topics` | `["Limiting Reagent and Excess Reactant"]` | free-text topic tags |
| `mainTags` | `["Law of reciprocal proportions", …]` | broader tags |
| `analysisTags` | same shape as `topics` | used by the insight engine |
| `difficulty` | `MODERATE` | 90.4% of the corpus is this one value |
| `questionIndex` | `1` | position within the paper |
| `questionType` | `SCQ` or `NUMERIC` | |
| `marks` | `{"positive": 4, "negative": 1}` | per question |
| `duration` | `0` | 0 before an attempt; seconds after |

`imageDetails` — **empty (`[]`) on all 105 papers.** Images for test questions were
not delivered through this field; they were recovered from URLs embedded in the HTML.

`resultEntries[]` before submission carries `correctness: "UNKNOWN"` and
`questionAttemptState: "NOT_EVALUATED"` — **no answer key**.

### `review.json` — the marked attempt

44 top-level keys. The ones that matter:

| Field | Example | Meaning |
|---|---|---|
| `id` | 24-hex | the **attemptId** |
| `testId`, `contentInfoId`, `studentId` | 24-hex / numeric | joins |
| `attemptState` | `EVALUATE_COMPLETE` | |
| `totalMarks` / `marksAcheived` | `100` / `0` | note the platform's spelling |
| `attempted` / `unattempted` / `correct` / `incorrect` / `partiallyCorrect` | ints | `partiallyCorrect` is 0 everywhere |
| `attemptMarksPercent` | int | |
| `testPercentile`, `aitsTestPercentile` | **0 on all 105** | never populated |
| `timeTakenByStudent`, `duration`, `startTime`, `endTime`, `startedAt`, `endedAt` | epoch ms | |
| `testEndType` | string | how the attempt ended |
| `attemptIndex`, `reevaluationNumber` | ints | |
| `omrTest` | bool | |
| `resultEntries[]` | list | per question, below |
| `categoryAnalyticsList[]` | list | per section, below |

`resultEntries[]` **after** submission — this is where the answer key appears:

| Field | Example | Meaning |
|---|---|---|
| `questionId` | 24-hex | join to the question |
| `answerGiven` | `["1"]` | a list; the option `index`, or the typed number |
| **`correctAnswer`** | `["2"]` | **only present after evaluation** |
| `marksGiven` | `-1` | what this question scored |
| `maxMarks` | `4` | what it was worth — **can be 3 or 1, see bug #2** |
| `correctness` | `CORRECT` / `INCORRECT` / `UNKNOWN` | `UNKNOWN` = unattempted |
| `questionAttemptState` | `EVALUATED` | |
| `duration` | `8000` | milliseconds spent |
| `questionIndex` | `0` | |
| `answerChangeRecords`, `questionChangeRecords` | `[]` | empty in all our data |

Counted across all 105: **2,540 SCQ + 635 NUMERIC**; correctness **576 CORRECT,
1,963 INCORRECT, 636 UNKNOWN**.

`categoryAnalyticsList[]` — one per section:

| Field | Example |
|---|---|
| `name` | `CHEM SEC 1` |
| `categoryType` | `SECTION` |
| `marks` | `4` |
| `attempted` / `unattempted` / `correct` / `incorrect` / `partiallyCorrect` | ints |
| `maxMarks` | `80` |
| `duration` | `262928` (ms) |

### `insights.json`

Fully documented in `03_INSIGHTS_CATALOG.md`. Shape:
`{ "insights": { …4 payload blocks… }, "hshwTopicDetails": [ {topicId, topicName, chapterName, subjectName}, … ] }`

### `summary.md`

Six lines we wrote, e.g. test name, `testId` and `attemptId`, subjects, question and
answer counts, score, and attempt state.

---

## 2. How things link together

```
tests.json.testId  ──┬──> all_tests/<testId>/questions.json   (the paper)
                     ├──> all_tests/<testId>/review.json      (the marked attempt)
                     └──> all_tests/<testId>/insights.json    (the analytics)

questions.json: categories[].questions[].questionId
                     │
                     └──> review.json: resultEntries[].questionId   (answer + key)

master_bank rows:  source='test', source_id=<testId>, id='MB######'
                   image_paths ──> master_bank/images/MB######_1.jpg
```

To reconstruct a paper with its answers you need **questions.json and review.json
together**. Neither alone is enough: the paper has no key, and the review has no
question text.

---

## 3. Images

| Where | What | Count | Size |
|---|---|---:|---:|
| `master_bank/images/_by_url/` | download cache, named by URL hash | 7,621 | 100.8 MB |
| `master_bank/images/` | files linked to rows, named `MB######_N.jpg` | 8,910 | 110.9 MB |

**Naming rule:** `<master bank row id>_<n><ext>`, e.g. `MB002558_1.jpg`,
`MB002558_2.jpg` for a question with two figures. A row's `image_paths` column holds
`images/MB002558_1.jpg; images/MB002558_2.jpg` — relative to `master_bank/`,
semicolon-space separated.

Files in `images/` are **hard links** to the cache, so the two folders share disk
blocks; the real footprint is about 110 MB, not 211 MB.

**All 7,621 image URLs downloaded, zero failures**, over plain HTTPS with no sign-in.
Images whose source URL was a presigned S3 link were **deliberately skipped** because
those URLs embed credentials. The bare S3 URLs return 404 and the CloudFront host is
dead, so **those figures are NOT CAPTURED** — 198 rows still say "figure" with no
image anywhere.

---

## 4. Master bank schema

`master_bank/master_bank.sqlite`, table `questions`, **23,447 rows, 24 columns**.
Also exported as `master_bank.csv`.

| Column | Example | Meaning / allowed values |
|---|---|---|
| `id` | `MB000126` | our row id, `MB` + 6 digits |
| `source` | `test` | `test` (3,175) · `assignment` (20,062) · `bank` (210, ours) |
| `source_id` | `68ce405c…` | the testId or assignment id it came from |
| `subject` | `Maths` | `Physics` · `Chemistry` · `Maths` · `Biology` · blank (10) |
| `chapter` | `Sequences and Series` | one of our 77, or `unmapped` (2,058 rows) |
| `sub_topic` | `Sum of terms in A.P.` | source tag; often just repeats the chapter |
| `concept` | *(blank)* | filled on 8,383 rows only |
| `question_text` | LaTeX string | never empty except 2 flagged rows |
| `option_a`…`option_d` | `$\frac{59}{134}$` | blank for numeric questions |
| `question_type` | `SCQ` | `SCQ` · `numeric` · `MCQ` (24 rows) |
| `correct_answer` | `1` | `1`–`4` for SCQ (20 rows use `a`–`d`), a number for numeric |
| `solution_text` | worked text | blank on 1,092 rows |
| `marks` | `4` | mostly `4`; also `+4` (32 rows) and `2` (8 rows) |
| `source_difficulty` | `MODERATE` | `MODERATE` 21,200 · `EASY` 1,646 · `TOUGH` 308 · `BEGINNER` 151 · `MEDIUM` 78 · `HARD` 64 |
| `estimated_difficulty` | `Easy` | **our** estimate: `Easy` · `Medium` · `Hard` |
| `has_figure` | `false` | `true` / `false` |
| `image_paths` | `images/MB000007_1.jpg` | `; `-separated, relative to `master_bank/` |
| `source_time_seconds` | `8` | present on only 2,750 rows (11.7%) |
| `pyq_year` | *(blank)* | **blank on all 23,447 rows.** Never guessed |
| `exam_tag` | `JEE_Main; JEE_Main-11` | the exam and class. Also `NEET_UG`, `JEE_Advanced`, `CBSE`, `11_12_JEE` |
| `duplicate_of` | *(blank)* | blank = unique (16,780). Otherwise the id it duplicates |

Filter `duplicate_of = ''` for the working set. 6,667 rows are duplicates — **28.4%**
(5,924 exact-text, 743 near-match by token set).

### How `estimated_difficulty` is derived

Rules only, no model, from `master_bank/difficulty_rules.md`. The source `difficulty`
field is useless (90% one value), so the estimate leans on **solution shape**.
Thresholds are set at measured percentiles of this corpus, not guessed.

Score starts at 0 and adds: source difficulty easy −3 / hard +3; solution length
≤110 chars −1, 350–556 +1, >556 +2; reasoning steps ≥5 +2, 2–4 +1; numeric type +1;
question text >242 chars +1; recorded time >150 s +1, <45 s −1; marks <4 −1.
Bands: ≤−1 Easy, 0–2 Medium, ≥3 Hard. Result: **Easy 7,033 (30.0%), Medium 14,962
(63.8%), Hard 1,452 (6.2%)**.

**Known limits, stated in the source document:** timing fires on only 11.7% of rows;
1,092 rows have no solution so contribute nothing; the rule rewards long multi-step
solutions and therefore **under-rates a short, genuinely hard conceptual question**;
and **nothing is calibrated against real student performance**, because the corpus
contains none.

---

## 5. Taxonomy

`question_bank/jee_main_taxonomy.csv` — **1,288 rows = 1,288 concepts, grouped into
77 chapters** across Maths (26), Physics (29) and Chemistry (22). Ours, not Vedantu's.

| Column | Example |
|---|---|
| `subject` | `Maths` |
| `class` | `11` or `12` |
| `chapter` | `Relations and Functions` |
| `chapter_order` | `1` |
| `concept_id` | `1.1` |
| `concept_name` | `Cartesian product, relations, domain and range` |
| `exam_status` | `jee_main` |
| `figure_likely` | `no` |
| `source`, `confidence`, `source_note` | provenance of the mapping |

Coverage against the bank: 75 of 77 chapters have at least one question; **2 have
zero** (Maths / Linear Programming, Physics / Experimental Skills); 17 have fewer
than 100.

---

## 6. Quality flags

`master_bank/quality_flags.csv` — **1,858 distinct rows flagged**, one row per
flagged question, `flags` column semicolon-separated.

| Flag | Rows | What it means |
|---|---:|---|
| `solution_is_image` | 848 | the worked solution exists, as a picture, not text |
| `options_are_images` | 652 | options are pictures; stored text is only `(a)`, `(b)` |
| `no_solution_field_in_source` | 210 | the source CSV has no solution column at all |
| `figure_without_image` | 198 | text mentions a figure, no image exists anywhere |
| `no_solution` | 34 | genuinely empty |
| `missing_options` | 31 | genuinely empty |
| `quote_damage` | 29 | encoding damage / mojibake in the text |
| `no_correct_answer` | 25 | no answer key recorded |
| `broken_formula` | 5 | unclosed LaTeX delimiter |
| `empty_question` | 2 | no text and no image |

**For building a paper**, seven of these make a question unusable — `empty_question`,
`missing_options`, `no_correct_answer`, `figure_without_image`, `options_are_images`,
`broken_formula`, `quote_damage`. The other three only weaken the *solution*; the
question is still answerable. Applying that rule to the 15,093 unique Physics,
Chemistry and Maths questions leaves **14,045 usable (93.1%)**.

### One formatting trap worth knowing

The bank's formulas came out of MathType, which writes array column specifications as
`\begin{array}{*{20}{c}}`. **KaTeX cannot parse that repeat form** and renders the
whole piecewise function as an error. **490 of the 16,780 unique questions** are
affected, concentrated in Determinants (106), Continuity and Differentiability (91)
and Matrices (29). The fix is to expand `*{20}{c}` into twenty `c`s before rendering.
