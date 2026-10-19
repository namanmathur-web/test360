import json,re,hashlib
D=json.load(open('../app/data.json'))
Q=D['q'];SECS=D['secs'];REV=D['rev']
def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def clean(s): return esc(s).replace('-&gt;','→').replace('\\binf\\b','∞')
def tx(s):
    s=clean(s); s=re.sub(r'\binf\b','∞',s); return s.replace('\n','<br>')
DM={'easy':'easy','medium':'med','hard':'hard'}
def h(s): return int(hashlib.md5(s.encode()).hexdigest(),16)
byT={t:sorted([q for q in Q if q['topic']==t],key=lambda q:h(q['id'])) for t in range(4)}
used=set();test=[];rt={};lv={}
def pick(t,diff):
    for q in byT[t]:
        if q['id'] not in used and q['diff']==diff: used.add(q['id']);return q
for t in range(4):
    for df in ['easy','medium','hard']:
        q=pick(t,df)
        if q: test.append((t,q))
# retest: one medium (else any) per topic, lv: one hard per topic (else medium)
for t in range(4):
    q=pick(t,'medium') or pick(t,'easy') or pick(t,'hard'); rt[t]=q
for t in range(4):
    q=pick(t,'hard') or pick(t,'medium'); lv[t]=q
test.sort(key=lambda x:(x[0],{'easy':0,'medium':1,'hard':2}[x[1]['diff']]))
# interleave topics so it is not blocky: round robin by difficulty
order=[];lists={t:[x for x in test if x[0]==t] for t in range(4)}
for i in range(3):
    for t in range(4):
        if i<len(lists[t]): order.append(lists[t][i])
test=order
N=len(test);MAX=4*N;sec=sum(q['t'] for _,q in test);TMIN=int(-(-sec//60/5)*5) if False else ((sec+59)//60+4)//5*5
print('N',N,'sum target s',sec,'TMIN',TMIN)
def jsstr(s): return json.dumps(s,ensure_ascii=False)
FALL='This option comes from a common slip. Re-read the question and check the first step again.'
def qjs(t,q,extra=''):
    fb={i:tx(q['slips'].get('abcd'[i],FALL)) for i in range(4) if 'abcd'[i]!=q['ans']}
    # slips read "from ..."; make a sentence
    for k,v in list(fb.items()):
        fb[k]=v[0].upper()+v[1:]
        if not fb[k].endswith('.'): fb[k]+='.'
        if v.startswith('from ') or v.startswith('using ') or v.startswith('reading '): fb[k]='This comes '+v if v.startswith('from') else 'This comes from '+v+'.'
    w='high' if 'main' in (q['tag'] or '') else 'med'
    return '{t:"t%d",w:"%s",d:"%s",stem:%s,o:%s,a:%d,sol:%s,fb:%s%s}'%(t+1,w,DM[q['diff']],jsstr(esc(q['q'])),jsstr([esc(o) for o in q['opts']]),'abcd'.index(q['ans']),jsstr(tx(q['sol'])),json.dumps(fb,ensure_ascii=False),extra)
notes={0:"Name the form first. Factorise for polynomials, multiply by the conjugate for surds, and divide by the highest power at infinity. If the limit is finite and the denominator vanishes, the numerator must vanish too.",
1:"Sine or tangent of something, over that same something, goes to 1, and the coefficient of x inside is the answer. Keep 1 − cos 2θ = 2 sin²θ ready for the cosine forms.",
2:"Log of 1 plus something, over that same something, goes to 1, and a to the x minus 1, over x, goes to log a. For the 1^∞ form, the limit is e^λ where λ is (base − 1) × power.",
3:"Expansions: match the minimum power and read off one coefficient. L'Hôpital: differentiate top and bottom, then repeat if the form returns. Reach for it when differentiating visibly simplifies the function."}
names=['Algebraic limits','Trigonometric limits','Logarithmic and exponential limits','Expansions and L’Hôpital']
cum=0;TS=[];
def mm(s): return '%02d:%02d'%(s//60,s%60) if s<3600 else '%d:%02d:%02d'%(s//3600,(s%3600)//60,s%60)
for t in range(4):
    d=sum(s['clip'] or 0 for s in SECS if s['topic']==t)
    TS.append((cum,cum+d));cum+=d
DUR=cum
tot_h=DUR//3600;tot_m=(DUR%3600)//60
life='%d h %d min'%(tot_h,tot_m)
topics='var TOPICS={\n'+',\n'.join('  t%d:{n:%s,ts:"%s to %s",note:%s}'%(t+1,jsstr(names[t]),mm(TS[t][0]),mm(TS[t][1]),jsstr(notes[t])) for t in range(4))+'\n};\nvar ORDER=["t1","t2","t3","t4"];\nvar DUR=%d;\nvar NQ=%d,MAXM=%d,TSEC=%d;\n'%(DUR,N,MAX,TMIN*60)
qs='var Q=[\n'+',\n'.join(qjs(t,q) for t,q in test)+'\n];\n'
def hint(q): return tx(q['sol'])
rts='var RT={\n'+',\n'.join(' t%d:{t:"t%d",stem:%s,o:%s,a:%d,hint:%s}'%(t+1,t+1,jsstr(esc(q['q'])),jsstr([esc(o) for o in q['opts']]),'abcd'.index(q['ans']),jsstr(hint(q))) for t,q in rt.items())+'\n};\n'
lvs='var LV=[\n'+',\n'.join(' {t:"t%d",stem:%s,o:%s,a:%d,ex:%s}'%(t+1,jsstr(esc(q['q'])),jsstr([esc(o) for o in q['opts']]),'abcd'.index(q['ans']),jsstr(hint(q))) for t,q in lv.items())+'\n];\n'
# demo fill answers: right,wrong,skip pattern
fill=[]
for i,(t,q) in enumerate(test):
    a='abcd'.index(q['ans'])
    fill.append(a if i%3!=1 else (None if i%6==1 else (a+1)%4))
fill=json.dumps(fill)
# revise data: strip unneeded
rev=dict(root=REV['root'],mind=REV['mind'],groups=[dict(sub=g['sub'],items=[dict(no=i['no'],title=i['title'],k=i['k'],text=i['text'],f=i['f']) for i in g['items']]) for g in REV['groups']],cards=[dict(kind=c['kind'],no=c['no'],q=c['q'],f=c['f'],a=c['a']) for c in REV['cards']])
rv='var REV='+json.dumps(rev,ensure_ascii=False).replace('</','<\\/')+';\nvar SECT='+json.dumps({s['no']:s['title'] for s in SECS},ensure_ascii=False)+';\n'
open('gen_out.json','w').write(json.dumps(dict(data=topics+qs+rts+rv,lv=lvs,fill=fill,N=N,MAX=MAX,TMIN=TMIN,life=life),ensure_ascii=False))
print(life,len(topics+qs+rts+rv),sorted(set(q['id'] for _,q in test)))
