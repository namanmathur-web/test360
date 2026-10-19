# 01_PRODUCT_SPEC.md — what the test series contains

**INTERNAL: contains Vedantu content. Not for public use.**

Everything here was counted from `all_tests/` on 19 October 2026.

---

## 1. The two test types

The data shows exactly **two** paper types. There is no "half-syllabus" type and no
"chapter test" type in this series — those are categories we invented later for our
own product, not things Vedantu ships here.

| | Topic test | Full-syllabus paper |
|---|---|---|
| **How many** | 94 of 105 | 11 of 105 |
| **Subjects** | one | all three |
| **Questions** | 25 | 75 |
| **Sections** | 2 | 6 |
| **Duration** | 60 minutes | 180 minutes |
| **Total marks** | 100 | 300 |
| **Platform's `pattern` field** | `JEE_MAINS` | `JEE_MAINS_2024` |
| **Name looks like** | `Physics Highweightage Test-20` | `EklavyATS-2026-Part-Test-10-Paper 1(JEE MAIN)` |

The `pattern` field in `tests.json` is the platform's own label and separates the two
cleanly — 94 `JEE_MAINS` and 11 `JEE_MAINS_2024`. Do not infer the type from the
question count; use this field.

## 2. The exact paper pattern

Identical in both types; the full paper is simply the single-subject block repeated
three times.

**One subject block = 25 questions:**

| Section | Questions | Question type | Answer input |
|---|---:|---|---|
| `<SUBJ> SEC 1` | 20 | `SCQ` — single correct choice | pick one of four options |
| `<SUBJ> SEC 2` | 5 | `NUMERIC` | type a number into a free-text box |

`<SUBJ>` is literally `PHY`, `CHEM` or `MATH`. A full paper's six sections appear in
this fixed order: **PHY SEC 1, PHY SEC 2, CHEM SEC 1, CHEM SEC 2, MATH SEC 1, MATH SEC 2.**
All 11 full papers have this exact shape with no variation.

Counted across all 105 papers: **2,540 SCQ** and **635 NUMERIC** questions. The split
is exactly 20:5 in every single paper.

**Marking**

| Outcome | Marks |
|---|---|
| Correct | **+4** |
| Incorrect | **−1** |
| Unanswered | **0** |

Negative marking applies to the numeric section too. There is no partial credit:
`partiallyCorrect` is 0 on every one of the 105 papers.

**Total marks should be 25 × 4 = 100, or 75 × 4 = 300. They are not always.**
Counted from the files:

| Expected | Papers at that total | Anomalies |
|---|---:|---|
| 100 | 90 | 3 papers total **96**, 1 totals **98** |
| 300 | 10 | 1 totals **297** |

Five of the 105 papers do not add up, because individual questions carry a `maxMarks`
of 3 or 1 instead of 4 while the instructions screen still promises "+4". This is
bug #2 in `06_BUGS.md`. **Do not copy this.** Put the marks on the paper, not on the
question, so a paper cannot contradict its own rubric.

## 3. Naming and ordering

Four naming families, counted:

| Family | Count | Pattern | Numbering |
|---|---:|---|---|
| Physics Highweightage | 36 | `Physics Highweightage Test-N` | N = 1…36 |
| Chem Highweightage | 32 | `Chem Highweightage Test-N` | N = 1…32 |
| Maths Highweightage | 26 | `Maths Highweightage Test-N` | N = 1…26 |
| Part Test | 11 | `EklavyATS-2026-Part-Test-N-Paper 1(JEE MAIN)` | N = 1…11 |

"Highweightage" is Vedantu's word for a topic that carries a lot of marks in the real
exam. `EklavyATS` = Eklavya Test Series. "Paper 1" distinguishes JEE Main's paper 1
(engineering) from paper 2 (architecture); only paper 1 appears here.

**Ordering is by scheduled date**, not by name. Every paper carries a `minStart`
timestamp, and all 105 are present. The series runs **30 September 2025 → 30 December
2025**. Note that the capture happened in October 2026, a year after the window
closed — every paper was therefore `MISSED` (102) or already `ATTEMPTED` (3).

## 4. Subject coverage

| Subject | Papers it appears in |
|---|---:|
| Physics | 47 (36 topic + 11 full) |
| Chemistry | 43 (32 topic + 11 full) |
| Mathematics | 37 (26 topic + 11 full) |

Physics gets the most dedicated papers; Maths the fewest. Every full paper carries all
three equally at 25 questions each.

## 5. Chapter and topic coverage

Each question carries a free-text `topics` tag from Vedantu's own content database.
Across the 3,175 captured questions there are **764 distinct topic tags**, of which
**293 appear exactly once**. The tagging is fine-grained and inconsistent — it is a
topic label, not a chapter label.

Most frequent tags:

| Tag | Questions |
|---|---:|
| Light | 52 |
| Alternating current | 48 |
| Current electricity | 37 |
| Kinematics | 36 |
| VSEPR Theory | 32 |
| Colligative Properties of Dilute Solutions | 30 |
| Plotting region and area under curves | 29 |
| Shortest distance between two lines | 29 |
| Chemical Properties of Aromatic Hydrocarbons | 28 |
| Chemical Properties of Amines | 27 |

Mapped onto our own 77-chapter taxonomy, the 3,175 test questions touch **74 distinct
subject/chapter pairs**, with 5 questions unmappable. The heaviest chapters:

| Chapter | Questions |
|---|---:|
| Physics / Work, Energy and Power | 297 |
| Chemistry / Organic Chemistry: Some Basic Principles and Techniques | 188 |
| Physics / Current Electricity | 136 |
| Maths / Three Dimensional Geometry | 90 |
| Chemistry / Some Basic Concepts of Chemistry | 77 |
| Physics / Dual Nature of Radiation and Matter | 77 |

**Important caveat:** Vedantu's own topic tags are demonstrably wrong on some
questions — three of six audited questions were mis-tagged (`06_BUGS.md` #4), and the
AI assistant then repeated the error to the student. Treat the tags as a starting
point, not as truth.

## 6. Difficulty

Each question carries a `difficulty` field from the source. It is close to useless as
a discriminator: **90.4% of the whole bank is the single value `MODERATE`**. The full
distribution across all 23,447 rows is MODERATE 21,200 / EASY 1,646 / TOUGH 308 /
BEGINNER 151 / MEDIUM 78 / HARD 64.

Anything that needs a real difficulty split has to derive one. Our own rule-based
estimate is documented in `master_bank/difficulty_rules.md` and summarised in
`04_DATA_DICTIONARY.md`. **It has never been validated against real student
performance** and should be labelled as an estimate wherever it is shown.

## 7. The complete test list

All 105 papers are in **`test_list.csv`** beside this file, with these columns:

`testId, name, type, pattern, scheduled_date_utc, subjects, questions, sections,
total_marks, duration_min, status_when_captured, distinct_topics, topics_sample`

A sample of rows, to show the shape:

| name | type | date | Q | marks | min |
|---|---|---|---:|---:|---:|
| EklavyATS-2026-Part-Test-1-Paper 1(JEE MAIN) | full-syllabus (3 subjects) | 2025-10-05 | 75 | 300 | 180 |
| Chem Highweightage Test-1 | topic test (1 subject) | 2025-09-30 | 25 | 100 | 60 |
| Physics Highweightage Test-20 | topic test (1 subject) | 2025-11-18 | 25 | 100 | 60 |

The `sections` column spells out the section names and counts for each paper, e.g.
`PHY SEC 1=20; PHY SEC 2=5`. The `topics_sample` column holds up to six of the topic
tags found on that paper's questions — useful for seeing what "syllabus covered" means
in practice, since the platform publishes no formal per-paper syllabus.

**NOT CAPTURED:** there is no published syllabus document for any paper. What a paper
covers can only be inferred from the topic tags on its questions. See
`07_GAPS_AND_UNKNOWNS.md`.
