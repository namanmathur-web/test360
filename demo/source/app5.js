/* ===== v2: the 7-page flow with a personal dashboard (overrides earlier versions) ===== */
const realAtt=()=>S.attempts.filter(a=>!a.sample);
function lastFor(t){for(let i=S.attempts.length-1;i>=0;i--){const a=S.attempts[i];if(a.topics.includes(t)){const b=grade(a).byT.find(x=>x.t===t);if(b)return{ok:b.ok,n:b.n,lost:b.lost,level:a.level,sample:a.sample}}}return null}
const recLevel=t=>Math.min(5,S.lvl[t]+1);
function weakTopics(){const r=realAtt();if(!r.length)return[];return grade(r.at(-1)).weak.map(b=>b.t)}
function todayCard(){const r=realAtt();
 if(!r.length)return{eb:'Today · your first step',title:'Start with Algebraic Limits',sub:'A 2-minute summary, then Level 1. Your report is instant.',btn:'Open the summary',act:'A.openTopic(0)'};
 const last=r.at(-1),g=grade(last),w=g.weak[0],lv=Math.min(5,last.level+1);
 if(w)return{eb:'Today · your next move',title:`Retest ${T[w.t].name} at Level ${lv}`,sub:`You lost ${w.lost} marks here last time. Target: ${Math.min(g.max,g.score+Math.ceil(g.lostTot/2))}/${g.max}.`,btn:'Start the retest',act:'go(53)'};
 const nt=T.findIndex((_,i)=>S.lvl[i]===0);
 if(nt>=0)return{eb:'Today · your next move',title:`Next topic: ${T[nt].name}`,sub:'2-minute summary, then 3 questions at Level 1.',btn:'Open the summary',act:`A.openTopic(${nt})`};
 return{eb:'Today · your next move',title:'Redo the questions you got wrong',sub:`${wrongRows().length} questions in your mistake notebook.`,btn:'Open my notebook',act:'go(46)'}}
function missions(){const r=realAtt();return[['Read 2 summary sections',Object.keys(S.got).length>=2],['Finish a test',r.length>0],['Score 60%+',r.some(a=>a.score/a.max>=.6)]]}
function beforeAfter(){const r=realAtt();if(r.length<2)return null;const p=a=>Math.round(Math.max(0,a.score)/a.max*100);return[p(r[0])+'%',p(r.at(-1))+'%',p(r.at(-1))-p(r[0])]}
function chapterTarget(){const w=weakTopics();if(w.length)return w[0];const nt=T.findIndex((_,i)=>S.lvl[i]<5);return nt<0?0:nt}

/* Page 2 — free test page = personal dashboard */
function home(subj){S.subj=subj;const list=CHAPTERS[subj];const tc=todayCard();const ms=missions();const ba=beforeAfter();const tt=title(),nx=nextTitle();
 const r=realAtt();const tested=r.length>0;const wk=weakTopics();const lim=lastFor(0)&&r.length?grade(r.at(-1)):null;
 const subPct={Maths:Math.round(chapPct()/14),Physics:0,Chemistry:0};
 return `<div class="scr"><div class="top"><div class="tt"><div class="logo"><i>Vedantu</i> Test360</div><small>${tested?'Your JEE Main dashboard':'Free JEE Main tests'}</small></div><span class="chip" style="background:#FFF1E6;color:var(--acc);border:1px solid #FFD3B8">${S.streak}-day streak</span>${xpChip()}</div>
 <div class="scroll"><div class="pad stack">
 <div class="card" style="border:1.5px solid var(--org);padding:15px;background:linear-gradient(180deg,#FFF6F1,#fff 70%)"><div class="eyebrow">${tc.eb}</div><b style="font-size:18px;display:block;line-height:1.25;margin:4px 0 3px">${tc.title}</b><div class="xs mut">${tc.sub}</div><button class="btn" style="margin-top:12px" onclick="${tc.act}">${tc.btn}</button></div>
 <div class="g2" style="grid-template-columns:1fr 1fr 1fr;gap:6px">
  <div class="card" style="padding:9px;text-align:center"><div class="xs mut" style="font-weight:700">Title</div><b class="sm">${tt[0]}</b><div class="bar" style="height:4px;margin-top:5px"><i style="width:${nx?Math.min(100,(S.xp-tt[1])/(nx[1]-tt[1])*100):100}%"></i></div><div class="xs mut" style="font-size:10px;margin-top:2px">${nx?`${nx[1]-S.xp} XP to ${nx[0]}`:'Top title'}</div></div>
  <div class="card" style="padding:9px;text-align:center"><div class="xs mut" style="font-weight:700">This week</div><div class="streak" style="margin:5px 0 0;gap:3px">${['M','T','W','T','F','S','S'].map((d,i)=>`<span class="${i<S.streak?'d':''}" style="width:14px;height:14px;font-size:8px">${i<S.streak?'':d}</span>`).join('')}</div><div class="xs mut" style="font-size:10px;margin-top:4px">${S.streak} days in a row</div></div>
  <div class="card" style="padding:9px;text-align:center"><div class="xs mut" style="font-weight:700">Before → after</div>${ba?`<b class="sm">${ba[0]} → ${ba[1]}</b><div class="xs" style="color:${ba[2]>=0?'var(--grn)':'var(--red)'};font-weight:800;font-size:10px">${ba[2]>=0?'+':''}${ba[2]} pts · score %</div>`:`<div class="xs mut" style="font-size:10px;margin-top:3px">Unlocks after your 2nd test</div>`}</div></div>
 <div class="card" style="padding:10px 12px"><div class="row"><b class="sm sp">Today's missions · ${ms.filter(m=>m[1]).length}/3</b><span class="xs mut">bonus, not a cap</span></div>
  <div class="row" style="gap:6px;margin-top:7px;flex-wrap:wrap">${ms.map(m=>`<span class="chip" style="background:${m[1]?'#E3F6EE':'#F1F3FA'};color:${m[1]?'var(--grn)':'var(--mut)'};font-weight:700">${m[1]?'✓ ':''}${m[0]}</span>`).join('')}</div></div>
 <div class="tabs">${['Physics','Chemistry','Maths'].map(s=>`<button class="${s===subj?'on':''}" onclick="go(${s==='Maths'?10:s==='Physics'?12:13})">${s} <span style="opacity:.7;font-size:11px">${subPct[s]}%</span></button>`).join('')}</div>
 ${list.map((c,i)=>{const isL=subj==='Maths'&&i===0;const p=isL?chapPct():0;const nt=(CH_TOPICS[subj]||[])[i]||[5,6,4,5][i%4];
  let status='<span class="tag n">Not started</span>';if(isL&&tested)status=wk.length?`<span class="tag o">${wk.length} topic${wk.length>1?'s':''} to fix</span>`:`<span class="tag">Level ${Math.max(...S.lvl)} cleared</span>`;
  const lv=isL?Math.round(S.lvl.reduce((a,b)=>a+b,0)/6):0;
  return `<button class="chap" onclick="${isL?'A.openChapter()':`A.other(${i})`}"><div class="row"><b class="sp">${c}</b><span class="pct">${p}%</span></div>
   <div class="row xs mut" style="margin:3px 0 7px;gap:6px;flex-wrap:wrap">${isL&&lim?`<b style="color:var(--navy)">Last: ${lim.score}/${lim.max} · L${r.at(-1).level}</b>`:`${nt} topics · 5 levels`}${status}<span class="tag">Free</span>${isL&&tested&&!S.bought?`<span class="tag n" style="background:#FFF1EA;color:var(--acc)">Pack ${rs(PRICE.pack)}</span>`:''}</div>${ladder(lv)}</button>`}).join('')}
 </div></div>${bnav('Home')}</div>`}

/* Page 3 — topic summary with the topic strip on top (replaces the separate mind map) */
const STOP=new Set(['limit','limits','form','forms','with','when','that','from','value','method','the','and','what','your','where','them','into','have','must','take']);
const words=s=>new Set(String(s).toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(w=>w.length>=4&&!STOP.has(w)));
function secOf(q){const cw=words(q.c.replace(/^2\.\d+\s*/,''));let best=-1,bs=0;T[q.t].sections.forEach((s,k)=>{const sw=words(s.ti+' '+s.tx);let sc=0;cw.forEach(w=>{if(sw.has(w))sc++});if(sc>bs){bs=sc;best=k}});return best}
function secLoss(ti){const out=T[ti].sections.map(()=>0);const a=[...S.attempts].reverse().find(x=>x.topics.includes(ti));if(!a)return out;grade(a).rows.forEach(r=>{if(r.q.t===ti&&r.lost>0){const k=secOf(r.q);if(k>=0)out[k]+=r.lost}});return out}
function summary(full){const ti=S.sumTopic;const t=T[ti];const loss=secLoss(ti);const order=t.sections.map((s,k)=>k).sort((a,b)=>(loss[b]>0)-(loss[a]>0)||a-b);
 const readN=t.sections.filter((s,k)=>S.got[ti+'-'+k]).length;const p=chapPct();
 return `<div class="scr">${hdr('Limits, Continuity and Differentiability',`Chapter ${p}% · ${S.lvl.filter(l=>l>0).length} of 6 topics started`,10)}
 <div style="background:#fff;border-bottom:1px solid #E4E8F4;flex:none;padding:8px 0 10px"><div style="display:flex;gap:7px;overflow-x:auto;padding:0 12px" class="strip">${T.map((x,i)=>{const lf=lastFor(i);const on=i===ti;return `<button onclick="A.openTopic(${i})" style="flex:none;width:112px;text-align:left;border-radius:11px;padding:8px 9px;border:1.5px solid ${on?'var(--navy)':'var(--line)'};background:${on?'#EEF1FB':'#fff'}"><div class="row" style="gap:4px"><b class="xs sp" style="line-height:1.2">${i+1}. ${TOPIC_SHORT[i]}</b>${lf&&lf.lost?`<span style="width:7px;height:7px;border-radius:50%;background:var(--red)"></span>`:''}</div><div class="xs mut" style="font-size:10px;margin:2px 0 5px">${lf?`last ${lf.ok}/${lf.n} · L${lf.level}`:'not tested'}</div>${ladder(S.lvl[i])}</button>`}).join('')}</div></div>
 <div class="scroll"><div class="notes"><div class="in">
 <div class="row"><div class="cap sp">Topic ${ti+1} of 6 · Test360 Notes</div><span class="chip" style="font-family:'Plus Jakarta Sans';background:#fff;border:1px solid #E5DCC5;font-size:10.5px">${readN}/${t.sections.length} read</span></div><h1>${t.name}</h1><p>${t.line}</p>
 <div class="plum"><div class="eyebrow">By the end you can</div><ul>${CAN[ti].map(c=>`<li>${c}</li>`).join('')}</ul></div>
 <p style="font-size:12.5px;font-style:italic;color:#7A6A50;line-height:20px">Tap a section for the short version. Tap <b>Full detail</b>, or double-tap, for the formula and the usual slip.${loss.some(x=>x)?' Sections where you lost marks are on top.':''}</p>
 ${order.map(k=>{const s=t.sections[k];const key=ti+'-'+k;const open=S.sumOpen[key];const fl=S.sumFull[key]||(full&&k===0);const got=S.got[key];
  return `<div class="ncard" ondblclick="A.full('${key}')" style="${loss[k]?'border-color:#F2B8B8':''}${got&&!open?';opacity:.75':''}"><button class="hd" onclick="A.sec('${key}')"><b class="no" style="${got?'background:#E3F6EE;color:var(--grn)':''}">${got?'✓':`${ti+1}.${k+1}`}</b><span>${esc(s.ti)}${loss[k]?`<br><span class="tag r" style="margin-top:3px">You lost ${loss[k]} marks here last time</span>`:''}</span><b style="color:var(--mut)">${open||fl?'⌃':'⌄'}</b></button>
  ${open||fl?`<div class="bd"><div>${esc(s.tx)}</div>
   ${fl?`<div class="fbox"><small>FORMULA</small>${s.f.map(x=>`<div>${x}</div>`).join('')}</div>${s.slip?`<div class="sticky"><b>Usual slip:</b> ${esc(s.slip)}</div>`:''}
    <div class="row" style="gap:6px;margin-top:8px;font-family:'Plus Jakarta Sans'">${got?`<span class="tag">✓ Got it · +5 XP</span>`:`<button class="tag" style="padding:5px 10px" onclick="A.got('${key}')">✓ Got it · +5 XP</button>`}<button class="tag o" style="padding:5px 10px" onclick="toast('Saved to review later')">Review later</button></div>`
   :`<button class="link" style="font-family:'Plus Jakarta Sans';margin-top:6px" onclick="A.full('${key}')">Full detail →</button>`}</div>`:''}</div>`}).join('')}
 ${lastFor(ti)?`<div class="ved" style="margin-top:12px;font-family:'Plus Jakarta Sans'"><span class="vt">Ved AI</span><div class="sm" style="margin-top:6px"><b>Your pattern here</b><div class="xs mut">${A.patternLine(ti)}</div></div></div>`:''}
 <button class="card row" style="margin-top:12px;font-family:'Plus Jakarta Sans';width:100%;text-align:left" onclick="A.lesson(${ti})"><b style="flex:none;width:34px;height:26px;border-radius:7px;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:11px">▶</b><div class="sp"><b class="sm">Teacher clip ${CLIPS[ti][0]}–${CLIPS[ti][1]}</b><div class="xs mut">Watch it, then try one question</div></div></button>
 ${readN>=2?`<div class="card" style="margin-top:10px;font-family:'Plus Jakarta Sans';background:#FFFDF6"><b class="sm">Want these notes in full?</b><div class="xs mut">All ${t.nsec} sections, with solved examples. Price: ₹ --</div><button class="link" onclick="go(19)">See notes and book</button></div>`:''}
 </div></div></div><div class="foot"><button class="btn" onclick="A.buildFrom(${ti})">Test me on this · Level ${recLevel(ti)} →</button></div></div>`}
R[14]=R[15]=()=>{S.scr=16;return R[16]()};

/* Page 4 — pick topics and level, with smart defaults */
R[20]=()=>{const b=S.build;const sel=b.topics.map((x,i)=>x?i:-1).filter(i=>i>=0);const n=sel.reduce((a,i)=>a+Math.min(b.n[i],avail(i)),0);
 const mins=Math.max(5,Math.ceil(sel.reduce((a,i)=>a+pickTime(i,Math.min(b.n[i],avail(i)),b.level),0)/60));const mult=LEVELS[b.level-1][1];
 const rec=sel.length?Math.min(...sel.map(recLevel)):1;const r=realAtt();const prev=[...r].reverse().find(a=>a.topics.some(t=>sel.includes(t)));
 return `<div class="scr">${hdr('Test yourself','Limits, Continuity and Differentiability',16)}<div class="scroll"><div class="pad stack">
 ${prev?`<div class="card row" style="background:#FFF7F2;border-color:#FFC2A6"><div class="sp"><div class="eyebrow">Beat your last score</div><b>${prev.score}/${prev.max}</b> <span class="xs mut">at Level ${prev.level}</span></div><span class="tag o">Target ${Math.min(prev.max,prev.score+Math.ceil((prev.max-prev.score)/2))}</span></div>`:''}
 <div class="row"><b class="sm sp">Choose topics</b><button class="link" onclick="A.clearTopics()">Clear all</button></div>
 ${T.map((t,i)=>{const lf=lastFor(i);return `<div class="card row" style="padding:10px 12px"><button class="cb ${b.topics[i]?'on':''}" onclick="A.tgl(${i})">${b.topics[i]?'✓':''}</button><div class="sp" onclick="A.tgl(${i})"><b class="sm">${t.name}</b><div class="xs mut">${lf?`Last time ${lf.ok}/${lf.n} at Level ${lf.level}`:'Not tested yet'} · <b style="color:var(--acc)">Recommended L${recLevel(i)}</b>${Q.some(q=>q.t===i&&q.src==='sample')?' · sample questions':''}</div></div>
  <div class="stepper"><button onclick="A.step(${i},-1)">−</button><b>${b.n[i]}</b><button onclick="A.step(${i},1)">+</button></div></div>`}).join('')}
 <div class="row" style="margin-top:6px"><b class="sm sp">Level <span class="mut xs">(all open)</span></b><span class="xs" style="color:var(--acc);font-weight:700">Recommended: Level ${rec}</span></div>
 <div class="lv">${LEVELS.map((l,i)=>`<button class="lv${i+1} ${b.level===i+1?'on':''}" style="position:relative" onclick="S.build.level=${i+1};render()">${i+1}<small>${l[0]}</small><small style="font-size:9.5px;opacity:.85">${l[1]}× XP</small>${rec===i+1?'<span style="position:absolute;top:-7px;right:-3px;background:var(--org);color:#fff;font-size:8.5px;border-radius:5px;padding:1px 4px">REC</span>':''}</button>`).join('')}</div>
 <div class="xs mut">${rec>1?`Recommended because you cleared Level ${rec-1} (60% or more).`:'Level 1 to start. Clear 60% to move up.'}</div>
 <div class="xs" style="background:#FFF8DB;border-radius:8px;padding:7px 9px;color:#6B5400">Honest note: until questions carry Level 1–5 tags, levels re-order questions by difficulty.</div>
 </div></div><div class="foot"><div class="row xs mut"><span class="sp">${sel.length} topics · ${n} questions</span><span>about ${mins} min · +${Math.round(n*10*mult)} XP (${mult}×)</span></div>
 <button class="btn" ${n?'':'disabled'} onclick="A.startBuild()">Start test · ${n} questions · ${mins} min</button></div></div>`};

/* Page 6 — next move on the report + per-question actions */
function nextMove(g){const w=g.weak[0];const lv=Math.min(5,g.a.level+1);
 if(w)return `<div class="card" style="border:1.5px solid var(--org)"><div class="eyebrow">Your next move</div><b style="display:block;margin:3px 0">Retest ${T[w.t].name} at Level ${lv}</b><div class="xs mut">It cost you ${w.lost} marks. Target ${Math.min(g.max,g.score+Math.ceil(g.lostTot/2))}/${g.max} next time.</div><div class="g2" style="margin-top:10px"><button class="btn sm" style="width:100%" onclick="go(53)">Retest at Level ${lv}</button><button class="btn2 sm" style="width:100%" onclick="go(54)">All next steps</button></div></div>`;
 const nt=T.findIndex((_,i)=>!g.a.topics.includes(i));return `<div class="card" style="border:1.5px solid var(--grn)"><div class="eyebrow" style="color:var(--grn)">Nothing lost · your next move</div><b style="display:block;margin:3px 0">${nt>=0?`Next topic: ${T[nt].name}`:`Level ${lv}`}</b><div class="g2" style="margin-top:10px"><button class="btn sm" style="width:100%" onclick="${nt>=0?`A.openTopic(${nt})`:'go(53)'}">Go</button><button class="btn2 sm" style="width:100%" onclick="go(54)">All next steps</button></div></div>`}
function testFromIds(ids,level){const qs=ids.map(qById);const sc=qs.filter(q=>q.ty==='sc'),nm=qs.filter(q=>q.ty==='num');const all=[...sc,...nm];const secs=[];
 if(sc.length)secs.push({name:'MAT SEC 1',ty:'sc',from:0,to:sc.length});if(nm.length)secs.push({name:'MAT SEC 2',ty:'num',from:sc.length,to:all.length});const dur=Math.max(2,Math.ceil(all.reduce((a,q)=>a+q.tt,0)/60));
 return{qs:all.map(q=>q.id),secs,topics:[...new Set(all.map(q=>q.t))],level,dur,left:dur*60,idx:0,ans:{},sel:{},mark:{},vis:{0:1},time:{},t0:Date.now(),answered:0,nudged:true,retest:true,sample:false,font:0}}
Object.assign(A,{
 openChapter(){A.openTopic(chapterTarget())},
 buildFrom(ti,lv){const w=weakTopics();if(ti>=0)S.build.topics=T.map((_,i)=>i===ti||w.includes(i)?1:0);else if(w.length)S.build.topics=T.map((_,i)=>w.includes(i)?1:0);
  const sel=S.build.topics.map((x,i)=>x?i:-1).filter(i=>i>=0);S.build.level=lv||(ti>=0?recLevel(ti):(sel.length?Math.min(...sel.map(recLevel)):1));S.cur=null;closeSideSafe();go(20)},
 similar(id){const q=qById(id);const seen=new Set(S.attempts.flatMap(a=>a.qs));const pool=Q.filter(x=>x.t===q.t&&x.id!==id);const p=pool.find(x=>x.d===q.d&&!seen.has(x.id))||pool.find(x=>!seen.has(x.id))||pool.find(x=>x.d===q.d)||pool[0];
  if(!p){toast('No other question in this topic yet');return}S.cur=testFromIds([p.id],G().a.level);S.agree=true;S.cur.running=true;S.cur.qT=Date.now();go(22)},
 reLevel(t,lv){S.cur=makeTest([t],[3,3,3,3,3,3],Math.min(5,lv+1),{retest:true});S.agree=false;go(21)},
 clip(t){if(!S.seen.clip){S.seen.clip=1;go(37)}else A.lesson(t)}
});
function closeSideSafe(){try{closeSide()}catch(e){}}
/* simpler: rebuild the per-question action row by marking each card */
R[36]=(()=>{return ()=>{const g=G();S.resTab='ans';const f=S.ansFilter;const lv=Math.min(5,g.a.level+1);const rows=g.rows.filter(r=>f==='all'||(f==='ok'&&r.st==='ok')||(f==='bad'&&r.st==='bad')||(f==='skip'&&r.st==='skip'));
 return `<div class="scr">${resTop(g)}<div class="scroll"><div class="pad stack"><div class="row" style="gap:6px;flex-wrap:wrap">${[['all','All',g.rows.length],['ok','Correct',g.ok],['bad','Incorrect',g.bad],['skip','Skipped',g.skip]].map(x=>`<button class="chip" style="background:${f===x[0]?'var(--navy)':'#fff'};color:${f===x[0]?'#fff':'var(--navy)'};border:1px solid var(--line);padding:5px 10px" onclick="S.ansFilter='${x[0]}';render()">${x[1]} (${x[2]})</button>`).join('')}</div>
 <div class="ph-note" style="border-radius:8px">Placeholder questions. Answer keys must be checked by a teacher before launch.</div>
 ${rows.map(r=>{const q=r.q;return `<div class="card"><div class="row xs"><b style="font-size:13px">Q${r.i+1}</b><span class="mut">· ${TOPIC_SHORT[q.t]}</span><span class="sp"></span><span class="tag ${r.st==='ok'?'':r.st==='bad'?'r':'n'}">${r.st==='ok'?'Correct':r.st==='bad'?'Incorrect':'Skipped'}</span></div><div class="qtext" style="font-size:14px;margin:6px 0 8px">${q.q}</div>
  ${q.ty==='sc'?q.o.map((o,k)=>{const L='abcd'[k];const c=L===q.a?'ok':L===r.a?'bad':'';return `<div class="optn ${c}" style="padding:8px 10px"><b class="xs" style="width:20px">${L.toUpperCase()}</b><span class="sp">${o}</span>${L===r.a?`<b class="xs" style="color:${c==='ok'?'var(--grn)':'var(--red)'}">Your answer</b>`:L===q.a?'<b class="xs" style="color:var(--grn)">Correct</b>':''}</div>`}).join('')
   :`<div class="sm">Your answer: <b style="color:${r.st==='ok'?'var(--grn)':'var(--red)'}">${r.a??'—'}</b> · Correct: <b style="color:var(--grn)">${q.a}</b></div>`}
  <div class="xs" style="color:${r.t>q.tt*1.3?'var(--red)':'var(--acc)'};font-weight:700;margin-top:4px">Time spent ${fmt(r.t)} · Expected ${fmt(q.tt)} · ${q.d.toUpperCase()}${r.why&&r.st!=='ok'?` · ${r.why}`:''}</div>
  <details style="margin-top:6px"><summary class="sm" style="font-weight:800;cursor:pointer">Solution</summary><div class="sm" style="margin-top:4px">${esc(q.s)}</div>${q.m?`<div class="xs mut" style="margin-top:4px">${esc(q.m)}</div>`:''}</details>
  <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:9px"><button class="btn2 sm" onclick="A.similar('${q.id}')">Try a similar question</button><button class="btn2 sm" onclick="A.reLevel(${q.t},${g.a.level})">Reattempt at Level ${lv}</button><button class="link xs" onclick="A.clip(${q.t})">▶ Teacher clip</button></div></div>`}).join('')}
 </div></div><div class="foot"><button class="btn" onclick="go(54)">What next →</button></div></div>`}})();

/* Page 7 — three equal next steps, then the paid product */
R[54]=()=>{const g=G();const lv=Math.min(5,g.a.level+1);const w=(g.weak.length?g.weak:g.byT).slice(0,3);const target=Math.min(g.max,g.score+Math.ceil(g.lostTot/2));
 const nt=(()=>{const i=T.findIndex((_,k)=>!g.a.topics.includes(k)&&S.lvl[k]<5);return i<0?T.findIndex((_,k)=>S.lvl[k]<5):i})();const ntx=nt<0?0:nt;
 const card=(n,eb,title,sub,meta,btn,act,hl)=>`<div class="card" style="${hl?'border:1.5px solid var(--org)':''}"><div class="row"><b style="flex:none;width:24px;height:24px;border-radius:50%;background:${hl?'var(--org)':'var(--navy)'};color:#fff;display:grid;place-items:center;font-size:12px">${n}</b><div class="eyebrow sp">${eb}</div><span class="xs" style="color:var(--acc);font-weight:800">${meta}</span></div><b style="display:block;margin:6px 0 2px">${title}</b><div class="xs mut">${sub}</div><button class="${hl?'btn':'btn2'}" style="margin-top:10px" onclick="${act}">${btn}</button></div>`;
 return `<div class="scr">${hdr("What next",`From your Level ${g.a.level} test: ${g.score}/${g.max}${g.a.sample?' (sample)':''}`,30)}<div class="scroll"><div class="pad stack">
 ${card(1,'Same topic, higher level',`Level ${lv} · ${w.map(b=>TOPIC_SHORT[b.t]).join(', ')}`,`Last ${g.score}/${g.max} → target ${target}/${g.max}. Questions you have seen come last.`,`+${Math.round(10*3*w.length*LEVELS[lv-1][1])} XP`,`Retest at Level ${lv}`,'go(53)',true)}
 ${card(2,'Next topic',T[ntx].name,'A 2-minute summary, then 3 questions at Level 1.','+30 XP','Open the summary',`A.openTopic(${ntx})`,false)}
 ${g.weak.length?card(3,'Fix what went wrong · free',`${g.weak.length} topic${g.weak.length===1?'':'s'}, ranked by marks lost`,`Each with the exact teacher-clip minutes and a practice set. ${g.lostTot} marks to win back.`,'+10 XP each','Start fixing','go(47)',false):card(3,'Review · free','Nothing to fix this time','Look through your answers, or try a similar question on any of them.','','Review my answers','go(36)',false)}
 <div class="row" style="margin-top:6px"><div class="eyebrow sp" style="color:var(--mut)">Go further</div><span class="xs mut">Free stays free: every level, every chapter</span></div>
 ${S.bought?`<div class="card" style="background:#EAF7F1;border-color:#9FDCC2"><b class="sm">${S.bought==='pack'?'Limits chapter pack':'Complete JEE Main series'} is active</b><div class="xs mut">Your notebook, notes and clips are open.</div></div>`:`
 <div class="plan hl"><div class="row"><div class="sp"><div class="eyebrow">Built around your weak topics</div><b>Limits chapter pack</b><div class="xs mut">${g.weak.map(b=>TOPIC_SHORT[b.t]).join(', ')||'All 6 topics'} · notes · mistake notebook · teacher clips</div></div><b style="font-size:20px">${rs(PRICE.pack)}</b></div><button class="btn" style="margin-top:10px" onclick="A.checkout('pack')">Get the Limits pack</button></div>
 <div class="plan dk"><div class="row"><div class="sp"><b class="sm">Complete JEE Main series</b><div class="xs" style="opacity:.75">All ${PRICE.chapters} chapters, 5 levels each, VedAI on every test</div></div><b style="font-size:18px">${rs(PRICE.series)}</b></div><button class="link" style="color:#FF9C72;margin-top:6px" onclick="A.checkout('series')">See the series</button></div>`}
 ${A.loopDone()?`<div class="row xs" style="gap:12px"><span class="mut">Also preparing for</span><a class="link" onclick="go(44)">BITSAT</a><a class="link" onclick="go(45)">NDA</a></div>`:''}
 </div></div></div>`};

/* names in the side panel follow the 7-page flow */
NAMES[9]='Your dashboard · Today card, missions, Maths';NAMES[11]='Dashboard · Physics';NAMES[12]='Dashboard · Chemistry';
NAMES[15]='Topic summary · topic strip + short notes';NAMES[16]='Topic summary · full detail';NAMES[19]='Pick topics and level · smart defaults';
NAMES[29]='Result · your report + next move';NAMES[35]='Answers · try similar / reattempt / clip';NAMES[53]='What next · 3 next steps, then the pack';
