/* BioPay: simulador de pago estilo Stripe Checkout + portal de facturación.
   Todo ocurre en el navegador: no se envían ni se guardan datos de tarjeta (solo marca y últimos 4 dígitos).
   Para pasar a Stripe real, reemplaza BioPay.charge() por una llamada a tu servidor que cree una Checkout Session
   (ver docs/stripe-integracion.md). */
(function(){
var KEY='biomaster.sub.v1', P=BIO.PLANS, $=function(s,r){return (r||document).querySelector(s)};
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var API=window.BioAPI&&BioAPI.state.on?BioAPI:null;
function load(){
 if(API){var s=API.state.sub;if(!s)return null;
  return{plan:s.plan,email:API.state.user&&API.state.user.email||'',brand:s.brand||'TARJETA',last4:s.last4||'••••',start:s.start||new Date(s.renews||Date.now()).toISOString(),renews:new Date(s.renews||Date.now()).toISOString(),
   status:(s.status==='active'||s.status==='trialing')&&!s.cancelAtPeriodEnd?'active':'canceled',real:!s.simulated}}
 try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function save(s){if(API){document.dispatchEvent(new CustomEvent('biopay:change'));return}try{if(s)localStorage.setItem(KEY,JSON.stringify(s));else localStorage.removeItem(KEY)}catch(e){}document.dispatchEvent(new CustomEvent('biopay:change'))}
function mlabel(o){return o.method==='pix'?'PIX':o.method==='qr'?'QR':(brand(o.digits||'')||'TARJETA')}
function cardLabel(s){return (s.brand==='PIX'||s.brand==='QR')?s.brand:(esc(s.brand)+' •••• '+s.last4)}
function planOf(id){return P.filter(function(p){return p.id===id})[0]||P[0]}
function addMonths(d,m){var x=new Date(d);x.setMonth(x.getMonth()+m);return x}
function fdate(d){return new Date(d).toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'})}
function luhn(n){var s=0,alt=false;for(var i=n.length-1;i>=0;i--){var d=+n[i];if(alt){d*=2;if(d>9)d-=9}s+=d;alt=!alt}return n.length>=13&&s%10===0}
function brand(n){return /^4/.test(n)?'VISA':/^(5[1-5]|2[2-7])/.test(n)?'MASTERCARD':/^3[47]/.test(n)?'AMEX':''}
var ov=null,lastFocus=null;
function close(){if(!ov)return;ov.remove();ov=null;document.removeEventListener('keydown',onKey);document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function onKey(e){if(!ov)return;if(e.key==='Escape'){close();return}
 if(e.key==='Tab'){var f=[].slice.call(ov.querySelectorAll('button,input,select,[tabindex]:not([tabindex="-1"])')).filter(function(x){return !x.disabled&&x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}
function mount(html,cls){lastFocus=document.activeElement;if(!ov){ov=document.createElement('div');ov.className='bp-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Pago');document.body.appendChild(ov);document.body.style.overflow='hidden';document.addEventListener('keydown',onKey);ov.addEventListener('mousedown',function(e){if(e.target===ov)close()})}
 ov.innerHTML='<div class="bp '+(cls||'')+'">'+html+'</div>';var x=ov.querySelector('.bp-x');if(x)x.onclick=close;return ov.firstChild}
var SIM='<div class="bp-sim">MODO SIMULADOR · no se cobra nada y no se guarda tu tarjeta. Es una demostración del flujo de pago.</div><button class="bp-x" aria-label="Cerrar">×</button>';

function open(opt){opt=opt||{};
 if(API&&window.BioAuth){BioAuth.require(function(){openForm(opt)},'Crea tu cuenta gratis para elegir tu plan y guardar tu progreso.');return}
 openForm(opt)}
var METHOD_LABEL={card:'Tarjeta',qr:'QR / transferencia',pix:'PIX'};
function fp(plan,c){return BIO.planPrice(plan,c||CURSEL)}
var CURSEL='USD';
function openForm(opt){opt=opt||{};var plan=planOf(opt.plan||'mensual'),cur=plan;
 CURSEL=opt.currency||BIO.getCur();var method=opt.method&&BIO.methodsFor(CURSEL).indexOf(opt.method)>-1?opt.method:BIO.methodsFor(CURSEL)[0];
 var stripeMode=!!(API&&API.state.cfg.stripe),noPay=!!(API&&!API.state.cfg.stripe&&!API.state.cfg.sim);
 var html=SIM+'<aside class="bp-sum"><div class="bp-brand"><img src="assets/logo-coruja.png" alt="">BIOMÁSTER ACADEMY</div><h3>Elige tu plan</h3>'+
 '<div class="bp-cur" role="group" aria-label="Moneda">'+BIO.CURS.map(function(c){return '<button type="button" data-cur="'+c[0]+'" aria-pressed="'+(c[0]===CURSEL)+'">'+c[1]+'</button>'}).join('')+'</div>'+
 '<fieldset class="bp-plans"><legend>Plan</legend>'+P.map(function(p){var sv=BIO.saveOf(p,CURSEL);return '<label class="bp-plan"><input type="radio" name="plan" value="'+p.id+'"'+(p.id===plan.id?' checked':'')+'><span><b>'+esc(p.name)+(sv>0?'<span class="bp-tag">Ahorra '+sv+'%</span>':'')+'</b><small>'+esc(p.note)+'</small></span><em>'+BIO.planPrice(p,CURSEL)+'<i>'+(p.months>1?BIO.planPer(p,CURSEL)+' / mes':'por mes')+'</i></em></label>'}).join('')+'</fieldset>'+
 '<div class="bp-total" id="bp-tot"></div><p class="bp-guar"><b>7 días de garantía.</b> Si el contenido o la metodología no cumplen tus expectativas, pides el reembolso del 100%.</p></aside>'+
 '<section class="bp-pay" id="bp-paybox"></section>';
 var box=mount(html),payBox=$('#bp-paybox',box);
 function tipo(){return method==='card'?'Se renueva automáticamente. Cancela cuando quieras.':'Pago único por el período elegido: sin renovación automática, te avisamos antes de que venza.'}
 function refresh(){var t=$('#bp-tot',box);t.innerHTML='<div><span>'+esc(cur.name)+'</span><span>'+fp(cur)+'</span></div>'+(BIO.saveOf(cur,CURSEL)>0?'<div><span>Ahorro frente al mensual</span><span>−'+BIO.saveOf(cur,CURSEL)+'%</span></div>':'')+'<div class="t"><span>Total hoy</span><span>'+fp(cur)+'</span></div><div><span>'+(method==='card'?'Próxima renovación':'Acceso hasta')+'</span><span>'+fdate(addMonths(new Date(),cur.months))+'</span></div>';
  var b=$('#bp-submit',box)||$('#bp-stripe',box)||$('#bp-qrgo',box);if(b&&!b.disabled)b.innerHTML=(stripeMode?'Continuar al pago · ':method==='card'?'Pagar ':'Generar código '+(method==='pix'?'PIX':'QR')+' · ')+fp(cur)}
 box.addEventListener('change',function(e){if(e.target.name==='plan'){cur=planOf(e.target.value);refresh()}});
 box.addEventListener('click',function(e){var c=e.target.closest('[data-cur]');if(c){BIO.setCur(c.dataset.cur);openForm({plan:cur.id,currency:c.dataset.cur});return}
  var m=e.target.closest('[data-m]');if(m&&!m.disabled){method=m.dataset.m;renderPay()}});
 function tabs(){var ms=BIO.methodsFor(CURSEL);if(ms.length<2)return'';return '<div class="bp-tabs" role="tablist" aria-label="Método de pago">'+ms.map(function(m){return '<button type="button" role="tab" data-m="'+m+'" aria-selected="'+(m===method)+'">'+METHOD_LABEL[m]+'</button>'}).join('')+'</div>'}
 function prov(){var r=BIO.route(CURSEL,method);return '<div class="bp-secure">🔒 Simulación · procesado por <b>'+esc(r.prov)+'</b> (demo)</div>'}
 function renderPay(){
  if(stripeMode||noPay){
   payBox.innerHTML=noPay?'<h3>Pagos no disponibles</h3><p>Los pagos todavía no están activos. Vuelve pronto o escríbenos para reservar tu lugar.</p>'
    :'<h3>Pago seguro</h3><p style="color:#56637f">Serás redirigido a <b>Stripe</b> para pagar con tarjeta. Biomáster nunca ve ni guarda los datos de tu tarjeta.</p><div id="bp-fail"></div><button class="bp-go" id="bp-stripe"></button><div class="bp-secure">🔒 Pago procesado por Stripe</div>';
   var sb=$('#bp-stripe',box);if(sb)sb.onclick=function(){sb.disabled=true;sb.innerHTML='<span class="bp-spin"></span>Redirigiendo…';
    API.req('POST','/api/checkout',{plan:cur.id}).then(function(d){location.href=d.url}).catch(function(e){sb.disabled=false;refresh();$('#bp-fail',box).innerHTML='<div class="bp-fail" role="alert">'+esc(e.message)+'</div>'})};
   refresh();return}
  if(method==='card'){
   payBox.innerHTML=tabs()+CARDHTML+prov();bindCard()}
  else{payBox.innerHTML=tabs()+qrFormHtml()+prov();bindQr()}
  refresh()}
 var CARDHTML='<h3>Pago con tarjeta</h3>'+CARDFORM();
 function qrFormHtml(){var k=method==='pix'?'PIX':'QR';
  return '<h3>Pago con '+k+'</h3><p class="bp-p">'+(method==='pix'?'Paga al instante desde la app de tu banco. Sin tarjeta internacional.':'Escanea el código desde la app de tu banco o billetera y paga al instante.')+'</p><form id="bp-qrform" novalidate>'+
   '<div class="bp-f"><label for="bp-qemail">Correo electrónico</label><input class="bp-in" id="bp-qemail" name="email" type="email" autocomplete="email" placeholder="tu@correo.com"><div class="bp-e" aria-live="polite"></div></div>'+
   '<div class="bp-f"><label for="bp-qname">Nombre completo</label><input class="bp-in" id="bp-qname" name="name" autocomplete="name" placeholder="Tu nombre"><div class="bp-e" aria-live="polite"></div></div>'+
   '<div id="bp-fail"></div><button class="bp-go" type="submit" id="bp-qrgo"></button></form><div id="bp-qrview"></div><p class="bp-note">'+tipo()+'</p>'}
 function qrSvg(seed){var n=25,s=0,i;for(i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;var r=function(){s=(s*1664525+1013904223)>>>0;return s/4294967296},cells='';
  for(var y=0;y<n;y++)for(var x=0;x<n;x++){var f=(x<7&&y<7)||(x>n-8&&y<7)||(x<7&&y>n-8);if(f)continue;if(r()>.52)cells+='<rect x="'+x+'" y="'+y+'" width="1" height="1"/>'}
  var fin=function(ox,oy){return '<rect x="'+ox+'" y="'+oy+'" width="7" height="7"/><rect x="'+(ox+1)+'" y="'+(oy+1)+'" width="5" height="5" fill="#fff"/><rect x="'+(ox+2)+'" y="'+(oy+2)+'" width="3" height="3"/>'};
  return '<svg viewBox="-1 -1 27 27" class="bp-qr" role="img" aria-label="Código de pago de demostración (no escaneable)"><rect x="-1" y="-1" width="27" height="27" fill="#fff"/>'+cells+fin(0,0)+fin(n-7,0)+fin(0,n-7)+'</svg>'}
 function bindQr(){var f=$('#bp-qrform',box);
  f.addEventListener('submit',function(e){e.preventDefault();var ok=true,em=f.email,nm=f.name;
   [[em,/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value.trim())?'':'Escribe un correo válido.'],[nm,nm.value.trim().length>=3?'':'Escribe tu nombre.']].forEach(function(c){var w=c[0].closest('.bp-f');w.classList.toggle('err',!!c[1]);w.querySelector('.bp-e').textContent=c[1];if(c[1])ok=false});
   if(!ok)return;var b=$('#bp-qrgo',box);b.disabled=true;b.innerHTML='<span class="bp-spin"></span>Generando código…';
   setTimeout(function(){var code='00020126'+Math.random().toString().slice(2,14)+'BR.GOV.BCB.PIX-DEMO-'+cur.id.toUpperCase()+'-'+Date.now().toString(36);
    f.hidden=true;$('#bp-qrview',box).innerHTML='<div class="bp-qrbox">'+qrSvg(code)+'<div><b>'+fp(cur)+'</b><small>Vence en <span id="bp-cd">10:00</span></small><button type="button" class="bp-go ghost" id="bp-copy">Copiar código</button><code class="bp-code">'+esc(code)+'</code></div></div><button type="button" class="bp-go" id="bp-paid">Simular pago recibido</button><p class="bp-note">Demostración: en producción, el pago se confirma automáticamente cuando el banco lo notifica.</p>';
    var left=600,iv=setInterval(function(){left--;var c=$('#bp-cd',box);if(!c){clearInterval(iv);return}c.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');if(left<=0)clearInterval(iv)},1000);
    $('#bp-copy',box).onclick=function(){try{navigator.clipboard.writeText(code)}catch(x){}this.textContent='¡Copiado!'};
    $('#bp-paid',box).onclick=function(){clearInterval(iv);this.disabled=true;this.innerHTML='<span class="bp-spin"></span>Confirmando…';setTimeout(function(){done({plan:cur,email:em.value.trim(),name:nm.value.trim(),digits:'',method:method,box:box})},900)}},900)})}
 function bindCard(){
  var num=$('#bp-num',box),exp=$('#bp-exp',box),cvc=$('#bp-cvc',box);
 num.addEventListener('input',function(){var d=num.value.replace(/\D/g,'').slice(0,19);num.value=d.replace(/(.{4})/g,'$1 ').trim();$('#bp-br',box).textContent=brand(d)});
 exp.addEventListener('input',function(e){var d=exp.value.replace(/\D/g,'').slice(0,4);if(d.length>=3)d=d.slice(0,2)+' / '+d.slice(2);else if(d.length===2&&e.inputType!=='deleteContentBackward')d=d+' / ';exp.value=d});
 cvc.addEventListener('input',function(){cvc.value=cvc.value.replace(/\D/g,'').slice(0,4)});
 box.addEventListener('click',function(e){var c=e.target.closest('[data-fill]');if(c){num.value=c.dataset.fill.replace(/(.{4})/g,'$1 ').trim();num.dispatchEvent(new Event('input'));exp.value='12 / 34';cvc.value='123';var nm=$('#bp-name',box),em=$('#bp-email',box);if(!nm.value)nm.value='Alumno Biomáster';if(!em.value)em.value='alumno@ejemplo.com'}});
 function setErr(inp,msg){var f=inp.closest('.bp-f');f.classList.toggle('err',!!msg);f.querySelector('.bp-e').textContent=msg||'';if(msg)inp.setAttribute('aria-invalid','true');else inp.removeAttribute('aria-invalid');return !msg}
 $('#bp-form',box).addEventListener('submit',function(e){e.preventDefault();var f=e.target,ok=true,first=null;
  function chk(inp,msg){var r=setErr(inp,msg);if(!r){ok=false;if(!first)first=inp}}
  var em=f.email.value.trim(),d=f.num.value.replace(/\D/g,''),m=f.exp.value.replace(/\D/g,''),mm=+m.slice(0,2),yy=2000+(+m.slice(2,4)),now=new Date();
  chk(f.email,/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?'':'Escribe un correo válido.');
  chk(f.num,luhn(d)?'':'El número de tarjeta no es válido.');
  chk(f.exp,(m.length===4&&mm>=1&&mm<=12&&(yy>now.getFullYear()||(yy===now.getFullYear()&&mm>=now.getMonth()+1)))?'':'Fecha de vencimiento no válida.');
  chk(f.cvc,/^\d{3,4}$/.test(f.cvc.value)?'':'Revisa el CVC.');
  chk(f.name,f.name.value.trim().length>=3?'':'Escribe el nombre de la tarjeta.');
  if(!ok){first.focus();return}
  pay({plan:cur,email:em,name:f.name.value.trim(),digits:d,method:'card',box:box})})
 }
 renderPay()}
function CARDFORM(){return '<form id="bp-form" novalidate>'+
 '<div class="bp-f"><label for="bp-email">Correo electrónico</label><input class="bp-in" id="bp-email" name="email" type="email" autocomplete="email" placeholder="tu@correo.com"><div class="bp-e" aria-live="polite"></div></div>'+
 '<div class="bp-f"><label for="bp-num">Número de tarjeta</label><div class="bp-card"><input class="bp-in" id="bp-num" name="num" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234" maxlength="23"><span class="bp-brandtag" id="bp-br"></span></div><div class="bp-e" aria-live="polite"></div></div>'+
 '<div class="bp-row"><div class="bp-f"><label for="bp-exp">Vencimiento</label><input class="bp-in" id="bp-exp" name="exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / AA" maxlength="7"><div class="bp-e" aria-live="polite"></div></div><div class="bp-f"><label for="bp-cvc">CVC</label><input class="bp-in" id="bp-cvc" name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4"><div class="bp-e" aria-live="polite"></div></div></div>'+
 '<div class="bp-f"><label for="bp-name">Nombre en la tarjeta</label><input class="bp-in" id="bp-name" name="name" autocomplete="cc-name" placeholder="Como aparece en la tarjeta"><div class="bp-e" aria-live="polite"></div></div>'+
 '<div id="bp-fail"></div><button class="bp-go" type="submit" id="bp-submit"></button></form>'+
 '<div class="bp-hint">Tarjetas de prueba: <code data-fill="4242424242424242">4242 4242 4242 4242</code> aprobada · <code data-fill="4000000000000002">4000 0000 0000 0002</code> rechazada · <code data-fill="4000002500003155">4000 0025 0000 3155</code> pide autenticación 3D Secure. Cualquier fecha futura y CVC.</div>';}

/* Proceso del pago simulado (reemplazar por llamada al servidor en producción) */
function charge(digits){return new Promise(function(res){setTimeout(function(){
 if(digits==='4000000000000002')res({ok:false,msg:'Tu tarjeta fue rechazada. Prueba con otra tarjeta.'});
 else if(digits==='4000000000009995')res({ok:false,msg:'Fondos insuficientes en la tarjeta.'});
 else if(digits==='4000002500003155')res({ok:true,auth:true});
 else res({ok:true})},1300)})}
function pay(o){var btn=$('#bp-submit',o.box),fail=$('#bp-fail',o.box);fail.innerHTML='';btn.disabled=true;btn.innerHTML='<span class="bp-spin"></span>Procesando…';
 charge(o.digits).then(function(r){
  if(!r.ok){btn.disabled=false;btn.innerHTML='Pagar '+fp(o.plan);fail.innerHTML='<div class="bp-fail" role="alert">'+esc(r.msg)+'</div>';return}
  if(r.auth){auth(o);return}
  done(o)})}
function auth(o){var b=mount(SIM+'<div class="bp-3ds"><div class="bank">🏦</div><h3>Autenticación 3D Secure</h3><p>Tu banco (simulado) pide confirmar el pago de <b>'+fp(o.plan)+'</b> a Biomáster Academy.</p><div class="acts"><button class="bp-go" id="a-ok">Completar autenticación</button><button class="bp-go ghost" id="a-no">Fallar autenticación</button></div></div>','one');
 $('#a-ok',b).focus();$('#a-ok',b).onclick=function(){done(o)};
 $('#a-no',b).onclick=function(){open({plan:o.plan.id});var f=$('#bp-fail');if(f)f.innerHTML='<div class="bp-fail" role="alert">La autenticación no se completó. Intenta de nuevo.</div>'}}
function done(o){
 if(API){var br=mlabel(o),l4=(o.digits||'').slice(-4);
  API.req('POST','/api/sim/subscribe',{plan:o.plan.id,brand:br,last4:l4}).then(API.refresh).then(function(){ok(o,load())})
   .catch(function(e){open({plan:o.plan.id});setTimeout(function(){var f=$('#bp-fail');if(f)f.innerHTML='<div class="bp-fail" role="alert">'+esc(e.message)+'</div>'},50)});return}
 var now=new Date(),sub={id:'sim_'+Math.random().toString(36).slice(2,10),plan:o.plan.id,email:o.email,name:o.name,brand:mlabel(o),last4:(o.digits||'').slice(-4),start:now.toISOString(),renews:addMonths(now,o.plan.months).toISOString(),status:'active'};
 save(sub);ok(o,sub)}
function ok(o,sub){
 var b=mount(SIM+'<div class="bp-ok"><div class="tick" aria-hidden="true">✓</div><h3>¡Pago confirmado!</h3><p>Bienvenido/a a Biomáster Academy. Tu plan <b>'+esc(o.plan.name)+'</b> está activo.</p><div class="bp-rcpt"><div><span>Plan</span><b>'+esc(o.plan.name)+'</b></div><div><span>Total pagado</span><b>'+fp(o.plan)+'</b></div><div><span>Método</span><b>'+cardLabel(sub)+'</b></div><div><span>'+(o.method==='pix'||o.method==='qr'?'Acceso hasta (sin renovación automática)':'Próxima renovación')+'</span><b>'+fdate(sub.renews)+'</b></div><div><span>Recibo enviado a</span><b>'+esc(sub.email||o.email)+'</b></div></div><button class="bp-go" id="go-panel">Entrar al panel →</button></div>','one');
 $('#go-panel',b).focus();$('#go-panel',b).onclick=function(){close();location.hash='inicio'}}

/* Portal de facturación (Gestionar plan) */
function manage(){
 if(API&&window.BioAuth&&!API.state.user){BioAuth.require(manage,'Inicia sesión para gestionar tu plan.');return}
 var s=load();
 if(API&&s&&s.real){API.req('POST','/api/portal',{}).then(function(d){location.href=d.url}).catch(function(e){alert(e.message)});return}
 if(!s){var b=mount(SIM+'<div class="bp-man"><h3>Tu plan</h3><p>Aún no tienes un plan activo. Elige uno para desbloquear el curso completo y todas las actualizaciones.</p><button class="bp-go" id="m-pick">Elegir un plan</button></div>','one');$('#m-pick',b).onclick=function(){open()};return}
 var p=planOf(s.plan),on=s.status==='active',nr=(s.brand==='PIX'||s.brand==='QR');
 var b=mount(SIM+'<div class="bp-man"><div class="bp-brand" style="color:#1f2f4a"><img src="assets/logo-coruja.png" alt="">BIOMÁSTER ACADEMY</div><h3>Gestionar plan</h3>'+
 '<div><span class="st '+(on?'on':'off')+'">'+(on?'● Activo':'● Cancelado · activo hasta el fin del periodo')+'</span></div>'+
 '<div class="bp-inv"><div><span>Plan</span><b>'+esc(p.name)+' · '+BIO.planPrice(p,BIO.getCur())+'</b></div><div><span>'+(on&&!nr?'Próxima renovación':'Acceso hasta')+'</span><b>'+fdate(s.renews)+'</b></div><div><span>Método de pago</span><b>'+cardLabel(s)+'</b></div><div><span>Correo de facturación</span><b>'+esc(s.email)+'</b></div></div>'+
 '<div class="bp-inv"><div><span>'+fdate(s.start)+'</span><b>'+BIO.planPrice(p,BIO.getCur())+' · Pagado</b></div></div>'+
 (nr?'<p class="bp-note">Tu pago por PIX/QR no se renueva solo: te avisaremos antes del vencimiento para que renueves.</p><button class="bp-go" id="m-chg">Renovar o cambiar de plan</button>':on?'<button class="bp-go ghost" id="m-chg">Cambiar de plan</button><button class="bp-go danger" id="m-can">Cancelar suscripción</button>':'<button class="bp-go" id="m-rea">Reactivar suscripción</button>')+
 '<button class="bp-go ghost" id="m-reset" style="font-size:12px;height:36px">Reiniciar demostración (borrar plan simulado)</button></div>','one');
 var q=function(i){return $(i,b)};
 if(q('#m-chg'))q('#m-chg').onclick=function(){open({plan:s.plan})};
 if(q('#m-can'))q('#m-can').onclick=function(){if(confirm('¿Cancelar la suscripción? Mantendrás el acceso hasta '+fdate(s.renews)+'.')){if(API)API.req('POST','/api/sim/cancel',{}).then(API.refresh).then(manage);else{s.status='canceled';save(s);manage()}}};
 if(q('#m-rea'))q('#m-rea').onclick=function(){if(API)API.req('POST','/api/sim/reactivate',{}).then(API.refresh).then(manage);else{s.status='active';save(s);manage()}};
 q('#m-reset').onclick=function(){if(API)API.req('POST','/api/sim/reset',{}).then(API.refresh).then(close);else{save(null);close()}}}

document.addEventListener('bioapi:change',function(){document.dispatchEvent(new CustomEvent('biopay:change'))});
window.BioPay={open:open,manage:manage,sub:load,close:close,plan:planOf};
document.addEventListener('click',function(e){var t=e.target.closest('[data-pay],[data-manage]');if(!t)return;e.preventDefault();if(t.hasAttribute('data-manage'))manage();else open({plan:t.dataset.pay||'mensual'})});
})();
