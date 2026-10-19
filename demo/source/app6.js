/* ===== v3: progress model (chapter grid, milestones, badges), per-topic levels, real streak, personal Home ===== */

/* ---- progress model: a chapter is 6 topics x 5 levels = 30 cells; a cell fills when that level is cleared (60%+) ---- */
const cellsN=()=>S.lvl.reduce((a,b)=>a+b,0);
const lvOfAtt=(a,t)=>(a.levels&&a.levels[t])||a.level;
/* the level a topic remembers: one above the last cleared level, or the same level again if the last try fell short */
function recLevel(t){const r=S.lastRes[t];if(!r)return Math.min(5,S.lvl[t]+1);return r.ok/r.n>=0.6?Math.min(5,r.lv+1):r.lv}
function nextLv(g){const w=g.weak&&g.weak[0];return recLevel(w?w.t:g.a.topics[0])}
const levelOf=i=>(S.build.lv&&S.build.lv[i])||recLevel(i);
function buildLevels(){const o={};T.forEach((_,i)=>o[i]=levelOf(i));return o}
const cellsFor=ts=>ts.reduce((s,t)=>s+Math.max(0,recLevel(t)-S.lvl[t]),0);

const MILESTONES=[[25,'Foundation set','A quarter of the chapter cleared'],[50,'Halfway there','Half of the chapter cleared'],[75,'Exam-ready zone','Three quarters cleared'],[90,'Final stretch','Only a few cells left'],[100,'Chapter cleared','Every topic cleared at Level 5']];
const msCells=p=>Math.ceil(p*30/100);
function nextMilestone(c=cellsN()){const m=MILESTONES.find(x=>c<msCells(x[0]));return m?{p:m[0],name:m[1],need:msCells(m[0])-c}:null}
const cellWord=n=>n===1?'1 cell':n+' cells';

/* ---- real streak and week, from the dates of real tests ---- */
const dayKey=d=>{const x=new Date(d);return x.getFullYear()*10000+(x.getMonth()+1)*100+x.getDate()};
const testDays=()=>new Set(realAtt().map(a=>dayKey(a.when)));
function streakN(){const ds=testDays();if(!ds.size)return 0;const d=new Date();if(!ds.has(dayKey(d)))d.setDate(d.getDate()-1);let n=0;while(ds.has(dayKey(d))){n++;d.setDate(d.getDate()-1)}return n}
function weekStart(){const n=new Date();const m=new Date(n.getFullYear(),n.getMonth(),n.getDate()-((n.getDay()+6)%7));return m}
function weekDone(){const ds=testDays();const m=weekStart();return[0,1,2,3,4,5,6].map(i=>ds.has(dayKey(new Date(m.getFullYear(),m.getMonth(),m.getDate()+i))))}
const weekTests=()=>realAtt().filter(a=>a.when>=weekStart().getTime()).length;
function weekDots(small){const done=weekDone();const sz=small?'width:14px;height:14px;font-size:8px;':'';const today=(new Date().getDay()+6)%7;return['M','T','W','T','F','S','S'].map((d,i)=>`<span class="${done[i]?'d':''}" style="${sz}${i===today&&!done[i]?'outline:2px solid var(--org)':''}">${done[i]?'✓':d}</span>`).join('')}
function ago(ts){const m=Math.round((Date.now()-ts)/60000);if(m<2)return 'just now';if(m<60)return m+' min ago';const h=Math.round(m/60);if(h<24)return h+' h ago';const d=Math.round(h/24);return d===1?'yesterday':d+' days ago'}

/* ---- badges: plain records of something the student actually did ---- */
function badgesEarned(){const r=realAtt();const out=[];
 if(r.length)out.push({k:'first',n:'First report',p:'Finished your first test'});
 const last={};
 r.forEach(a=>{grade(a).byT.forEach(b=>{const pct=b.ok/b.n;if(last[b.t]!==undefined&&last[b.t]<.6&&pct>=.6&&!out.some(x=>x.k==='fix'+b.t))out.push({k:'fix'+b.t,n:'Fixed it · '+TOPIC_SHORT[b.t],p:`${TOPIC_SHORT[b.t]} went from ${Math.round(last[b.t]*100)}% to ${Math.round(pct*100)}%`});last[b.t]=pct})});
 let pp=null;r.forEach(a=>{const p=Math.max(0,a.score)/a.max*100;if(pp!==null&&p-pp>=20&&!out.some(x=>x.k==='comeback'))out.push({k:'comeback',n:'Comeback',p:`Up ${Math.round(p-pp)} points on your previous test`});pp=p});
 r.forEach(a=>{const g=grade(a);if(g.att>=3&&g.acc>=80&&g.spent<=a.dur*60&&!out.some(x=>x.k==='sharp'))out.push({k:'sharp',n:'Sharp',p:`${g.acc}% accuracy inside the time limit`})});
 const wk=Date.now()-7*864e5;if(new Set(r.filter(a=>a.when>=wk).map(a=>dayKey(a.when))).size>=3)out.push({k:'steady',n:'Steady',p:'Tests on 3 different days this week'});
 MILESTONES.forEach(m=>{if(cellsN()>=msCells(m[0]))out.push({k:'ms'+m[0],n:m[1],p:`${m[2]} · ${msCells(m[0])} of 30 cells`})});
 return out}
function badgeHints(){const out=[];const nm=nextMilestone();if(nm)out.push([nm.name,`${cellWord(nm.need)} to go`]);
 const d=new Set(realAtt().filter(a=>a.when>=Date.now()-7*864e5).map(a=>dayKey(a.when))).size;if(d<3)out.push(['Steady',`${d} of 3 test days this week`]);
 if(!realAtt().length)out.push(['First report','Finish your first test']);return out}

/* ---- the chapter grid ---- */
function triedSet(){const s=new Set();realAtt().forEach(a=>a.topics.forEach(t=>s.add(t+'-'+lvOfAtt(a,t))));return s}
function gridHtml(){const tr=triedSet();
 return `<div class="pgrid"><div class="pg-head"><span></span>${[1,2,3,4,5].map(l=>`<span>L${l}</span>`).join('')}</div>${T.map((t,i)=>`<div class="pg-row"><span class="pg-n">${TOPIC_SHORT[i]}</span>${[1,2,3,4,5].map(l=>`<i class="${l<=S.lvl[i]?'c':tr.has(i+'-'+l)?'a':l===S.lvl[i]+1?'n':''}" title="${TOPIC_SHORT[i]} Level ${l}"></i>`).join('')}</div>`).join('')}</div>
 <div class="pg-key"><span><i style="background:var(--grn)"></i>Cleared</span><span><i style="background:#FFF1E6;border:1px solid var(--org)"></i>Tried, not yet 60%</span><span><i style="background:#fff;border:1.5px dashed var(--navy)"></i>Next</span></div>`}
function progressCard(){const c=cellsN(),p=Math.round(c/30*100),nm=nextMilestone();
 return `<button class="card" style="text-align:left;padding:13px" onclick="go(57)"><div class="row"><div class="sp"><div class="eyebrow" style="color:var(--mut)">Limits, Continuity &amp; Differentiability</div><div style="margin-top:2px"><b style="font-size:24px">${p}%</b> <span class="xs mut">${c} of 30 cells cleared</span></div></div><span class="link xs">My progress ›</span></div>
 <div class="bar" style="height:6px;margin:8px 0 2px"><i style="width:${p}%"></i></div>
 ${gridHtml()}
 <div class="xs" style="margin-top:9px;background:#F1F3FA;border-radius:8px;padding:7px 9px">${nm?`<b>${cellWord(nm.need)}</b> to <b>${nm.name}</b> (${nm.p}%)`:'<b>Chapter cleared.</b> Every topic at Level 5.'}</div></button>`}

/* ---- Home: personal to the last test ---- */
function lastTestStrip(){const r=realAtt();if(!r.length)return '';const a=r.at(-1);const pct=Math.round(Math.max(0,a.score)/a.max*100);const prev=r.length>1?r.at(-2):null;const dl=prev?pct-Math.round(Math.max(0,prev.score)/prev.max*100):null;
 const lv=[...new Set(a.topics.map(t=>lvOfAtt(a,t)))];const lvTxt=lv.length===1?`Level ${lv[0]}`:`Levels ${lv.join(' · ')}`;
 return `<button class="card" style="text-align:left;padding:11px 13px" onclick="go(30)"><div class="row"><div class="eyebrow sp" style="color:var(--mut)">Your last test · ${ago(a.when)}</div><span class="link xs">View report ›</span></div>
 <div class="row" style="margin-top:6px"><div class="sp"><b style="font-size:21px">${a.score}/${a.max}</b> <span class="xs mut">${pct}%${dl!==null?` · <b style="color:${dl>=0?'var(--grn)':'var(--red)'}">${dl>=0?'+':''}${dl} pts vs the one before</b>`:''}</span><div class="xs mut" style="margin-top:2px">${a.topics.map(t=>TOPIC_SHORT[t]).join(', ')} · ${lvTxt}</div></div>${ring(pct,pct+'%')}</div></button>`}
function baselineTile(){const ba=beforeAfter();const r=realAtt();
 if(ba)return `<b class="sm">${ba[0]} → ${ba[1]}</b><div class="xs" style="color:${ba[2]>=0?'var(--grn)':'var(--red)'};font-weight:800;font-size:10px">${ba[2]>=0?'+':''}${ba[2]} pts · score %</div>`;
 if(r.length)return `<b class="sm">${Math.round(Math.max(0,r[0].score)/r[0].max*100)}% first</b><div class="xs mut" style="font-size:10px;margin-top:2px">Retest to see your change</div>`;
 return `<div class="xs mut" style="font-size:10px;margin-top:3px">Shows after your 2nd test</div>`}
function home(subj){S.subj=subj;const list=CHAPTERS[subj];const tc=todayCard();const ms=missions();const tt=title(),nx=nextTitle();
 const r=realAtt();const tested=r.length>0;const wk=weakTopics();const lim=tested?grade(r.at(-1)):null;const sn=streakN();
 const subPct={Maths:Math.round(chapPct()/14),Physics:0,Chemistry:0};
 return `<div class="scr"><div class="top"><div class="tt"><div class="logo"><i>Vedantu</i> Test360</div><small>${tested?'Your JEE Main dashboard':'Free JEE Main tests'}</small></div>${sn?`<span class="chip" style="background:#FFF1E6;color:var(--acc);border:1px solid #FFD3B8">${sn}-day streak</span>`:''}${xpChip()}</div>
 <div class="scroll"><div class="pad stack">
 ${lastTestStrip()}
 <div class="card" style="border:1.5px solid var(--org);padding:15px;background:linear-gradient(180deg,#FFF6F1,#fff 70%)"><div class="eyebrow">${tc.eb}</div><b style="font-size:18px;display:block;line-height:1.25;margin:4px 0 3px">${tc.title}</b><div class="xs mut">${tc.sub}</div><button class="btn" style="margin-top:12px" onclick="${tc.act}">${tc.btn}</button></div>
 ${subj==='Maths'?progressCard():''}
 <div class="g2" style="grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) minmax(0,1fr);gap:6px">
  <div class="card" style="padding:9px;text-align:center"><div class="xs mut" style="font-weight:700">Title</div><b class="sm">${tt[0]}</b><div class="bar" style="height:4px;margin-top:5px"><i style="width:${nx?Math.min(100,(S.xp-tt[1])/(nx[1]-tt[1])*100):100}%"></i></div><div class="xs mut" style="font-size:10px;margin-top:2px">${nx?`${nx[1]-S.xp} XP to ${nx[0]}`:'Top title'}</div></div>
  <div class="card" style="padding:9px;text-align:center"><div class="xs mut" style="font-weight:700">This week</div><div class="streak" style="margin:5px 0 0;gap:3px">${weekDots(true)}</div><div class="xs mut" style="font-size:10px;margin-top:4px">${weekTests()} of ${S.goal} tests</div></div>
  <div class="card" style="padding:9px;text-align:center"><div class="xs mut" style="font-weight:700">Before → after</div>${baselineTile()}</div></div>
 <div class="card" style="padding:10px 12px"><div class="row"><b class="sm sp">Today's missions · ${ms.filter(m=>m[1]).length}/3</b><span class="xs mut">bonus, not a cap</span></div>
  <div class="row" style="gap:6px;margin-top:7px;flex-wrap:wrap">${ms.map(m=>`<span class="chip" style="background:${m[1]?'#E3F6EE':'#F1F3FA'};color:${m[1]?'var(--grn)':'var(--mut)'};font-weight:700">${m[1]?'✓ ':''}${m[0]}</span>`).join('')}</div></div>
 <div class="tabs">${['Physics','Chemistry','Maths'].map(s=>`<button class="${s===subj?'on':''}" onclick="go(${s==='Maths'?10:s==='Physics'?12:13})">${s} <span style="opacity:.7;font-size:11px">${subPct[s]}%</span></button>`).join('')}</div>
 ${list.map((c,i)=>{const isL=subj==='Maths'&&i===0;const p=isL?chapPct():0;const nt=(CH_TOPICS[subj]||[])[i]||[5,6,4,5][i%4];
  let status='<span class="tag n">Not started</span>';if(isL&&tested)status=wk.length?`<span class="tag o">${wk.length} topic${wk.length>1?'s':''} to fix</span>`:`<span class="tag">Level ${Math.max(...S.lvl)} cleared</span>`;
  const lv=isL?Math.round(S.lvl.reduce((a,b)=>a+b,0)/6):0;
  return `<button class="chap" onclick="${isL?'A.openChapter()':`A.other(${i})`}"><div class="row"><b class="sp">${c}</b><span class="pct">${p}%</span></div>
   <div class="row xs mut" style="margin:3px 0 7px;gap:6px;flex-wrap:wrap">${isL&&lim?`<b style="color:var(--navy)">Last: ${lim.score}/${lim.max}</b>`:`${nt} topics · 5 levels`}${status}<span class="tag">Free</span>${isL&&tested&&!S.bought?`<span class="tag n" style="background:#FFF1EA;color:var(--acc)">Pack ${rs(PRICE.pack)}</span>`:''}</div>${ladder(lv)}</button>`}).join('')}
 </div></div>${bnav('Home')}</div>`}
R[10]=()=>home('Maths');R[12]=()=>home('Physics');R[13]=()=>home('Chemistry');

/* ---- Page 4: each topic has its own level, and remembers it ---- */
R[20]=()=>{const b=S.build;const sel=b.topics.map((x,i)=>x?i:-1).filter(i=>i>=0);const k=i=>Math.min(b.n[i],avail(i));const n=sel.reduce((a,i)=>a+k(i),0);
 const mins=Math.max(5,Math.ceil(sel.reduce((a,i)=>a+pickTime(i,k(i),levelOf(i)),0)/60));const xp=Math.round(sel.reduce((a,i)=>a+k(i)*10*LEVELS[levelOf(i)-1][1],0));
 const r=realAtt();const prev=[...r].reverse().find(a=>a.topics.some(t=>sel.includes(t)));const custom=!!b.lv;
 return `<div class="scr">${hdr('Test yourself','Limits, Continuity and Differentiability',16)}<div class="scroll"><div class="pad stack">
 ${prev?`<div class="card row" style="background:#FFF7F2;border-color:#FFC2A6"><div class="sp"><div class="eyebrow">Beat your last score</div><b>${prev.score}/${prev.max}</b> <span class="xs mut">on ${prev.topics.map(t=>TOPIC_SHORT[t]).join(', ')}</span></div><span class="tag o">Target ${Math.min(prev.max,prev.score+Math.ceil((prev.max-prev.score)/2))}</span></div>`:''}
 <div class="row"><b class="sm sp">Choose topics and levels</b><button class="link" onclick="A.clearTopics()">Clear all</button></div>
 ${T.map((t,i)=>{const lf=lastFor(i);const L=levelOf(i);const rec=recLevel(i);return `<div class="card" style="padding:10px 12px"><div class="row"><button class="cb ${b.topics[i]?'on':''}" onclick="A.tgl(${i})">${b.topics[i]?'✓':''}</button><div class="sp" onclick="A.tgl(${i})"><b class="sm">${t.name}</b><div class="xs mut">${lf?`Last time ${lf.ok}/${lf.n} at Level ${lf.level}`:'Not tested yet'}${S.lvl[i]?` · cleared up to L${S.lvl[i]}`:''}${Q.some(q=>q.t===i&&q.src==='sample')?' · sample questions':''}</div></div>
  <div class="stepper"><button onclick="A.step(${i},-1)">−</button><b>${b.n[i]}</b><button onclick="A.step(${i},1)">+</button></div></div>
  <div class="lvmini">${LEVELS.map((l,j)=>`<button class="m${j+1} ${L===j+1?'on':''}" onclick="A.setLv(${i},${j+1})" aria-label="Level ${j+1} ${l[0]}">${j+1}${rec===j+1?'<span class="rec">REC</span>':''}</button>`).join('')}</div>
  <div class="xs mut" style="margin-top:5px">Level ${L} · ${LEVELS[L-1][0]} · ${LEVELS[L-1][1]}× XP${L===rec?` · ${S.lastRes[i]?(S.lastRes[i].ok/S.lastRes[i].n>=.6?'one above your last cleared level':'same level again, you were close'):'a good place to start'}`:''}</div></div>`}).join('')}
 <div class="row xs" style="gap:6px;flex-wrap:wrap"><span class="mut">Set every topic to</span>${[1,2,3,4,5].map(l=>`<button class="chip" style="background:#fff;border:1px solid var(--line);color:var(--navy)" onclick="A.setAllLv(${l})">L${l}</button>`).join('')}${custom?`<button class="link xs" onclick="A.resetLv()">Back to recommended</button>`:''}</div>
 <div class="xs mut">All levels are open. Each topic remembers where you left off, and moves up when you clear 60%.</div>
 <div class="xs" style="background:#FFF8DB;border-radius:8px;padding:7px 9px;color:#6B5400">Honest note: until questions carry Level 1–5 tags, levels re-order questions by difficulty.</div>
 </div></div><div class="foot"><div class="row xs mut"><span class="sp">${sel.length} topics · ${n} questions</span><span>about ${mins} min · +${xp} XP</span></div>
 <button class="btn" ${n?'':'disabled'} onclick="A.startBuild()">Start test · ${n} questions · ${mins} min</button></div></div>`};
Object.assign(A,{
 setLv(i,l){if(!S.build.lv)S.build.lv=T.map((_,k)=>recLevel(k));S.build.lv[i]=l;render()},
 setAllLv(l){S.build.lv=T.map(()=>l);render()},
 resetLv(){S.build.lv=null;render()}
});

/* ---- Page 6: what this test did to your progress ---- */
function progressDelta(g){const a=g.a;if(a.sample||a.cells1===undefined)return '';const d=a.cells1-a.cells0;const p0=Math.round(a.cells0/30*100),p1=Math.round(a.cells1/30*100);const nm=nextMilestone(a.cells1);
 const done=g.byT.filter(b=>b.ok/b.n>=.6).map(b=>`${TOPIC_SHORT[b.t]} · Level ${lvOfAtt(a,b.t)}`);
 const near=g.byT.filter(b=>b.ok/b.n<.6).map(b=>{const need=Math.ceil(.6*b.n)-b.ok;return `${TOPIC_SHORT[b.t]}: ${need} more correct answer${need>1?'s':''} would have cleared Level ${lvOfAtt(a,b.t)}`});
 return `<div class="card" style="border:1.5px solid var(--grn)"><div class="eyebrow" style="color:var(--grn)">Your progress</div>
 <div class="row" style="margin:4px 0 2px"><b style="font-size:19px" class="sp">${d>0?`+${cellWord(d)} cleared`:'No new cells this time'}</b><span class="xs mut">Chapter ${p0}% → <b style="color:var(--navy)">${p1}%</b></span></div>
 ${done.length?`<div class="xs" style="margin-top:4px">Cleared: ${done.join(' · ')}</div>`:''}${near.map(x=>`<div class="xs mut" style="margin-top:3px">${x}</div>`).join('')}
 <div class="xs" style="margin-top:8px;background:#F1F3FA;border-radius:8px;padding:7px 9px">${nm?`<b>${cellWord(nm.need)}</b> to <b>${nm.name}</b>`:'<b>Chapter cleared.</b>'} · <a class="link" onclick="go(57)">See my grid</a></div></div>`}

/* ---- Progress hub and badges ---- */
R[57]=()=>{const c=cellsN(),p=Math.round(c/30*100),nm=nextMilestone();const earned=badgesEarned();
 return `<div class="scr">${hdr('My progress','Limits, Continuity and Differentiability',null)}<div class="scroll"><div class="pad stack">${progTabs(57)}
 <div class="card"><div class="row"><div class="sp"><div class="eyebrow">Chapter progress</div><b style="font-size:28px">${p}%</b> <span class="xs mut">${c} of 30 cells</span></div>${ring(p)}</div>${gridHtml()}</div>
 <div class="card"><b class="sm">Milestones</b>${MILESTONES.map(m=>{const ok=c>=msCells(m[0]);return `<div class="row" style="margin-top:8px"><span class="cb ${ok?'on':''}" style="width:18px;height:18px;flex:none">${ok?'✓':''}</span><div class="sp"><b class="sm">${m[1]}</b><div class="xs mut">${m[0]}% · ${m[2]}</div></div><span class="xs mut">${ok?'Done':cellWord(msCells(m[0])-c)+' to go'}</span></div>`}).join('')}</div>
 <div class="g2"><div class="card" style="text-align:center"><div class="eyebrow" style="color:var(--mut)">Streak</div><b style="font-size:24px">${streakN()}</b><div class="xs mut">${streakN()===1?'day':'days'} in a row</div></div><div class="card" style="text-align:center"><div class="eyebrow" style="color:var(--mut)">This week</div><b style="font-size:24px">${weekTests()}/${S.goal}</b><div class="xs mut">tests</div></div></div>
 <button class="card row" style="text-align:left" onclick="go(62)"><div class="sp"><b class="sm">Badges</b><div class="xs mut">${earned.length?`${earned.length} earned · latest: ${earned.at(-1).n}`:'Finish a test to earn your first'}</div></div><span class="link xs">View ›</span></button>
 </div></div><div class="foot"><button class="btn" onclick="A.buildFrom(-1)">${nm?`Continue · ${cellWord(nm.need)} to ${nm.name}`:'Keep your edge sharp'}</button></div>${bnav('Progress')}</div>`};
R[62]=()=>{const earned=badgesEarned();const hints=badgeHints();
 return `<div class="scr">${hdr('My progress','Badges',null)}<div class="scroll"><div class="pad stack">${progTabs(62)}
 <div class="xs mut">Badges are records of what you did. Nothing to collect for its own sake.</div>
 ${earned.length?earned.map(b=>`<div class="card row"><span class="chip" style="background:#E3F6EE;color:var(--grn);flex:none">Earned</span><div class="sp"><b class="sm">${b.n}</b><div class="xs mut">${b.p}</div></div></div>`).join(''):'<div class="card xs mut">No badges yet. Your first report earns the first one.</div>'}
 ${hints.length?`<div class="eyebrow" style="color:var(--mut);margin-top:6px">Next up</div>${hints.map(h=>`<div class="card row"><span class="chip" style="background:#F1F3FA;color:var(--mut);flex:none">Next</span><div class="sp"><b class="sm">${h[0]}</b><div class="xs mut">${h[1]}</div></div></div>`).join('')}`:''}
 </div></div>${bnav('Progress')}</div>`};
