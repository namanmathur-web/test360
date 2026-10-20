"""Build the clean question bank for Maths, Physics and Chemistry.

Reads reference/06_question_files/qbank_chapterwise.zip (the raw bank) and writes:
  content/bank/Maths.json, Physics.json, Chemistry.json   one clean list per subject
  content/bank/REPORT.md                                  plain-language summary
  content/bank/chapter_readiness.xlsx                     one row per JEE Main chapter (54)

Run:  python3 -I tools/build_bank.py

Decisions baked in (Naman, 2026-10-19/20):
- Numerical questions have no negative marking, whatever the source file says.
- Level 1-5 are provisional: each chapter's questions are ranked by difficulty and split into five equal bands.
Nothing is deleted. Problems are flagged so a teacher or the AI tagger can fix them; `usable` says whether a question may go into a live test today.
"""
import json,os,re,zipfile,collections,statistics
import openpyxl
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.dirname(HERE)
ZIP=ROOT+'/reference/06_question_files/qbank_chapterwise.zip'
INDEX=ROOT+'/reference/06_question_files/JEE_index.xlsx'
OUT=ROOT+'/content/bank';os.makedirs(OUT,exist_ok=True)

# bank chapter name -> position of the JEE Main chapter (same order as JEE_index.xlsx within each subject)
MAP={
'Maths':[['Relations and Functions'],['Complex Numbers','Linear Inequalities'],['Matrices','Determinants'],['Permutations and Combinations'],['Binomial Theorem'],['Sequences and Series'],['Limits','Continuity and Differentiability','Differentiation','Applications of Derivatives'],['Indefinite Integration','Definite Integration','Area Under Curves'],['Differential Equations'],['Straight Lines','Conic Sections'],['Three Dimensional Geometry'],['Vector Algebra'],['Statistics','Probability'],['Trigonometric Functions','Inverse Trigonometric Functions']],
'Physics':[['Units and Measurement'],['Motion in a Straight Line','Motion in a Plane'],['Laws of Motion'],['Work, Energy and Power'],['System of Particles and Rotational Motion'],['Gravitation'],['Mechanical Properties of Solids','Mechanical Properties of Fluids','Thermal Properties of Matter'],['Thermodynamics'],['Kinetic Theory'],['Oscillations','Waves'],['Electric Charges and Fields','Electrostatic Potential and Capacitance'],['Current Electricity'],['Moving Charges and Magnetism'],['Electromagnetic Induction','Alternating Current'],['Electromagnetic Waves'],['Ray Optics and Optical Instruments','Wave Optics'],['Dual Nature of Radiation and Matter'],['Atoms','Nuclei'],['Semiconductor Electronics: Materials, Devices and Simple Circuits'],[]],
'Chemistry':[['Some Basic Concepts of Chemistry'],['Structure of Atom'],['Chemical Bonding and Molecular Structure'],['Thermodynamics'],['Solutions'],['Equilibrium'],['Redox Reactions','Electrochemistry'],['Chemical Kinetics'],['Classification of Elements and Periodicity in Properties'],['p-Block Elements (Groups 13-18)'],['The d- and f-Block Elements'],['Coordination Compounds'],['Purification and Characterisation of Organic Compounds'],['Organic Chemistry: Some Basic Principles and Techniques'],['Hydrocarbons'],['Haloalkanes and Haloarenes'],['Alcohols, Phenols and Ethers','Aldehydes, Ketones and Carboxylic Acids'],['Amines'],['Biomolecules'],[]]}
SUBJ={'Mathematics':'Maths','Physics':'Physics','Chemistry':'Chemistry'}
jee=collections.defaultdict(list)
for r in list(openpyxl.load_workbook(INDEX,read_only=True).active.iter_rows(values_only=True))[1:]:
    if r[0] in SUBJ: jee[SUBJ[r[0]]].append((int(r[1]),r[3]))
for s in MAP: assert len(jee[s])==len(MAP[s]),(s,len(jee[s]),len(MAP[s]))
lookup={}
for s,rows in MAP.items():
    for i,names in enumerate(rows):
        for n in names: lookup[(s,n)]=(jee[s][i][0],jee[s][i][1])
# chapters where the bank's chapter tag is a catch-all; keep only questions whose sub-topic looks related, flag the rest
CATCHALL={('Physics','Work, Energy and Power'):['work','energy','power','collision','spring','conservative','momentum'],
          ('Chemistry','Organic Chemistry: Some Basic Principles and Techniques'):['organic','isomer','inductive','resonance','hyperconj','electrophil','nucleophil','carbocation','carbanion','radical','iupac','nomenclature','reaction intermediate','acidity','basicity','aromatic','stereo','chirality','conformation','tautomer','electromeric','functional','bond fission','types of organic','purification','detection']}


# Questions the bank filed under a catch-all chapter are moved to the right chapter by their sub-topic wording (flagged `rehomed`, teacher to confirm).
REHOME={'Physics':[(2,['projectile','acceleration','velocity','displacement','relative motion','kinematic','free fall','speed']),
  (6,['orbit','gravitation','"g"','escape','satellite','kepler']),
  (8,['thermodynamic','cp and cv','isothermal','adiabatic','carnot','heat engine','entropy']),
  (7,['calorimetry','thermal expansion','heat transfer','conduction','fluid','viscos','surface tension','bernoulli','elastic','young']),
  (5,['torque','moment of inertia','rolling','rotational','angular','centre of mass','center of mass','rigid body']),
  (3,['vertical circular','circular motion','friction','newton','pulley','banking']),
  (10,['shm','simple harmonic','pendulum']),(11,['capacitor','electric','charge'])],
 'Chemistry':[(20,['salt analysis','qualitative analysis','titration']),(13,['quantitative analysis','chromatograph','distillation','crystallis','sublimation','lassaigne']),
  (16,['alkyl','aryl halide','haloalkane','haloarene','halide']),(17,['alcohol','phenol','ether','carbonyl','aldehyde','ketone','carboxylic']),
  (18,['amine','diazonium']),(19,['carbohydrate','protein','amino acid','vitamin','nucleic']),(11,['transition','d-block','f-block','lanthan','actin']),
  (4,['entropy','spontaneity','enthalpy','gibbs']),(15,['alkane','alkene','alkyne'])]}

zf=zipfile.ZipFile(ZIP);raw=[]
for n in zf.namelist():
    if n.startswith('qbank/') and n.endswith('.json') and not n.endswith(('index.json','papers_map.json')):
        raw+=json.loads(zf.read(n))
norm=lambda s:re.sub(r'\W+','',s.lower())
first={}
def numeric(v):
    v=str(v).strip()
    try:
        f=float(v);return str(int(f)) if f==int(f) else repr(f)
    except Exception:return v
DIFF={'Easy':0,'Medium':1,'Hard':2};TT={'Easy':70,'Medium':110,'Hard':180}
clean=[]
for q in raw:
    s=q['subject'];name=q['chapter']
    if name=='unmapped' or (s,name) not in lookup:
        cn,cname=None,None
    else:cn,cname=lookup[(s,name)]
    flags=[]
    if cn is None:flags.append('no_chapter')
    num=q['type']=='NUMERIC'
    opts=[(o.get('text') or '').strip() for o in q['options']]
    ans=q['correct_answer'];ca=(ans.get('option_label') if not num else numeric(ans.get('value',''))) if ans else None
    if q['type']=='PARA':flags.append('para')
    if not ca:flags.append('no_answer')
    if not num and (len(opts)!=4 or any(not o for o in opts)):flags.append('empty_option')
    if (q['marks_if_correct'],q['marks_if_wrong'])!=(4,-1):flags.append('odd_marks_fixed')
    if not q['solution_text'] and not q['solution_images']:flags.append('no_solution')
    elif not q['solution_text']:flags.append('solution_is_image')
    if not any(t.upper().startswith('JEE_MAIN') for t in q['exam_tags']):flags.append('not_jee_main_tag')
    if (s,name) in CATCHALL and not any(k in (q['sub_topic'] or '').lower() for k in CATCHALL[(s,name)]):flags.append('chapter_suspect')
    if 'chapter_suspect' in flags:
        st=(q['sub_topic'] or '').lower()
        for tgt,keys in REHOME.get(s,[]):
            if any(k in st for k in keys):
                cn,cname=[(n,nm) for n,nm in jee[s] if n==tgt][0];flags.remove('chapter_suspect');flags.append('rehomed');break
    k=norm(q['question_text'])
    if len(k)>25 and not q['question_images']:
        if k in first:flags.append('duplicate')
        else:first[k]=q['master_bank_id']
    clean.append({'id':q['master_bank_id'],'subject':s,'chapter_no':cn,'chapter':cname,'bank_chapter':name,'sub_topic':q['sub_topic'],'type':'num' if num else 'sc',
      'q':q['question_text'],'o':[] if num else opts,'a':ca,'mc':4,'mw':0 if num else -1,'d':q['difficulty']['estimated'],'d_src':q['difficulty']['source'],
      'tt':TT[q['difficulty']['estimated']]+(20 if num else 0),'s':q['solution_text'] or '','q_img':q['question_images'],'s_img':q['solution_images'],
      'tags':q['exam_tags'],'paper':q['paper_title'],'flags':flags,'_sl':len(q['solution_text'] or '')})
# provisional Level 1-5: rank each chapter's questions by difficulty (then solution length, numerical last) and split into five equal bands
by=collections.defaultdict(list)
for c in clean:by[(c['subject'],c['chapter_no'])].append(c)
for k,v in by.items():
    v.sort(key=lambda c:(DIFF[c['d']],c['_sl']+(400 if c['type']=='num' else 0)))
    for i,c in enumerate(v):c['level']=min(5,1+i*5//len(v))
BLOCK={'no_chapter','para','no_answer','empty_option','duplicate'}
for c in clean:
    c['usable']=not (set(c['flags'])&BLOCK);del c['_sl']
for s in MAP:
    json.dump([c for c in clean if c['subject']==s],open(f'{OUT}/{s}.json','w'),ensure_ascii=False,indent=0)

# ---- chapter readiness (one row per JEE Main chapter) ----
rows=[]
for s in MAP:
    for no,name in jee[s]:
        v=[c for c in clean if c['subject']==s and c['chapter_no']==no]
        u=[c for c in v if c['usable']];j=[c for c in u if 'not_jee_main_tag' not in c['flags']]
        good=[c for c in j if 'chapter_suspect' not in c['flags']]
        L=collections.Counter(c['level'] for c in good)
        rows.append([s,no,name,len(v),len(u),len(good),*[L[i] for i in range(1,6)],sum('no_solution' in c['flags'] for c in good),sum(bool(c['q_img']) for c in good),sum(c['type']=='num' for c in good)])
hdr=['Subject','Ch','Chapter','In bank','Usable','Usable + JEE Main tag + right chapter','L1','L2','L3','L4','L5','No solution','Has image','Numerical']
def status(n):return 'Ready (60+)' if n>=60 else 'Thin (30-59)' if n>=30 else 'Short (10-29)' if n>=10 else 'Almost empty (<10)'
wb=openpyxl.Workbook();ws=wb.active;ws.title='Chapters';ws.append(hdr+['Status','Short by (to 100)'])
for r in rows:ws.append(r+[status(r[5]),max(0,100-r[5])])
for col,w in zip('ABCDEFGHIJKLMNOP',[10,5,48,9,8,22,6,6,6,6,6,11,10,10,18,14]):ws.column_dimensions[col].width=w
ws.freeze_panes='D2'
wb.save(f'{OUT}/chapter_readiness.xlsx')
st=collections.Counter(status(r[5]) for r in rows)
F=collections.Counter(f for c in clean for f in c['flags'])
rep=['# Question bank report','',f'Source: qbank_chapterwise.zip, {len(raw)} questions. Clean copy: `content/bank/<Subject>.json`. Chapter table: `chapter_readiness.xlsx`.','',
 '## Chapters ready for a live chapter test','',
 '"Good" = no blocking problem, tagged for JEE Main, and not a suspected wrong-chapter question.','']
for s in MAP:
    rr=[r for r in rows if r[0]==s];rep.append(f"- **{s}**: {sum(r[5]>=60 for r in rr)} of {len(rr)} chapters have 60+ good questions; {sum(r[5]<30 for r in rr)} have fewer than 30; {sum(r[5] for r in rr)} good questions in total.")
rep+=['',f"All 54 chapters: {dict(st)}",'','## Problems found (one question can have several)','']
rep+=[f'- `{k}`: {v}' for k,v in F.most_common()]
rep+=['','Blocking (not usable in a test until fixed): '+', '.join(sorted(BLOCK))+'.','','## Levels','','Levels 1-5 are provisional: inside each chapter the questions are ranked by difficulty and split into five equal bands, so every chapter has all five levels. Real difficulty should replace this once students have taken tests.']
open(f'{OUT}/REPORT.md','w').write('\n'.join(rep)+'\n')
print(len(clean),'questions;',dict(st));print(dict(F))
