# master_bank_schema.md

**INTERNAL: contains Vedantu content. Not for public use.**

Table `questions` in `master_bank/master_bank.sqlite`. 23,447 rows, 24 columns.
Full meanings and allowed values are in `04_DATA_DICTIONARY.md` §4.

| # | Column | Type | Non-empty rows | Distinct values |
|---:|---|---|---:|---:|
| 1 | `id` | TEXT | 23,447 | 23,447 |
| 2 | `source` | TEXT | 23,447 | 3 |
| 3 | `source_id` | TEXT | 23,447 | 1,797 |
| 4 | `subject` | TEXT | 23,429 | 5 |
| 5 | `chapter` | TEXT | 23,447 | 75 |
| 6 | `sub_topic` | TEXT | 23,447 | 1,504 |
| 7 | `concept` | TEXT | 12,583 | 710 |
| 8 | `question_text` | TEXT | 23,424 | 18,389 |
| 9 | `option_a` | TEXT | 21,754 | 12,981 |
| 10 | `option_b` | TEXT | 21,750 | 13,454 |
| 11 | `option_c` | TEXT | 21,407 | 13,370 |
| 12 | `option_d` | TEXT | 21,512 | 11,926 |
| 13 | `question_type` | TEXT | 23,447 | 3 |
| 14 | `correct_answer` | TEXT | 23,422 | 249 |
| 15 | `solution_text` | TEXT | 22,355 | 18,517 |
| 16 | `marks` | TEXT | 23,139 | 6 |
| 17 | `source_difficulty` | TEXT | 23,447 | 6 |
| 18 | `estimated_difficulty` | TEXT | 23,447 | 3 |
| 19 | `has_figure` | TEXT | 23,447 | 2 |
| 20 | `image_paths` | TEXT | 5,064 | 5,061 |
| 21 | `source_time_seconds` | TEXT | 2,750 | 26 |
| 22 | `pyq_year` | TEXT | 0 | 1 |
| 23 | `exam_tag` | TEXT | 23,328 | 35 |
| 24 | `duplicate_of` | TEXT | 6,667 | 4,784 |

## Value sets for the small-cardinality columns

**`source`** — `assignment` 20,062 · `test` 3,175 · `bank` 210

**`subject`** — `Chemistry` 8,550 · `Physics` 7,761 · `Maths` 5,424 · `Biology` 1,694 · `(blank)` 18

**`question_type`** — `SCQ` 22,441 · `numeric` 980 · `MCQ` 26

**`source_difficulty`** — `MODERATE` 21,200 · `EASY` 1,646 · `TOUGH` 308 · `BEGINNER` 151 · `MEDIUM` 78 · `HARD` 64

**`estimated_difficulty`** — `Medium` 14,962 · `Easy` 7,033 · `Hard` 1,452

**`has_figure`** — `false` 18,185 · `true` 5,262

## DDL

```sql
CREATE TABLE questions (
  id TEXT,
  source TEXT,
  source_id TEXT,
  subject TEXT,
  chapter TEXT,
  sub_topic TEXT,
  concept TEXT,
  question_text TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  question_type TEXT,
  correct_answer TEXT,
  solution_text TEXT,
  marks TEXT,
  source_difficulty TEXT,
  estimated_difficulty TEXT,
  has_figure TEXT,
  image_paths TEXT,
  source_time_seconds TEXT,
  pyq_year TEXT,
  exam_tag TEXT,
  duplicate_of TEXT
);
```
