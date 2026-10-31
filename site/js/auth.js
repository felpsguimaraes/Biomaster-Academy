/* Acceso de alumnos: modal de inicio de sesión / registro. Solo activo con backend (BioAPI.state.on). */
(function(){
var A=window.BioAPI;if(!A||!A.state.on){window.BioAuth={require:function(cb){cb()},on:false};return}
var ov=null,after=null,mode='register',last=null;
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function close(){if(!ov)return;ov.remove();ov=null;document.removeEventListener('keydown',key);document.body.style.overflow='';if(last&&last.focus)last.focus()}
function key(e){if(!ov)return;if(e.key==='Escape'){close();return}
 if(e.key==='Tab'){var f=[].slice.call(ov.querySelectorAll('button,input')).filter(function(x){return!x.disabled&&x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}
function show(reason){
 last=document.activeElement;
 if(!ov){ov=document.createElement('div');ov.className='bp-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Acceso');document.body.appendChild(ov);document.body.style.overflow='hidden';document.addEventListener('keydown',key);ov.addEventListener('mousedown',function(e){if(e.target===ov)close()})}
 var reg=mode==='register';
 ov.innerHTML='<div class="bp one"><button class="bp-x" aria-label="Cerrar">×</button><section class="bp-pay" style="padding:32px 28px 28px"><div class="bp-brand" style="color:#1f2f4a"><img src="assets/logo-coruja.png" alt="">BIOMÁSTER ACADEMY</div><h3>'+(reg?'Crea tu cuenta':'Inicia sesión')+'</h3>'+(reason?'<p style="color:#56637f">'+esc(reason)+'</p>':'')+
 '<form id="au-form" novalidate>'+(reg?'<div class="bp-f"><label for="au-name">Nombre</label><input class="bp-in" id="au-name" autocomplete="name" placeholder="Tu nombre"><div class="bp-e"></div></div>':'')+
 '<div class="bp-f"><label for="au-email">Correo electrónico</label><input class="bp-in" id="au-email" type="email" autocomplete="email" placeholder="tu@correo.com"><div class="bp-e"></div></div>'+
 '<div class="bp-f"><label for="au-pass">Contraseña</label><input class="bp-in" id="au-pass" type="password" autocomplete="'+(reg?'new-password':'current-password')+'" placeholder="'+(reg?'Mínimo 8 caracteres':'Tu contraseña')+'"><div class="bp-e"></div></div>'+
 (reg?'':'<button class="linkbtn" type="button" id="au-forgot" style="justify-self:start;font-size:12px">¿Olvidaste tu contraseña?</button>')+
 '<div id="au-fail"></div><button class="bp-go" type="submit" id="au-go">'+(reg?'Crear cuenta':'Entrar')+'</button></form>'+
 '<button class="bp-go ghost" id="au-sw" type="button">'+(reg?'Ya tengo cuenta · Iniciar sesión':'No tengo cuenta · Crear una')+'</button></section></div>';
 ov.querySelector('.bp-x').onclick=close;
 var fg=ov.querySelector('#au-forgot');if(fg)fg.onclick=forgot;
 ov.querySelector('#au-sw').onclick=function(){mode=reg?'login':'register';show(reason)};
 var f=ov.querySelector('#au-form'),em=f.querySelector('#au-email');(reg?f.querySelector('#au-name'):em).focus();
 function bad(inp,msg){var w=inp.closest('.bp-f');w.classList.toggle('err',!!msg);w.querySelector('.bp-e').textContent=msg||'';return!msg}
 f.addEventListener('submit',function(e){e.preventDefault();var pw=f.querySelector('#au-pass'),nm=f.querySelector('#au-name'),ok=true;
  ok=bad(em,/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value.trim())?'':'Escribe un correo válido.')&&ok;
  ok=bad(pw,pw.value.length>=(reg?8:1)?'':(reg?'Usa al menos 8 caracteres.':'Escribe tu contraseña.'))&&ok;
  if(!ok)return;var b=f.querySelector('#au-go');b.disabled=true;b.innerHTML='<span class="bp-spin"></span>Un momento…';
  (reg?A.register(em.value.trim(),pw.value,nm.value.trim()):A.login(em.value.trim(),pw.value)).then(function(){var cb=after;after=null;close();if(cb)cb()})
  .catch(function(err){b.disabled=false;b.textContent=reg?'Crear cuenta':'Entrar';ov.querySelector('#au-fail').innerHTML='<div class="bp-fail" role="alert">'+esc(err.message)+'</div>'})})}
function panel(inner){last=last||document.activeElement;if(!ov){ov=document.createElement('div');ov.className='bp-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');document.body.appendChild(ov);document.body.style.overflow='hidden';document.addEventListener('keydown',key);ov.addEventListener('mousedown',function(e){if(e.target===ov)close()})}
 ov.innerHTML='<div class="bp one"><button class="bp-x" aria-label="Cerrar">×</button><section class="bp-pay" style="padding:32px 28px 28px"><div class="bp-brand" style="color:#1f2f4a"><img src="assets/logo-coruja.png" alt="">BIOMÁSTER ACADEMY</div>'+inner+'</section></div>';ov.querySelector('.bp-x').onclick=close;return ov}
function forgot(){var o=panel('<h3>Recupera tu contraseña</h3><p style="color:#56637f">Escribe tu correo y te enviaremos un enlace para crear una nueva.</p><form id="fg-form" novalidate><div class="bp-f"><label for="fg-email">Correo electrónico</label><input class="bp-in" id="fg-email" type="email" autocomplete="email" placeholder="tu@correo.com"><div class="bp-e"></div></div><div id="fg-msg"></div><button class="bp-go" type="submit" id="fg-go">Enviar enlace</button></form><button class="bp-go ghost" type="button" id="fg-back">Volver a iniciar sesión</button>');
 var f=o.querySelector('#fg-form'),em=f.querySelector('#fg-email');em.focus();o.querySelector('#fg-back').onclick=function(){mode='login';show()};
 f.addEventListener('submit',function(e){e.preventDefault();var w=em.closest('.bp-f'),v=em.value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){w.classList.add('err');w.querySelector('.bp-e').textContent='Escribe un correo válido.';return}
  var b=o.querySelector('#fg-go');b.disabled=true;b.innerHTML='<span class="bp-spin"></span>Enviando…';
  A.req('POST','/api/auth/forgot',{email:v}).then(function(){f.style.display='none';o.querySelector('#fg-msg').innerHTML='<div class="bp-hint" role="status">Si existe una cuenta con <b>'+esc(v)+'</b>, te enviamos un enlace. Revisa tu bandeja de entrada y el correo no deseado. El enlace vence en 1 hora.</div>'})
   .catch(function(err){b.disabled=false;b.textContent='Enviar enlace';o.querySelector('#fg-msg').innerHTML='<div class="bp-fail" role="alert">'+esc(err.message)+'</div>'})})}
function reset(token){var o=panel('<h3>Crea tu nueva contraseña</h3><form id="rs-form" novalidate><div class="bp-f"><label for="rs-pass">Nueva contraseña</label><input class="bp-in" id="rs-pass" type="password" autocomplete="new-password" placeholder="Mínimo 8 caracteres"><div class="bp-e"></div></div><div id="rs-msg"></div><button class="bp-go" type="submit" id="rs-go">Guardar contraseña</button></form>');
 var f=o.querySelector('#rs-form'),pw=f.querySelector('#rs-pass');pw.focus();
 f.addEventListener('submit',function(e){e.preventDefault();var w=pw.closest('.bp-f');if(pw.value.length<8){w.classList.add('err');w.querySelector('.bp-e').textContent='Usa al menos 8 caracteres.';return}
  var b=o.querySelector('#rs-go');b.disabled=true;b.innerHTML='<span class="bp-spin"></span>Guardando…';
  A.req('POST','/api/auth/reset',{token:token,password:pw.value}).then(function(){mode='login';show('Contraseña actualizada. Inicia sesión con la nueva.')})
   .catch(function(err){b.disabled=false;b.textContent='Guardar contraseña';o.querySelector('#rs-msg').innerHTML='<div class="bp-fail" role="alert">'+esc(err.message)+'</div>'})})}
var rm=/^#reset=([a-f0-9]{64})$/.exec(location.hash);if(rm){history.replaceState(null,'',location.pathname+location.search);reset(rm[1])}
window.BioAuth={on:true,
 require:function(cb,reason,m){if(m)mode=m;var go=function(){if(A.state.user)cb();else{after=cb;show(reason)}};if(A.state.ready)go();else A.refresh().then(go)},
 open:function(m){mode=m||'login';show()},close:close};
document.addEventListener('click',function(e){var t=e.target.closest('[data-auth],[data-logout]');if(!t)return;e.preventDefault();
 if(t.hasAttribute('data-logout'))A.logout().then(function(){location.hash='';location.reload()});else BioAuth.open(t.dataset.auth)});
})();
