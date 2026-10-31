/* Landing 3D: mundo molecular con profundidad ligada al scroll, tarjetas que "vuelan" hacia ti,
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
 $('#curTog').innerHTML=BIO.CURS.map(function(x){return '<button type="button" data-cur="'+x[0]+'" aria-pressed="'+(x[0]===c)+'">'+x[1]+'</button>'}).join('')+'<span>Paga en tu moneda · '+WAYS[c]+'</span>';
 $('#planGrid').innerHTML=BIO.PLANS.map(function(p){var hot=p.id==='anual',sv=BIO.saveOf(p,c),price=BIO.planPrice(p,c).replace(/^(USD|Gs|R\$)\s/,'');
 return '<article class="lp-plan'+(hot?' hot':'')+'" data-3d="rise">'+(sv>0?'<span class="badge">Ahorra '+sv+'%</span>':'')+'<h3>'+esc(p.name)+'</h3><div class="price"><small>'+CSYM[c]+'</small>'+price+'</div><p class="per">'+(p.months>1?BIO.planPer(p,c)+' por mes · pago por '+p.months+' meses':'por mes · cancela cuando quieras')+'</p><ul>'+FEAT.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul><button class="lp-btn '+(hot?'gold':'navy')+'" data-pay="'+p.id+'">Elegir '+esc(p.name.split(' ')[0].toLowerCase())+' →</button></article>'}).join('');
 items=$$('[data-3d]')}
var items=[];
$('#curTog').addEventListener('click',function(e){var b=e.target.closest('[data-cur]');if(b)BIO.setCur(b.dataset.cur)});
document.addEventListener('biocur:change',renderPlans);

/* ---------- Mundo 3D de fondo ---------- */
var cam=$('#w3dCam'),nodes=[],DEPTH=2600,W=innerWidth,H=innerHeight;
function build(){cam.innerHTML='';nodes=[];W=innerWidth;H=innerHeight;var n=W<760?14:30;
 var cols=[['#fff','#8fb0dc'],['#fff6dc','#e8cd8c'],['#fff','#4f74ad'],['#fff','#bcd5f7']];
 for(var i=0;i<n;i++){var el=document.createElement('div'),k=Math.random(),o={el:el,z:Math.random()*DEPTH,x:Math.random()*W,y:Math.random()*H,rz:Math.random()*360,sp:(Math.random()-.5)*10,t:''};
  if(k<.5){var s=26+Math.random()*60;el.className='n atom';el.style.width=el.style.height=s+'px';var c=cols[i%cols.length];el.style.setProperty('--c1',c[0]);el.style.setProperty('--c2',c[1]);o.t='atom';o.s=s}
  else if(k<.78){var h=90+Math.random()*140;el.className='n hex';el.style.width=h+'px';el.style.height=h+'px';el.innerHTML='<svg viewBox="-50 -50 100 100"><polygon points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23" fill="rgba(255,255,255,.18)" stroke="#4f74ad" stroke-opacity=".5" stroke-width="2.2" stroke-linejoin="round"/><circle cx="0" cy="-46" r="4.5" fill="#4f74ad" fill-opacity=".5"/><circle cx="40" cy="23" r="4.5" fill="#e8cd8c"/><circle cx="-40" cy="23" r="4.5" fill="#4f74ad" fill-opacity=".5"/></svg>';o.t='hex';o.s=h}
  else{var l=80+Math.random()*180;el.className='n bond';el.style.width=l+'px';o.t='bond';o.s=l}
  cam.appendChild(el);nodes.push(o)}}
function placeWorld(sy,tm,mx,my){
 for(var i=0;i<nodes.length;i++){var o=nodes[i],z=((o.z+sy*.75)%DEPTH)-DEPTH+420;
  var op=clamp((z+DEPTH-420)/600,0,1)*clamp((420-z)/280,0,1);
  var px=o.x+mx*(z+DEPTH)*.02,py=o.y+my*(z+DEPTH)*.015;
  o.el.style.opacity=(op*.6).toFixed(3);
  o.el.style.transform='translate3d('+px.toFixed(1)+'px,'+py.toFixed(1)+'px,'+z.toFixed(0)+'px) rotateZ('+(o.rz+tm*o.sp).toFixed(1)+'deg) rotateY('+((tm*o.sp*.6)%360).toFixed(1)+'deg)'}}
build();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,200)});

/* ---------- Anillo del método ---------- */
var STEPS=[['01','Aprende','Videoaulas por módulos y conceptos, para avanzar sin perderte.'],['02','Conecta','Mapas, esquemas y explicaciones visuales que integran las vías.'],['03','Repasa','Flashcards y repasos rápidos para fijar lo esencial.'],['04','Practica','Preguntas para comprobar tu comprensión y detectar puntos débiles.'],['05','Material premium','PDFs exclusivos para estudiar a fondo, como el de Ciclo de Krebs.'],['06','Desafíos','Ejercicios de repaso con banco de respuestas para medir lo que sabes.']];
var ring=$('#ring'),ringSec=$('#metodo'),dots=$('#ringDots'),rNum=$('#ringNum'),rT=$('#ringTitle'),rX=$('#ringText'),rot=0,rotT=0,sIdx=-1;
dots.innerHTML=STEPS.map(function(){return '<i></i>'}).join('');
function setStep(i){if(i===sIdx)return;sIdx=i;var s=STEPS[i];rNum.textContent=s[0];rT.textContent=s[1];rX.textContent=s[2];$$('i',dots).forEach(function(d,k){d.classList.toggle('on',k===i)})}
setStep(0);

/* ---------- Panel: pantallas ---------- */
var shots=$$('#shots img'),tabs=$$('.lp-tabs button'),lab=$('#shotLabel'),NAMES=['Inicio','Mi curso','Repaso','Preguntas','Materiales'],si=0,hold=false;
function setShot(i){si=(i+shots.length)%shots.length;shots.forEach(function(s,k){s.classList.toggle('on',k===si)});tabs.forEach(function(b,k){b.setAttribute('aria-selected',k===si)});lab.textContent='Panel · '+NAMES[si]}
tabs.forEach(function(b,k){b.addEventListener('click',function(){setShot(k)})});
var lap=$('.lp-laptop');lap.addEventListener('pointerenter',function(){hold=true});lap.addEventListener('pointerleave',function(){hold=false});
if(!RM)setInterval(function(){if(!hold&&!L.hidden&&!document.hidden)setShot(si+1)},4500);

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
 if(!RM||true){var rr=ringSec.getBoundingClientRect(),prog=clamp(-rr.top/(rr.height-vh),0,1);
  if(!RM){rotT=-prog*300;rot+=(rotT-rot)*.12;ring.style.setProperty('--rot',rot.toFixed(2)+'deg')}
  setStep(clamp(Math.round(prog*5),0,5))}
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
