/* ===== Screens 46–62: notebook, fix, plans, checkout, retest, progress ===== */
function wrongRows(){const out=[];S.attempts.forEach((a,ai)=>{grade(a).rows.forEach(r=>{if(r.st==='bad')out.push(Object.assign({key:ai+'-'+r.q.id,ai},r))})});return out}
R[46]=()=>{G();const all=wrongRows();const f=S.nbTab;const rows=all.filter(r=>f==='all'||(f==='fix'?S.nbFixed[r.key]:!S.nbFixed[r.key]));
 return `<div class="scr">${hdr('Mistake notebook',`Limits · ${all.length} wrong answers`,58)}<div class="scroll"><div class="pad stack">
 <div class="tabs">${[['all',`All (${all.length})`],['rev','To revise'],['fix','Fixed']].map(x=>`<button class="${f===x[0]?'on':''}" onclick="S.nbTab='${x[0]}';render()">${x[1]}</button>`).join('')}</div>
 ${rows.length?rows.map(r=>`<div class="card"><div class="row"><b class="sm sp">Q${r.i+1} · ${T[r.q.t].name}</b><span class="tag o">${r.why==='Rushed'?'Rushed':'Concept slip'}</span></div>
  <div class="xs mut" style="margin:4px 0 8px">${esc((r.q.m||r.q.s).slice(0,150))}${(r.q.m||r.q.s).length>150?'…':''}</div>
  <div class="row" style="gap:6px"><button class="chip" style="background:var(--navy);color:#fff" onclick="A.lesson(${r.q.t})">▶ Watch fix</button>${S.nbFixed[r.key]?'<span class="tag">✓ Fixed</span>':`<button class="tag" style="padding:4px 9px" onclick="S.nbFixed['${r.key}']=1;addXP(5,'mistake fixed');render()">Mark fixed</button>`}</div></div>`).join(''):`<div class="card sm mut">Nothing here yet.</div>`}
 <div class="xs mut">The notebook is part of the ${rs(PRICE.pack)} chapter pack.</div></div></div>
 <div class="foot"><button class="btn" onclick="A.retestWrong()">Retest these ${all.filter(r=>!S.nbFixed[r.key]).length||all.length} questions</button></div></div>`};
R[47]=()=>{const g=G();const w=g.weak.length?g.weak:[{t:g.a.topics[0],lost:0,bad:0,skip:0,ok:0,n:0}];
 return `<div class="scr">${hdr('Fix what went wrong','Watch the exact parts, practise, retest',30)}<div class="scroll"><div class="pad stack">
 ${w.map((b,k)=>{const fx=S.fixed[b.t];return `<div class="card" style="${fx?'border-color:#9FDCC2':''}"><div class="row"><b class="sm sp">${k+1}. ${T[b.t].name}</b><span class="tag o">Lost ${b.lost} marks</span></div>
  <div class="xs mut" style="margin:3px 0 8px">${b.bad?`${b.bad} wrong`:''}${b.bad&&b.skip?', ':''}${b.skip?`${b.skip} not attempted`:''}. ${IDEA[b.t]}</div>
  <button class="row" style="width:100%;background:#F1F3FA;border-radius:10px;padding:8px;text-align:left" onclick="A.lesson(${b.t})"><b style="flex:none;width:36px;height:28px;border-radius:7px;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:11px">▶</b><div class="sp"><b class="sm">Watch ${CLIPS[b.t][0]} → ${CLIPS[b.t][1]}</b><div class="xs mut">Key idea: ${T[b.t].line}</div></div></button>
  <div class="row" style="margin-top:8px"><button class="link xs" onclick="A.buildFrom(${b.t})">Practise ${Math.min(5,avail(b.t))} questions</button><span class="sp"></span>${fx?'<span class="tag">✓ Fixed</span>':`<button class="tag n" style="padding:4px 9px" onclick="A.fix(${b.t})">Mark fixed · +10 XP</button>`}</div></div>`}).join('')}
 <button class="btn2" onclick="go(48)">Keep improving: notes, tests and solutions</button></div></div>
 <div class="foot"><button class="btn" onclick="go(53)">Retest these topics</button></div></div>`};
R[48]=()=>{const g=G();return `<div class="scr">${hdr('Keep improving','Notes, tests and solutions',47)}<div class="scroll"><div class="pad stack">
 <div class="plan hl"><div class="eyebrow">Recommended for you</div><b>Fix your weak topics in Limits</b><div class="row" style="margin-top:6px"><div class="sp"><b class="sm">Limits chapter pack</b><div class="xs mut">Topic tests at 5 levels · notes · mistake notebook · retests</div></div><b style="font-size:18px">${rs(PRICE.pack)}</b></div>
  <div class="xs" style="margin-top:6px;color:var(--acc);font-weight:700">Built around your ${g.weak.length} weak topic${g.weak.length===1?'':'s'}: ${g.weak.map(b=>TOPIC_SHORT[b.t]).join(', ')||'none'}</div></div>
 <div class="plan dk"><div class="row"><div class="sp"><b class="sm">Complete JEE Main series</b><div class="xs" style="opacity:.7">All ${PRICE.chapters} chapters · notes and teacher clips · Ved ScoreBooster</div></div><b style="font-size:18px">${rs(PRICE.series)}</b></div></div>
 <div class="row xs"><a class="link" onclick="go(39)">Compare pack and series</a><span class="sp"></span><a class="link" onclick="go(40)">Why the series?</a></div>
 <div class="eyebrow" style="color:var(--mut);margin-top:6px">Continue for free</div>
 ${[['Watch the teacher clips','go(47)'],['Review my answers','go(36)'],['Retest the same topics','go(53)']].map(x=>`<button class="card row" style="text-align:left" onclick="${x[1]}"><b class="sm sp">${x[0]}</b><b style="color:var(--org)">›</b></button>`).join('')}
 </div></div><div class="foot"><button class="btn" onclick="A.checkout('pack')">Get the chapter pack · ${rs(PRICE.pack)}</button></div></div>`};
function checkout(){const it=S.pay.item;const amt=it==='pack'?PRICE.pack:it==='upgrade'?PRICE.upgrade:PRICE.series;const gst=(amt*18/118).toFixed(2);
 const name=it==='pack'?'Limits chapter pack':'Complete JEE Main series';
 const feats=it==='pack'?['Chapter-wise tests at all 5 levels','Quick revision notes','Mistake notebook','Teacher lesson clips','Yours for one year']:[`All ${PRICE.chapters} JEE Main chapters, 5 levels each`,'Revision notes for every chapter','Teacher lesson clips for every topic','Ved ScoreBooster on every test','Yours for one year'];
 return `<div class="scr" style="background:#fff"><div class="ph"><span class="chip">Checkout</span><button class="x" onclick="go(48)">×</button><h2>${name}</h2><p>Demo checkout. No payment is taken.</p></div><div class="scroll"><div class="pad stack">
 <div class="card"><b class="sm">Order summary</b><div class="row sm" style="margin-top:6px"><span class="sp">${name}${it==='upgrade'?' (upgrade)':''}</span><b>${rs(amt)}</b></div>${it==='upgrade'?`<div class="row xs mut"><span class="sp">You already paid for the Limits pack</span><span>−${rs(PRICE.pack)}</span></div>`:''}<div class="row xs mut"><span class="sp">GST included</span><span>₹${gst}</span></div>
  <div class="row" style="border-top:1px solid #EEF0F7;margin-top:8px;padding-top:8px"><b class="sp">You pay</b><b style="font-size:18px">${rs(amt)}</b></div>
  ${feats.map(f=>`<div class="row sm" style="margin-top:5px"><b style="flex:none;width:17px;height:17px;border-radius:50%;background:var(--grn);color:#fff;display:grid;place-items:center;font-size:10px">✓</b>${f}</div>`).join('')}</div>
 <div class="card"><b class="sm">Pay with</b>${[['upi','UPI','Google Pay, PhonePe, Paytm'],['card','Card','Debit or credit'],['nb','Net banking','All major banks']].map(m=>`<button class="opt row ${S.pay.method===m[0]?'on':''}" style="margin-top:8px;padding:10px" onclick="S.pay.method='${m[0]}';render()"><i class="rd" style="width:16px;height:16px;border-radius:50%;border:${S.pay.method===m[0]?'5px solid var(--org)':'2px solid #AEB8D6'}"></i><b class="sm sp">${m[1]}</b><span class="xs mut">${m[2]}</span></button>${S.pay.method===m[0]&&m[0]==='upi'?'<input placeholder="yourname@upi" style="width:100%;margin-top:6px;border:1px solid var(--line);border-radius:9px;padding:10px;background:#F8F9FD">':''}`).join('')}
  <button class="btn" style="margin-top:12px" onclick="A.pay()">Pay ${rs(amt)} (demo)</button><div class="row xs" style="margin-top:8px"><span class="mut sp">Have a coupon? <a class="link">Add it</a></span><a class="link" style="color:var(--mut)" onclick="go(51)">Demo: make it fail</a></div></div>
 </div></div></div>`}
R[49]=()=>{S.pay.item='pack';return checkout()};R[50]=()=>{if(S.pay.item==='pack')S.pay.item='series';return checkout()};
R[51]=()=>`<div class="scr">${hdr('Purchase','',48,'')}<div class="scroll"><div class="pad"><div class="card" style="text-align:center;margin-top:120px"><b style="color:var(--red)">Payment did not go through</b><div class="xs mut" style="margin-top:4px">No money was taken. Retry, or save it for later.</div></div></div></div>
 <div class="foot"><button class="btn" onclick="go(S.pay.item==='pack'?49:50)">Retry payment</button><button class="btn2" onclick="toast('Saved for later');go(48)">Save for later</button></div></div>`;
R[52]=()=>{const ser=S.bought==='series'||S.bought==='upgrade';return {base:R[48](),sheet:`<div class="ph"><div style="width:38px;height:38px;border-radius:50%;background:#fff;color:var(--grn);display:grid;place-items:center;font-weight:800;font-size:18px">✓</div><button class="x" onclick="go(57)">×</button><h2>${ser?'Complete JEE Main series is active':'Limits chapter pack is active'}</h2><p>${ser?`All ${PRICE.chapters} chapters are open on your account.`:'Everything for this chapter is open on your account.'} (Demo: no payment was taken.)</p></div><div class="pb">
 <div class="card"><b class="sm">Start here</b>${[`Chapter-wise test: ${T[(G().weak[0]||{t:0}).t].name.toLowerCase()}`,'Quick revision notes','Mistake notebook and teacher lesson clips'].map(f=>`<div class="row sm" style="margin-top:6px"><b style="flex:none;width:17px;height:17px;border-radius:50%;background:var(--grn);color:#fff;display:grid;place-items:center;font-size:10px">✓</b>${f}</div>`).join('')}<button class="btn" style="margin-top:10px" onclick="go(53)">Start the first test</button></div>
 ${ser?'':`<div class="card" style="border:1.5px solid #E8A0B4"><span class="tag n">All ${PRICE.chapters} chapters</span><b style="display:block;margin-top:6px">Add the rest of the syllabus</b><div class="xs mut">Upgrade to the Complete JEE Main series and pay only the difference.</div><div style="margin:6px 0"><b style="font-size:22px">${rs(PRICE.upgrade)}</b> <s class="xs mut">${rs(PRICE.series)}</s></div><button class="btn" onclick="A.checkout('upgrade')">Upgrade (demo)</button></div>`}
 <button class="link" style="margin:0 auto;color:var(--mut)" onclick="go(57)">Close</button></div>`}};
R[53]=()=>{const g=G();const lv=nextLv(g);const w=(g.weak.length?g.weak:g.byT).slice(0,3);const target=Math.min(g.max,g.score+Math.ceil(g.lostTot/2));
 return `<div class="scr">${hdr(`Level ${lv}`,'Retest and beat your score',30)}<div class="scroll"><div class="pad stack">
 <div class="card row" style="justify-content:space-around;text-align:center"><div><div class="xs mut" style="font-weight:800">LAST SCORE</div><b style="font-size:24px">${g.score}/${g.max}</b></div><b style="color:var(--org);font-size:22px">→</b><div><div class="xs mut" style="font-weight:800">TARGET</div><b style="font-size:24px;color:var(--acc)">${target}/${g.max}</b></div></div>
 ${w.map(b=>`<div class="card"><div class="eyebrow">Level ${recLevel(b.t)} · next up</div><b class="sm">${T[b.t].name}</b><div class="xs mut">3 new questions · about ${Math.ceil(pickTime(b.t,3,recLevel(b.t))/60)} min · +${Math.round(30*LEVELS[recLevel(b.t)-1][1])} XP (${LEVELS[recLevel(b.t)-1][1]}×)</div></div>`).join('')}
 <div class="xs mut">Same topics, one level higher. Questions you have seen are picked last.</div></div></div>
 <div class="foot"><button class="btn" onclick="A.retest(${lv})">Start retest</button></div></div>`};
R[54]=()=>{const g=G();const nt=T.findIndex((_,i)=>!g.a.topics.includes(i));const ct=g.a.topics[0];
 return `<div class="scr">${hdr("What's next",'',30)}<div class="scroll"><div class="pad stack">
 <button class="card" style="text-align:left;background:#FFF7F2;border-color:#FFC2A6" onclick="A.openTopic(${nt<0?0:nt})"><div class="eyebrow">Continue</div><b>${T[nt<0?0:nt].name} · Level 1</b><div class="xs mut">2-minute summary, then 3 questions.</div></button>
 <div class="g2"><button class="card" style="text-align:left" onclick="go(53)"><div class="eyebrow">Same topic</div><b class="sm">Level ${nextLv(g)} →</b></button><button class="card" style="text-align:left" onclick="A.buildFrom(${nt<0?0:nt})"><div class="eyebrow">Next topic</div><b class="sm">${TOPIC_SHORT[nt<0?0:nt]} →</b></button></div>
 <button class="card row" onclick="A.other(1)"><b class="sm">Differentiation</b><span class="xs mut sp" style="text-align:left">Next chapter · free test</span></button>
 <button class="card row" onclick="go(12)"><b class="sm">Physics · Kinematics</b><span class="xs mut sp" style="text-align:left">Another subject · free test</span></button>
 ${A.loopDone()?`<div class="row xs" style="gap:12px;margin-top:6px"><span class="mut">Also preparing for</span><a class="link" onclick="go(44)">BITSAT</a><a class="link" onclick="go(45)">NDA</a></div>`:''}
 </div></div><div class="foot"><button class="btn" onclick="A.openTopic(${nt<0?0:nt})">Go</button></div></div>`};
R[55]=()=>({base:R[47](),sheet:`<div class="ph"><span class="chip">Limits fixed</span><button class="x" onclick="closeOv()">×</button><h2>Next: Continuity and Differentiability</h2><p>You closed ${Object.keys(S.fixed).length||G().weak.length} of ${G().weak.length||1} weak topics. Keep the run going.</p></div><div class="pb">
 <div class="card" style="text-align:center"><b class="sm">Check where you stand</b><div class="xs mut" style="margin:4px 0 10px">A free 10-minute diagnostic for the last two topics of this chapter, with a report like this one.</div><button class="btn" onclick="A.diag()">Start the free diagnostic</button><button class="link xs" style="margin-top:8px" onclick="closeOv()">Later</button></div>
 <div class="card" style="border:1.5px solid #E8A0B4"><span class="tag n">Everything</span><b style="display:block;margin-top:6px">Open all remaining chapters</b><div class="xs mut">All ${PRICE.chapters} JEE Main chapters at 5 levels, with VedAI on every test.</div><b style="font-size:22px;display:block;margin:6px 0">${rs(PRICE.series)}</b><button class="btn" onclick="A.checkout('series')">Get the full series</button></div>
 <button class="link" style="margin:0 auto;color:var(--mut)" onclick="closeOv()">Not now</button></div>`});
R[56]=()=>({base:R[54](),center:`<div class="pad" style="text-align:center"><div class="eyebrow">Streak</div><b style="font-size:30px;display:block;color:var(--acc)">${streakN()}-day streak</b>
 <div class="streak">${weekDots()}</div>
 <div class="xs mut">Test tomorrow to make it ${streakN()+1}. A streak gives bonus XP.</div><button class="btn" style="margin-top:12px" onclick="toast('Demo: reminder set for tomorrow');closeOv()">Take tomorrow's test →</button><button class="link xs" style="margin-top:8px" onclick="closeOv()">Remind me</button></div>`});
function progTabs(on){return `<div class="tabs" style="margin-bottom:2px">${[['Chapter',57],['Trend',59],['Syllabus',60],['Badges',62]].map(x=>`<button class="${on===x[1]?'on':''}" onclick="go(${x[1]})">${x[0]}</button>`).join('')}</div>`}
R[57]=()=>{const p=chapPct();return `<div class="scr">${hdr('My progress','Limits, Continuity and Differentiability',null)}<div class="scroll"><div class="pad stack">${progTabs(57)}
 <div class="card row">${`<div class="ring" style="--p:${p};width:74px;height:74px"><b style="width:58px;height:58px;font-size:16px">${p}%</b></div>`}<div class="sp"><b>Limit Learner</b><div class="xs mut">100% = Level 5 in all 6 topics</div><div class="xs" style="margin-top:4px;color:var(--acc);font-weight:700">${title()[0]} · ${S.xp} XP</div></div></div>
 ${T.map((t,i)=>`<button class="card row" style="text-align:left" onclick="A.openTopic(${i})"><div class="ring" style="--p:${S.lvl[i]*20};width:40px;height:40px"><b style="width:30px;height:30px;font-size:10.5px">${S.lvl[i]}/5</b></div><div class="sp"><b class="sm">${t.name}</b><div class="xs mut">${S.lvl[i]} of 5 levels</div></div></button>`).join('')}
 <button class="link" onclick="go(61)">Preview: chapter at 100%</button></div></div>
 <div class="foot"><button class="btn" onclick="A.buildFrom(-1)">Continue Level ${Math.min(5,Math.min(...S.lvl)+1)}</button></div>${bnav('Progress')}</div>`};
R[58]=()=>{const nb=wrongRows().length;const w=S.attempts.length?G().weak[0]:null;return `<div class="scr"><div class="top"><div class="logo"><i>Vedantu</i> Test360</div><span class="sp"></span><span class="xs mut">Test Series · Explore · My Learning</span></div><div class="scroll"><div class="pad stack">
 <h2 class="h" style="margin:0">My Learning</h2><div class="xs mut" style="margin-top:-8px">Class ${S.ob[0]||'12'} · JEE · ${S.ob[2]||'English'}</div>
 <div class="tabs"><button class="on">Overview</button><button onclick="go(59)">Tests</button><button onclick="go(46)">Mistakes</button><button onclick="go(33)">Planner</button></div>
 <div class="card" style="border:1.5px solid #FFC2A6"><div class="eyebrow">Recommended next step</div><b>${w?`Retest ${T[w.t].name}`:'Take your first free test'}</b><div class="xs mut">${w?`Fix ${w.lost} marks from ${TOPIC_SHORT[w.t].toLowerCase()}.`:'Pick any topic. Level 1 takes about 5 minutes.'}</div><button class="btn" style="margin-top:8px" onclick="${w?'go(53)':'go(20)'}">${w?'Start the retest':'Build my test'}</button></div>
 <b class="sm">Limits, topic by topic</b><div class="g2">${T.map((t,i)=>`<button class="card" style="text-align:left;padding:10px" onclick="A.openTopic(${i})"><b class="xs">${t.name}</b><div class="xs mut">${S.lvl[i]?`Level ${S.lvl[i]} cleared`:'Not tested'}</div></button>`).join('')}</div>
 <div class="g2"><button class="card" style="text-align:left" onclick="go(46)"><b class="sm">Mistake notebook</b><div class="xs mut">${nb} saved</div></button><button class="card" style="text-align:left" onclick="A.openTopic(0)"><b class="sm">Revision cards</b><div class="xs mut">${Object.keys(S.got).length} sections done</div></button></div>
 </div></div>${bnav('Profile')}</div>`};
R[59]=()=>{const real=S.attempts.filter(a=>!a.sample);const pts=real.length>=2?real.slice(-4).map(a=>[a.score,a.max]):[[11,36],[15,36],[20,36]];const smp=real.length<2;const mx=Math.max(...pts.map(p=>p[1]));
 const accs=real.length?Math.round(real.reduce((s,a)=>s+grade(a).acc,0)/real.length):68;
 return `<div class="scr">${hdr('My progress','Score trend',null)}<div class="scroll"><div class="pad stack">${progTabs(59)}
 <div class="card"><div class="row"><div class="eyebrow sp">Score trend</div>${smp?'<span class="sample">Sample data</span>':''}</div>
  <div class="chart">${pts.map((p,i)=>`<div class="${i===pts.length-1?'last':''}">${p[0]}<i style="height:${Math.max(4,p[0]/mx*100)}%"></i></div>`).join('')}</div>
  <div class="xs" style="color:var(--grn);font-weight:800;margin-top:8px">${pts[pts.length-1][0]-pts[0][0]>=0?'+':''}${pts[pts.length-1][0]-pts[0][0]} marks · ${accs}% accuracy</div></div>
 <div class="g2"><div class="card" style="text-align:center"><div class="eyebrow" style="color:var(--mut)">Streak</div><b style="font-size:24px">${streakN()}</b><div class="xs mut">days</div></div><div class="card" style="text-align:center"><div class="eyebrow" style="color:var(--mut)">Level</div><b style="font-size:20px">${title()[0]}</b><div class="xs mut">${S.xp} XP</div></div></div>
 <div class="card"><div class="eyebrow">This week's missions · ${[Object.keys(S.got).length>=2,real.length>0,real.some(a=>a.score/a.max>=.6)].filter(Boolean).length}/3</div>
  ${[['Read 2 summary sections',Object.keys(S.got).length>=2],['Finish a test',real.length>0],['Score 60%+',real.some(a=>a.score/a.max>=.6)]].map(m=>`<div class="row sm" style="margin-top:6px"><span class="cb ${m[1]?'on':''}" style="width:17px;height:17px">${m[1]?'✓':''}</span>${m[0]}</div>`).join('')}<div class="xs mut" style="margin-top:6px">Missions are a bonus, not a cap.</div></div>
 </div></div>${bnav('Progress')}</div>`};
R[60]=()=>{const p=Math.round(chapPct()/14);return `<div class="scr">${hdr('JEE Main · Maths','Your syllabus',57)}<div class="scroll"><div class="pad stack">${progTabs(60)}
 <div class="card"><div class="eyebrow">Maths complete</div><b style="font-size:26px">${p}%</b><div class="bar" style="margin-top:6px"><i style="width:${p}%"></i></div></div>
 ${CHAPTERS.Maths.map((c,i)=>{const v=i===0?chapPct():0;return `<button class="card" style="text-align:left" onclick="${i===0?'go(14)':`A.other(${i})`}"><div class="row"><b class="sm sp">${c}</b><b class="xs" style="color:var(--acc)">${v}%</b></div><div class="bar" style="height:5px;margin-top:6px"><i style="width:${v}%"></i></div></button>`}).join('')}
 <button class="link" onclick="go(12)">+ Physics and Chemistry chapters</button></div></div>
 <div class="foot"><button class="btn" onclick="A.other(1)">Open next chapter</button></div></div>`};
R[61]=()=>`<div class="scr">${hdr('Limits','',57,'')}<div class="scroll"><div class="pad" style="text-align:center;padding-top:110px">
 <div class="ring" style="--p:100;width:130px;height:130px;margin:0 auto"><b style="width:108px;height:108px;font-size:28px">100%</b></div>
 <h2 class="h" style="margin-top:18px">Chapter complete</h2><div class="sm mut">All 6 topics at Level 5</div><span class="chip" style="background:var(--org);color:#fff;margin-top:10px;padding:5px 12px">Title earned: Limit Master</span>
 <div class="xs mut" style="margin-top:14px">Preview of the 100% state.</div></div></div><div class="foot"><button class="btn" onclick="A.other(1)">Start the next chapter</button></div></div>`;
R[62]=()=>{const B=[['1st','First Test','Finish any test',S.badges.first],['3d','3-day streak','Practise 3 days in a row',S.streak>=3],['+5','Score +5','Beat a score by 5 marks',S.attempts.filter(a=>!a.sample&&a.prevScore!==null&&a.score-a.prevScore>=5).length],['✓','Topic cleared','Clear Level 3 of any topic',S.lvl.some(l=>l>=3)],['L5','Level 5 mastery','Clear Level 5 of a topic',S.lvl.some(l=>l>=5)],['100','Chapter done','All 6 topics at Level 5',S.lvl.every(l=>l>=5)]];
 const nx=B.find(b=>!b[3]);
 return `<div class="scr">${hdr('My progress','Badges',null)}<div class="scroll"><div class="pad stack">${progTabs(62)}
 <div class="card"><div class="g2" style="grid-template-columns:repeat(3,1fr);gap:14px 8px">${B.map(b=>`<div style="text-align:center"><div class="badge ${b[3]?'e':'l'}">${b[0]}</div><b class="xs" style="display:block;margin-top:5px">${b[1]}</b><div class="xs mut" style="font-size:10px">${b[3]?'Earned':'Not yet'}</div></div>`).join('')}</div></div>
 ${nx?`<div class="card" style="background:#FFF8DB;border-color:#F0DD8A"><b class="sm">Next badge: ${nx[1]}</b><div class="xs mut">${nx[2]} to earn it · +40 XP</div></div>`:''}
 </div></div>${bnav('Progress')}</div>`};

/* ===== Actions ===== */
const A={
 ob(step,v){S.ob[step]=v;render()},
 obNext(step){if(step===0)S.grade=S.ob[0];if(step===1)S.goal=parseInt(S.ob[1])||3;if(step<2){S.obStep=step+1;render()}else{if(S.ob[2]&&S.ob[2]!=='English')toast('Saved: '+S.ob[2]+'. This demo shows English only.',3200);go(10)}},
 obSkip(step){if(!S.ob[step])S.ob[step]=['12','3','English'][step];A.obNext(step)},
 loopDone(){return S.attempts.filter(a=>!a.sample).length>=2},
 examGo(){const e=S.exam;if(e==='JEE Main')go(10);else if(e==='BITSAT')go(44);else if(e==='NDA')go(45);else{toast(`Demo shows JEE Main. ${e} uses the same pages once its tests are added.`);go(10)}},
 profile(){toast(`Class ${S.ob[0]||'12'} · ${S.exam} · ${S.ob[2]||'English'}. Demo: no account needed.`)},
 other(){toast('This demo has the Limits question bank loaded. Other chapters open the same way once their question file is added.',3400)},
 openTopic(i){S.sumTopic=i;R16reset=true;go(16)},
 zoom(i){S.open=i;go(i<0?14:15)},
 lesson(i){S.sumTopic=i;S.tryOne=null;go(18)},
 tryOne(L){if(!S.tryOne){S.tryOne=L;addXP(2,'tried one')}render()},
 sec(k){S.sumOpen[k]=!S.sumOpen[k];if(!S.sumOpen[k])S.sumFull[k]=0;render()},
 full(k){S.sumOpen[k]=1;S.sumFull[k]=1;render()},
 got(k){S.got[k]=1;addXP(5,'section done');render()},
 patternLine(ti){const g=G();const rr=g.rows.filter(r=>r.q.t===ti);if(!rr.length)return 'Not tested yet. Take a Level 1 test to see your pattern here.';const b=rr.filter(r=>r.st!=='ok');if(!b.length)return `All ${rr.length} right in your last test. Try one level higher.`;return `${b.length} of ${rr.length} lost in your last test: ${b.map(r=>r.why.toLowerCase()).join(', ')}. Read the usual slip below first.`},
 buildFrom(ti,lv){if(ti>=0)S.build.topics=T.map((_,i)=>i===ti?1:0);if(lv)S.build.level=lv;S.cur=null;go(20)},
 clearTopics(){S.build.topics=[0,0,0,0,0,0];render()},
 tgl(i){S.build.topics[i]=S.build.topics[i]?0:1;render()},
 step(i,d){S.build.n[i]=Math.max(1,Math.min(Math.min(10,avail(i)),S.build.n[i]+d));render()},
 startBuild(){const b=S.build;const sel=b.topics.map((x,i)=>x?i:-1).filter(i=>i>=0);S.cur=makeTest(sel,b.n,buildLevels());S.agree=false;go(21)},
 begin(){S.cur.running=true;S.cur.qT=Date.now();S.nudge=0;go(22)},
 leaveQ(){const t=S.cur;if(!t||!t.qT)return;t.time[t.idx]=(t.time[t.idx]||0)+(Date.now()-t.qT)/1000;t.qT=Date.now()},
 sel(L){S.cur.sel[S.cur.idx]=L;render()},
 key(k){const t=S.cur;let v=String(t.sel[t.idx]??t.ans[t.idx]??'');if(k==='del')v=v.slice(0,-1);else if(k==='-'){if(!v)v='-'}else if(k==='.'){if(!v.includes('.'))v+='.'}else if(v.length<8)v+=k;t.sel[t.idx]=v;render()},
 to(k){A.leaveQ();const t=S.cur;t.idx=k;t.vis[k]=1;S.scr=22;render()},
 jump(k){A.to(k)},prev(){if(S.cur.idx>0)A.to(S.cur.idx-1)},
 next(){const t=S.cur;if(t.idx<t.qs.length-1)A.to(t.idx+1);else{S.scr=22;render();toast('Last question. Tap SUBMIT when you are done.')}},
 commit(){const t=S.cur,i=t.idx;const v=t.sel[i];if(v!==undefined){if(v===''||v==='-')delete t.ans[i];else t.ans[i]=v}
  const n=t.qs.filter((_,k)=>t.ans[k]!==undefined).length;if(n>=4&&!t.nudged){t.nudged=true;S.nudge=n}},
 saveNext(){A.commit();S.cur.mark[S.cur.idx]=false;A.next()},
 markNext(){A.commit();S.cur.mark[S.cur.idx]=true;A.next()},
 clear(){const t=S.cur;delete t.sel[t.idx];delete t.ans[t.idx];t.mark[t.idx]=false;render()},
 font(d){S.cur.font=Math.max(-1,Math.min(1,S.cur.font+d));render()},
 formula(){go(24)},endTap(){go(26)},reportInfo(){S.nudge=0;go(26)},
 submit(auto){const t=S.cur;if(!t){go(29);return}A.leaveQ();Object.keys(t.sel).forEach(i=>{const v=t.sel[i];if(v!==''&&v!=='-'&&v!==undefined)t.ans[i]=v});t.running=false;
  const first=!S.attempts.some(a=>!a.sample);finishAttempt(t);S.firstReal=first;S.verified=false;S.nudge=0;if(auto)toast('Time is up. Your test was submitted.');go(29)},
 viewResult(){S.resTab='perf';if(S.firstReal){S.firstReal=false;go(32)}else go(31)},
 afterBadge(){go(31)},
 exitRes(){go(38)},
 plan(g){const w=g.weak;const n1=w[0]?T[w[0].t].name:T[g.a.topics[0]].name;const n2=w[1]?T[w[1].t].name:n1;const lv=nextLv(g);
  return `<b>Day 1:</b> redo the ${w[0]?w[0].bad+w[0].skip:0} questions you lost in ${n1}, then read its usual slips. <b>Day 2:</b> ${w[1]?`same for ${n2}`:`watch the teacher clip for ${n1}`}; read each solution first. <b>Day 3:</b> retest at Level ${lv} and beat ${g.score}.`},
 ved(k,g){const w=g.weak[0];const rs2=g.rows.filter(r=>r.st==='bad'&&r.why==='Rushed');const slow=g.rows.filter(r=>r.t>r.q.tt*1.3);
  if(k==='why'||k==='first'){if(!w)return 'You did not lose marks in this test. Move one level up.';return `You lost ${g.lostTot} marks. ${w.lost} came from <b>${T[w.t].name}</b>: ${w.bad} wrong and ${w.skip} skipped.${g.weak[1]?` Next is ${T[g.weak[1].t].name} with ${g.weak[1].lost}.`:''} ${g.types['Rushed']?`${g.types['Rushed']} of your wrong answers were rushed, under 40% of the expected time.`:''}`}
  if(k==='revise'){if(!w)return 'Nothing urgent. Try the next level.';const s=T[w.t].sections.find(x=>x.slip);return `Start with <b>${T[w.t].name}</b>. Read "${esc(s?s.ti:T[w.t].sections[0].ti)}" and its usual slip, then watch the clip ${CLIPS[w.t][0]}–${CLIPS[w.t][1]}.`}
  if(k==='time')return `You used ${fmt(g.spent)} of ${g.a.dur}:00. ${slow.length?`${slow.length} question${slow.length>1?'s':''} took over 1.3× the expected time.`:'No question ran far over time.'} ${rs2.length?`${rs2.length} wrong answer${rs2.length>1?'s were':' was'} rushed. Slow down on those.`:''}`;
  if(k==='plan')return A.plan(g);
  return 'For now I answer from your own test: where you lost marks, what to revise first, your timing, or a 3-day plan. A real AI model would let me answer anything.'},
 ask(k,label){const g=G();S.chat.push(['u',label],['v',A.ved(k,g)]);render();const c=document.getElementById('chat');if(c)c.scrollTop=c.scrollHeight},
 askFree(txt){if(!txt.trim())return;const t=txt.toLowerCase();const k=/time|slow|fast|speed/.test(t)?'time':/revise|first|start|study/.test(t)?'revise':/plan|day|week/.test(t)?'plan':/why|lose|lost|mark|wrong/.test(t)?'why':'x';A.ask(k,esc(txt))},
 sendReport(){const v=(document.getElementById('ph')||{}).value||'';if(!/^[6-9]\d{9}$/.test(v)){toast('Enter a 10-digit mobile number');return}toast(`Demo: the report would go to +91 ${v}`);closeOv()},
 nextTopic(){const g=G();const nt=T.findIndex((_,i)=>!g.a.topics.includes(i));A.buildFrom(nt<0?0:nt)},
 checkout(it){S.pay.item=it;go(it==='pack'?49:50)},
 pay(){S.bought=S.pay.item;addXP(0);S.badges.buyer=1;save();go(52)},
 fix(t){S.fixed[t]=1;addXP(10,'topic fixed');const g=G();if(g.weak.every(b=>S.fixed[b.t]))go(55);else render()},
 retest(lv){const g=G();const w=(g.weak.length?g.weak:g.byT).slice(0,3).map(b=>b.t);const n=[3,3,3,3,3,3];S.cur=makeTest(w,n,Object.fromEntries(w.map(t=>[t,recLevel(t)])),{retest:true});S.agree=false;go(21)},
 retestWrong(){const ts=[...new Set(wrongRows().filter(r=>!S.nbFixed[r.key]).map(r=>r.q.t))];S.cur=makeTest(ts.length?ts:[0],[3,3,3,3,3,3],G().a.level,{retest:true});S.agree=false;go(21)},
 diag(){S.cur=makeTest([4,5],[3,3,3,3,3,3],1);S.agree=false;go(21)}
};

/* ===== Router ===== */
const BASE={8:1,9:1,11:10,19:16,24:22,26:22,27:22,28:22,29:30,31:30,32:30,34:30,37:36,38:30,52:57,55:47,56:54};
const NAMES=window.__NAMES__;
const GROUPS=[['Page 1 · JEE page (first visit)',[1,2,3,4,5,6,7,8,9]],['Page 2 · Free test page = your dashboard',[10,12,13,11,57,58,59,60,61,62]],['Page 3 · Topic summary',[16,17,18,19]],['Page 4 · Pick topics and level',[20]],['Page 5 · Give test',[21,22,23,24,25,26,27,28,29]],['Page 6 · Result and analysis',[30,33,31,32,34,35,36,37,38,46]],['Page 7 · What next and upsell',[54,56,53,47,55,48,49,50,51,52,39,40,41,42,43,44,45]]];
let prevScr=null;
function go(n){if(typeof n!=='number'||!R[n])return;
 if(n===8&&S.scr!==8)S.obStep=0;
 if((n===16||n===17)&&![16,17,19].includes(S.scr))R16reset=true;
 if(n===31||n===34||n===39)S.resTab='perf';
 if(n>=22&&n<=28){ensureTest();if(!S.cur.running){S.cur.running=true;S.cur.qT=Date.now()}}
 if(n===56)S.seen.streak=1;
 if(n===54&&S.streakFor!==S.attempts.length&&S.attempts.some(a=>!a.sample)){S.streakFor=S.attempts.length;n=56}
 S.scr=n;save();render();closeSide()}
function closeOv(){const t=BASE[S.scr]??(S.scr>=39&&S.scr<=45?(prevBase||30):S.scr);go(t)}
let prevBase=30;
function render(){const ph=document.getElementById('phone');const same=prevScr===S.scr;const sc=ph.querySelector('.scr .scroll');const keep=same&&sc?sc.scrollTop:0;const ov=ph.querySelector('.ov .sheet,.ov .center');const keepO=same&&ov?ov.scrollTop:0;
 let out=R[S.scr]();if(typeof out==='string')out={base:out};
 if(!out.sheet&&!out.center&&!(S.scr>=21&&S.scr<=29))prevBase=S.scr;
 ph.innerHTML=out.base+(out.sheet?`<div class="ov on"><div class="dim" onclick="closeOv()"></div><div class="sheet">${out.sheet}</div></div>`:'')+(out.center?`<div class="ov on"><div class="dim"></div><div class="center">${out.center}</div></div>`:'');
 if(window.renderMathInElement){try{renderMathInElement(ph,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})}catch(e){}}
 const s2=ph.querySelector('.scr .scroll');
 if(same){if(s2)s2.scrollTop=keep;const o2=ph.querySelector('.ov .sheet,.ov .center');if(o2)o2.scrollTop=keepO}
 else if(s2){const id=S.scr>=1&&S.scr<=7?'s'+S.scr:S.scr===33?'s33':null;const el=id&&ph.querySelector('#'+id);s2.scrollTop=el&&S.scr!==1?el.offsetTop-6:0}
 if(!same&&S.scr===17){const fb=ph.querySelector('.fbox');if(fb)fb.scrollIntoView({block:'center'})}
 prevScr=S.scr;
 document.querySelectorAll('.side a').forEach(a=>a.classList.toggle('on',+a.dataset.n===S.scr));
 const on=document.querySelector('.side a.on');if(on&&!same)on.scrollIntoView({block:'nearest'})}
function side(){return GROUPS.map(([name,ns])=>`<div class="grp">${name}</div>`+ns.map(n=>`<a data-n="${n}" onclick="go(${n})"><b>${n}</b><span>${NAMES[n-1]}</span></a>`).join('')).join('')}
function closeSide(){document.getElementById('side').classList.remove('open')}
function resetDemo(){try{localStorage.removeItem('t360')}catch(e){}S=fresh();prevScr=null;go(1);toast('Demo reset')}

/* replace the question bank with a CSV in the same format as limits_bank.csv */
function parseCSV(txt){const rows=[];let row=[],f='',q=false;for(let i=0;i<txt.length;i++){const c=txt[i];if(q){if(c==='"'){if(txt[i+1]==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===','){row.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&txt[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f=''}else f+=c}if(f||row.length){row.push(f);rows.push(row)}
 const h=rows.shift().map(x=>x.trim());return rows.filter(r=>r.length>=h.length-1&&r[0]).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]??''])))}
function loadBank(file){const fr=new FileReader();fr.onload=()=>{try{const rows=parseCSV(fr.result);const topicOf=tag=>{const m=/^2\.(\d+)/.exec(tag||'');if(m){const n=+m[1];return n<=14?0:n<=16?1:n<=19?2:3}const k=T.findIndex(t=>(tag||'').toLowerCase().includes(t.name.toLowerCase().split(' ')[0]));return k<0?0:k};
  const nq=rows.map(r=>({id:r.id,t:r.topic!==undefined&&r.topic!==''?(+r.topic-1):topicOf(r.concept_tag),c:r.concept_tag,d:(r.difficulty||'medium').toLowerCase(),ty:/single/.test(r.type)?'sc':'num',q:r.question_text,o:[r.option_a,r.option_b,r.option_c,r.option_d],a:(r.correct_answer||'').trim().toLowerCase(),mc:parseInt(r.marks_correct)||4,mw:parseInt(r.marks_wrong)||0,tt:parseInt(r.target_time_seconds)||110,s:r.solution||'',h:r.hint||'',m:r.wrong_option_mistakes||'',src:r.source||'file'}));
  if(!nq.length)throw 0;const keep=D.Q.filter(q=>q.src==='sample'&&!nq.some(x=>x.t===q.t));Q=[...nq,...keep];S.cur=null;S.attempts=[];save();go(20);toast(`Loaded ${nq.length} questions from ${file.name}`)}catch(e){toast('Could not read that file. Use the same columns as limits_bank.csv.')}};fr.readAsText(file)}

/* timer */
setInterval(()=>{const t=S.cur;if(!t||!t.running||!(S.scr>=22&&S.scr<=28))return;t.left--;const el=document.getElementById('tmr');if(el)el.textContent=fmt(t.left);if(t.left<=0){t.running=false;A.submit(true)}},1000);
window.addEventListener('DOMContentLoaded',()=>{load();document.getElementById('side-list').innerHTML=side();if(!R[S.scr])S.scr=1;if(S.scr<=7&&S.attempts.some(a=>!a.sample))S.scr=10;
 if(S.cur&&S.cur.running)S.cur.qT=Date.now();render()});
