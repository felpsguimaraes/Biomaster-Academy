/* Landing: fondo de red molecular dorada plana y estática, tarjetas que "vuelan" hacia ti,
   anillo 3D del método fijado por scroll, laptop que se abre y tilt en tarjetas. Respeta prefers-reduced-motion. */
(function(){
var L=document.getElementById('landing');if(!L)return;
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
var COARSE=window.matchMedia&&matchMedia('(pointer:coarse)').matches;
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};

/* ---------- Temario (desde los datos compartidos) ---------- */
$('#path').innerHTML=BIO.MODS.map(function(m){var on=!m.locked;
 return '<li class="'+(on?'':'off')+'" data-3d="rise"><span class="num">'+m.n+'</span><span class="tag">'+esc(m.tag||'Módulo '+m.n)+'</span><h3>'+esc(m.t)+'</h3><p>'+esc(m.d)+'</p><span class="st '+(on?'on':'soon')+'">'+(on?'● Disponible · '+m.l+(m.l===1?' aula':' aulas'):'Próximamente')+'</span></li>'}).join('');

/* ---------- Planes ---------- */
var FEAT=['Curso completo de Bioquímica','Videoaulas y materiales','Repasos y banco de preguntas','PDFs premium (Ciclo de Krebs y más)','Actualizaciones del contenido'];
var CSYM={USD:'USD',PYG:'Gs',BRL:'R$'},WAYS={USD:'Tarjeta internacional',PYG:'Tarjeta · QR · transferencia',BRL:'PIX · tarjeta'};
function renderPlans(){var c=BIO.getCur();
 $('#curTog').innerHTML='<div class="lp-seg" role="group" aria-label="Moneda">'+BIO.CURS.map(function(x){return '<button type="button" data-cur="'+x[0]+'" aria-pressed="'+(x[0]===c)+'">'+x[1]+'</button>'}).join('')+'</div><span>Paga en tu moneda · '+WAYS[c]+'</span>';
 $('#planGrid').innerHTML=BIO.PLANS.map(function(p){var hot=p.id==='anual',sv=BIO.saveOf(p,c),price=BIO.planPrice(p,c).replace(/^(USD|Gs|R\$)\s/,'');
 return '<article class="lp-plan'+(hot?' hot':'')+'" data-3d="rise">'+(sv>0?'<span class="badge">Ahorra '+sv+'%</span>':'')+'<h3>'+esc(p.name)+'</h3><div class="price"><small>'+CSYM[c]+'</small>'+price+'</div><p class="per">'+(p.months>1?BIO.planPer(p,c)+' por mes · pago por '+p.months+' meses':'por mes · cancela cuando quieras')+'</p><ul>'+FEAT.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul><button class="lp-btn '+(hot?'gold':'primary')+' block" data-pay="'+p.id+'">Elegir '+esc(p.name.split(' ')[0].toLowerCase())+'</button></article>'}).join('');
 items=$$('[data-3d]')}
var items=[];
$('#curTog').addEventListener('click',function(e){var b=e.target.closest('[data-cur]');if(b)BIO.setCur(b.dataset.cur)});
document.addEventListener('biocur:change',renderPlans);

/* ---------- Fondo: red molecular dorada, plana y estática ---------- */
/* Mismo estilo de los materiales de la profesora: hexágonos de línea fina, enlaces y nodos huecos,
   agrupados en las esquinas y desvaneciéndose hacia el centro. No se mueve. */
var cam=$('#w3dCam');
function seeded(x){return function(){x=(x*16807)%2147483647;return (x-1)/2147483646}}
function hexPath(cx,cy,r){var d='';for(var k=0;k<6;k++){var a=Math.PI/3*k+Math.PI/6;d+=(k?'L':'M')+(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)}return d+'Z'}
function cluster(r,ax,ay,rad,n,base,sm2){var pts=[],out='',i,j;
 var W0=innerWidth,H0=innerHeight,tries=0;while(pts.length<n&&tries<n*40){tries++;var ang=r()*Math.PI*2,dist=Math.pow(r(),.7)*rad,x=ax+Math.cos(ang)*dist,y=ay+Math.sin(ang)*dist;
  if(x<8||y<8||x>W0-8||y>H0-8)continue;var ok=true;for(j=0;j<pts.length;j++){var ex=pts[j].x-x,ey=pts[j].y-y;if(ex*ex+ey*ey<sm2*sm2*.12){ok=false;break}}
  if(ok)pts.push({x:x,y:y,d:dist/rad,k:r()})}
 n=pts.length;
 for(i=0;i<n;i++){var a=pts[i],best=[];for(j=0;j<n;j++){if(i===j)continue;var dx=pts[j].x-a.x,dy=pts[j].y-a.y,dd=dx*dx+dy*dy;best.push([dd,j])}
  best.sort(function(u,v){return u[0]-v[0]});var m=a.k<.3?1:(a.k<.85?2:3),MX=sm2*sm2;
  for(j=0;j<m&&j<best.length;j++){if(best[j][0]>MX)break;var q=pts[best[j][1]];
   var o=(base*(1-Math.max(a.d,q.d)*.85)).toFixed(2);out+='<line x1="'+a.x.toFixed(1)+'" y1="'+a.y.toFixed(1)+'" x2="'+q.x.toFixed(1)+'" y2="'+q.y.toFixed(1)+'" opacity="'+o+'"/>'}}
 pts.forEach(function(a){var o=(base*(1-a.d*.85)).toFixed(2);
  if(a.k<.45){var hr=9+r()*11;out+='<path d="'+hexPath(a.x,a.y,hr)+'" fill="#fbf8ef" opacity="'+o+'"/>'}
  else if(a.k<.78){out+='<circle cx="'+a.x.toFixed(1)+'" cy="'+a.y.toFixed(1)+'" r="'+(2.5+r()*2.5).toFixed(1)+'" fill="#fbf8ef" opacity="'+o+'"/>'}
  else{out+='<circle cx="'+a.x.toFixed(1)+'" cy="'+a.y.toFixed(1)+'" r="2.2" fill="#d4b26a" stroke="none" opacity="'+o+'"/>'}});
 return out}
function build(){var W=innerWidth,H=innerHeight,r=seeded(23),sm=W<760,R=Math.min(W,H)*(sm?.55:.42),L=sm?70:95,h='';
 h+=cluster(r,W*.97,H*.06,R,sm?26:46,.9,L);          /* esquina superior derecha */
 h+=cluster(r,W*.03,H*.96,R*1.05,sm?26:48,.9,L);     /* esquina inferior izquierda */
 h+=cluster(r,W*.96,H*.8,R*.5,sm?9:16,.6,L);          /* toque discreto a la derecha */
 h+=cluster(r,W*.04,H*.25,R*.42,sm?8:13,.55,L);       /* toque discreto arriba a la izquierda */
 cam.innerHTML='<svg class="bm-net" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" aria-hidden="true"><g fill="none" stroke="#cfa955" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">'+h+'</g></svg>'}
function placeWorld(){}
build();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,200)});

/* ---------- Método + panel: una sola sección; las pantallas cambian con el scroll ---------- */
var MP=[['01','Tu panel','Inicio','Sabes qué estudiar hoy, dónde continuar y cuánto ya avanzaste.'],
 ['02','Aprende','Mi curso','Videoaulas por módulos y conceptos, para avanzar sin perderte.'],
 ['03','Conecta','Clase','Esquemas y explicaciones visuales que integran las vías metabólicas.'],
 ['04','Repasa','Repaso','Flashcards y repasos rápidos para fijar lo esencial.'],
 ['05','Practica','Preguntas','Preguntas y desafíos para comprobar lo que entendiste.'],
 ['06','Material premium','Materiales','PDFs exclusivos para estudiar a fondo, como el de Ciclo de Krebs.']];
var shots=$$('#shots img'),stepsEl=$('#mpSteps'),lab=$('#shotLabel'),mpSec=$('#metodo'),si=-1;
stepsEl.innerHTML=MP.map(function(m){return '<li>'+m[1]+'</li>'}).join('');var steps=$$('li',stepsEl);
function setShot(i){if(i===si)return;si=i;var m=MP[i];shots.forEach(function(s,k){s.classList.toggle('on',k===si)});steps.forEach(function(b,k){b.classList.toggle('on',k===si);b.classList.toggle('done',k<si)});
 lab.textContent='Panel · '+m[2];$('#mpNum').textContent=m[0];$('#mpTitle').textContent=m[1];$('#mpText').textContent=m[3]}
setShot(0);

/* ---------- Mouse: owl + mundo ---------- */
var mx=0,my=0,tx=0,ty=0,owl=$('#owl'),art=$('#heroArt');
if(!RM&&!COARSE)addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
/* tilt de tarjetas */
function tilt(root,sel,max){if(RM||COARSE)return;root.addEventListener('pointermove',function(e){var c=e.target.closest(sel);if(!c)return;var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transition='box-shadow .2s';c.dataset.tx='perspective(900px) rotateY('+(x*max).toFixed(1)+'deg) rotateX('+(-y*max).toFixed(1)+'deg) translateZ(12px)';c.style.transform=c.dataset.tx;c.dataset.tilt='1'});
 root.addEventListener('pointerout',function(e){var c=e.target.closest(sel);if(!c||c.contains(e.relatedTarget))return;c.dataset.tilt='';c.style.transition='transform .35s,box-shadow .2s';c.style.transform=''})}
tilt($('#path'),'li',10);tilt($('#planGrid'),'.lp-plan',8);

/* ---------- Bucle de scroll ---------- */
renderPlans();var nav=$('#lpNav'),ticking=false,t0=performance.now();
function frame(now){ticking=false;if(L.hidden)return;
 var sy=scrollY,vh=innerHeight,tm=(now-t0)/1000;
 mx+=(tx-mx)*.06;my+=(ty-my)*.06;
 if(!RM){placeWorld(sy,tm,mx*40,my*30)}else if(!frame.once){placeWorld(0,0,0,0);frame.once=1}
 var rects=items.map(function(el){return el.getBoundingClientRect()});
 for(var i=0;i<items.length;i++){var el=items[i],r=rects[i],kind=el.dataset['3d'];if(RM)break;if(el.dataset.tilt)continue;
  if(r.bottom<-300||r.top>vh+400){continue}
  var t=(r.top+r.height/2-vh*.55)/(vh*.6);
  if(kind==='hero'){el.style.transform='translate3d(0,'+(sy*.12).toFixed(1)+'px,'+(-sy*.25).toFixed(1)+'px)';el.style.opacity=clamp(1-sy/(vh*.9),0,1).toFixed(2);continue}
  if(kind==='open'){var p=clamp(1-t,0,1),sc=$('.lp-screen',el);sc.style.transform='rotateX('+(-(1-p)*78).toFixed(1)+'deg)';el.style.opacity=clamp(.25+p,0,1).toFixed(2);continue}
  var below=clamp(t,0,1.3),above=clamp(-t,0,1.3);
  el.style.transform='translate3d(0,0,'+(-below*170+above*-60).toFixed(0)+'px) rotateX('+(below*20-above*5).toFixed(1)+'deg)';
  el.style.opacity=(1-clamp(below-.75,0,1)*.9-clamp(above-1,0,1)*.7).toFixed(2)}
 {var pr=mpSec.getBoundingClientRect(),pp=clamp(-pr.top/Math.max(1,pr.height-vh),0,.999);setShot(Math.floor(pp*MP.length))}
 if(!RM){owl.style.transform='translateZ(60px) rotateY('+(mx*26).toFixed(1)+'deg) rotateX('+(-my*18).toFixed(1)+'deg)';
  $$('.orb',art).forEach(function(o,k){o.style.transform='translate3d('+(mx*(k?-50:30)).toFixed(1)+'px,'+(my*(k?-40:24)).toFixed(1)+'px,0)'})}
 if(!RM)request()}
function request(){if(ticking)return;ticking=true;requestAnimationFrame(frame)}
addEventListener('scroll',request,{passive:true});addEventListener('resize',request);
document.addEventListener('visibilitychange',request);
new MutationObserver(request).observe(L,{attributes:true,attributeFilter:['hidden']});
/* nav: sombra al hacer scroll + anclas con offset */
addEventListener('scroll',function(){nav.style.boxShadow=scrollY>10?'0 8px 24px rgba(31,47,74,.08)':'none'},{passive:true});
$$('section[id],main[id]',L).forEach(function(s){s.style.scrollMarginTop='70px'});
var lg=document.getElementById('lpLogin');
function navUser(){if(!window.BioAPI||!BioAPI.state.on)return;var u=BioAPI.state.user;lg.hidden=!!u&&false;lg.textContent=u?(u.name||u.email.split('@')[0]).slice(0,14):'Entrar';if(u){lg.removeAttribute('data-auth');lg.setAttribute('data-enter','')}else{lg.setAttribute('data-auth','login');lg.removeAttribute('data-enter')}}
document.addEventListener('bioapi:change',navUser);navUser();
request();
})();
