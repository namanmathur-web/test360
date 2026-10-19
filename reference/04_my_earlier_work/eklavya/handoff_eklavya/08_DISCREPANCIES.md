# 08_DISCREPANCIES.md — where old notes disagree with the files

**INTERNAL: contains Vedantu content. Not for public use.**

Every entry was checked against the files on 19 October 2026. **The file count wins.**
Where an old note is simply out of date rather than wrong, that is said.

---

## 1. "107 tests" vs **105** — the old note is wrong

**Old note:** `PROJECT_BRIEF.md` line 15 — *"107 captured Eklavya tests"*.

**The files:** `all_tests/` contains **107 entries**, but two of them are files, not
test folders: `index.csv` and `tests.json`. There are **105 test folders**, each with
a `questions.json`.

**Correct number: 105.** This also matches `data_report.md`, `index.csv` (105 rows)
and `tests.json` (105 records). The same brief says "105/105 tests captured" eleven
lines later, so it contradicts itself.

---

## 2. "15 bugs" vs **10 in that file** — both are right, about different things

**Old note:** the task brief and `PROJECT_BRIEF.md` refer to 15 bugs in
`bugs_found.md`.

**The files:** `bugs_found.md` contains exactly **10** numbered bugs. The other five
come from `test-qa/test_log.md`: the anti-cheat counter reset, the lost visited-state,
the instructions-page marking table, the mandatory abandonment survey, and the Exam
Summary that does not reconcile. `PROJECT_BRIEF.md` §4 says so explicitly — *"From
`bugs_found.md` and `test-qa/test_log.md`"*.

**Correct: 10 in `bugs_found.md`, 5 more in `test_log.md`, 15 combined.**
`06_BUGS.md` in this pack documents all 15 and labels the source of each.

---

## 3. "Cohort and percentile not available" — the old note is **wrong**

**Old note:** `test-qa/comparison.md` rows 10, 11, 15 and 16 mark predicted
percentile, rank projection, topper/class-average comparison and leaderboard as
**"Cannot reproduce — Missing"**, needing *"cohort aggregates"* we did not have.
`PROJECT_BRIEF.md` repeats this as an open problem.

**The files:** cohort and percentile data **is present** in `insights.json`:

| Field | Papers | Range |
|---|---:|---|
| `eaqInsight.averageEAQCohortAccuracy` | 103 / 105 | 73–86 |
| `eaqInsight.attemptPercentile` | 98 | 50–100 |
| `eaqInsight.accuracyPercentile` | 98 | 0–100 |
| `testAttemptInsightsSummary.attemptPercentile` | 105 | 79–80 |
| `testAttemptInsightsSummary.totalImprovePercentile` | 105 | populated |

**Why both statements are defensible.** `comparison.md` was judging whether an
*independent rules engine* could reproduce the insight **from the answer sheet alone**
— it cannot, and that remains true. But the claim that the data was never captured is
wrong: it was, at **topic level**, inside the insight payloads.

**What is genuinely missing:** overall test percentile (see #4), per-question cohort
accuracy, and the leaderboard.

---

## 4. `testPercentile` exists but is **0 on all 105 papers**

Not a contradiction between notes, but a trap for anyone reading the schema.
`review.json` carries both `testPercentile` and `aitsTestPercentile`. Both are **0**
on every single paper. The fields exist; they were never populated — consistent with
every attempt having been made a year after the test window closed, so none was
eligible for ranking.

**Do not read these two fields as data.**

---

## 5. "pyq_year is blank on every row, no source states an exam year" — **incomplete**

**Old note:** `master_bank/coverage_report.md` — *"`pyq_year` is empty on every row.
No source field states an exam year"*. `comparison.md` row 8 marks PYQ analysis as
*"Cannot reproduce"*.

**The files:** `pyq_year` is indeed blank on all **23,447** bank rows. But
`insights.json` carries **`pyqInsight.examYears`**, populated on **58 of 105** papers,
with years 2015–2025 (most frequent: 2021 ×35, 2019 ×31, 2020 ×21, 2018 ×19).

**Correct:** exam years were captured at **paper/topic** level, never at
**per-question** level. Both notes are true at their own granularity; neither says so.

---

## 6. "499 image questions" vs **721** — the old note is out of date

**Old note:** `data_report.md` — *"Questions whose body is image-only / contains an
image: 499"*, written 11 October.

**The files:** **721** test-sourced rows now carry an `image_paths` value, and 5,064
across the whole bank.

**Why:** the image download finished on 14 October, after `data_report.md` was
written. 7,621 URLs were fetched with zero failures and linked to rows, so the count
rose. `data_report.md` is a point-in-time snapshot, not wrong at the time.

---

## 7. `library_report.md` is a stale snapshot — says **237**, the real figure is **1,688**

The file's own header admits it: *"Snapshot taken 2026-10-11 20:31:32. The background
run is STILL IN PROGRESS … Every number below is a point-in-time count and will grow."*

It reports 237 assignments captured and 2,882 questions. `checkpoint_library.json` now
records **1,688 assignments done, 0 failed**, and the bank holds **20,062**
assignment-sourced rows.

**Do not quote `library_report.md`.** Regenerate it or use the checkpoint.

---

## 8. Quality-flag counts differ between two reports — both were right in turn

An earlier version of `coverage_report.md` reported **3,484** flagged rows with
`figure_without_image` at **2,042**. The current file and `quality_flags.csv` report
**1,858** flagged rows with `figure_without_image` at **198**.

**Why:** the image download resolved 1,844 of those figures. The current numbers are
correct. Similarly, an older note described 1,092 rows as `no_solution`; re-checking
split that into 848 `solution_is_image` + 210 `no_solution_field_in_source` + 34
genuinely empty.

---

## 9. "Images: 8,910" vs "7,621" vs "16,531" — three right answers to three questions

All three appear in project notes and all three are correct:

| Number | What it counts |
|---:|---|
| **7,621** | distinct image **URLs** downloaded (zero failures) |
| **8,910** | image **files linked to question rows** — one URL can serve several rows, and one question can have several figures |
| **16,531** | **total files** in `master_bank/images/`, i.e. 8,910 linked + 7,621 in the `_by_url/` cache |

The linked files are hard links to the cache, so the real disk footprint is about
110 MB, not the 211 MB that a naive directory size reports.

---

## 10. Marks totals: "100 and 300" vs the five papers that do not add up

Not a note-vs-file conflict, but worth stating in one place. Expected totals are 100
(topic) and 300 (full). Counted: **90 papers at 100, 10 at 300**, plus **3 at 96, 1 at
98, 1 at 297**. Five papers are internally inconsistent. See bug #2.

---

## 11. `imageDetails` — present in the schema, empty in every file

`questions.json` has an `imageDetails` array, and `api_notes.md` describes it as
carrying *"image URLs where a question has one"*. It is `[]` on **all 105 papers**.
Test-question figures were recovered from URLs embedded in the page HTML instead.

The note is a correct description of the field's purpose and a misleading description
of our data.

---

## 12. Topic tags: "764 distinct" is right, but they are not chapters

`data_report.md` reports *"Distinct topics seen: 764"*, which the files confirm. What
it does not say is that **293 of those 764 appear exactly once**, and that the tags
are a free-text topic label, not a chapter. Mapped onto our 77-chapter taxonomy the
same 3,175 questions resolve to just **74 subject/chapter pairs**. Anyone reading
"764 topics" as "764 syllabus units" will plan the wrong product.
