import csv,json,re,base64
U='/root/.claude/uploads/54824050-b655-5055-82b2-c99ea93b3d37/5a85c84e-limits_bank.csv'
S='/tmp/claude-0/-home-claude/54824050-b655-5055-82b2-c99ea93b3d37/scratchpad/book/limits_sections.json'
secs=json.load(open(S))
secs=[dict(no=s['no'],title=s['title'],clip=s['clip_s'],key=s['key_idea'],one=s['one_line'],traps=s['traps'][:2]) for s in secs]
def topic_of_sec(no):
    n=int(no.split('.')[1])
    return 0 if n<=18 else 1 if n<=39 else 2 if n<=52 else 3 if n<=62 else 4 if n<=87 else 5
for s in secs: s['topic']=topic_of_sec(s['no'])
CMAP={1:'1.1',2:'1.65',3:'1.66',4:'1.36',5:'1.1',6:'1.52',7:'1.2',8:'1.3',9:'1.6',10:'1.13',11:'1.11',12:'1.65',13:'1.16',14:'1.16',15:'1.19',16:'1.33',17:'1.40',18:'1.47',19:'1.50',20:'1.55',21:'1.60',22:None}
def topic_q(n): return 0 if (n<=14 or n==22) else 1 if n<=16 else 2 if n<=19 else 3
def fix(t): return t.replace("H\\^opital","Hôpital").replace("L'H\\^o","L'Hô")
rows=list(csv.DictReader(open(U,encoding='utf8')))
Q=[]
for x in rows:
    cn=int(x['concept_tag'].split()[0].split('.')[1])
    slips={}
    w=x['wrong_option_mistakes']
    if x['type']=='single_correct':
        for m in re.finditer(r'^([a-d])\) (.*)$',w,re.M): slips[m.group(1)]=m.group(2).strip()
    else:
        body=re.sub(r'^Common wrong answers:\s*','',w)
        for it in re.split(r';\s+(?=[-\'\w])',body):
            if ' (' in it:
                a,why=it.split(' (',1); slips[a.strip().strip("'")]=why.rstrip('). ').strip()
    Q.append(dict(id=x['id'],concept=re.sub(r'^\d+\.\d+\s+','',x['concept_tag']),cno=cn,sec=CMAP[cn],topic=topic_q(cn),diff=x['difficulty'],type='mcq' if x['type']=='single_correct' else 'num',
      q=fix(x['question_text']),opts=[fix(x['option_'+k]) for k in 'abcd'] if x['type']=='single_correct' else None,ans=x['correct_answer'],t=int(x['target_time_seconds']),
      sol=fix(x['solution']),hint=fix(x['hint']),slips=slips,tag=x['book_exam_tag']))

import hashlib
FR={'0.25':'1/4','0.5':'1/2','0.75':'3/4','0.6667':'2/3','1.5':'3/2','-1.5':'-3/2','0.2':'1/5'}
def disp(v):
    v=str(v).strip()
    if v=='infinity': return '∞'
    if v=='does not exist': return 'Does not exist'
    v=FR.get(v,v)
    return v.replace('-','−') if v.startswith('-') else v
for q in Q:
    if q['type']!='num': continue
    cands=[(q['ans'],None)]+list(q['slips'].items())
    seen=set();items=[]
    for a,w in cands:
        d=disp(a)
        if d in seen: continue
        seen.add(d);items.append((d,w))
    assert len(items)==4,(q['id'],items)
    h=int(hashlib.md5(q['id'].encode()).hexdigest(),16)
    pos=h%4
    wrong=items[1:]
    opts=[];slips={}
    wi=0
    for i in range(4):
        if i==pos: opts.append(items[0][0])
        else:
            opts.append(wrong[wi][0]);slips['abcd'[i]]=wrong[wi][1];wi+=1
    q['opts']=opts;q['ans']='abcd'[pos];q['slips']=slips;q['type']='mcq'
REV=json.load(open('revise.json'))
json.dump(dict(secs=secs,q=Q,rev=REV),open('data.json','w'),ensure_ascii=False)
print(len(secs),len(Q))
# katex inline
d='/tmp/claude-0/-home-claude/54824050-b655-5055-82b2-c99ea93b3d37/scratchpad/kx/node_modules/katex/dist/'
css=open(d+'katex.min.css').read()
need=['Main-Regular','Main-Bold','Main-Italic','Math-Italic','Size1-Regular','Size2-Regular','AMS-Regular','Main-BoldItalic','Math-BoldItalic','Size3-Regular','Size4-Regular']
def sub(m):
    name=m.group(1)
    if name in need:
        b=base64.b64encode(open(d+'fonts/KaTeX_%s.woff2'%name,'rb').read()).decode()
        return 'url(data:font/woff2;base64,%s) format("woff2")'%b
    return 'url(data:font/woff2;base64,) format("woff2")'
css=re.sub(r'url\(fonts/KaTeX_([A-Za-z0-9-]+)\.woff2\) format\("woff2\"\),url\([^)]*\) format\("woff"\),url\([^)]*\) format\("truetype"\)',sub,css)
css=re.sub(r'url\(fonts/KaTeX_([A-Za-z0-9-]+)\.woff2\) format\("woff2"\)',sub,css)
open('katex.css','w').write(css);open('katex.js','w').write(open(d+'katex.min.js').read());open('auto.js','w').write(open(d+'contrib/auto-render.min.js').read())
print(len(css),'fonts.googleapis' in css, 'fonts/' in css)
