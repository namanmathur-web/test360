# Task: turn the Limits test product into a multi-chapter build

## What is in this folder
- platform/Vedantu_Self_Study_Platform_ORIGINAL.html : the user's own approved product (17 pages, exam-style test screen, Ved AI purple-orange result card, ScoreBooster). DO NOT redesign it.
- platform/Vedantu_Self_Study_Platform_Limits_BUILT.html : the same file with real Limits content swapped in. This is the reference for how the final result must look and behave.
- limits/input/ : limits_bank.csv (66 MCQ-ready questions), limits_sections.json (114 book sections), revise_kit.json (mind map, one-pager, 252 flash cards from the book), coverage.md, exam_tag_labels.csv.
- tools/ : the scripts that produced the BUILT file. prep.py + rv.py make the data, gen.py makes the JS data blocks, build_ss.py injects them into the original HTML (KaTeX is inlined; images are kept as blobs.json placeholders). Paths inside are hard-coded to an old machine and must be fixed.

## What to do
1. Refactor into one folder per chapter: chapters/<chapter-id>/input/ (bank csv, book html or its extracted json, topic map) and a single command `python build.py <chapter-id>` that writes dist/<chapter-id>.html. No hand-editing of the HTML per chapter.
2. Move everything chapter-specific into a chapter.json: chapter name, topic names (4 to 6), topic key ideas, section-number range per topic, concept-to-section map, test size, minutes, prices. Today these are hard-coded in gen.py and build_ss.py (topic names, notes, the section ranges 1-18/19-39/40-52/53-62, CMAP in prep.py, "12 questions / 25 minutes", "Limits" in text).
3. Make the chapter list on the platform's Explore page switch a chapter from "coming soon" to live when its folder is built.
4. Limits must rebuild byte-for-byte equivalent in behavior to platform/..._BUILT.html. Check by screenshot of: test screen, result page, answers tab, revision toolkit (mind map, one-pager, cards).
5. Add a build check that fails loudly if: a question has fewer than 3 slips, an answer letter is missing, a concept has no section mapping, or a topic has fewer than 5 questions. Print a coverage table per chapter.
6. Next chapter to add: Continuity and Differentiability (topics 5 and 6 of the same book). The bank has no questions for them yet; the build must run and show them as "coming soon" until the CSV arrives.

## Rules
- Keep the original design, copy and flow. Only content and counts change.
- Prices: Rs 99 chapter pack, Rs 2,999 everything.
- Every wrong option must have a slip text.
- Do not invent facts, ranks or percentiles. Placeholders stay labelled as placeholders.
- Use Playwright with python3 -I for screenshots. Fonts from Google are blocked offline; that error is expected.
- Finish by printing the coverage table and listing anything that needs a human (teacher check of answer keys, concept-to-section map).
