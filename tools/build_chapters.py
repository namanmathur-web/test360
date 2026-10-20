"""Build one content pack per live chapter (the first six) from the clean bank and the teacher content.

Reads  content/bank/*.json, content/books/*.json, demo/source/data.json (existing Limits notes and questions)
Writes content/chapters/<id>.json, content/chapters/index.json, content/chapters/REPORT.md

Run:  python3 -I tools/build_chapters.py

Pack fields:  topics[{name,short,line,sections[{no,ti,tx,f,slip,clip}]}]  questions[{id,t,level,ty,q,o,a,mc,mw,tt,s,src,...}]
              flashcards[{t,k,q,a}]  mistakes[{m,fix}]  lecture{teacher,sessions,...}
Topic and level labels on bank questions are provisional (rule-based) and flagged so a teacher can confirm them.
"""
import collections,json,os,re
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.dirname(HERE)
OUT=ROOT+'/content/chapters/';os.makedirs(OUT,exist_ok=True)
B={s:json.load(open(f'{ROOT}/content/bank/{s}.json')) for s in ('Maths','Physics','Chemistry')}
BOOK=json.load(open(ROOT+'/content/books/maths_calculus_book.json'))['chapters']
KOSH={c['name'].lower():c for c in json.load(open(ROOT+'/content/books/crash_kosh.json'))['chapters']}
TR=collections.defaultdict(list)
for t in json.load(open(ROOT+'/content/books/crash_kosh_transcripts.json')):TR[t['chapter'].lower()].append(t)
DEMO=json.load(open(ROOT+'/demo/source/data.json'))
ws=lambda s:re.sub(r'\s+',' ',s or '').strip()
nosmall=lambda s:ws(re.sub(r'<small[^>]*>.*?</small>','',s or '',flags=re.S))
plain=lambda s:ws(re.sub(r'<[^>]+>','',s or ''))
def tt_of(d,num):return {'Easy':70,'Medium':110,'Hard':180}[d]+(20 if num else 0)
DIFFRANK={'Easy':0,'Medium':1,'Hard':2}

# ---------- topic rules ----------
LCD=[x['name'] for x in DEMO['T']]
def lcd_topic(q):
    st=(q['sub_topic'] or '').lower();tx=q['q'].lower()
    if 'continu' in st:return 4
    if 'differentiab' in st or 'differentiation' in st or 'derivative' in st:return 5
    if 'expansion' in st or 'hospital' in st or "l'h" in st:return 3
    if st.startswith('standard result') or 'limits' == st.strip():
        if re.search(r'sin|tan|cos',tx):return 1
        if re.search(r'ln|log|e\^|\\ln|exp',tx):return 2
        return 0
    if 'algebraic' in st or 'sequence' in st or 'bundle' in st:return 0
    if 'continuous' in tx:return 4
    if 'differentiable' in tx:return 5
    if 'lim' in tx:return 1 if re.search(r'sin|tan|cos',tx) else 2 if re.search(r'ln|log',tx) else 0
    return None
def kw(rules,order=None):
    order=order or list(range(len(rules)))
    def f(q):
        st=(q['sub_topic'] or '').lower()
        for i in order:
            if any(k in st for k in rules[i]):return i
        return None
    return f
def integral_topic(q):
    st=(q['sub_topic'] or '').lower()
    if 'indefinite' in st and not st.startswith('definite'):return 0
    if st.startswith('definite') or 'properties of definite' in st or 'limit of a sum' in st:return 1
    if 'area' in st or 'plotting region' in st:return 2
    if any(k in st for k in ['substitution','parts','partial fraction','reduction','standard','integral calculus']):return 0
    return None
def nuclear(q):
    st=(q['sub_topic'] or '').lower();tx=q['q'].lower()
    if any(k in st for k in ['atomic structure','bohr','spectra','hydrogen','energy, radius']):return 0
    if any(k in st for k in ['radioactiv','nuclear energy','q-value','nuclear reaction','standard nuclear']):return 2
    if any(k in st for k in ['size of the nucleus','binding','atomic nuclei','mass-energy']):return 1
    if 'nuclear physics' in st:return 2 if re.search(r'decay|half|activity|radioactiv|alpha|beta|gamma',tx) else 1
    return None
SPECS=[
 {'id':'maths-lcd','subject':'Maths','no':7,'name':'Limits, Continuity and Differentiability','topics':LCD,'rule':lcd_topic,'bank_chapters':None},
 {'id':'maths-integral','subject':'Maths','no':8,'name':'Integral Calculus','topics':['Indefinite Integration','Definite Integration','Area Under Curves'],'rule':integral_topic},
 {'id':'phys-current','subject':'Physics','no':12,'name':'Current Electricity','topics':['Current, resistance and Ohm\'s law','Circuits and Kirchhoff\'s laws','Cells and EMF','Heating effect of current','Measuring instruments'],
  'rule':kw([['current electricity','resistance','resistivity','temperature dependence','conduction'],['equivalent resistance','kirchoff','kirchhoff','nodal','wheatstone'],['cell','terminal voltage'],['heating','joule'],['measuring instruments']],order=[4,1,2,3,0]),'kosh':['current electricity']},
 {'id':'phys-atoms','subject':'Physics','no':18,'name':'Atoms and Nuclei','topics':['Bohr model and atomic spectra','The nucleus and binding energy','Radioactivity and nuclear reactions'],'rule':nuclear,'kosh':['atoms','nuclei']},
 {'id':'chem-bonding','subject':'Chemistry','no':3,'name':'Chemical Bonding and Molecular Structure','topics':['Shapes of molecules (VSEPR and hybridisation)','Molecular orbital theory','Bond parameters and polarity'],
  'rule':kw([['vsepr','valence shell','hybridisation','xenon'],['molecular orbital'],['bond parameters','dipole','covalent','miscellaneous']]),'kosh':['chemical bonding']},
 {'id':'chem-thermo','subject':'Chemistry','no':4,'name':'Chemical Thermodynamics','topics':['First law, heat and work','Enthalpy of reactions','Entropy and Gibbs energy'],
  'rule':kw([['first law','concept of heat','reversible','heat capacity','types of processes','enthalpy of a system','relationship between'],['bond dissociation','hess','enthalpy of reactions','enthalpies for different'],['entropy','gibbs',"gibb's",'equilibrium']]),'kosh':['thermodynamics and thermochemistry']},
]

# ---------- question conversion ----------
def from_bank(q,t):
    return {'id':q['id'],'t':t,'ty':q['type'],'q':q['q'],'o':q['o'],'a':q['a'],'mc':4,'mw':q['mw'],'tt':q['tt'],'s':q['s'],'h':'','m':'','d':q['d'],'src':'vedantu_bank','sub':q['sub_topic'],'checked':False,'level':None,'_rank':(DIFFRANK[q['d']],len(q['s']))}
def numeric_ok(a):
    a=ws(a or '')
    m=re.fullmatch(r'(?:[a-zA-Z]\s*=\s*)?(-?\d+(?:\.\d+)?)',a)
    return m.group(1) if m else None
def book_questions(chapters,spec,tmap):
    out=[]
    for ch in chapters:
        for src,items in (('book_ladder',ch['ladder']),('book_bank',ch['testBank'])):
            for i,q in enumerate(items):
                level=q.get('level') if src=='book_ladder' else (5 if q.get('official') else 3)
                opts=q.get('opts') or []
                if opts:
                    letter=next((chr(97+k) for k,o in enumerate(opts) if ws(o)==ws(q['answer'] or '')),None)
                    if not letter and re.fullmatch(r'[A-Da-d]',ws(q['answer'] or '')):letter=ws(q['answer']).lower()
                    if not letter:continue
                    ty,a,o,mw=('sc',letter,opts,-1)
                else:
                    a=numeric_ok(q['answer']);
                    if a is None:continue
                    ty,o,mw='num',[],0
                t=tmap(q,ch)
                if t is None:continue
                out.append({'id':f"{src}-{ch['no']}-{i+1}",'t':t,'ty':ty,'q':q['q'],'o':o,'a':a,'mc':4,'mw':mw,'tt':{1:70,2:100,3:130,4:160,5:200}.get(level,110),'s':' '.join(q['steps']),'h':'','m':'','d':None,'src':src,'checked':q['checked'],'level':level,'_rank':None})
    return out
def tmap_integral(q,ch):return {4:0,5:1,6:2}[ch['no']]
def tmap_lcd(q,ch):
    if ch['no']!=1:return None
    tx=q['q'].lower()
    if re.search(r'continu',tx):return 4
    if re.search(r'differentiab|derivative',tx):return 5
    if re.search(r'ln|log|e\^',tx):return 2
    if re.search(r'sin|tan|cos',tx):return 1
    return 0

# ---------- sections (notes) ----------
def maths_sections(spec):
    if spec['id']=='maths-lcd':
        return [{'name':t['name'],'line':t['line'],'sections':t['sections'],'nsec':t.get('nsec')} for t in DEMO['T']]
    tops=[]
    for ch,name,line in ((BOOK[3],'Indefinite Integration','Reverse differentiation: know the standard list, then the substitution and parts.'),(BOOK[4],'Definite Integration','Limits first, then properties that halve the work.'),(BOOK[5],'Area Under Curves','Sketch the region, choose vertical or horizontal strips, then integrate.')):
        cs=ch['concepts'];pick=[cs[round(i*(len(cs)-1)/7)] for i in range(8)] if len(cs)>8 else cs
        secs=[{'no':c['no'],'ti':c['title'],'tx':c['oneLine'],'f':[nosmall(x) for x in c['formulas']][:3],'slip':re.sub(r'^Watch out\s*','',c.get('slip') or ''),'clip':(c['clip'] or {}).get('seconds')} for c in pick]
        tops.append({'name':name,'line':line,'sections':secs,'nsec':len(cs)})
    return tops
def kosh_sections(spec,topics,kchs):
    secs_by_topic=[[] for _ in topics];cards=[];lect={'teacher':'','sessions':[]}
    kwt=[[w for w in re.findall(r'[a-z]{4,}',t.lower())] for t in topics]
    for kc in kchs:
        lect['teacher']=kc['teacher'];lect['sessions']+= [{'chapter':kc['name'],'part':s['part'],'title':s['title'],'meta':s['meta'],'durationSec':s['lastSecond'],'clipCut':s['clipCut']} for s in kc['sessions']]
        op=kc['onePager'] or kc['mindMap'] or {'bullets':[],'memoryNotes':[]}
        groups=[];cur=None
        for b in op['bullets'][2:]:
            if re.fullmatch(r'\d{1,2}',b):cur=[];groups.append(cur)
            elif cur is not None:cur.append(b)
        trs=TR.get(kc['name'].lower(),[])
        for gi,g in enumerate(groups):
            if not g:continue
            head=g[0].title();body=g[1:];text=' '.join(body)
            words=set(re.findall(r'[a-z]{4,}',(head+' '+text).lower()))
            sc=[len(words&set(k)) for k in kwt];ti=sc.index(max(sc)) if max(sc)>0 else min(len(topics)-1,gi*len(topics)//max(1,len(groups)))
            start=None;best=0
            for t in trs:
                for sec,line in t['lines']:
                    ov=len(set(re.findall(r'[a-z]{5,}',head.lower()))&set(re.findall(r'[a-z]{5,}',line.lower())))
                    if ov>best:best=ov;start=(t['part'],sec)
            secs_by_topic[ti].append({'no':f"{ti+1}.{len(secs_by_topic[ti])+1}",'ti':head,'tx':text,'f':[],'slip':(op['memoryNotes'][gi] if gi<len(op['memoryNotes']) else ''),'clip':None,'lectureAt':{'part':start[0],'second':start[1]} if start else None})
        for fc in kc['flashcards']:
            words=set(re.findall(r'[a-z]{4,}',(fc['title']+' '+' '.join(fc['bullets'])).lower()));sc=[len(words&set(k)) for k in kwt]
            cards.append({'t':sc.index(max(sc)) if max(sc)>0 else 0,'k':'Recall','q':fc['title'],'a':' '.join(fc['bullets'][1:]) or ' '.join(fc['bullets']),'note':' '.join(fc['memoryNotes'])})
    tops=[{'name':n,'line':'','sections':secs_by_topic[i],'nsec':len(secs_by_topic[i])} for i,n in enumerate(topics)]
    return tops,cards,lect

# ---------- build ----------
report=[];index=[]
for spec in SPECS:
    sid=spec['id'];topics=spec['topics']
    rows=[q for q in B[spec['subject']] if q['chapter_no']==spec['no'] and q['usable'] and 'not_jee_main_tag' not in q['flags'] and 'chapter_suspect' not in q['flags'] and not q['q_img']]
    qs=[];off=0
    for q in rows:
        t=spec['rule'](q)
        if t is None:off+=1;continue
        qs.append(from_bank(q,t))
    # level: provisional band inside the chapter (rank by difficulty, then solution length)
    qs.sort(key=lambda c:c['_rank'])
    for i,c in enumerate(qs):c['level']=min(5,1+i*5//len(qs))
    extra=[]
    if sid=='maths-lcd':
        extra+=[dict(q,**{'level':None,'src':q['src'],'checked':False,'_rank':(DIFFRANK[{'easy':'Easy','medium':'Medium','hard':'Hard'}[q['d']]],len(q['s']))}) for q in DEMO['Q'] if q['src'] in ('existing_goat','textbook_edition','new_by_claude','vedantu_jee_bank') and q['t']<=5]
        extra+=book_questions(BOOK[:1],spec,tmap_lcd)
    if sid=='maths-integral':extra+=book_questions(BOOK[3:6],spec,tmap_integral)
    seen={re.sub(r'\W+','',c['q'].lower()) for c in qs};dup=0
    for c in extra:
        k=re.sub(r'\W+','',c['q'].lower())
        if k in seen:dup+=1;continue
        seen.add(k);qs.append(c)
    # remaining questions without a level get a band by difficulty rank
    nl=[c for c in qs if c['level'] is None]
    nl.sort(key=lambda c:c['_rank'] or (1,0))
    for i,c in enumerate(nl):c['level']=min(5,1+i*5//max(1,len(nl)))
    for c in qs:c.pop('_rank',None)
    # notes, cards, mistakes, lecture
    if spec['subject']=='Maths':
        tops=maths_sections(spec)
        chs=BOOK[:1] if sid=='maths-lcd' else BOOK[3:6];cards=[];ms=[]
        for ci,ch in enumerate(chs):
            for f in ch['flashcards']:
                t=0 if sid=='maths-lcd' else ci
                if sid=='maths-lcd':
                    no=f['no'];c=next((x for x in ch['concepts'] if x['no']==no),None);t=LCD.index(c['topic'].split(' ',1)[1]) if c and c['topic'] and c['topic'].split(' ',1)[1] in LCD else 0
                cards.append({'t':t,'k':f['kind'],'q':plain(f['q']),'a':f['a'],'no':f['no']})
            items=ch['commonMistakes'];cur=None
            for it in items:
                if it.startswith('Fix:') and ms:ms[-1]['fix']=it[4:].strip()
                else:ms.append({'m':re.sub(r'^\d+\.\s*','',it),'fix':'','chapter':ch['title']})
        lect={'teacher':'Ankit Sir / Harsh Sir','sessions':[]}
    else:
        kch=[KOSH[k] for k in spec['kosh']]
        tops,cards,lect=kosh_sections(spec,topics,kch);ms=[]
    for i,t in enumerate(tops):t.setdefault('short',topics[i]);t['name']=topics[i]
    pack={'id':sid,'subject':spec['subject'],'name':spec['name'],'jeeChapterNo':spec['no'],'topics':tops,'questions':qs,'flashcards':cards,'mistakes':ms,'lecture':lect,
          'provisional':'Topic and Level labels on bank questions are rule-based and need a teacher check. Book questions are marked checked=false until a teacher confirms the answer.'}
    json.dump(pack,open(OUT+sid+'.json','w'),ensure_ascii=False)
    L=collections.Counter(c['level'] for c in qs);T=collections.Counter(c['t'] for c in qs);S=collections.Counter(c['src'] for c in qs)
    index.append({'id':sid,'subject':spec['subject'],'name':spec['name'],'questions':len(qs),'topics':len(topics)})
    report.append(f"### {spec['subject']}: {spec['name']} (`{sid}`)\n- Questions: **{len(qs)}** (from the bank: {S['vedantu_bank']}, book ladder: {S['book_ladder']}, book question bank: {S['book_bank']}, earlier Limits bank: {sum(v for k,v in S.items() if k not in ('vedantu_bank','book_ladder','book_bank'))}); left out as off-chapter: {off}; duplicates dropped: {dup}\n- By level: "+', '.join(f'L{i}: {L[i]}' for i in range(1,6))+"\n- By topic: "+'; '.join(f"{topics[i]}: {T[i]}" for i in range(len(topics)))+f"\n- Notes sections: {sum(len(t['sections']) for t in tops)} · flashcards: {len(cards)} · common mistakes: {len(ms)}\n")
json.dump(index,open(OUT+'index.json','w'),indent=1)
open(OUT+'REPORT.md','w').write('# Chapter packs (first six chapters)\n\n'+'\n'.join(report))
print('\n'.join(report))
