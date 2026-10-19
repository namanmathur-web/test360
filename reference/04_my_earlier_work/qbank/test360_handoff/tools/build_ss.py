import json,re
H=open('stripped.html',encoding='utf8').read()
G=json.load(open('gen_out.json'))
blobs=json.load(open('blobs.json'))
def must(s,old,new,count=None):
    n=s.count(old)
    assert n>=1,('missing',old[:70])
    if count: assert n==count,('count',old[:60],n)
    return s.replace(old,new)
# 1. data region
a=H.index('var TOPICS={');b=H.index('var SCREENS=')
data=G['data']+'var LIFE=%s,TMIN=%d;\n'%(json.dumps(G['life']),G['TMIN'])
pre,post=H[:a],H[b:]
# LV block
m=re.search(r'var LV=\[.*?\n\];\n',post,re.S);assert m
post=post[:m.start()]+G['lv']+post[m.end():]
# 2. revision view
a2=post.index('/* ---- revision toolkit ---- */');b2=post.index('/* ---- level challenge ---- */')
post=post[:a2]+open('rev_js.js').read()+post[b2:]
post=must(post,'    case "fcflip":',open('rev_cases.js').read()+'    case "fcflip":',1)
# 3. text/count replacements (outside data region)
def fix(s):
    R=[('Six questions, no login','Twelve questions, no login'),('Six questions, 15 minutes','Twelve questions, 25 minutes'),
     ('See where you stand in 15 minutes','See where you stand in 25 minutes'),('Take the 15-minute diagnostic','Take the 25-minute diagnostic'),
     ('Six questions on the highest-weight','Twelve questions on the highest-weight'),('Six questions on Limits','Twelve questions on Limits'),
     ('Take all six questions','Take all twelve questions'),('6-question','12-question'),
     ('Three harder questions','Four harder questions'),('[null,null,null]','[null,null,null,null]'),
     ("/24</b>","/'+MAXM+'</b>"),(" of 6</b>"," of '+NQ+'</b>"),(" of 24 · "," of '+MAXM+' · "),(" of 6 right"," of '+NQ+' right"),
     ("<small>/24</small>","<small>/'+MAXM+'</small>"),("Based on 6 questions","Based on '+NQ+' questions"),
     ("/6*100","/NQ*100"),('<div class="v">6</div>',"<div class=\"v\">'+NQ+'</div>"),('ring(A.score,24,"MARKS")','ring(A.score,MAXM,"MARKS")'),
     ('"Marks: 24 · Time: 15:00"','"Marks: "+MAXM+" · Time: "+mmss(TSEC)'),("Marks: 24 · Time: 15:00</div>","Marks: '+MAXM+' · Time: '+mmss(TSEC)+'</div>"),
     ("' / 15 mins","' / '+TMIN+' mins"),("49:30","'+LIFE+'"),("49 minute lesson","'+LIFE+' lesson"),
    ("Correct answer: '+q.o[q.a]+'.</div>'+why+'</div>';","Correct answer: '+q.o[q.a]+'.</div>'+why+'<div class=\"why sol\"><b>Solution.</b> '+q.sol+'</div></div>';"),
     ("₹100","₹99"),("₹6,000","₹2,999"),
     ("A.score>=16","A.score>=Math.round(.67*MAXM)"),("A.score>=6","A.score>=Math.round(.25*MAXM)"),("A.s>=3","A.s>=NQ/2"),("A.w>=3","A.w>=NQ/2"),
     ("S.test.ans=[3,null,1,0,2,null]","S.test.ans="+G['fill']),
     ("' of 3 right","' of '+LV.length+' right"),("sc===3","sc===LV.length"),("All three right","All right"),
    ]
    for o,n in R:
        assert o in s,('missing',o)
        s=s.replace(o,n)
    s=re.sub(r'\b900\b','TSEC',s)
    return s
W=fix(pre+'@@DATA@@'+post)
H2=W.replace('@@DATA@@',data)
# 4. css / katex / meta / observer
kcss=open('../app/katex.css').read();kjs=open('../app/katex.js').read();ajs=open('../app/auto.js').read()
css=open('rev.css').read()
H2=H2.replace('</style>',css+'\n</style>',1)
H2='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<style>'+kcss+'</style>\n'+H2
obs="""<script>"""+kjs+"""</script><script>"""+ajs+"""</script><script>
(function(){var r=document.getElementById('root');if(!r)return;var t,mo;function run(){if(!window.renderMathInElement)return;try{renderMathInElement(r,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})}catch(e){}if(mo)mo.takeRecords()}
mo=new MutationObserver(function(){clearTimeout(t);t=setTimeout(run,0)});mo.observe(r,{childList:true,subtree:true});run();})();
</script>"""
# put after main script end (last </script>)
i=H2.rindex('</script>')+len('</script>')
H2=H2[:i]+'\n'+obs+H2[i:]
# 5. restore blobs
def rb(m): return blobs[int(m.group(1))]
H2=re.sub(r'@@B(\d+)@@',rb,H2)
open('/home/claude/Vedantu_Self_Study_Platform_Limits.html','w',encoding='utf8').write(H2)
print(len(H2))
