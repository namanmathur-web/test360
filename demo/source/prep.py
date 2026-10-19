import csv, json, re, html, sys
B='/home/claude/t360/04_my_earlier_work/qbank/test360_handoff/limits/input/'
rows=list(csv.DictReader(open(B+'limits_bank.csv',encoding='utf-8')))
def topic_of(tag):
    n=int(re.match(r'2\.(\d+)',tag).group(1))
    return 0 if n<=14 else 1 if n<=16 else 2 if n<=19 else 3
Q=[]
for r in rows:
    Q.append(dict(id=r['id'],t=topic_of(r['concept_tag']),c=r['concept_tag'],d=r['difficulty'],ty='sc' if r['type']=='single_correct' else 'num',
      q=r['question_text'],o=[r['option_a'],r['option_b'],r['option_c'],r['option_d']] if r['type']=='single_correct' else [],
      a=r['correct_answer'].strip(),mc=int(r['marks_correct']),mw=int(r['marks_wrong']),tt=int(r['target_time_seconds']),
      s=r['solution'],h=r['hint'],m=r['wrong_option_mistakes'],src=r['source']))
# original sample questions for Continuity (4) and Differentiability (5)
def S(id,t,d,ty,q,o,a,s,mw=-1,tt=110):
    Q.append(dict(id=id,t=t,c='Sample question (not from the bank)',d=d,ty=ty,q=q,o=o,a=a,mc=4,mw=mw if ty=='sc' else 0,tt=tt,s=s,h='',m='',src='sample'))
S('CON-S1',4,'easy','sc',r'$f(x)=\begin{cases}kx+1,& x\le 2\\ 3x-1,& x>2\end{cases}$ is continuous at $x=2$. Find $k$.',['$1$','$2$','$3$','$5$'],'b','LHL = 2k+1, RHL = 5. Continuity needs 2k+1 = 5, so k = 2.',tt=70)
S('CON-S2',4,'easy','num',r'$f(x)=\dfrac{x^2-16}{x-4}$ for $x\neq 4$ and $f(4)=k$. If $f$ is continuous at $x=4$, find $k$.',[],'8','Factorise: (x-4)(x+4)/(x-4) = x+4, which tends to 8. Continuity needs f(4) = 8.',tt=70)
S('CON-S3',4,'medium','sc',r'At $x=1$, the function $f(x)=[x]$ (greatest integer) has',[r'continuity',r'a jump: LHL $=0$, RHL $=1$',r'a removable discontinuity',r'LHL $=1$, RHL $=0$'],'b','Just left of 1, [x] = 0; just right, [x] = 1. The two sides disagree, so it is a jump (irremovable) discontinuity.')
S('CON-S4',4,'medium','num',r'$f(x)=\dfrac{\sin 3x}{x}$ for $x\neq 0$ and $f(0)=k$. If $f$ is continuous at $0$, find $k$.',[],'3','sin 3x / x = 3 · (sin 3x)/(3x), which tends to 3. So k = 3.')
S('CON-S5',4,'hard','num',r'How many points in $(0,3)$ is $f(x)=[x^2]$ discontinuous?',[],'8','[x²] jumps wherever x² is an integer. In (0,3), x² runs over (0,9), so x² = 1,2,…,8: eight points.',tt=180)
S('CON-S6',4,'medium','sc',r'For $f(x)=\dfrac{1}{1-x}$, at how many points is $f(f(x))$ discontinuous?',['$0$','$1$','$2$','$3$'],'c','f itself breaks at x = 1. f(f(x)) also breaks where f(x) = 1, i.e. x = 0. Two points.')
S('DIF-S1',5,'easy','sc',r'At $x=0$, the function $f(x)=|x|$ is',['differentiable','continuous but not differentiable','discontinuous','neither defined nor continuous'],'b','The graph has a corner at 0: LHD = -1, RHD = +1. Continuous, not differentiable.',tt=70)
S('DIF-S2',5,'medium','num',r'$f(x)=\begin{cases}x^2,& x\le 1\\ ax+b,& x>1\end{cases}$ is differentiable at $x=1$. Find $a+b$.',[],'1','Derivatives: 2x gives 2 on the left, so a = 2. Continuity: 1 = a + b, so a + b = 1 (b = -1).')
S('DIF-S3',5,'medium','sc',r'The right-hand derivative of $f(x)=|x-2|$ at $x=2$ is',['$-1$','$0$','$1$','does not exist'],'c','For x > 2, f(x) = x - 2, whose slope is 1.')
S('DIF-S4',5,'hard','num',r'At how many points is $f(x)=|x^2-1|$ not differentiable?',[],'2','The modulus makes corners where x² - 1 = 0 with a sign change: x = 1 and x = -1.',tt=180)
S('DIF-S5',5,'medium','sc',r"If $f'(5)=3$, then $\displaystyle\lim_{t\to 0}\frac{f(5+t)-f(5-t)}{2t}$ equals",[r'$\tfrac{3}{2}$','$3$','$6$','$0$'],'b','By L’Hôpital in t: [f′(5+t) + f′(5−t)]/2 → (3+3)/2 = 3.')
S('DIF-S6',5,'hard','sc',r'$f(x)=x\sin\frac{1}{x}$ for $x\ne 0$, $f(0)=0$. At $x=0$, $f$ is',['differentiable','continuous but not differentiable','discontinuous','differentiable with $f\'(0)=1$'],'b','|x sin(1/x)| ≤ |x| → 0, so it is continuous. But f(h)/h = sin(1/h) oscillates, so no derivative.',tt=180)
kit=json.load(open(B+'revise_kit.json',encoding='utf-8'))
secs={s['no']:s for s in json.load(open(B+'limits_sections.json',encoding='utf-8'))}
G=kit['groups']
topic_groups=[[0,1],[3],[4],[2,5],[6,7],[8]]
TOP=[]
names=['Algebraic Limits','Trigonometric Limits','Logarithmic and Exponential Limits',"Expansions and L'Hôpital",'Continuity','Differentiability']
lines=["Factorise, rationalise, or divide by the highest power to remove 0/0 and ∞/∞.",
"Force the angle to approach zero, then use sin x/x → 1 and tan x/x → 1.",
"Make ln(1+t)/t and (aᵗ−1)/t appear; 1^∞ goes to e^λ.",
"Expand to the lowest power that survives, or differentiate top and bottom.",
"LHL = RHL = f(a). Only the change points can break it.",
"Continuous first, then LHD = RHD. A corner kills the derivative."]
for i,gs in enumerate(topic_groups):
    items=[]
    for gi in gs:
        for it in G[gi]['items']:
            if it['title'].lower().startswith(('practice','quiz','oral','doubt')): continue
            sec=secs.get(it['no'],{})
            traps=sec.get('traps') or []
            items.append(dict(no=it['no'],ti=html.unescape(it['title']),tx=it['text'],f=it['f'][:2],slip=traps[0] if traps else '',clip=sec.get('clip_s')))
    TOP.append(dict(name=names[i],line=lines[i],sections=items[:6],nsec=len(items)))
from collections import Counter
print(Counter((q['t'],q['d']) for q in Q))
print([ (t['name'],len(t['sections']),t['nsec']) for t in TOP])
json.dump(dict(Q=Q,T=TOP),open('/home/claude/build/data.json','w',encoding='utf-8'),ensure_ascii=False)
