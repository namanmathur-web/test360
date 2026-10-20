"""Turn the two teacher-content files into structured data the product can read.

Inputs (private, in reference/07_teacher_content/):
  Harsh-Sir-Calculus-Book-Demo.html   Maths calculus book (the file holds a compressed copy of the book; this script opens it)
  jee-crash-kosh.html                 Physics and Chemistry crash-course notes, flashcards and lecture transcripts

Outputs (content/books/):
  maths_calculus_book.json            concepts, quick checks, flashcards, exam ladder (Level 1-5), question bank, common mistakes
  crash_kosh.json                     per chapter: mind map, one-pager, flashcards, memory notes, session list
  crash_kosh_transcripts.json         lecture transcripts with timestamps (source for teacher-clip ranges)
  REPORT.md                           plain-language inventory

Run:  python3 -I tools/extract_books.py
Nothing is invented: every field comes from the files. Items the book marks 'answer not yet checked' keep that mark (checked=false).
"""
import base64,html,json,os,re,zlib,collections
from bs4 import BeautifulSoup
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.dirname(HERE)
SRC=ROOT+'/reference/07_teacher_content/';OUT=ROOT+'/content/books/';os.makedirs(OUT,exist_ok=True)
ws=lambda s:re.sub(r'\s+',' ',s or '').strip()
def txt(e):return ws(e.get_text(' ',strip=True)) if e else ''
def inner(e):
    for t in e.find_all(['script','style']):t.decompose()
    return ws(''.join(str(c) for c in e.children))

# ---------- 1. Maths calculus book ----------
def open_book():
    raw=open(SRC+'Harsh-Sir-Calculus-Book-Demo.html',encoding='utf-8').read()
    m=re.search(r'"([A-Za-z0-9+/=]{100000,})"',raw)
    if not m:return raw
    import brotli  # pip install brotli
    return brotli.decompress(base64.b64decode(m.group(1))).decode('utf-8')
def clipdur(sec):
    m=re.search(r'(\d+)m(\d+)s',sec or '');return int(m.group(1))*60+int(m.group(2)) if m else None
def parse_ladder(root):
    out=[];tier=None
    for el in root.find_all(['div'],recursive=True):
        c=el.get('class') or []
        if 'thead' in c:tier=txt(el)
        elif 'q' in c and el.find(class_='qtext'):
            tags=[txt(x) for x in el.select('.xtag')]
            steps=[txt(x) for x in el.select('.solution .step')]
            ans=next((s[len('Answer:'):].strip() for s in steps if s.startswith('Answer:')),None)
            sch=[txt(x) for x in el.select('.scheme > div')]
            out.append({'tier':tier,'level':int(re.match(r'L(\d)',tier).group(1)) if tier and re.match(r'L\d',tier) else None,'source':txt(el.select_one('.qmeta')),
              'q':txt(el.select_one('.qtext')),'steps':[s for s in steps if not s.startswith('Answer:')],'answer':ans,
              'marking':[{'step':sch[i],'marks':sch[i+1]} for i in range(0,len(sch)-1,2)],'checked':not any('not yet checked' in t for t in tags),'tags':tags,
              'clip':(el.find(attrs={'data-clip':True}) or {}).get('data-clip') if el.find(attrs={'data-clip':True}) else None})
    return out
def book():
    soup=BeautifulSoup(open_book(),'html.parser')
    chapters=[]
    for n in range(7):
        main=soup.find(id=f'main-c{n}')
        title=txt(soup.select_one(f'#main-c{n}-practice .lhead')).replace('Exam ladder — ','')
        topics=[];concepts=[];band=None
        for el in main.find_all(True,recursive=False):
            if 'secband' in (el.get('class') or []):
                band=txt(el);topics.append(band)
            elif el.name=='h2' and el.get('data-tbno'):
                c={'no':el['data-tbno'],'id':el.get('id'),'title':el.get('data-tbtitle'),'topic':band,'quote':'','clip':None,'oneLine':'','notes':[],'quickChecks':[],'formulas':[]}
                concepts.append(c);cur=c
            elif concepts:
                c=cur
                tr=el if 'trap' in (el.get('class') or []) else el.select_one('.trap')
                if tr is not None:c.setdefault('slip',txt(tr))
                if 'tv' in (el.get('class') or []) and el.find(class_='tv-quote'):
                    c['quote']=txt(el.find(class_='tv-quote'));c['teacher']=txt(el.select_one('.tv-id b'))
                elif 'vid' in (el.get('class') or []):c['clip']={'slug':el.get('data-clip')}
                elif 'cap' in (el.get('class') or []) and c['clip'] is not None:
                    c['clip']['label']=txt(el);c['clip']['seconds']=clipdur(txt(el))
                elif 'defn' in (el.get('class') or []):c['oneLine']=txt(el.select_one('.hl'))
                elif el.name=='p':c['notes'].append(inner(el))
                elif el.select_one('.fcard') or 'fcard' in (el.get('class') or []):
                    fc=el if 'fcard' in (el.get('class') or []) else el.select_one('.fcard')
                    c.setdefault('formulas',[]).extend(inner(d) for d in fc.find_all('div',recursive=False))

                elif 'tb-yt' in (el.get('class') or []):
                    for li in el.select('li'):
                        q=li.select_one('.tb-q');st=[txt(x) for x in li.select('.tb-a .step')]
                        c['quickChecks'].append({'q':txt(q),'steps':[s for s in st if not s.startswith('Answer:')],'answer':next((s[7:].strip() for s in st if s.startswith('Answer:')),None)})
        # flashcards in the Revise book
        cards=[{'kind':txt(c.select_one('.fc-k')).split('·')[0].strip(),'no':txt(c.select_one('.fc-k')).split('·')[-1].strip(),'q':inner(c.select_one('.rk-q')),'a':inner(c.select_one('.rk-a')),
                'clip':(c.find(attrs={'data-clip':True}) or {}).get('data-clip')} for c in soup.select(f'#rk-cards-c{n} .fcard.rk-fcard')]
        # exam ladder, test bank, mistakes and shortcuts
        ladder=parse_ladder(soup.find(id=f'main-c{n}-practice'))
        bank=[]
        for xq in soup.find_all(class_='xq',id=re.compile(rf'^test-c{n}-q\d+$')):
            st=[txt(x) for x in xq.select('.solution .step')];tags=[txt(x) for x in xq.select('.xtag')]
            bank.append({'id':xq['id'],'source':txt(xq.select_one('.qmeta')),'type':'sc' if xq.select_one('.xopts') else 'num','q':txt(xq.select_one('.xqq')),
              'opts':[txt(li) for li in xq.select('.xopts li')],'steps':[s for s in st if not s.startswith('Answer:')],'answer':next((s[7:].strip() for s in st if s.startswith('Answer:')),None),
              'checked':not any('not yet checked' in t for t in tags),'official':'Advanced 2026' in txt(xq.select_one('.qmeta')),'clip':(xq.find(attrs={'data-clip':True}) or {}).get('data-clip')})
        prac=soup.find(id=f'practice-c{n}');mist=[];short=[]
        if prac:
            for h in prac.find_all('h2'):
                body=[];e=h.find_next_sibling()
                while e and e.name!='h2':body.append(e);e=e.find_next_sibling()
                items=[txt(x) for b in body for x in b.select('li')] or [txt(b) for b in body]
                if 'mistake' in h.get_text().lower():mist=items
                elif 'shortcut' in h.get_text().lower():short=items
        mm=soup.find(id=f'mp-c{n}')
        chapters.append({'no':n+1,'title':title or txt(soup.select_one(f'#revise-c{n} h2')),'topics':topics,'concepts':concepts,'flashcards':cards,'ladder':ladder,'testBank':bank,'commonMistakes':mist,'shortcuts':short,'mindMap':txt(mm)})
    json.dump({'source':'Harsh Sir / Ankit Sir Calculus Book (Eklavya Dropper JEE 2026)','chapters':chapters},open(OUT+'maths_calculus_book.json','w'),ensure_ascii=False)
    return chapters

# ---------- 2. Crash Kosh (Physics and Chemistry) ----------
def kosh():
    soup=BeautifulSoup(open(SRC+'jee-crash-kosh.html',encoding='utf-8').read(),'html.parser')
    chs=[];trs=[]
    for sec in soup.select('section.chapter'):
        revise=sec.select_one('.revise-pane');parts={'mindMap':None,'onePager':None,'flashcards':[]}
        for card in revise.select('.revise-card'):
            h=txt(card.find('h4'));slot=card.select_one('.slot-text')
            item={'title':h,'bullets':[txt(li) for li in slot.select('.slot-bullets li')] if slot else [],'memoryNotes':[re.sub(r'^\(Memory Note\)\s*','',txt(m)) for m in (slot.select('.mn') if slot else [])],
                  'image':card.find('img').get('src') if card.find('img') else None}
            if 'mind map' in h.lower():parts['mindMap']=item
            elif 'one-pager' in h.lower():parts['onePager']=item
            else:parts['flashcards'].append(item)
        sess=[]
        for ss in sec.select('.session'):
            lines=[]
            for ln in (ss.select_one('.transcript-box').get_text() if ss.select_one('.transcript-box') else '').split('\n'):
                m=re.match(r'\[(\d+):(\d+):(\d+)\]\s*(.*)',ln.strip())
                if m:lines.append([int(m.group(1))*3600+int(m.group(2))*60+int(m.group(3)),html.unescape(m.group(4))])
            meta=txt(ss.select_one('.sess-meta'))
            sess.append({'part':txt(ss.select_one('.sess-n')),'title':txt(ss.select_one('.sess-title')),'meta':meta,'clipCut':'not-cut' not in ' '.join(ss.select_one('.watch-btn').get('class') or []) if ss.select_one('.watch-btn') else False,'transcriptLines':len(lines),'lastSecond':lines[-1][0] if lines else 0})
            trs.append({'chapter':html.unescape(txt(sec.find('h2'))),'part':sess[-1]['part'],'title':sess[-1]['title'],'lines':lines})
        chs.append({'idx':sec['id'],'subject':sec['data-subject'],'name':ws(html.unescape(txt(sec.find('h2')))),'teacher':ws(txt(sec.select_one('.chapter-meta'))),'sessions':sess,**parts})
    json.dump({'source':'JEE Crash Kosh (GenZ 2.0 crash course)','chapters':chs},open(OUT+'crash_kosh.json','w'),ensure_ascii=False)
    json.dump(trs,open(OUT+'crash_kosh_transcripts.json','w'),ensure_ascii=False)
    return chs

if __name__=='__main__':
    bk=book();ks=kosh()
    C=collections.Counter
    L=['# Teacher content report','','## Maths calculus book (7 chapters)','','| Chapter | Concepts | Quick checks | Flashcards | Exam ladder | of which Level 1-5 tagged | Question bank | Common mistakes |','|---|---|---|---|---|---|---|---|']
    for c in bk:L.append(f"| {c['no']}. {c['title']} | {len(c['concepts'])} | {sum(len(x['quickChecks']) for x in c['concepts'])} | {len(c['flashcards'])} | {len(c['ladder'])} | {sum(1 for q in c['ladder'] if q['level'])} | {len(c['testBank'])} | {len(c['commonMistakes'])} |")
    allq=[q for c in bk for q in c['ladder']+c['testBank']]
    L+=['',f"Questions in the book: {len(allq)}. Marked 'answer not yet checked': {sum(not q['checked'] for q in allq)}. Official JEE Advanced 2026 items: {sum(q.get('official',False) for q in c['testBank'] for c in bk)}.",'',
        '## Crash Kosh (Physics and Chemistry)','',f"{len(ks)} chapters ({C(c['subject'] for c in ks)}). Sessions: {sum(len(c['sessions']) for c in ks)}. Flashcards: {sum(len(c['flashcards']) for c in ks)}.",'']
    L+=['| Subject | Chapter | Sessions | Flashcards | Memory notes | Transcript lines | Clips cut |','|---|---|---|---|---|---|---|']
    for c in ks:L.append(f"| {c['subject']} | {c['name']} | {len(c['sessions'])} | {len(c['flashcards'])} | {sum(len(f['memoryNotes']) for f in c['flashcards'])} | {sum(s['transcriptLines'] for s in c['sessions'])} | {sum(s['clipCut'] for s in c['sessions'])} |")
    open(OUT+'REPORT.md','w').write('\n'.join(L)+'\n');print('\n'.join(L[:14]))
