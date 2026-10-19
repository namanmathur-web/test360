# 00_START_HERE.md

**INTERNAL: contains Vedantu content. Not for public use.**

## What the product is

**Eklavya JEE Main Test Series 2025-26** is Vedantu's online mock-test series for
students preparing for JEE Main, India's engineering entrance exam. A student logs in,
sees a list of test papers, sits a paper against a countdown clock in a locked-down
exam window, submits it, and is then shown a marked result with a worked solution for
every question plus a panel of automated "insights" — weak topics, marks they could
have gained, a chat assistant called **Ved AI**. The series is made of two paper types:
**94 single-subject topic tests** (25 questions, 60 minutes) and **11 full-syllabus
papers** in the real JEE Main shape (75 questions across Physics, Chemistry and Maths,
180 minutes). Everything is marked +4 for a right answer and −1 for a wrong one.

## What this pack is

A complete written record of what we captured from that product between 8 and 14
October 2026, so that someone who has never seen this project can understand the
product well enough to build a copy. It contains specifications, screen descriptions,
data dictionaries, the platform's API shapes, and an honest list of what we did *not*
capture. It is documentation only — no product is built here.

Every number in this pack was produced by counting files on disk on **19 October
2026**. Where an earlier note in the project disagrees with the files, the disagreement
is recorded in `08_DISCREPANCIES.md` and the file count wins.

## File map

| File | One line |
|---|---|
| `00_START_HERE.md` | This file: what the product is, what the pack is, where to start |
| `01_PRODUCT_SPEC.md` | Every test type, the exact paper pattern, and all 105 papers as a table |
| `02_SCREEN_BY_SCREEN.md` | Every screen a student sees, its labels, controls and screenshots |
| `03_INSIGHTS_CATALOG.md` | Every post-test insight, what it needs, and how hard it is to reproduce |
| `04_DATA_DICTIONARY.md` | Folder layout, every field with an example, the bank schema and taxonomy |
| `05_API_AND_FLOW_NOTES.md` | The platform's call chain and its quirks. No credentials of any kind |
| `06_BUGS.md` | All 15 defects found, with repro steps, correct behaviour and severity |
| `07_GAPS_AND_UNKNOWNS.md` | Everything NOT captured. Read before promising anything |
| `08_DISCREPANCIES.md` | Where old project notes disagree with the files, and the right number |
| `09_RIGHTS_AND_USE.md` | Five lines on ownership and permitted use. Read it |
| `NEXT_CHAT_PROMPT.txt` | Paste this into a new chat to hand the project over |
| `test_list.csv` | All 105 papers: id, name, type, date, sections, marks, topics |
| `handoff_eklavya_full_manifest.md` | The large data that stays on disk, with paths and sizes |

Also shipped alongside, where the zip includes them: `index.csv` (the capture's own
test index), `jee_main_taxonomy.csv` (our 77-chapter map), `master_bank_schema.md`,
the 14 design-guide screenshots, and three complete sample test folders.

## Reading order

1. **`09_RIGHTS_AND_USE.md`** — five lines, and it governs everything else.
2. **`00_START_HERE.md`** — this file.
3. **`01_PRODUCT_SPEC.md`** — what the thing actually is.
4. **`02_SCREEN_BY_SCREEN.md`** — what it looks like to a student.
5. **`03_INSIGHTS_CATALOG.md`** — the part that looks clever, and what it really needs.
6. **`07_GAPS_AND_UNKNOWNS.md`** — read this *before* planning, not after.
7. **`04_DATA_DICTIONARY.md`** and **`05_API_AND_FLOW_NOTES.md`** — when you start building.
8. **`06_BUGS.md`** — the list of things not to copy.
9. **`08_DISCREPANCIES.md`** — if a number anywhere looks wrong.

## Verified headline numbers

Counted from disk on 19 October 2026.

| | Count | Where it came from |
|---|---:|---|
| Test papers captured | **105** | folders under `all_tests/` holding a `questions.json` |
| &nbsp;&nbsp;single-subject topic tests | 94 | 25 questions each |
| &nbsp;&nbsp;full-syllabus papers | 11 | 75 questions each |
| Questions in those papers | **3,175** | `resultEntries` across all 105 papers |
| &nbsp;&nbsp;with a correct answer recorded | 3,174 | one question has none |
| &nbsp;&nbsp;with worked solution text | 2,901 | the rest are image-only or absent |
| Distinct topic tags on those questions | **764** | 293 of them appear exactly once |
| Scheduled dates covered | 2025-09-30 → 2025-12-30 | `minStart` in `tests.json`, all 105 present |
| | | |
| Master question bank, rows ingested | **23,447** | `master_bank/master_bank.sqlite` |
| &nbsp;&nbsp;unique after de-duplication | **16,780** | 6,667 duplicates, 28.4% |
| &nbsp;&nbsp;from practice assignments | 20,062 | a separate scrape, not the test series |
| &nbsp;&nbsp;from the 105 test papers | 3,175 | |
| &nbsp;&nbsp;written by us, not Vedantu | 210 | |
| Rows with a correct answer | 23,422 | |
| Rows with solution text | 22,355 | |
| Rows carrying at least one image | 5,064 | |
| Image files downloaded | **7,621** | zero failures; cached under `images/_by_url/` |
| Image files linked to question rows | 8,910 | one question can have several |
| Chapters in our taxonomy | **77** | `question_bank/jee_main_taxonomy.csv` |
| Concepts in that taxonomy | **1,288** | |
| Rows carrying a quality flag | 1,858 | see `04_DATA_DICTIONARY.md` |

**One thing to understand immediately:** the master bank is *not* the test series. Only
3,175 of its 23,447 rows came from the 105 papers. The other 20,062 came from a
separate scrape of practice assignments in Vedantu's course library. If you are
rebuilding the test series, the 3,175 are what you are modelling.
