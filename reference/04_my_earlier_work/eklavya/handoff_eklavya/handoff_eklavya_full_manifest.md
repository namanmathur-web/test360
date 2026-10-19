# handoff_eklavya_full_manifest.md

**INTERNAL: contains Vedantu content. Not for public use.**

The large data stays on disk; it is far too big to attach to a chat. This is what
exists and where, counted on 19 October 2026. Paths are relative to
`~/vedantu-recording-extractor/` unless they begin with `../`.

| Path | What it holds | Files | Size |
|---|---|---:|---:|
| `all_tests/` | The 105 captured test papers: questions, marked attempt, insights, summary | 432 | 23.2 MB |
| `master_bank/` | The merged 23,447-row question bank (sqlite + csv) and its reports | 16,552 | 268.2 MB |
| `master_bank/images/` | Downloaded question figures (8,910 linked + 7,621 cache) | 16,531 | 211.7 MB |
| `library/` | Course-library scrape: 1,688 assignment JSONs, indexes, catalogues | 1,701 | 60.6 MB |
| `question_bank/` | Our 77-chapter taxonomy and 210 own-written questions | 45 | 1.1 MB |
| `../test-qa/` | Manual QA session: play-through log, engine comparison, design guide | 34 | 5.9 MB |
| `ad_pack/` | 97 result-page screenshots, desktop and mobile | 98 | 46.4 MB |
| `test_screens/` | 15 in-test screenshots: instructions, palette, submit flow | 15 | 4.4 MB |
| `atlas/` | Browsable HTML atlas generated over the bank | 6,180 | 122.8 MB |
| | **Total (double-counts images)** | **41,588** | **744.2 MB** |

*`master_bank/images` is counted inside `master_bank`, so the total double-counts it.
The image files are hard links to the download cache, so the true footprint of the
images is about 110 MB, not the 212 MB a naive directory size reports.*

## The files that matter most

| File | Rows / size | Why you would open it |
|---|---|---|
| `master_bank/master_bank.sqlite` | 23,447 rows, 20.3 MB | the whole question bank, one table `questions` |
| `master_bank/master_bank.csv` | same data, 16.0 MB | if you cannot use sqlite |
| `all_tests/<testId>/questions.json` | 105 files | a paper's sections, questions and options |
| `all_tests/<testId>/review.json` | 105 files | the marked attempt — **the only place the answer key lives** |
| `all_tests/<testId>/insights.json` | 105 files | the ScoreBooster analytics payload |
| `all_tests/index.csv` | 105 rows | our summary index of the papers |
| `all_tests/tests.json` | 105 records | the platform's listing, incl. `pattern` and `minStart` |
| `master_bank/quality_flags.csv` | 1,858 rows | which questions are damaged, and how |
| `master_bank/coverage_report.md` | — | chapter coverage, gaps, duplicate rate |
| `master_bank/difficulty_rules.md` | — | how `estimated_difficulty` is derived |
| `question_bank/jee_main_taxonomy.csv` | 1,288 rows | 77 chapters, 1,288 concepts |
| `../test-qa/test_log.md` | — | the hand-played 75-question QA session |
| `../test-qa/comparison.md` | — | our rules engine vs Ved AI, insight by insight |
| `../test-qa/design_guide/design_notes.md` | — | colours, type, spacing from computed styles |

## What is in the light zip instead

`handoff_eklavya_light.zip` carries all the documentation, the two index CSVs, the
taxonomy, the master-bank schema, the 14 design-guide screenshots and **three complete
sample test folders**, so the shape of the data is visible without the bulk.

## What is not on disk at all

See `07_GAPS_AND_UNKNOWNS.md`. In short: no paper PDFs (5 attempted, 5 failed); no
LearnList playlist content (501 topic ids known, 0 playlists captured); no per-class
notes; no course-test content (76 indexed, 0 captured); no video (1,420 indexed); no
leaderboard; no payment, pricing or sign-up flow; nothing from the admin side.
