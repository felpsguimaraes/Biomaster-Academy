/* Panel de la profesora: resumen, aulas (por módulo) y alumnos. Requiere backend y cuenta admin (ADMIN_EMAILS). */
(function(){
var A=window.BioAPI,main=document.getElementById('main'),MODS=BIO.MODS;
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function msg(h,p){main.innerHTML='<div class="msg"><h2>'+h+'</h2><p>'+p+'</p></div>'}
if(!A.state.on){msg('Backend no configurado','Define <code>apiBase</code> en <code>js/config.js</code> para usar el panel. Ver <code>docs/backend.md</code>.');return}
function boot(){
 if(!A.state.ready){A.refresh().then(boot);return}
 if(A.state.offline){msg('No se pudo conectar','Revisa que la API esté en línea y vuelve a intentarlo.');return}
 if(!A.state.user){msg('Acceso restringido','Inicia sesión con la cuenta de la profesora.');BioAuth.require(boot,'Inicia sesión con la cuenta de la profesora.','login');return}
 document.getElementById('who').textContent=A.state.user.email;document.getElementById('out').hidden=false;
 if(!A.state.admin){msg('Sin permiso','Esta cuenta no es administradora. Su correo debe estar en ADMIN_EMAILS <b>y verificado</b>: cierra sesión y usa “¿Olvidaste tu contraseña?” para comprobar tu correo.');return}
 shell()}
document.addEventListener('bioapi:change',function(){});
function shell(){
 main.innerHTML='<div class="tabs" role="tablist"><button role="tab" aria-selected="true" data-t="res">Resumen</button><button role="tab" aria-selected="false" data-t="aul">Aulas</button><button role="tab" aria-selected="false" data-t="alu">Alumnos</button></div><section id="pane"></section>';
 var tabs=[].slice.call(main.querySelectorAll('[role=tab]'));
 function go(t){tabs.forEach(function(b){b.setAttribute('aria-selected',b.dataset.t===t)});({res:resumen,aul:aulas,alu:alumnos})[t]()}
 tabs.forEach(function(b){b.onclick=function(){go(b.dataset.t)}});go('res')}
var pane=function(){return document.getElementById('pane')};
function err(e){pane().innerHTML='<div class="note" role="alert">'+esc(e.message)+'</div>'}

/* ---------- Resumen ---------- */
function resumen(){pane().innerHTML='<div class="msg">Cargando…</div>';
 A.req('GET','/api/admin/stats').then(function(s){
  var conv=s.users?Math.round(s.active/s.users*100):0;
  pane().innerHTML='<div class="cards"><div class="card"><span>Alumnos registrados</span><b>'+s.users+'</b></div><div class="card"><span>Planes activos</span><b>'+s.active+'</b></div><div class="card"><span>Ingreso mensual estimado</span><b>USD '+s.mrr.toFixed(2).replace('.',',')+'</b><small>equivalente mensual de cada plan</small></div><div class="card"><span>Conversión</span><b>'+conv+'%</b><small>activos / registrados</small></div></div>'+
  '<div class="cards" style="grid-template-columns:repeat(3,1fr);margin-top:14px"><div class="card"><span>Mensual</span><b>'+s.byPlan.mensual+'</b></div><div class="card"><span>Semestral</span><b>'+s.byPlan.semestral+'</b></div><div class="card"><span>Anual</span><b>'+s.byPlan.anual+'</b></div></div>'+
  (s.simulated?'<div class="note">Incluye <b>'+s.simulated+'</b> suscripción(es) de demostración (sin cobro real).</div>':'')+
  '<p style="color:#56637f;margin-top:18px">Los registrados sin plan son tus contactos para convertir: ve a <b>Alumnos</b> y exporta la lista para enviarles una oferta.</p>'}).catch(err)}

/* ---------- Aulas ---------- */
var DB={};
function aulas(){pane().innerHTML='<div class="msg">Cargando…</div>';
 A.req('GET','/api/admin/lessons').then(function(d){DB={};d.lessons.forEach(function(l){(DB[l.module]=DB[l.module]||[]).push(l)});drawMods()}).catch(err)}
function drawMods(){
 pane().innerHTML='<div class="note">Cada módulo se guarda por separado. <b>Evita reordenar o borrar aulas ya publicadas:</b> el progreso de los alumnos se guarda por posición. Los videos deben ser enlaces <b>https</b> (mp4 directo o reproductor incrustable). Un módulo con aulas aparece disponible en el panel de los alumnos.</div><div id="mods"></div>';
 var box=document.getElementById('mods');
 MODS.forEach(function(m){var rows=(DB[m.id]||[]).map(function(l){return{title:l.title,duration:l.duration,video:l.video_url,free:l.free}}),saved=rows.length>0,draft=false;
  if(!rows.length&&m.L){rows=m.L.map(function(x){return{title:x[0],duration:x[1],video:'',free:m.id==='m0'}});draft=true}
  var el=document.createElement('article');el.className='mod';box.appendChild(el);
  function head(){return '<button aria-expanded="'+el.classList.contains('open')+'"><span class="n">'+esc(m.n)+'</span><h3>'+esc(m.t)+'</h3><span class="pill'+(saved?' on':'')+'">'+(saved?rows.length+(rows.length===1?' aula publicada':' aulas publicadas'):'Próximamente')+'</span></button>'}
  function body(){
   return '<div class="body"><div class="head"><span style="width:28px">#</span><span style="flex:1.4">Título</span><span style="width:84px">Duración</span><span style="flex:2">URL del video (https)</span></div>'+
   rows.map(function(r,i){return '<div class="row" data-i="'+i+'"><span class="i">'+(i+1)+'</span><input type="text" data-f="title" value="'+esc(r.title)+'" placeholder="Título de la aula" aria-label="Título aula '+(i+1)+'"><input type="text" data-f="duration" value="'+esc(r.duration)+'" placeholder="12:48" aria-label="Duración aula '+(i+1)+'"><input class="u" type="url" data-f="video" value="'+esc(r.video)+'" placeholder="https://…" aria-label="Video aula '+(i+1)+'"><label><input type="checkbox" data-f="free"'+(r.free?' checked':'')+'> Gratis</label><span class="acts"><button class="btn sm" data-a="up" aria-label="Subir">↑</button><button class="btn sm" data-a="dn" aria-label="Bajar">↓</button><button class="btn sm" data-a="rm" aria-label="Quitar">✕</button></span></div>'}).join('')+
   '<div class="foot"><button class="btn sm" data-a="add">+ Añadir aula</button><button class="btn pri sm" data-a="save">Guardar módulo</button><span class="st" role="status">'+(draft?'Borrador sin guardar (aulas de ejemplo)':'')+'</span></div></div>'}
  function draw(){var open=el.classList.contains('open');el.innerHTML=head()+(open?body():'')}
  function sync(){[].forEach.call(el.querySelectorAll('.row'),function(r){var o=rows[+r.dataset.i];[].forEach.call(r.querySelectorAll('[data-f]'),function(f){o[f.dataset.f]=f.type==='checkbox'?f.checked:f.value.trim()})})}
  el.addEventListener('click',function(e){var h=e.target.closest('.mod>button');if(h){el.classList.toggle('open');draw();return}
   var b=e.target.closest('[data-a]');if(!b)return;sync();var i=+(b.closest('.row')||{dataset:{}}).dataset.i,a=b.dataset.a;
   if(a==='add'){rows.push({title:'',duration:'',video:'',free:false});draft=true}
   else if(a==='rm'){if(confirm('¿Quitar esta aula? El progreso de los alumnos en las aulas siguientes se desplazará.')){rows.splice(i,1);draft=true}else return}
   else if(a==='up'&&i>0){var t=rows[i];rows[i]=rows[i-1];rows[i-1]=t;draft=true}
   else if(a==='dn'&&i<rows.length-1){var t2=rows[i];rows[i]=rows[i+1];rows[i+1]=t2;draft=true}
   else if(a==='save'){save();return}
   draw()});
  function save(){var st=el.querySelector('.st'),ok=true;
   [].forEach.call(el.querySelectorAll('.row'),function(r,i){var t=r.querySelector('[data-f=title]'),v=r.querySelector('[data-f=video]'),d=r.querySelector('[data-f=duration]');
    var bt=!rows[i].title,bv=rows[i].video&&!/^https:\/\//i.test(rows[i].video),bd=rows[i].duration&&!/^\d{1,2}:\d{2}(:\d{2})?$/.test(rows[i].duration);
    t.classList.toggle('err',bt);v.classList.toggle('err',!!bv);d.classList.toggle('err',!!bd);if(bt||bv||bd)ok=false});
   if(!ok){st.className='st bad';st.textContent='Revisa los campos marcados: título obligatorio, video https y duración mm:ss.';return}
   var btn=el.querySelector('[data-a=save]');btn.disabled=true;st.className='st';st.textContent='Guardando…';
   var payload=rows.map(function(r,i){return{id:m.id+'-'+(i+1),module:m.id,position:i+1,title:r.title,duration:r.duration,video_url:r.video,free:!!r.free}});
   A.req('PUT','/api/admin/lessons',{replace:[m.id],lessons:payload}).then(function(){saved=rows.length>0;draft=false;draw();var s2=el.querySelector('.st');s2.className='st ok';s2.textContent='✓ Guardado. Los alumnos ya ven los cambios.'})
    .catch(function(e){btn.disabled=false;st.className='st bad';st.textContent=e.message})}
  draw()})}

/* ---------- Alumnos ---------- */
function alumnos(){pane().innerHTML='<div class="msg">Cargando…</div>';
 A.req('GET','/api/admin/stats').then(function(s){var list=s.students;
  pane().innerHTML='<div class="tool"><input type="search" id="q" placeholder="Buscar por nombre o correo…" aria-label="Buscar alumno"><button class="btn sm" id="csv">⬇ Exportar CSV</button><span class="sp" id="cnt"></span></div><div class="scroll"><table class="tbl"><thead><tr><th>Nombre</th><th>Correo</th><th>Registro</th><th>Plan</th><th>Estado</th></tr></thead><tbody id="tb"></tbody></table></div>';
  function status(x){if(!x.plan)return'<span class="tag off">Sin plan</span>';if(x.status!=='active'&&x.status!=='trialing')return'<span class="tag off">'+esc(x.status)+'</span>';return x.cancel_at_period_end?'<span class="tag can">Cancela al vencer</span>':'<span class="tag act">Activo</span>'}
  function draw(){var q=document.getElementById('q').value.trim().toLowerCase(),f=list.filter(function(x){return(x.email+' '+(x.name||'')).toLowerCase().indexOf(q)>-1});
   document.getElementById('cnt').textContent=f.length+' de '+list.length;
   document.getElementById('tb').innerHTML=f.map(function(x){return '<tr><td>'+esc(x.name||'—')+'</td><td>'+esc(x.email)+'</td><td>'+new Date(x.created_at*1000).toLocaleDateString('es')+'</td><td>'+esc(x.plan||'—')+'</td><td>'+status(x)+'</td></tr>'}).join('')||'<tr><td colspan="5" style="color:#56637f">Sin resultados</td></tr>'}
  document.getElementById('q').oninput=draw;draw();
  document.getElementById('csv').onclick=function(){function c(v){v=String(v==null?'':v);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return'"'+v.replace(/"/g,'""')+'"'}
   var rows=[['nombre','correo','registro','plan','estado']].concat(list.map(function(x){return[x.name,x.email,new Date(x.created_at*1000).toISOString().slice(0,10),x.plan||'',x.plan?x.status+(x.cancel_at_period_end?' (cancela al vencer)':''):'sin plan']}));
   var blob=new Blob(['﻿'+rows.map(function(r){return r.map(c).join(',')}).join('\r\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='alumnos-biomaster.csv';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}}).catch(err)}
boot();
})();
