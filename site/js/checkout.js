/* BioPay: simulador de pago estilo Stripe Checkout + portal de facturación.
   Todo ocurre en el navegador: no se envían ni se guardan datos de tarjeta (solo marca y últimos 4 dígitos).
   Para pasar a Stripe real, reemplaza BioPay.charge() por una llamada a tu servidor que cree una Checkout Session
   (ver docs/stripe-integracion.md). */
(function(){
var KEY='biomaster.sub.v1', P=BIO.PLANS, $=function(s,r){return (r||document).querySelector(s)};
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function load(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function save(s){try{if(s)localStorage.setItem(KEY,JSON.stringify(s));else localStorage.removeItem(KEY)}catch(e){}document.dispatchEvent(new CustomEvent('biopay:change'))}
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

function open(opt){opt=opt||{};var plan=planOf(opt.plan||'mensual');
 var html=SIM+'<aside class="bp-sum"><div class="bp-brand"><img src="assets/logo-coruja.png" alt="">BIOMÁSTER ACADEMY</div><h3>Elige tu plan</h3>'+
 '<fieldset class="bp-plans"><legend>Plan</legend>'+P.map(function(p){return '<label class="bp-plan"><input type="radio" name="plan" value="'+p.id+'"'+(p.id===plan.id?' checked':'')+'><span><b>'+esc(p.name)+(p.badge?'<span class="bp-tag">'+p.badge+'</span>':'')+'</b><small>'+esc(p.note)+'</small></span><em>'+BIO.money(p.price)+'<i>'+(p.months>1?BIO.money(p.perMonth)+' / mes':'por mes')+'</i></em></label>'}).join('')+'</fieldset>'+
 '<div class="bp-total" id="bp-tot"></div><p class="bp-guar"><b>7 días de garantía.</b> Si el contenido o la metodología no cumplen tus expectativas, pides el reembolso del 100%.</p></aside>'+
 '<section class="bp-pay"><h3>Pago con tarjeta</h3><form id="bp-form" novalidate>'+
 '<div class="bp-f"><label for="bp-email">Correo electrónico</label><input class="bp-in" id="bp-email" name="email" type="email" autocomplete="email" placeholder="tu@correo.com"><div class="bp-e" aria-live="polite"></div></div>'+
 '<div class="bp-f"><label for="bp-num">Número de tarjeta</label><div class="bp-card"><input class="bp-in" id="bp-num" name="num" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234" maxlength="23"><span class="bp-brandtag" id="bp-br"></span></div><div class="bp-e" aria-live="polite"></div></div>'+
 '<div class="bp-row"><div class="bp-f"><label for="bp-exp">Vencimiento</label><input class="bp-in" id="bp-exp" name="exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / AA" maxlength="7"><div class="bp-e" aria-live="polite"></div></div><div class="bp-f"><label for="bp-cvc">CVC</label><input class="bp-in" id="bp-cvc" name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4"><div class="bp-e" aria-live="polite"></div></div></div>'+
 '<div class="bp-f"><label for="bp-name">Nombre en la tarjeta</label><input class="bp-in" id="bp-name" name="name" autocomplete="cc-name" placeholder="Como aparece en la tarjeta"><div class="bp-e" aria-live="polite"></div></div>'+
 '<div id="bp-fail"></div><button class="bp-go" type="submit" id="bp-submit"></button></form>'+
 '<div class="bp-hint">Tarjetas de prueba: <code data-fill="4242424242424242">4242 4242 4242 4242</code> aprobada · <code data-fill="4000000000000002">4000 0000 0000 0002</code> rechazada · <code data-fill="4000002500003155">4000 0025 0000 3155</code> pide autenticación 3D Secure. Cualquier fecha futura y CVC.</div>'+
 '<div class="bp-secure">🔒 Simulación · powered by <b>Stripe</b> (demo)</div></section>';
 var box=mount(html);var cur=plan;
 function refresh(){var t=$('#bp-tot',box);t.innerHTML='<div><span>'+esc(cur.name)+'</span><span>'+BIO.money(cur.price)+'</span></div>'+(cur.save>0?'<div><span>Ahorro frente al mensual</span><span>−'+cur.save+'%</span></div>':'')+'<div class="t"><span>Total hoy</span><span>'+BIO.money(cur.price)+'</span></div><div><span>Próxima renovación</span><span>'+fdate(addMonths(new Date(),cur.months))+'</span></div>';$('#bp-submit',box).innerHTML='Pagar '+BIO.money(cur.price)}
 refresh();
 box.addEventListener('change',function(e){if(e.target.name==='plan'){cur=planOf(e.target.value);refresh()}});
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
  pay({plan:cur,email:em,name:f.name.value.trim(),digits:d,box:box})})}

/* Proceso del pago simulado (reemplazar por llamada al servidor en producción) */
function charge(digits){return new Promise(function(res){setTimeout(function(){
 if(digits==='4000000000000002')res({ok:false,msg:'Tu tarjeta fue rechazada. Prueba con otra tarjeta.'});
 else if(digits==='4000000000009995')res({ok:false,msg:'Fondos insuficientes en la tarjeta.'});
 else if(digits==='4000002500003155')res({ok:true,auth:true});
 else res({ok:true})},1300)})}
function pay(o){var btn=$('#bp-submit',o.box),fail=$('#bp-fail',o.box);fail.innerHTML='';btn.disabled=true;btn.innerHTML='<span class="bp-spin"></span>Procesando…';
 charge(o.digits).then(function(r){
  if(!r.ok){btn.disabled=false;btn.innerHTML='Pagar '+BIO.money(o.plan.price);fail.innerHTML='<div class="bp-fail" role="alert">'+esc(r.msg)+'</div>';return}
  if(r.auth){auth(o);return}
  done(o)})}
function auth(o){var b=mount(SIM+'<div class="bp-3ds"><div class="bank">🏦</div><h3>Autenticación 3D Secure</h3><p>Tu banco (simulado) pide confirmar el pago de <b>'+BIO.money(o.plan.price)+'</b> a Biomáster Academy.</p><div class="acts"><button class="bp-go" id="a-ok">Completar autenticación</button><button class="bp-go ghost" id="a-no">Fallar autenticación</button></div></div>','one');
 $('#a-ok',b).focus();$('#a-ok',b).onclick=function(){done(o)};
 $('#a-no',b).onclick=function(){open({plan:o.plan.id});var f=$('#bp-fail');if(f)f.innerHTML='<div class="bp-fail" role="alert">La autenticación no se completó. Intenta de nuevo.</div>'}}
function done(o){var now=new Date(),sub={id:'sim_'+Math.random().toString(36).slice(2,10),plan:o.plan.id,email:o.email,name:o.name,brand:brand(o.digits)||'TARJETA',last4:o.digits.slice(-4),start:now.toISOString(),renews:addMonths(now,o.plan.months).toISOString(),status:'active'};
 save(sub);
 var b=mount(SIM+'<div class="bp-ok"><div class="tick" aria-hidden="true">✓</div><h3>¡Pago confirmado!</h3><p>Bienvenido/a a Biomáster Academy. Tu plan <b>'+esc(o.plan.name)+'</b> está activo.</p><div class="bp-rcpt"><div><span>Plan</span><b>'+esc(o.plan.name)+'</b></div><div><span>Total pagado</span><b>'+BIO.money(o.plan.price)+'</b></div><div><span>Tarjeta</span><b>'+esc(sub.brand)+' •••• '+sub.last4+'</b></div><div><span>Próxima renovación</span><b>'+fdate(sub.renews)+'</b></div><div><span>Recibo enviado a</span><b>'+esc(o.email)+'</b></div></div><button class="bp-go" id="go-panel">Entrar al panel →</button></div>','one');
 $('#go-panel',b).focus();$('#go-panel',b).onclick=function(){close();location.hash='inicio'}}

/* Portal de facturación (Gestionar plan) */
function manage(){var s=load();
 if(!s){var b=mount(SIM+'<div class="bp-man"><h3>Tu plan</h3><p>Aún no tienes un plan activo. Elige uno para desbloquear el curso completo y todas las actualizaciones.</p><button class="bp-go" id="m-pick">Elegir un plan</button></div>','one');$('#m-pick',b).onclick=function(){open()};return}
 var p=planOf(s.plan),on=s.status==='active';
 var b=mount(SIM+'<div class="bp-man"><div class="bp-brand" style="color:#1f2f4a"><img src="assets/logo-coruja.png" alt="">BIOMÁSTER ACADEMY</div><h3>Gestionar plan</h3>'+
 '<div><span class="st '+(on?'on':'off')+'">'+(on?'● Activo':'● Cancelado · activo hasta el fin del periodo')+'</span></div>'+
 '<div class="bp-inv"><div><span>Plan</span><b>'+esc(p.name)+' · '+BIO.money(p.price)+'</b></div><div><span>'+(on?'Próxima renovación':'Acceso hasta')+'</span><b>'+fdate(s.renews)+'</b></div><div><span>Método de pago</span><b>'+esc(s.brand)+' •••• '+s.last4+'</b></div><div><span>Correo de facturación</span><b>'+esc(s.email)+'</b></div></div>'+
 '<div class="bp-inv"><div><span>'+fdate(s.start)+'</span><b>'+BIO.money(p.price)+' · Pagado</b></div></div>'+
 (on?'<button class="bp-go ghost" id="m-chg">Cambiar de plan</button><button class="bp-go danger" id="m-can">Cancelar suscripción</button>':'<button class="bp-go" id="m-rea">Reactivar suscripción</button>')+
 '<button class="bp-go ghost" id="m-reset" style="font-size:12px;height:36px">Reiniciar demostración (borrar plan simulado)</button></div>','one');
 var q=function(i){return $(i,b)};
 if(q('#m-chg'))q('#m-chg').onclick=function(){open({plan:s.plan})};
 if(q('#m-can'))q('#m-can').onclick=function(){if(confirm('¿Cancelar la suscripción? Mantendrás el acceso hasta '+fdate(s.renews)+'.')){s.status='canceled';save(s);manage()}};
 if(q('#m-rea'))q('#m-rea').onclick=function(){s.status='active';save(s);manage()};
 q('#m-reset').onclick=function(){save(null);close()}}

window.BioPay={open:open,manage:manage,sub:load,close:close,plan:planOf};
document.addEventListener('click',function(e){var t=e.target.closest('[data-pay],[data-manage]');if(!t)return;e.preventDefault();if(t.hasAttribute('data-manage'))manage();else open({plan:t.dataset.pay||'mensual'})});
})();
