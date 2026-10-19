/* ---- revision toolkit (book revise kit: mind map, one-pager, flash cards) ---- */
var BC={tab:"map",i:0,flip:false,kind:"All",top:-1,got:{}};
try{var _bc=localStorage.getItem("vss_bc");if(_bc)BC.got=JSON.parse(_bc)||{};}catch(e){}
function bcSave(){try{localStorage.setItem("vss_bc",JSON.stringify(BC.got));}catch(e){}}
var KC={Recall:"#5814D6",Formula:"#0f6e6e",Method:"#b4521a",Trap:"#8a1c2b"};
function secTopic(no){var n=+no.split(".")[1];return n<=18?0:n<=39?1:n<=52?2:n<=62?3:n<=87?4:5;}
var TOPN=["Algebraic","Trig","Log and Exp","Expand","Continuity","Differentiability"];
function bcPool(){return REV.cards.map(function(c,i){return {c:c,i:i};}).filter(function(x){return (BC.kind==="All"||x.c.kind===BC.kind)&&(BC.top<0||secTopic(x.c.no)===BC.top);});}
function rkMap(){
  return '<div class="rk-root"><small>CHAPTER 1 · MIND MAP</small>'+REV.root.toUpperCase()+'</div><div class="rk-grid">'+REV.mind.map(function(b){
    return '<div class="rk-box" style="--c:'+b.c+'"><div class="rk-t"><span class="rk-n">'+b.n+'</span>'+b.t+'</div><ul>'+b.b.map(function(x){return '<li>'+x+'</li>';}).join("")+'</ul></div>';}).join("")+'</div>';
}
function rkOne(){
  return '<p class="muted" style="margin:0 0 12px">The whole chapter on one page: '+REV.groups.reduce(function(a,g){return a+g.items.length;},0)+' sections in '+REV.groups.length+' groups. Tap a group to open it.</p>'+REV.groups.map(function(g,gi){
    return '<details class="rk-og" style="--k:'+g.items[0].k+'"'+(gi===0?' open':'')+'><summary><span class="rk-on">'+(gi+1)+'</span><span><b>'+g.sub+'</b><small>'+g.items.length+' sections · §'+g.items[0].no+' to §'+g.items[g.items.length-1].no+'</small></span></summary>'+
     g.items.map(function(it){return '<div class="rk-it" style="--k:'+it.k+'"><div class="rk-h"><span>'+it.no+'</span>'+it.title+'</div><div class="rk-p">'+it.text+'</div>'+it.f.map(function(f){return '<div class="rk-fm">'+f+'</div>';}).join("")+'</div>';}).join("")+'</details>';}).join("");
}
function rkCards(){
  var pool=bcPool();if(BC.i>=pool.length)BC.i=0;
  var kinds=["All","Recall","Formula","Method","Trap"],cnt=function(k){return REV.cards.filter(function(c){return k==="All"||c.kind===k;}).length;};
  var got=pool.filter(function(x){return BC.got[x.i]==="got";}).length,card;
  if(!pool.length)card='<div class="rk-empty">No cards match this filter.</div>';
  else{var x=pool[BC.i],c=x.c,st=BC.got[x.i],col=KC[c.kind];
    card='<div class="rk-card" style="--k:'+col+'"><div class="rk-ct"><span class="rk-ck">'+c.kind.toUpperCase()+' · §'+c.no+'</span><span class="rk-cn">'+(BC.i+1)+' of '+pool.length+'</span></div><div class="rk-cs">'+(SECT[c.no]||"")+'</div><div class="rk-cq">'+c.q+'</div>'+
     (BC.flip?'<div class="rk-ca">'+c.f.map(function(f){return '<div class="rk-fm">'+f+'</div>';}).join("")+'<div>'+c.a+'</div></div>':'<div class="rk-ch">Try to answer in your head first.</div>')+
     (st?'<div class="rk-cl"><span class="rk-st '+st+'">'+(st==="got"?"Got it":"Revise again")+'</span></div>':'')+'</div>'+
     '<div class="nbtn" style="margin-top:14px">'+(BC.flip?'<button class="btn quiet" data-a="bcmark" data-v="again">Revise again</button><button class="btn primary" data-a="bcmark" data-v="got">Got it</button>':'<button class="btn quiet" data-a="bcgo" data-d="-1">Previous</button><button class="btn primary" data-a="bcflip">Show answer</button><button class="btn quiet" data-a="bcgo" data-d="1">Skip</button>')+'</div>';}
  return '<div class="rk-chips">'+kinds.map(function(k){return '<button class="fchip'+(BC.kind===k?' on':'')+'" data-a="bckind" data-v="'+k+'">'+k+' '+cnt(k)+'</button>';}).join("")+'</div>'+
   '<div class="rk-chips">'+[["-1","All topics"]].concat(TOPN.map(function(n,i){return [""+i,n];})).map(function(p){return '<button class="fchip'+(BC.top===+p[0]?' on':'')+'" data-a="bctop" data-v="'+p[0]+'">'+p[1]+'</button>';}).join("")+'</div>'+
   '<p class="muted" style="margin:6px 0 12px;font-size:13px">'+REV.cards.length+' cards from the book · '+got+' of '+pool.length+' marked got it</p><div class="rk-cw">'+card+'</div>';
}
function vRevision(){
  var tabs=[["map","Mind map"],["one","One-pager"],["cards","Flash cards"]].map(function(t){return '<button class="xtab'+(BC.tab===t[0]?' on':'')+'" data-a="rvtab" data-v="'+t[0]+'" role="tab" aria-selected="'+(BC.tab===t[0])+'">'+t[1]+'</button>';}).join("");
  var body=BC.tab==="map"?rkMap():BC.tab==="one"?rkOne():rkCards();
  return crumbs([cbtn("Home","home"),cbtn("Limits","hub"),"Revision"])+'<h1 class="xh1">Revision toolkit</h1><p class="muted" style="margin:0 0 16px">The chapter on one mind map, one page of formulas, and flash cards. Built for the day before a test.</p>'+
   '<nav class="xtabs" role="tablist" aria-label="Revision">'+tabs+'</nav><div class="rk-body">'+body+'</div>'+
   '<div class="xtg" style="margin-top:26px"><div class="slips"><h2>Saved topics</h2>'+bookmarksHtml()+'</div><div class="slips"><h2>My mistakes</h2>'+mistakesHtml()+'</div></div>';
}
