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
json.dump(out,open(ROOT+'/content/jee_main_maths_ch07.json','w'),ensure_ascii=False,indent=1)
dp=HERE+'/data.json';D=json.load(open(dp))
have={q['id'] for q in D['Q']}
add=[q for q in out if q['t'] is not None and q['id'] not in have]
D['Q'].extend(add)
json.dump(D,open(dp,'w'),ensure_ascii=False)
print(len(out),'converted;',len(add),'added to the demo;',len(out)-sum(q['t'] is not None for q in out),'held back')
