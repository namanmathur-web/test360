/* ===== Screens 1–20: landing, onboarding, home, chapter, notes, build-your-test ===== */
const R={};
function landHead(){return `<div class="top"><div class="logo"><i>Vedantu</i> Test360</div><div class="sp"></div><div class="nav"><a onclick="go(2)">Results</a><a onclick="go(3)">VedAI</a><a onclick="go(6)">Plans</a><a onclick="go(7)">FAQ</a></div></div>`}
function landing(){
 const ch=s=>CHAPTERS[s];const all=[...ch('Physics').slice(0,4),...ch('Chemistry').slice(0,3),...ch('Maths').slice(0,3)];
 const faqs=[['Can I try before paying?','Yes. Every chapter starts with a free test and a VedAI summary. No card, no sign-up.'],
  [`What is the difference between the ${rs(PRICE.pack)} pack and the series?`,`The pack opens everything for one chapter. The series opens all ${PRICE.chapters} chapters, with the full VedAI report on every test.`],
  ['In which languages are the tests?','Tests are in English, as in the JEE Main paper.'],
  ['When do tests open?','Now. Every chapter and all 5 levels are open, with no daily cap.'],
  ['Is there a refund?','[Refund policy to be confirmed before launch.]'],
  ['What is VedAI and does it cost extra?','VedAI reads your test like a teacher would and tells you which topics cost you marks. The summary is free with every test.']];
 return `<div class="scr">${landHead()}<div class="scroll land" id="sc">
 <section id="s1"><div class="eyebrow">Free chapter test · JEE Main · ${PRICE.chapters} chapters</div>
  <h2 class="h">Fix JEE Main one chapter at a time.</h2><p class="mut">Every chapter starts with a free test. VedAI then shows exactly which topics cost you marks and what to fix next.</p>
  <img class="hero-img" src="${IMG.hero}" alt="Student planning her JEE prep">
  <div class="card"><div class="row"><div class="logo" style="font-size:13px"><i>Vedantu</i> Test360</div><div class="sp"></div><span class="sample">Sample report</span></div>
   <h3 class="h" style="font-size:19px;margin-top:8px">Limits · Topic Test 1 (JEE Main)</h3><div class="xs mut">Marks: 24 · Time: 15:00</div>
   <div class="utabs" style="padding:0;margin-top:6px"><button class="on">Performance</button><button>Answers</button></div>
   <div class="score" style="--p:25;margin-top:10px;padding:12px"><div class="row"><div class="sp"><div class="xs" style="opacity:.8">Hello there,</div><b style="font-size:17px">Keep improving!</b></div><div class="dial" style="--p:25;width:64px;height:64px"><div style="width:52px;height:52px"><b style="font-size:19px">6</b><small>of 24</small></div></div></div></div></div>
  <div class="card" style="margin-top:10px;background:#FFF7F2;border-color:#FFD3B8;font-weight:700;font-size:12.5px">2200+ Vedantu students qualified for JEE Advanced 2026</div>
  <div class="stack" style="margin-top:12px"><button class="btn" onclick="go(8)">Take a free chapter test</button><button class="btn2" onclick="go(6)">See the ${rs(PRICE.series)} series</button></div></section>
 <section id="s2"><div class="eyebrow">Results 2026</div><h2 class="h">Our students deliver. Every year.</h2>
  <img class="hero-img" src="${IMG.results}" alt="Vedantu JEE Main 2026 results">
  <div class="g2"><div class="stat"><b>27</b><span class="xs mut">ranks in top 1000</span></div><div class="stat"><b>2200+</b><span class="xs mut">JEE Advanced qualifiers</span></div><div class="stat"><b>${PRICE.chapters}</b><span class="xs mut">JEE Main chapters, each with a free test</span></div><div class="stat"><b>93</b><span class="xs mut">topic tests across Physics, Chemistry and Maths</span></div></div>
  <button class="btn" style="margin-top:12px" onclick="go(8)">Take a free chapter test</button></section>
 <section id="s3"><div class="eyebrow">Only on Test360 · VedAI</div><h2 class="h">Every test comes back with a tutor's read.</h2>
  <p class="mut sm">VedAI reads your chapter test the way a teacher would, finds the topics that cost you marks, and answers questions about your own paper.</p>
  <div class="stack" style="margin-top:10px">${[['Your score, instantly','Marks, accuracy, attempts and time per question, the moment you submit.'],['Ved ScoreBooster','The quickest marks to win back.'],['Easy Kill Topics','High-weight topics you missed, each with a Start button for the lesson.'],['Ask Ved','"Why did I lose marks in Chemistry?" Answered from your own test.']].map((x,i)=>`<div class="card step"><b style="background:var(--ved)">${i+1}</b><div><b>${x[0]}</b><div class="xs mut">${x[1]}</div></div></div>`).join('')}</div>
  <button class="btn" style="margin-top:12px" onclick="go(8)">Take a free chapter test and see your VedAI report</button></section>
 <section id="s4"><div class="eyebrow">Chapter-wise tests</div><h2 class="h">${PRICE.chapters} chapters. Every one starts free.</h2>
  <p class="mut sm">Take the free test in any chapter. Unlock that chapter's pack for ${rs(PRICE.pack)}, or all ${PRICE.chapters} with the series.</p>
  <div class="tabs" style="margin:10px 0"><button class="on">All · ${PRICE.chapters}</button><button>Phy · 20</button><button>Chem · 20</button><button>Maths · 14</button></div>
  <div class="stack" style="gap:6px">${all.map(c=>`<div class="card row" style="padding:9px 12px"><b class="sm sp">${c}</b><span class="tag">Free test</span></div>`).join('')}</div>
  <div class="xs mut" style="margin-top:6px">Chapter list is sample data: confirm the final ${PRICE.chapters}.</div></section>
 <section id="s5"><div class="eyebrow">What happens after every test</div><h2 class="h">The test is where the work starts.</h2>
  <div class="stack">${[['Take the chapter test','Timed, in the JEE Main pattern.'],['See what cost you marks','Topic by topic, with the reason.'],['Learn it from a teacher','A Vedantu lesson for that exact topic.'],['Retest and see the gain','Compare with your last attempt.']].map((x,i)=>`<div class="step"><b>${i+1}</b><div><b class="sm">${x[0]}</b><div class="xs mut">${x[1]}</div></div></div>`).join('')}</div>
  <h3 class="h" style="margin:16px 0 8px">A score is not a plan.</h3>
  <table class="cmp"><tr><th></th><th>Typical series</th><th>Test360</th></tr>${[['Organised by chapter','Mixed papers','Every chapter'],['Free test before you pay','Rare','Every chapter'],['Marks lost, by topic','Score only','Every test'],['AI reads your paper','No','VedAI'],['Lesson for weak topic','Separate course','Built in'],['Retest after the fix','Next paper','Same chapter']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></section>
 <section id="s6"><div class="eyebrow">Plans</div><h2 class="h">Pay only for what you need.</h2><div class="stack">
  <div class="plan"><div class="eyebrow">Start</div><b>Free chapter test · ₹0</b><div class="xs mut" style="margin:4px 0 10px">One test in every chapter · Score and marks lost by topic · VedAI summary · Retest after you fix a topic</div><button class="btn2" onclick="go(8)">Take a free test</button></div>
  <div class="plan hl"><div class="eyebrow">One chapter</div><b>Chapter pack · ${rs(PRICE.pack)} per chapter</b><div class="xs mut" style="margin:4px 0 10px">All tests in the chapter you pick · Mistake notebook for every wrong answer · Full VedAI report on each test · Retest after every fix</div><button class="btn2" onclick="go(10)">Pick a chapter</button></div>
  <div class="plan dk"><div class="eyebrow" style="color:#FF9C72">Best value · whole syllabus</div><b>JEE Main series · ${rs(PRICE.series)} one time</b><div class="xs" style="margin:4px 0 10px;opacity:.8">All ${PRICE.chapters} chapters unlocked · 93 topic tests · Full VedAI: ScoreBooster, Easy Kill Topics, Ask Ved · Retest after every fix</div><button class="btn" onclick="A.checkout('series')">Buy the series</button></div></div></section>
 <section id="s7"><h2 class="h">Questions students ask</h2><div class="stack">${faqs.map((f,i)=>`<div class="faq" onclick="this.classList.toggle('open')"><div class="row"><span class="sp">${f[0]}</span><b>+</b></div><div class="a">${f[1]}</div></div>`).join('')}</div>
  <div class="card" style="background:var(--navy);color:#fff;margin-top:14px;padding:16px;border:0"><h3 class="h" style="font-size:19px">Start with one free chapter test.</h3><p class="xs" style="opacity:.8;margin:4px 0 12px">See where you stand in 15 minutes, with your own VedAI report. No payment.</p><button class="btn" onclick="go(8)">Take a free chapter test</button></div>
  <p class="xs mut" style="text-align:center;margin-top:10px">Vedantu Test360 · Test. Analyse. Improve.</p></section>
 </div></div>`}
for(let i=1;i<=7;i++)R[i]=landing;

/* onboarding */
const OB=[['Which grade are you in?',['10','11','12','Dropper']],['When is your JEE Main?',['January 2027','April 2027','2028']],['Which subject feels hardest?',['Physics','Chemistry','Maths']],['How would you like to learn?',['English']]];
function onboard(step){const [q,opts]=OB[step];const val=S.ob[step];
 const grid=step===0?'g2':'stack';
 return {base:landing(),center:`<div class="pad"><div class="xs mut" style="font-weight:700">Question ${step+1} of 4</div><div class="bar" style="height:4px;margin:6px 0 12px"><i style="width:${(step+1)*25}%;background:var(--navy)"></i></div>
 <h3 class="h" style="margin-bottom:12px">${q}</h3><div class="${grid}" style="gap:8px">${opts.map(o=>`<button class="opt ${val===o?'on':''}" style="${step===0?'text-align:center':''}" onclick="A.ob(${step},'${o}')">${o}${step===3?'<small>Questions, solutions and VedAI in English, as in the JEE Main paper</small>':''}</button>`).join('')}</div>
 <button class="btn" style="margin-top:14px" ${val?'':'disabled'} onclick="A.obNext(${step})">Continue</button></div>`}}
R[8]=()=>onboard(S.obStep>=3?0:S.obStep);
R[9]=()=>onboard(3);

/* home */
function home(subj){S.subj=subj;const list=CHAPTERS[subj];const last=S.attempts.length?S.attempts[S.attempts.length-1]:null;const ct=last?last.topics[0]:0;
 return `<div class="scr">${hdr('Vedantu Test360','Free JEE Main tests',null)}<div class="scroll"><div class="pad stack">
 <div class="tabs">${['Physics','Chemistry','Maths'].map(s=>`<button class="${s===subj?'on':''}" onclick="go(${s==='Maths'?10:s==='Physics'?12:13})">${s}</button>`).join('')}</div>
 ${subj==='Maths'?`<button class="card row" style="text-align:left;padding:14px;border:1.5px solid #FFC2A6" onclick="A.openTopic(${ct})">${ring(chapPct())}<div class="sp"><div class="eyebrow" style="color:var(--mut)">Continue practising</div><b style="font-size:16px">${T[ct].name}</b><div class="xs mut">Limits, Continuity &amp; Diff. · Level ${Math.min(5,S.lvl[ct]+1)}</div></div><b style="color:var(--org);font-size:20px">›</b></button>`:''}
 <div class="eyebrow" style="color:var(--mut)">All ${subj.toLowerCase()} chapters</div>
 ${list.map((c,i)=>{const isL=subj==='Maths'&&i===0;const p=isL?chapPct():0;const nt=(CH_TOPICS[subj]||[])[i]||[5,6,4,5][i%4];
  return `<button class="chap" onclick="${isL?'go(14)':`A.other(${i})`}"><div class="row"><b class="sp">${c}</b><span class="pct">${p}%</span></div><div class="xs mut" style="margin:2px 0 7px">${nt} topics · 5 levels · free</div><div class="bar" style="height:5px"><i style="width:${p}%"></i></div></button>`}).join('')}
 </div></div>${bnav('Home')}</div>`}
R[10]=()=>home('Maths');R[12]=()=>home('Physics');R[13]=()=>home('Chemistry');
R[11]=()=>({base:home('Maths'),sheet:`<div class="grab"></div><div class="pad"><h3 class="h">Which exam are you preparing for?</h3><p class="xs mut" style="margin:3px 0 12px">We will show the right free tests.</p>
 <div class="row" style="flex-wrap:wrap;gap:8px">${['JEE Main','BITSAT','NDA','NEET','Boards','Other'].map(e=>`<button class="opt ${S.exam===e?'on':''}" style="width:auto;padding:8px 14px" onclick="S.exam='${e}';render()">${e}</button>`).join('')}</div>
 <button class="btn" style="margin-top:16px" onclick="A.examGo()">Continue →</button></div>`});

/* chapter page — mind map */
function chapter(openT){const p=chapPct();return `<div class="scr">${hdr('Limits, Continuity and Differentiability','JEE Maths · Calculus',10)}
 <div style="background:#fff;padding:9px 14px;border-bottom:1px solid #E4E8F4;flex:none"><div class="row xs mut"><span class="sp">Chapter progress</span><b style="color:var(--acc)">${p}%</b></div><div class="bar" style="margin-top:5px"><i style="width:${p}%"></i></div></div>
 <div class="scroll"><div class="pad stack">
 ${openT<0?`<div class="card" style="border-left:4px solid var(--org)"><div class="eyebrow">Chapter in one line</div><b class="sm">A limit tells you what a function approaches; continuity and the derivative are built on it.</b></div>`:''}
 <div class="path">${T.map((t,i)=>{const o=i===openT;return `<div class="node ${o?'open':''}" onclick="${o?'':`A.zoom(${i})`}"><div class="row"><b class="sp sm">${i+1}. ${t.name}</b><span class="xs mut">${o?'':'⌄'}</span></div>
  ${o?`<div class="xs mut" style="margin:4px 0 6px">${t.line}</div><div>${t.sections.map(s=>`<span class="schip">${s.no.replace(/^1\./,(i+1)+'.')}</span>`).join('')}</div>
   <div class="row xs mut" style="margin:10px 0 4px"><span class="sp">Your level</span><b>${S.lvl[i]} of 5</b></div>${ladder(S.lvl[i])}
   <div class="g2" style="margin-top:10px"><button class="btn sm" style="width:100%" onclick="event.stopPropagation();A.openTopic(${i})">Read summary</button><button class="btn2 sm" style="width:100%" onclick="event.stopPropagation();A.lesson(${i})">Lesson + try one</button></div>
   <button class="link" style="display:block;margin:8px auto 0" onclick="event.stopPropagation();A.zoom(-1)">‹ Back to map</button>`
  :`<div class="xs mut" style="margin:2px 0 6px">Tap to zoom in · 5 levels</div>${ladder(S.lvl[i])}`}</div>`}).join('')}
 <div class="node" style="border-style:dashed;background:#FFF9F5"><b class="sm">Chapter complete</b><div class="xs mut">All 6 topics at Level 5 earns the title <b>Limit Master</b>.</div></div></div>
 </div></div>
 <div class="foot"><button class="btn" onclick="A.buildFrom(${openT<0?-1:openT})">Next: test yourself →</button><div class="row xs"><a class="link" onclick="go(57)">My progress</a><span class="sp"></span><a class="link" onclick="go(60)">Syllabus map</a></div></div></div>`}
R[14]=()=>chapter(-1);R[15]=()=>chapter(S.open<0?0:S.open);

/* topic summary — notes design */
function summary(full){const ti=S.sumTopic;const t=T[ti];
 return `<div class="scr">${hdr('Test360 Notes',`Limits · ${t.name}`,14)}<div class="scroll"><div class="notes"><div class="in">
 <div class="cap">Limits, Continuity &amp; Differentiability</div><h1>${t.name}</h1><p>${t.line}</p>
 <div class="plum"><div class="eyebrow">By the end you can</div><ul>${CAN[ti].map(c=>`<li>${c}</li>`).join('')}</ul></div>
 <p style="font-size:12.5px;font-style:italic;color:#7A6A50;line-height:20px">Tap a section for the short version. Tap <b>Full detail</b>, or double-tap, for the formula and the usual slip.</p>
 ${t.sections.map((s,k)=>{const key=ti+'-'+k;const open=S.sumOpen[key];const fl=S.sumFull[key]||(full&&k===0);
  return `<div class="ncard" ondblclick="A.full('${key}')"><button class="hd" onclick="A.sec('${key}')"><b class="no">${ti+1}.${k+1}</b><span>${esc(s.ti)}</span><b style="color:var(--mut)">${open||fl?'⌃':'⌄'}</b></button>
  ${open||fl?`<div class="bd"><div>${esc(s.tx)}</div>
   ${fl?`<div class="fbox"><small>FORMULA</small>${s.f.map(x=>`<div>${x}</div>`).join('')}</div>${s.slip?`<div class="sticky"><b>Usual slip:</b> ${esc(s.slip)}</div>`:''}
    <div class="row" style="gap:6px;margin-top:8px;font-family:'Plus Jakarta Sans'">${S.got[key]?`<span class="tag">✓ Got it · +5 XP</span>`:`<button class="tag" style="padding:5px 10px" onclick="A.got('${key}')">✓ Got it · +5 XP</button>`}<button class="tag o" style="padding:5px 10px" onclick="toast('Saved to review later')">Review later</button></div>`
   :`<button class="link" style="font-family:'Plus Jakarta Sans';margin-top:6px" onclick="A.full('${key}')">Full detail →</button>`}</div>`:''}</div>`}).join('')}
 ${S.attempts.length?`<div class="ved" style="margin-top:12px;font-family:'Plus Jakarta Sans'"><span class="vt">Ved AI</span><div class="sm" style="margin-top:6px"><b>Your pattern here</b><div class="xs mut">${A.patternLine(ti)}</div></div></div>`:''}
 <div class="card" style="margin-top:12px;font-family:'Plus Jakarta Sans';background:#FFFDF6"><b class="sm">Want these notes in full?</b><div class="xs mut">All ${t.nsec} sections, with solved examples.</div><button class="link" onclick="go(19)">See notes and book</button></div>
 </div></div></div><div class="foot"><button class="btn" onclick="A.buildFrom(${ti})">Pick level &amp; take the test →</button></div></div>`}
R[16]=()=>{if(R16reset){S.sumOpen={};S.sumFull={};S.sumOpen[S.sumTopic+'-0']=1;R16reset=false}return summary(false)};let R16reset=false;
R[17]=()=>{if(R16reset){S.sumOpen={};S.sumFull={};R16reset=false}const k=S.sumTopic+'-0';S.sumOpen[k]=1;S.sumFull[k]=1;return summary(false)};

/* topic page — lesson clip + try one */
function lesson(){const ti=S.sumTopic;const t=T[ti];const q=Q.find(x=>x.t===ti&&x.ty==='sc'&&x.d==='easy')||Q.find(x=>x.t===ti&&x.ty==='sc');const pickd=S.tryOne;
 const slip=(t.sections.find(s=>s.slip)||{}).slip||'';
 return `<div class="scr">${hdr(t.name,`Topic ${ti+1} of 6`,15)}<div class="scroll"><div class="pad stack">
 <div style="background:linear-gradient(135deg,#141B4D,#2A3280);border-radius:14px;padding:14px;color:#fff;height:170px;display:flex;flex-direction:column">
  <b style="font-size:20px;letter-spacing:.5px">LIMITS</b><span class="xs" style="opacity:.8">Complete chapter · JEE Main 2027</span>
  <div style="flex:1;display:grid;place-items:center"><div style="width:46px;height:34px;border-radius:9px;background:#FF3B30;display:grid;place-items:center;font-size:15px">▶</div></div>
  <div class="row xs" style="opacity:.85"><span class="sp">${CLIPS[ti][0]}</span><span>Clip ${CLIPS[ti][0]} to ${CLIPS[ti][1]}</span></div></div>
 <div class="xs mut" style="margin-top:-4px">Teacher lesson clip: placeholder. Link the real lecture and its minute range.</div>
 <div class="card" style="border-left:4px solid var(--org)"><div class="eyebrow">The idea</div><b class="sm">${IDEA[ti]}</b></div>
 <div class="card" style="border:1.5px solid var(--navy)"><b class="sm">Try one</b><div class="qtext" style="font-size:14px;margin:6px 0 10px">${q.q}</div>
  ${q.o.map((o,k)=>{const L='abcd'[k];let c='';if(pickd){if(L===q.a)c='ok';else if(L===pickd)c='bad'}return `<button class="optn ${c}" onclick="A.tryOne('${L}')"><b style="width:22px;height:22px;border-radius:50%;border:1.5px solid #AEB8D6;display:grid;place-items:center;font-size:11px;flex:none">${L.toUpperCase()}</b><span>${o}</span></button>`}).join('')}
  ${pickd?`<div class="sm" style="margin-top:4px"><b style="color:${pickd===q.a?'var(--grn)':'var(--red)'}">${pickd===q.a?'Correct.':'Not quite.'}</b> ${esc(q.s)}</div>`:''}</div>
 <div class="card" style="background:#FFF7F2;border-color:#FFD3B8"><div class="eyebrow">Mistakes students make here</div><div class="sm" style="margin-top:4px">• ${esc(slip)}</div></div>
 </div></div><div class="foot"><button class="btn" onclick="A.buildFrom(${ti})">Test me on this topic →</button></div></div>`}
R[18]=lesson;

R[19]=()=>({base:summary(false),sheet:`<div class="grab"></div><div class="pad stack"><h3 class="h">Learn these sections properly</h3><p class="xs mut" style="margin-top:-6px">Full notes for what you got wrong.</p>
 <div class="pk row"><div class="sp"><b class="sm">Chapter notes</b><div class="xs mut">Limits only</div></div><b style="font-size:18px">₹ --</b></div>
 <div class="pk dk row" style="flex-direction:row"><div class="sp"><b class="sm">Full-year chapter notes + digital textbook</b><div class="xs" style="opacity:.7">All chapters</div></div><b style="font-size:18px">₹ --</b></div>
 <div class="xs mut">Notes and textbook prices are not decided yet.</div>
 <button class="btn" onclick="toast('Demo: notes checkout is not built until the price is set')">Get the chapter notes · ₹ --</button><button class="link" style="margin:0 auto" onclick="closeOv()">Not now</button></div>`});

/* build your test */
R[20]=()=>{const b=S.build;const sel=b.topics.map((x,i)=>x?i:-1).filter(i=>i>=0);const n=sel.reduce((a,i)=>a+Math.min(b.n[i],avail(i)),0);
 const mins=Math.max(5,Math.ceil(sel.reduce((a,i)=>a+pickTime(i,Math.min(b.n[i],avail(i)),b.level),0)/60));const mult=LEVELS[b.level-1][1];
 return `<div class="scr">${hdr('Test yourself','Limits, Continuity and Differentiability',14)}<div class="scroll"><div class="pad stack">
 <div class="row"><b class="sm sp">Choose topics</b><button class="link" onclick="A.clearTopics()">Clear all</button></div>
 ${T.map((t,i)=>`<div class="card row" style="padding:10px 12px"><button class="cb ${b.topics[i]?'on':''}" onclick="A.tgl(${i})">${b.topics[i]?'✓':''}</button><div class="sp" onclick="A.tgl(${i})"><b class="sm">${t.name}</b><div class="xs mut">${avail(i)} questions in the bank${Q.some(q=>q.t===i&&q.src==='sample')?' · sample questions':''}</div></div>
  <div class="stepper"><button onclick="A.step(${i},-1)">−</button><b>${b.n[i]}</b><button onclick="A.step(${i},1)">+</button></div></div>`).join('')}
 <b class="sm" style="margin-top:6px">Level <span class="mut xs">(all open)</span></b>
 <div class="lv">${LEVELS.map((l,i)=>`<button class="lv${i+1} ${b.level===i+1?'on':''}" onclick="S.build.level=${i+1};render()">${i+1}<small>${l[0]}</small></button>`).join('')}</div>
 <div class="xs mut">Higher level = more XP: ${LEVELS.map((l,i)=>`L${i+1} ${l[1]}×`).join(' · ')}</div>
 <div class="xs" style="background:#FFF8DB;border-radius:8px;padding:7px 9px;color:#6B5400">Honest note: the bank is tagged easy / medium / hard, not Level 1–5, so levels re-order questions by difficulty for now.</div>
 </div></div><div class="foot"><div class="row xs mut"><span class="sp">${sel.length} topics · ${n} questions</span><span>about ${mins} minutes · +${Math.round(n*10*mult)} XP (${mult}×)</span></div>
 <button class="btn" ${n?'':'disabled'} onclick="A.startBuild()">Start test · ${n} questions · ${mins} min</button></div></div>`};
function pickTime(t,n,level){return pick(t,n,level,(S.attempts.length+1)*7919).reduce((a,q)=>a+q.tt,0)}
