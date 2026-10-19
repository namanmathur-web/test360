/* ===== Vedantu Test360 — front-end demo. Core, state, data helpers ===== */
const PRICE={pack:99,series:2999,bitsat:599,combo:2999,nda:499,chapters:54};   // ONE price sheet: every page reads from here
PRICE.upgrade=PRICE.series-PRICE.pack;
const rs=n=>'₹'+n.toLocaleString('en-IN');
const D=window.__DATA__; let Q=D.Q; const T=D.T;
const TOPIC_SHORT=['Algebraic','Trig','Log & Exp',"Expansions & L'H",'Continuity','Differentiability'];
const LEVELS=[['Basic',1],['Core',1.2],['Mixed',1.5],['Tough',2],['Ranker',3]];
const TITLES=[['Rookie',0],['Explorer',30],['Aspirant',75],['Ranker',160],['Topper',320]];
const CAN=[
 ['Spot a 0/0 form and cancel the factor that causes it.','Rationalise a square-root limit with its conjugate.','Divide by the highest power as x goes to ∞.'],
 ['Force the angle to go to zero before using sin x / x.','Read the answer off the coefficients in one line.','Use the two identities a limit ever needs.'],
 ['Make ln(1 + t)/t appear and read the answer.','Turn (aˣ − 1)/x into ln a.','Solve any 1^∞ limit as e to the λ.'],
 ['Write the five standard expansions from memory.','Match the lowest power and read the coefficient.',"Know when L'Hôpital is the only way in."],
 ['Check LHL = RHL = f(a) at a point.','Find a constant that makes a function continuous.','Name the type of a discontinuity.'],
 ['Find LHD and RHD at a point.','Test continuity first, then the derivative.','Spot the corners that kill the derivative.']];
const IDEA=['If substitution gives 0/0, a common factor is hiding. Remove it, then substitute.','sin x / x → 1 only when the angle itself goes to 0.','Every log or exponential limit is built to look like ln(1 + t)/t or (eᵗ − 1)/t.','Expand each term up to the first power that does not cancel.','A function is continuous at a point when the left limit, the right limit and the value all agree.','No corner, no jump: that is what a derivative needs.'];
const CLIPS=[['6:10','12:40'],['12:40','24:15'],['05:15','11:20'],['18:02','26:30'],['31:10','38:45'],['40:05','49:20']];
const CHAPTERS={
 Maths:['Limits, Continuity & Differentiability','Differentiation','Application of Derivatives','Indefinite Integration','Definite Integration','Area Under Curves','Differential Equations','Sets, Relations and Functions','Complex Numbers and Quadratic Equations','Matrices and Determinants','Permutations, Combinations and Binomial','Sequences and Series','Coordinate Geometry','Vectors and 3D Geometry'],
 Physics:['Units and Measurements','Kinematics','Laws of Motion','Work, Energy and Power','Rotational Motion','Gravitation','Properties of Solids and Liquids','Thermodynamics','Kinetic Theory of Gases','Oscillations and Waves','Electrostatics','Current Electricity','Magnetic Effects of Current','Magnetism and Matter','EMI and AC','Electromagnetic Waves','Optics','Dual Nature of Matter','Atoms and Nuclei','Semiconductors'],
 Chemistry:['Mole Concept','Atomic Structure','Chemical Bonding','Thermodynamics','Chemical Equilibrium','Ionic Equilibrium','Redox Reactions','Electrochemistry','Chemical Kinetics','Solutions','Periodic Table','p-Block Elements','d and f Block Elements','Coordination Compounds','General Organic Chemistry','Hydrocarbons','Haloalkanes and Haloarenes','Alcohols, Phenols and Ethers','Aldehydes, Ketones and Acids','Amines and Biomolecules']};
const CH_TOPICS={Maths:[6,8,5,4,4,3,3,4,5,4,4,3,6,5]};

function fresh(){return{scr:1,grade:null,ob:[null,null,null,'English'],obStep:0,exam:'JEE Main',subj:'Maths',xp:0,streak:4,
 lvl:[0,0,0,0,0,0],read:{},got:{},open:-1,sumTopic:0,sumOpen:{},sumFull:{},
 build:{topics:[1,1,1,0,0,0],n:[3,3,3,3,3,3],level:3},cur:null,attempts:[],resTab:'perf',ansFilter:'all',
 bought:null,fixed:{},nbFixed:{},nbTab:'all',seen:{},badges:{},chat:[],pay:{item:'pack',method:'upi'},lastSample:false}}
let S=fresh();
function save(){try{const c=Object.assign({},S);localStorage.setItem('t360',JSON.stringify(c))}catch(e){}}
function load(){try{const v=localStorage.getItem('t360');if(v){S=Object.assign(fresh(),JSON.parse(v))}}catch(e){}}

const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const qById=id=>Q.find(q=>q.id===id);
function title(){let t=TITLES[0];for(const x of TITLES)if(S.xp>=x[1])t=x;return t}
function nextTitle(){for(const x of TITLES)if(S.xp<x[1])return x;return null}
const chapPct=()=>Math.round(S.lvl.reduce((a,b)=>a+b,0)/30*100);
function ladder(n){let h='<div class="ladder">';for(let i=1;i<=5;i++)h+=`<i class="${i<=n?'f'+i:''}"></i>`;return h+'</div>'}
function ring(p,label){return `<div class="ring" style="--p:${p}"><b>${label??p+'%'}</b></div>`}
function xpChip(){return `<span class="chip xp">⚡ ${S.xp} XP</span>`}
function hdr(t,s,back,right){return `<div class="top">${back!==undefined&&back!==null?`<button class="bk" onclick="go(${back})" aria-label="Back">‹</button>`:''}<div class="tt"><b>${t}</b>${s?`<small>${s}</small>`:''}</div>${right??xpChip()}</div>`}
function bnav(on){const it=[['Home',10],['All exams',11],['Progress',57],['Profile',58]];
 return `<div class="bnav">${it.map(([l,n])=>`<button class="${on===l?'on':''}" onclick="${n==='prof'?'A.profile()':'go('+n+')'}"><i></i>${l}</button>`).join('')}</div>`}
function toast(msg,ms=2600){const p=document.getElementById('phone');const old=p.querySelector('.toast');if(old)old.remove();const d=document.createElement('div');d.className='toast';d.textContent=msg;p.appendChild(d);setTimeout(()=>d.remove(),ms)}
function addXP(n,why){S.xp+=n;if(why)toast(`+${n} XP · ${why}`);save()}

/* ---- question selection by level (bank is tagged easy / medium / hard only; levels re-order by difficulty) ---- */
const PREF={1:['easy','medium','hard'],2:['easy','medium','hard'],3:['medium','easy','hard'],4:['hard','medium','easy'],5:['hard','medium','easy']};
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
function pick(topic,n,level,seed){const r=rng(seed+topic*97+level*13);const seen=new Set(S.attempts.flatMap(a=>a.qs));
 const pool=Q.filter(q=>q.t===topic);const order=PREF[level];
 const scoreQ=q=>order.indexOf(q.d)*10+(seen.has(q.id)?30:0)+r()*(level===2||level===4?12:6);
 return pool.map(q=>[scoreQ(q),q]).sort((a,b)=>a[0]-b[0]).slice(0,n).map(x=>x[1])}
function avail(t){return Q.filter(q=>q.t===t).length}

/* ---- build a test ---- */
function makeTest(topics,nper,level,opts={}){const seed=(S.attempts.length+1)*7919;
 let qs=[];topics.forEach(t=>qs.push(...pick(t,Math.min(nper[t],avail(t)),level,seed)));
 const sc=qs.filter(q=>q.ty==='sc'),nm=qs.filter(q=>q.ty==='num');qs=[...sc,...nm];
 const secs=[];if(sc.length)secs.push({name:'MAT SEC 1',ty:'sc',from:0,to:sc.length});if(nm.length)secs.push({name:'MAT SEC 2',ty:'num',from:sc.length,to:qs.length});
 const dur=Math.max(5,Math.ceil(qs.reduce((a,q)=>a+q.tt,0)/60));
 return{qs:qs.map(q=>q.id),secs,topics,level,dur,left:dur*60,idx:0,ans:{},sel:{},mark:{},vis:{0:1},time:{},t0:Date.now(),answered:0,nudged:false,retest:!!opts.retest,sample:!!opts.sample,font:0}}

/* ---- scoring and the rule-based "Ved AI" ---- */
function grade(test){const rows=test.qs.map((id,i)=>{const q=qById(id);const a=test.ans[i];const t=Math.round(test.time[i]||0);
  let st='skip',m=0;if(a!==undefined&&a!==''){const ok=q.ty==='sc'?a===q.a:Math.abs(parseFloat(a)-parseFloat(q.a))<1e-6;st=ok?'ok':'bad';m=ok?q.mc:q.mw}
  let why=null;if(st==='bad')why=t<q.tt*0.4?'Rushed':'Concept or calculation slip';if(st==='skip')why='Not attempted';
  return{i,q,a,st,m,t,why,lost:q.mc-m}});
 const score=rows.reduce((s,r)=>s+r.m,0),max=rows.reduce((s,r)=>s+r.q.mc,0);
 const ok=rows.filter(r=>r.st==='ok').length,bad=rows.filter(r=>r.st==='bad').length,skip=rows.filter(r=>r.st==='skip').length;
 const att=ok+bad,acc=att?Math.round(ok/att*100):0;const spent=rows.reduce((s,r)=>s+r.t,0);
 const byT=test.topics.map(t=>{const rr=rows.filter(r=>r.q.t===t);return{t,n:rr.length,ok:rr.filter(r=>r.st==='ok').length,lost:rr.reduce((s,r)=>s+r.lost,0),bad:rr.filter(r=>r.st==='bad').length,skip:rr.filter(r=>r.st==='skip').length}}).filter(x=>x.n);
 const weak=[...byT].filter(x=>x.lost>0).sort((a,b)=>b.lost-a.lost);
 const easyLost=rows.filter(r=>r.st!=='ok'&&r.q.d!=='hard');const gain=easyLost.reduce((s,r)=>s+r.lost,0);
 const lostTot=rows.reduce((s,r)=>s+r.lost,0);
 const types={'Concept or calculation slip':0,'Rushed':0,'Not attempted':0};rows.forEach(r=>{if(r.why)types[r.why]++});
 const attPct=Math.round(att/rows.length*100);
 let kind='Balanced Learner',kindLine='so build coverage and refine your approach to lift accuracy';
 if(acc>=75&&attPct>=70){kind='Sharp Shooter';kindLine='so push one level higher and keep the accuracy'}
 else if(attPct>=80&&acc<55){kind='Fast Risk-taker';kindLine='you attempt almost everything, but accuracy is costing marks. Slow down on questions you cannot narrow down'}
 else if(attPct<55){kind='Careful Skipper';kindLine='you leave too many questions. Attempt the ones you can narrow to two options'}
 return{rows,score,max,ok,bad,skip,att,acc,spent,byT,weak,gain,easyLost,lostTot,types,attPct,kind,kindLine}}
function lastAttempt(){if(!S.attempts.length)sampleAttempt();return S.attempts[S.attempts.length-1]}
function sampleAttempt(){const t=makeTest([0,1,2],[3,3,3,3,3,3],3,{sample:true});
 const pattern=['ok','bad','ok','skip','bad','ok','bad','skip','ok'];
 t.qs.forEach((id,i)=>{const q=qById(id);const p=pattern[i%pattern.length];t.time[i]=p==='bad'&&i%2?Math.round(q.tt*.3):Math.round(q.tt*.9);
  if(p==='ok')t.ans[i]=q.a;else if(p==='bad')t.ans[i]=q.ty==='sc'?['a','b','c','d'].find(x=>x!==q.a):String((parseFloat(q.a)||0)+1)});
 finishAttempt(t,true)}
function finishAttempt(t,silent){const g=grade(t);const mult=LEVELS[t.level-1][1];const xp=Math.round((g.ok*10*mult)+20);
 const prev=S.attempts.length?S.attempts[S.attempts.length-1]:null;
 S.attempts.push({qs:t.qs,ans:t.ans,time:t.time,topics:t.topics,level:t.level,dur:t.dur,secs:t.secs,sample:t.sample,xp,when:Date.now(),prevScore:prev?prev.score:null,prevMax:prev?prev.max:null,score:g.score,max:g.max});
 if(!silent)g.byT.forEach(b=>{if(b.ok/b.n>=0.6)S.lvl[b.t]=Math.max(S.lvl[b.t],t.level)});
 S.lastSample=t.sample;
 if(!silent){S.xp+=xp;S.badges.first=1;if(S.attempts.filter(a=>!a.sample).length>=2)S.badges.score5=1}else{S.badges.first=1}
 S.cur=null;S.chat=[];S.seen.res=0;S.seen.ans=0;save();return g}
const G=()=>{const a=lastAttempt();return Object.assign(grade(Object.assign({},a)),{a})};
