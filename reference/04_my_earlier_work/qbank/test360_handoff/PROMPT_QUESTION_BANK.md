# Prompt to build the question bank for a new chapter (run in Claude Code)

Goal: write a JEE Main question bank for the chapter "<CHAPTER NAME>" in exactly the same CSV format as limits/input/limits_bank.csv (read its header and 5 rows first and copy the format).

Rules:
1. 25 questions per topic, topics = <LIST TOPICS>. Mix: 8 easy, 10 medium, 7 hard.
2. Single-correct MCQ with 4 options. Numeric answers must still have 4 options.
3. Every question needs: solution (step by step), hint, target_time_seconds, difficulty, concept_tag from the taxonomy, book_exam_tag (use the token meanings in exam_tag_labels.csv), and wrong_option_mistakes: one line per wrong option saying the specific slip that leads to it. No generic lines.
4. Map every concept_tag to a section number of the chapter book (limits_sections.json shows the format).
5. Verify every answer by computing it with Python or sympy. Drop any question you cannot verify.
6. Do not copy questions from Vedantu's Eklavya series or any competitor. Write original questions or adapt standard textbook patterns.
7. Output: <chapter>_bank.csv plus a short coverage table (questions per topic and per difficulty).
