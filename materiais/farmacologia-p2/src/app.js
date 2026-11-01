/* SINUS · motor interativo da apostila (mapas, exercícios, flashcards, progresso) */
(function(){
'use strict';
var KEY='sinus.farmaco.p2.v1';
var S;try{S=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){S={}}
S.mm=S.mm||{};S.q=S.q||{};S.fc=S.fc||{};S.prova=S.prova||{};
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}prog()}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstElementChild}
var MAPS={};(window.SINUS_MAPAS||[]).forEach(function(m){MAPS[m.id]=m});
var Q=window.SINUS_QUESTOES||{},C=window.SINUS_CARTOES||{};

/* ---------------- mapas mentais ---------------- */
var COL=['#2a7a52','#3d6f8c','#6d5a9a','#9a6f3a'],BG=['#f3f9f5','#f1f6f9','#f5f3fa','#fbf7f0'];
function wrap(t,n){var w=String(t).split(' '),L=[],cur='';w.forEach(function(x){if((cur+' '+x).trim().length>n&&cur){L.push(cur);cur=x}else cur=(cur+' '+x).trim()});if(cur)L.push(cur);return L}
function tx(lines,x,y,lh,attrs){var y0=y-(lines.length-1)*lh/2;return '<text x="'+x+'" '+attrs+'>'+lines.map(function(l,i){return '<tspan x="'+x+'" y="'+(y0+i*lh)+'">'+esc(l)+'</tspan>'}).join('')+'</text>'}
function drawMap(box){
 var m=MAPS[box.dataset.mm];if(!m)return;var st=S.mm[m.id]||(S.mm[m.id]={}),prova=!!S.prova[m.id];
 var W=780,LH=36,GAP=8,GG=26,PAD=12,rx=8;
 var gh=2*LH+GAP,H=PAD*2+4*gh+3*GG;
 var rootX=6,rootW=150,bX=210,bW=170,lX=430,lW=W-lX-6;
 var cy=H/2,svg='';
 m.ramos.forEach(function(r,i){
  var gy=PAD+i*(gh+GG),by=gy+gh/2,c=COL[i%4];
  svg+='<path d="M'+(rootX+rootW)+' '+cy+' C'+(rootX+rootW+30)+' '+cy+' '+(bX-30)+' '+by+' '+bX+' '+by+'" fill="none" stroke="'+c+'" stroke-width="1.6"/>';
  r.f.forEach(function(f,j){var ly=gy+j*(LH+GAP)+LH/2;
   svg+='<path d="M'+(bX+bW)+' '+by+' C'+(bX+bW+24)+' '+by+' '+(lX-24)+' '+ly+' '+lX+' '+ly+'" fill="none" stroke="'+c+'" stroke-width="1.3"/>'});
 });
 m.ramos.forEach(function(r,i){
  var gy=PAD+i*(gh+GG),by=gy+gh/2,c=COL[i%4],k='b'+i,showB=!prova||st[k];
  var bl=showB?wrap(r.t,19):['?'];
  svg+='<g class="branch'+(showB?'':' hidden leaf')+'" data-k="'+k+'"><rect x="'+bX+'" y="'+(by-21)+'" width="'+bW+'" height="42" rx="'+rx+'" fill="'+BG[i%4]+'" stroke="'+c+'" stroke-width="1.3"/>'+tx(bl,bX+12,by+4,14,'font-size="12.5" font-weight="700" fill="'+c+'"')+'</g>';
  r.f.forEach(function(f,j){var ly=gy+j*(LH+GAP)+LH/2,kk=i+'-'+j,show=!!st[kk];
   svg+='<g class="leaf'+(show?'':' hidden')+'" data-k="'+kk+'" tabindex="0" role="button" aria-label="'+(show?esc(f):'Revelar folha do ramo '+esc(r.t))+'"><rect x="'+lX+'" y="'+(ly-LH/2)+'" width="'+lW+'" height="'+LH+'" rx="7" fill="#fff" stroke="#d6e4dc"/>'+
   tx(show?wrap(f,48):['revelar'],lX+12,ly+4,13,'font-size="12.5" fill="#253530"')+'</g>'});
 });
 var rl=wrap(m.root,15);
 svg+='<rect x="'+rootX+'" y="'+(cy-Math.max(30,rl.length*10+14))+'" width="'+rootW+'" height="'+Math.max(60,rl.length*20+28)+'" rx="9" fill="#2a7a52"/>'+tx(rl,rootX+14,cy+5,19,'font-size="15" font-weight="800" fill="#fff"');
 var tot=8,done=0;for(var i=0;i<4;i++)for(var j=0;j<2;j++)if(st[i+'-'+j])done++;
 box.innerHTML='<div class="mmhead"><span class="k">'+done+'/'+tot+(prova?' · modo prova':'')+'</span><span class="mmtools noprint"><button data-mmall>Revelar tudo</button><button data-mmhide>Ocultar tudo</button><button data-mmprova>'+(prova?'Sair do modo prova':'Modo prova')+'</button></span></div><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Mapa mental: '+esc(m.title)+'">'+svg+'</svg>';
}
function mapAct(box,act,k){var id=box.dataset.mm,st=S.mm[id]||(S.mm[id]={});
 if(act==='leaf'){st[k]=1}
 else if(act==='all'){for(var i=0;i<4;i++){st['b'+i]=1;for(var j=0;j<2;j++)st[i+'-'+j]=1}}
 else if(act==='hide'){S.mm[id]={}}
 else if(act==='prova'){S.prova[id]=!S.prova[id];S.mm[id]={}}
 save();drawMap(box)}

/* ---------------- exercícios ---------------- */
var LET='ABCDE';
function drawQuiz(box){var k=box.dataset.quiz,L=Q[k]||[],st=S.q[k]||(S.q[k]={});
 var ac=0,re=0,rv=0;L.forEach(function(q,i){if(st[i]!=null&&q.tipo!=='ab'){re++;if(st[i]===1)ac++;else rv++}});
 var h='<div class="score"><div class="s"><b>'+ac+'</b>Acertos</div><div class="s"><b>'+re+'/'+L.filter(function(q){return q.tipo!=='ab'}).length+'</b>Respondidas</div><div class="s"><b>'+rv+'</b>Para revisar</div><button class="btn ghost" data-qreset>Refazer exercícios</button></div>';
 L.forEach(function(q,i){var a=st[i],lab=q.tipo==='mc'?'Múltipla escolha':q.tipo==='vf'?'Verdadeiro ou falso':'Resposta aberta';
  h+='<div class="qbox'+(q.tipo==='ab'?' rv':'')+'" data-i="'+i+'"><div class="qn">Questão '+(i+1)+' <em>'+lab+'</em></div><div class="qt">'+esc(q.q)+'</div>';
  if(q.tipo==='ab'){h+='<button class="btn ghost" data-rv>Revelar resposta</button><div class="ans">'+esc(q.resp)+'</div>'}
  else{var ops=q.tipo==='vf'?['Verdadeiro','Falso']:q.ops,right=q.tipo==='vf'?(q.r?0:1):q.r,pick=S.q[k]['p'+i];
   h+='<div class="opts">'+ops.map(function(o,j){var cls='';if(a!=null){if(j===right)cls=' ok';else if(j===pick)cls=' no'}
    return '<button class="opt'+cls+'" data-o="'+j+'"'+(a!=null?' disabled':'')+'><span class="L">'+(q.tipo==='vf'?(j?'F':'V'):LET[j])+'</span><span>'+esc(o)+'</span></button>'}).join('')+'</div>';
   h+='<div class="fb'+(a!=null?' show '+(a===1?'ok':'no'):'')+'"><b>'+(a===1?'Correto. ':'Resposta: '+(q.tipo==='vf'?(q.r?'Verdadeiro':'Falso'):LET[q.r])+'. ')+'</b>'+esc(q.ex)+'</div>';
   h+='<div class="gab pdf-only"><b>Gabarito:</b> '+(q.tipo==='vf'?(q.r?'Verdadeiro':'Falso'):LET[q.r])+' — '+esc(q.ex)+'</div>'}
  h+='</div>'});
 box.innerHTML=h}
function answer(box,i,o){var k=box.dataset.quiz,q=Q[k][i],right=q.tipo==='vf'?(q.r?0:1):q.r;S.q[k]=S.q[k]||{};
 if(S.q[k][i]!=null)return;S.q[k][i]=o===right?1:0;S.q[k]['p'+i]=o;save();
 var y=box.querySelector('[data-i="'+i+'"]').getBoundingClientRect().top;drawQuiz(box);
 var nb=box.querySelector('[data-i="'+i+'"]');window.scrollBy(0,nb.getBoundingClientRect().top-y)}

/* ---------------- flashcards ---------------- */
function deckState(k){var L=C[k]||[],d=S.fc[k];if(!d||!Array.isArray(d.queue)||d.n!==L.length){d=S.fc[k]={n:L.length,queue:L.map(function(_,i){return i}),known:[],rev:0}}return d}
function drawDeck(box){var k=box.dataset.deck,L=C[k]||[],d=deckState(k),cur=d.queue[0];
 var h='<div class="dk-top"><span class="dk-stats"><b>'+d.known.length+'</b> de '+L.length+' dominados · '+d.queue.length+' na pilha · '+d.rev+' revisões</span><span><button class="btn ghost" data-fshuf>Embaralhar</button> <button class="btn ghost" data-freset>Reiniciar</button></span></div>';
 if(cur==null)h+='<div class="box"><span class="lb">Pilha concluída</span><p>Todos dominados. Reinicie para repassar.</p></div>';
 else h+='<div class="card3" data-flip tabindex="0" role="button" aria-label="Virar cartão"><div class="in"><div class="f"><span class="lbl">Cartão '+(cur+1)+' · frente</span><div class="txt">'+esc(L[cur].f)+'</div></div><div class="b"><span class="lbl">Verso</span><div class="txt">'+esc(L[cur].b)+'</div></div></div></div><div class="dk-ctl"><button class="btn bad" data-fno>Revisar de novo</button><button class="btn good" data-fok>Sei</button></div>';
 h+='<table class="fl-list pdf-only"><thead><tr><th>Frente</th><th>Verso</th></tr></thead><tbody>'+L.map(function(c){return '<tr><td>'+esc(c.f)+'</td><td>'+esc(c.b)+'</td></tr>'}).join('')+'</tbody></table>';
 box.innerHTML=h}
function deckAct(box,a){var k=box.dataset.deck,d=deckState(k);
 if(a==='ok'){var c=d.queue.shift();if(d.known.indexOf(c)<0)d.known.push(c)}
 else if(a==='no'){d.queue.push(d.queue.shift());d.rev++}
 else if(a==='shuf'){for(var i=d.queue.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=d.queue[i];d.queue[i]=d.queue[j];d.queue[j]=t}}
 else if(a==='reset'){delete S.fc[k];deckState(k)}
 save();drawDeck(box)}

/* ---------------- progresso: capítulos lidos + prática ---------------- */
S.lido=S.lido||{};
function prog(){var caps=document.querySelectorAll('[data-cap]'),n=0;
 caps.forEach(function(c){var on=!!S.lido[c.dataset.cap];if(on)n++;c.classList.toggle('lido',on);var cb=c.querySelector('[data-lido]');if(cb)cb.checked=on});
 document.querySelectorAll('[data-toc]').forEach(function(a){a.classList.toggle('done',!!S.lido[a.dataset.toc])});
 var tot=0,ok=0;
 Object.keys(Q).forEach(function(k){Q[k].forEach(function(q,i){if(q.tipo==='ab')return;tot++;if(S.q[k]&&S.q[k][i]!=null)ok++})});
 Object.keys(C).forEach(function(k){tot+=C[k].length;ok+=S.fc[k]&&S.fc[k].known?S.fc[k].known.length:0});
 var b=document.getElementById('progbar'),t=document.getElementById('progtxt');
 if(b)b.style.width=(caps.length?Math.round(n/caps.length*100):0)+'%';
 if(t)t.textContent='Capítulos lidos: '+n+' de '+caps.length+' · '+(tot?Math.round(ok/tot*100):0)+'% dos exercícios e flashcards praticados'}

/* ---------------- abas ---------------- */
function tab(name){document.querySelectorAll('[data-tab]').forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab===name?'true':'false')});
 document.querySelectorAll('[data-pane]').forEach(function(p){p.hidden=p.dataset.pane!==name})}
function goTo(id){var el=document.getElementById(id);if(!el)return;var pane=el.closest('[data-pane]');if(pane&&pane.hidden)tab(pane.dataset.pane);
 setTimeout(function(){el.scrollIntoView({behavior:'smooth',block:'start'})},30)}
document.addEventListener('change',function(e){var c=e.target.closest&&e.target.closest('[data-lido]');if(!c)return;if(c.checked)S.lido[c.dataset.lido]=1;else delete S.lido[c.dataset.lido];save()});

/* ---------------- esquemas: blocos com detalhe ---------------- */
document.querySelectorAll('.st,.br').forEach(function(n){if(n.querySelector('.dt')){n.classList.add('has');n.tabIndex=0;n.setAttribute('role','button')}});
/* ---------------- eventos ---------------- */
document.addEventListener('click',function(e){var t=e.target;
 var tb=t.closest('[data-tab]');if(tb){tab(tb.dataset.tab);window.scrollTo({top:document.querySelector('nav.tabs').offsetTop-4,behavior:'smooth'});return}
 var an=t.closest('a[href^="#"]');if(an&&an.getAttribute('href').length>1){e.preventDefault();goTo(an.getAttribute('href').slice(1));return}
 var leaf=t.closest('.mm .leaf');if(leaf){mapAct(leaf.closest('.mm'),'leaf',leaf.dataset.k);return}
 var mb=t.closest('[data-mmall],[data-mmhide],[data-mmprova]');if(mb){mapAct(mb.closest('.mm'),'mmall' in mb.dataset?'all':'mmhide' in mb.dataset?'hide':'prova');return}
 var o=t.closest('.opt');if(o&&!o.disabled){var qb=o.closest('.qbox');answer(o.closest('.quiz'),+qb.dataset.i,+o.dataset.o);return}
 if(t.closest('[data-qreset]')){var qz=t.closest('.quiz');S.q[qz.dataset.quiz]={};save();drawQuiz(qz);return}
 var rv=t.closest('[data-rv]');if(rv){var a=rv.parentNode.querySelector('.ans');a.classList.toggle('show');rv.textContent=a.classList.contains('show')?'Ocultar resposta':'Revelar resposta';return}
 var hs=t.closest('.has');if(hs){hs.classList.toggle('open');return}
 var f=t.closest('[data-flip]');if(f){f.classList.toggle('flip');return}
 var fb=t.closest('[data-fok],[data-fno],[data-fshuf],[data-freset]');if(fb){deckAct(fb.closest('.deck'),'fok' in fb.dataset?'ok':'fno' in fb.dataset?'no':'fshuf' in fb.dataset?'shuf':'reset')}
});
document.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var t=e.target;
 if(t.matches&&(t.matches('.mm .leaf')||t.matches('[data-flip]')||t.matches('.has'))){e.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});

document.querySelectorAll('.mm').forEach(drawMap);
document.querySelectorAll('.quiz').forEach(drawQuiz);
document.querySelectorAll('.deck').forEach(drawDeck);
prog();
if(location.hash)goTo(location.hash.slice(1));
})();
