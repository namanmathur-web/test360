"""Read the Vedantu JEE question file for Maths ch07 and add it to the demo.

- Writes all 30 questions, converted to the demo's format, to content/jee_main_maths_ch07.json.
- Adds the ones that match one of the 6 summary topics to demo/source/data.json (once; safe to re-run).
- Numerical questions have no negative marking (decision: Naman, 2026-10-19), whatever the file's marking guide says.
"""
import json,os,re,openpyxl
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.dirname(os.path.dirname(HERE))
XLSX=ROOT+'/reference/06_question_files/Maths_ch07_Limit-Continuity-And-Differentiability.xlsx'
# question number -> demo topic (0 Algebraic, 1 Trig, 2 Log/Exp, 3 Expansions & L'Hopital, 4 Continuity, 5 Differentiability)
# Not listed = not tied to one of the 6 summary topics yet (functions/domain items and derivative rules/applications).
TOPIC={3:0,4:0,9:1,10:2,11:3,12:4,13:5,14:5}
TT={'easy':70,'medium':110,'hard':180}

# Proper maths formatting (KaTeX) for the questions that go into the demo: id suffix -> (question, options)
R=r'\mathbb{R}'
LATEX={
 3:(r"Let $p(x) = x^3 + a x^2 + b x - 6$, where $a$ and $b$ are real constants. It is given that $\lim_{x \to 1} \dfrac{p(x)}{x - 1}$ exists and equals $4$. Find the value of $p(3)$.",None),
 4:(r"Consider the rational function $f(x) = \dfrac{x^3 - 2x^2 - 5x + 6}{x^2 - 4x + 3}$, taken over the real numbers. Which one of the following statements is correct?",
    [r"The domain of $f$ is $\mathbb{R}$ and $f(x) = x + 2$ for every real $x$",r"The domain of $f$ is $\mathbb{R} \setminus \{3\}$ and $f(x) = x + 2$ there",r"The domain of $f$ is $\mathbb{R} \setminus \{1, 3\}$ and $f(x) = x + 2$ there",r"The domain of $f$ is $\mathbb{R} \setminus \{1, 3\}$ and $f(x) = x - 2$ there"]),
 9:(r"For $x$ near $0$ with $x \neq 0$ and $\tan 5x \neq 0$, consider the quotient $\dfrac{\sin 7x - \sin 3x}{\tan 5x}$. The value of its limit as $x \to 0$ is",[r"$2$",r"$\dfrac{4}{5}$",r"$\dfrac{21}{5}$",r"$4$"]),
 10:(r"For $x$ near $0$ and $x \neq 0$, consider $F(x) = \left(\dfrac{1 + 3\sin x}{1 - 2\sin x}\right)^{1/x}$. The limit of $F(x)$ as $x \to 0$ is",[r"$e^{5}$",r"$e$",r"$e^{6}$",r"$e^{-5}$"]),
 11:(r"For $x$ near $0$ with $x \neq 0$ and $1 + 3x > 0$, let $L$ be the limit, as $x \to 0$, of $\dfrac{\ln(1 + 3x) - 3x + \frac{9}{2}x^2}{x^3}$, where $\ln$ denotes the natural logarithm. Find the value of $L$.",None),
 12:(r"Let $f(x) = \dfrac{\sqrt{1 + 4x} - 1}{x}$ for $x \neq 0$ and $f(0) = k$, where $k$ is a real constant and $x > -\tfrac{1}{4}$ so that the square root is real. The value of $k$ for which $f$ is continuous at $x = 0$ is",[r"$4$",r"$\dfrac{1}{2}$",r"$2$",r"$0$"]),
 13:(r"Let $f(x) = |x^2 - 7x + 10|$ for every real $x$. Which one of the following statements about $f$ at the two points $x = 2$ and $x = 5$ is correct?",
    [r"$f$ is continuous at $x = 2$ and $x = 5$ but differentiable at neither",r"$f$ is differentiable at $x = 2$ and $x = 5$, with $f'(2) = -3$, $f'(5) = 3$",r"$f$ is discontinuous at $x = 2$ and $x = 5$, and differentiable at neither",r"$f$ is continuous and differentiable at every real number $x$"]),
 14:(r"Let $a$ and $b$ be real constants and let $f$ be defined on $\mathbb{R}$ by $f(x) = ax^2 + bx + 1$ for $x \le 1$ and $f(x) = 3\ln x + 2x$ for $x > 1$, where $\ln$ denotes the natural logarithm. If $f$ is differentiable at $x = 1$, then the ordered pair $(a, b)$ is",[r"$(-3, 4)$",r"$(4, -3)$",r"$(2, -1)$",r"$(1, 0)$"]),
}
ws=openpyxl.load_workbook(XLSX,read_only=True).active
rows=list(ws.iter_rows(values_only=True));H=rows[0]
out=[]
for r in rows[1:]:
    d=dict(zip(H,r));n=int(d['q_id'][-3:]);num=d['question_type']=='numerical'
    segs=[re.sub(r'\s*\(-1\)','',s).strip() for s in (d['marking_steps'] or '').split(' | ')[1:]]
    out.append({'id':d['q_id'],'t':TOPIC.get(n),'c':'Vedantu JEE Main bank · Maths ch07 · '+str(d['topic_id'] or 'chapter level'),
     'd':d['difficulty'],'ty':'num' if num else 'sc','q':d['question_text'],
     'o':[] if num else [d['option_'+k] for k in 'abcd'],
     'a':str(d['correct_answer']).strip() if num else str(d['correct_answer']).strip().lower(),
     'mc':4,'mw':0 if num else -1,'tt':TT[d['difficulty']],'s':d['solution_short'],'h':'',
     'm':'Common wrong answers: '+'; '.join(segs) if segs else '','src':'vedantu_jee_bank'})
for q in out:
    n=int(q['id'][-3:])
    if n in LATEX:
        q['q']=LATEX[n][0]
        if LATEX[n][1]:q['o']=LATEX[n][1]
json.dump(out,open(ROOT+'/content/jee_main_maths_ch07.json','w'),ensure_ascii=False,indent=1)
dp=HERE+'/data.json';D=json.load(open(dp))
D['Q']=[q for q in D['Q'] if q.get('src')!='vedantu_jee_bank']
add=[q for q in out if q['t'] is not None]
D['Q'].extend(add)
json.dump(D,open(dp,'w'),ensure_ascii=False)
print(len(out),'converted;',len(add),'added to the demo;',len(out)-sum(q['t'] is not None for q in out),'held back')
