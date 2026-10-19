# Design guide — notes from Vedantu's post-test result & Ved AI screens

All values below were read from the live page's **computed styles**, not eyeballed from
screenshots. Screens referenced as `01_…png` … `13_…png` in this folder.
Findings marked ⚠ come from `../test_log.md` and `../comparison.md`.

---

## 1. Colour

### Brand / primary
| Hex | Use |
|---|---|
| `#FF693D` | **Primary action.** Solid fill on "Start"; 1px border on secondary buttons ("View Topics"); 0.5px border + `rgba(255,105,61,.2) 0 0 14px` glow on the ScoreBooster topic card |
| `#FF6200` | Secondary orange seen in header/nav accents |
| `#6825E5` | **Accent purple** — tertiary/link buttons ("View Chapter Level Analysis") |
| `#512C96` | Deep purple — subject headings, difficulty label, "Class AVG" chart bar |
| `#01202B` | Near-black navy — body text on light buttons, "New Chat" button fill, chat bubble text |

### Gradients
| Where | Value |
|---|---|
| Score card | `linear-gradient(339deg, #110A6A 8.97%, #7A42B0 91.02%)` |
| Chat send button | `linear-gradient(130deg, #FF501D 19.07%, #6D1FFF 81.91%)` |

### Status — ⚠ **inconsistent across screens, do not copy this**
| Meaning | Dashboard | Answers tab | Soft background |
|---|---|---|---|
| Correct / success | `#22C55E` dot | `#59AA00` text | `#EBF8DD` option row |
| Wrong / error | `#EF4444` dot | `#F94646` text, `#FF0000` "INCORRECT" label | `#FFE5E5` option row |
| Unattempted / neutral | `#9CA3AF` dot | — | — |
| Warning | `#D97706` text | — | `#FFF7E6` badge, `#FFF0CB` |

> **Three different greens and three different reds** for the same two meanings.
> Pick exactly one success and one error colour (plus one soft tint each) and use them everywhere.

### Surfaces
| Hex | Use |
|---|---|
| `#FFFFFF` | Card background (all cards) |
| `#F5F5F5` / `#F7F7F7` | Page background, filter-chip background |
| `#F0F0F0` | Dividers / inactive track |
| `#EAEAEA` | Chat user bubble |
| `#E5E7EB` | Avatar placeholder |
| `#FFD7CB` | Chat composer border (1px) |

### Chart series
`#3C6F9C` Topper · `#512C96` Class AVG · `#F8C7B9` You

---

## 2. Type

⚠ **Three font families are in use** — `Poppins`, `Open Sans`, `Raleway` — sometimes for the
same role. Standardise on one (Poppins is dominant) plus at most one companion.

| Role | Font | Size | Weight | Colour |
|---|---|---|---|---|
| Page title | Poppins | 24px | 700 | `#333333` |
| Card heading ("Hello Nn,") | Open Sans | 24px | 700 | `#FFFFFF` |
| **Hero number ("90")** | Poppins | **60px** | 700 | `#FFFFFF` |
| Hero label ("MARKS") | Poppins | 14px | 600 | `#FFFFFF` |
| Hero sublabel ("out of 300") | Poppins | 14px | 400 | `#FFFFFF` |
| Section heading in card | Poppins | 18px | 500 | `#FFFFFF` |
| Section caps ("LEADER BOARD") | Poppins | 16px | 600 | `#111827` |
| Stat value (75, 60, 30) | Poppins | 24px | 600 | `#FFFFFF` |
| Stat label | Poppins | 14px | 400 | `#FFFFFF` |
| Status CORRECT / INCORRECT | Raleway | 14px | 700 | `#59AA00` / `#FF0000` |
| Difficulty ("MODERATE") | Raleway | 16px | 600 | `#512C96` |
| Solution header | Open Sans | 16px | 400 | `#000000` |
| Answer key ("Correct: (b)") | Open Sans | 14px | 700 | `#59AA00` |
| Chat — AI message | Poppins | 13px | 400 / lh 20.8px | `#344E5A` |
| Chat — user bubble | Poppins | 14px | — | `#01202B` |
| Badge ("In-progress") | Poppins | **8px** | 500 | `#D97706` |

> ⚠ The 8px badge and the 13px chat body are below comfortable reading size.
> Our floor should be **12px** for metadata and **14px** for body.

**Scale to adopt:** 60 / 24 / 18 / 16 / 14 / 12 — weights 400, 500, 600, 700.

---

## 3. Cards, spacing, elevation

| Component | Radius | Padding | Shadow / border |
|---|---|---|---|
| Score card (hero) | **28px** | 24px | soft drop shadow, gradient fill |
| Subject card | 28px (bottom corners carry the expander) | 24px | light shadow on white |
| ScoreBooster topic card | **16px** | 12px | `0 0 14px rgba(255,105,61,.2)` + `0.5px #FF693D` |
| Leaderboard row | 0 | 12px 20px | 1px bottom divider |
| Badge | 3px | 2px 4px | none |
| Filter chip | 2px | — | none on `#F7F7F7` |
| Chat user bubble | **16px 16px 3px** (tail bottom-right) | 8px 12px | none |
| Chat composer | 20px | — | 1px `#FFD7CB` |

**Radius system in use:** 2 / 3 / 10 / 16 / 20 / 24 (pill) / 28.
⚠ Too many steps. Recommend **4 / 8 / 16 / 28 / pill**.

**Buttons**
| Variant | Spec |
|---|---|
| Primary | bg `#FF693D`, text `#FFFFFF`, radius 24px (pill), padding 4px 28px 5px, 13.3px/600 |
| Secondary | transparent, text `#01202B`, 1px `#FF693D`, radius 24px, 13px/500 |
| Tertiary / link | transparent, text `#6825E5`, 14px/600, full-width card footer, radius `0 0 28px 28px` |
| Dark (chat) | bg `#01202B`, text `#FCFCFD`, radius 10px, padding 9px 12px, 500 |
| Icon-send | gradient, fully round |

⚠ Primary button padding is **asymmetric** (`4px 28px 5px`) — top/bottom differ by 1px. Use even padding.

---

## 4. Reusable parts to build

1. **ScoreCard** — gradient panel: greeting, hero number + "/total", status pill ("Ranks not available"), stacked segment bar, 4 stat cells, footer meta (time taken).
2. **StatCell** — label (14/400) over value (24/600); optional coloured dot.
3. **SegmentBar** — single horizontal bar, 12px tall, radius 10px, three segments (correct/wrong/unattempted) in the status palette.
4. **SubjectCard** — title + score, stats row, segment bar, two "Average vs Topper" comparison pairs, expandable footer button.
5. **ComparisonPair** — two big percentages side by side with small captions. ⚠ **must also show "You"** — today it shows only Average and Topper.
6. **ChapterRow** — chapter name, score `x/y`, attempted `x/y`, mini segment bar + green/red/grey counts.
7. **TopicCard** — title, subject chip (PHY/CHE/MAT), chapter name, "Questions ›" link, state-aware CTA (`Start` → `Continue` → `Done`). The state-aware CTA is genuinely good; keep it.
8. **InsightCard** — bordered card with heading, badge, sentence with bolded numbers, footer action. (Easy Kill / PYQ cards.)
9. **ProgressModal** — title, determinate bar, percent. ⚠ see screen 07.
10. **QuestionReviewCard** — number, type, kebab menu, stem, option list with state colours, status strip (YOUR ANSWER + difficulty + time + topic), collapsible solution.
11. **OptionRow** — four visual states needed: *neutral*, *your answer correct* (`#EBF8DD`/`#59AA00`), *your answer wrong* (`#FFE5E5`/`#F94646`), and ⚠ **the missing one: correct answer you did not pick**.
12. **FilterChip** — small rounded select on `#F7F7F7`.
13. **ChatBubble** — user (grey, tailed) and assistant (no bubble, plain text) + thumbs up/down row.
14. **LeaderboardRow** — avatar, name, score `x/300`, rank or medal.
15. **Badge** — tiny status pill (In-progress / Important / Notes).

---

## 5. Screen-by-screen

### 01 — Result page, top (`01_result_top.png`)
- **What it shows:** test title, marks/time meta, Download PDF + Reattempt, Performance/Answers tabs, attempt picker, gradient score card (90/300, 75 total, 60 attempted, 30/30/15, 50% accuracy, time taken) and the ScoreBooster panel.
- **What works:** the hero number at 60px is instantly readable; the stacked segment bar communicates correct/wrong/unattempted at a glance; every number here was **verified exactly correct** against our ground truth.
- **Do better:** "Time Taken: 45.48 /180mins" is ambiguous (decimal minutes or mm:ss?) — print `45m 29s`. ⚠ "Ranks not available" sits inches from ScoreBooster's "improve your Rank from 1.1L to 6.2K" — never show a projection for a metric you've just disabled.

### 02 — ScoreBooster cards (`02_scorebooster_cards.png`)
- **What it shows:** percentile + learner label, "2 quick actions to gain 104 marks", Easy Kill Topics card (37 high-weight Qs, 54% accuracy, ~80 marks missed) and Previous Year Questions card (19 PYQs, 16 attempted, 6 right).
- **What works:** quantified, motivating framing — "~80 potential marks" is far more actionable than a score alone. The bordered glow card makes the two actions feel like the primary path.
- **Do better:** the "104 marks" figure is unexplained; show the arithmetic. ⚠ Our rules engine reproduced the *skipped* insight exactly but could not reproduce "37 high-weight questions" at all — that needs a per-question weight field, so **design the data model to carry it from day one**.

### 03 — Leaderboard + Subject analysis (`03_leaderboard_and_subject_analysis.png`)
- **What it shows:** top-10 by name/score/rank with an Overall/Physics/Maths/Chemistry filter; per-subject card with score, counts, accuracy, and Average vs Topper pairs.
- **What works:** the subject card is the best-composed unit on the page — one number, one bar, four stats, two comparisons, one action.
- **Do better:** ⚠ the Accuracy/Attempt pairs show **Average and Topper but not You** — the student can't place themselves. Add a third value or a marker. Also decide the privacy stance on showing real full names.

### 04 — Comparative chart (`04_comparative_chart.png`)
- **What it shows:** grouped bars, Topper / Class AVG / You, per subject.
- **What works:** correct and honest — we verified all three "You" bars sit at exactly 30.
- **Do better:** x-axis labels truncate to "Physic…" / "Chemis…"; y-axis ticks are odd (0, 14, 29, 43, 57, 71, 86, 100). Use 0/25/50/75/100 and don't clip labels. Large dead whitespace to the left on wide screens.

### 05 — Chapter Level Analysis (`05_chapter_level_analysis_expanded.png`)
- **What it shows:** Chapter / Total Score / Attempted Questions / Question Analysis with green-red-grey counts.
- **What works:** the row design is right — the mini bar plus three counts reads quickly, and `-1/4` honestly shows negative marking.
- **Do better:** ⚠ **this is the most broken screen.** Physics rendered **zero rows**; Maths showed one chapter; Chemistry four — roughly **16% of the paper mapped**. Caused by wrong/missing question→chapter tags (Q3 and Q13 both tagged `"energy and power , Work"`). Never render a bare header: show real rows, or an explicit "chapter data unavailable" state. Validate tag coverage at publish time.

### 06 — Easy Kill Topics expanded (`06_easy_kill_topics_expanded.png`)
- **What it shows:** 9 topics (3 per subject), each with subject chip, chapter, "Questions ›" and a Start/Continue button.
- **What works:** best feature in the product — concrete sub-topics, not vague advice, and the CTA correctly changed to **Continue** for the topic already begun.
- **Do better:** ⚠ our engine reproduced only **5 of 8** of these chapters from marks-forgone alone and **Physics only 1 of 3**, because Ved works at sub-topic granularity. Store a `subtopic` field, not just chapter. Links are JS-only with no `href`, so they can't be opened in a new tab or reached by keyboard.

### 07 — "Questions" popup (`07_questions_popup_loading.png`)
- **What it shows:** modal with topic title and a determinate progress bar.
- **What works:** nothing to keep — the pattern itself is the bug.
- **Do better:** ⚠ **permanently stuck at 90%** (reproduced 3×, >70 s) on both ScoreBooster cards, even though the API returns **200** and the question images are already in the DOM. The bar is driven by a timer rather than the response. Render on data arrival, cap any spinner at ~5 s, and always offer Retry.

### 08 — Topic Start / LearnList (`08_topic_start_playlist.png`)
- **What it shows:** branded LearnList page with "Learn Now" video, a notes PDF card with summary, and a 15-question Practice Test.
- **What works:** the strongest loop in the product — weak topic → video + notes + practice in two clicks, with a "Was this helpful?" signal at the end.
- **Do better:** the loop never reports back. After the practice set, return the student to the result and show the delta ("you converted 3 of 5 — worth +12 marks"). Also give the video a duration and a progress marker.

### 09 — Ved chat (`09_ved_chat_conversation.png`)
- **What it shows:** sidebar (New Chat, Library, Recent Chats, profile) and the conversation with thumbs up/down per answer.
- **What works:** answers are conversational and, on the headline numbers, **exactly right** (90/300, 30/100 Chemistry, 15 skipped → 60 marks).
- **Do better:** ⚠ it recommended **"Work, energy and power" — a topic not in this paper** — because it faithfully repeated a bad tag. It also advised "attempt all questions… partial knowledge can lead to marks", which is wrong under +4/−1. Ground the assistant in validated tags, teach it to say "I don't have topic data", and never let it contradict the marking scheme. The view does not auto-scroll to the newest reply, and the composer overlaps it.

### 10 — Answers tab, correct question (`10_answers_correct_question.png`)
- **What it shows:** stem, options with the chosen answer filled green, YOUR ANSWER **CORRECT**, difficulty, time spent, topic.
- **What works:** showing **per-question time** is a genuine differentiator — we found 4 wrong answers decided in 10–13 s that are worth ~20 marks.
- **Do better:** per-question time is displayed but **no insight is drawn from it anywhere**. Surface "rushed" and "over-invested" automatically.

### 11 — Answers tab, wrong question + solution (`11_answers_wrong_question_solution_open.png`)
- **What it shows:** chosen option in red, YOUR ANSWER **INCORRECT**, topic tag, expanded solution with "Correct: (b)" and a worked image.
- **What works:** worked solutions exist for **73 of 75** questions, with difficulty and a "Report Question" escape hatch.
- **Do better:** ⚠ **the correct option is never highlighted.** Only the red wrong answer is marked; the right answer appears solely as "Correct: **(b)**" inside a collapsed panel — and the options are **not lettered a/b/c/d**, so the student counts rows to decode it. Fix: letter the options and tint the correct row green always. ⚠ Numbering **restarts per section** (Q1–20, Q1–5, ×3, no section headers) so "Q43" from the test is untraceable — keep 1–75. Solutions are **images**: not selectable, searchable or screen-reader accessible. No "wrong only / skipped only" filter. The Answers tab also needs **two clicks** to open after a fresh page load.

### 12 — Mobile result page (`12_mobile_result_page.png`, ~500px)
- **What it shows:** single-column stack; score card, hero number and segment bar all survive well.
- **What works:** the score card is genuinely responsive — the 60px number and the stats grid reflow cleanly.
- **Do better:** the **"Download Pdf" button overlaps the test title**, and "Reattempt" floats awkwardly. Give the header a proper stacked mobile layout. (Chrome's minimum window width floored the viewport at 500px, so true 390px was not reachable — re-test at 390px in device emulation.)

### 13 — Mobile Ved chat (`13_mobile_ved_chat.png`, ~500px)
- **What it shows:** the sidebar at near-full width with the conversation pushed off-screen.
- **What works:** nothing at this width.
- **Do better:** ⚠ **the sidebar never collapses** — it eats ~480px of a 500px viewport and every message is cut off mid-sentence. The chat is unusable on a phone. Collapse the sidebar behind the existing hamburger below ~768px and give the thread the full width.

---

## 6. Five rules for our build

1. **One success colour, one error colour.** Not three of each.
2. **One font family.** Poppins, 12px floor for metadata, 14px for body.
3. **Never render an empty data component.** Header-only tables and 90% progress bars are worse than an honest empty state.
4. **Always show the correct answer, always letter the options, always keep test numbering.** Review exists to answer "what was right?".
5. **Carry the metadata from day one** — sub-topic, difficulty/weight, PYQ year, per-question time. Those four fields are what separates our analysis from a score, and none of them need AI.
