(function(){
var KEY='biomaster.panel.v2';
var IC={
 inicio:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 curso:'<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
 repaso:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h10M7 14h6"/>',
 preguntas:'<circle cx="12" cy="12" r="10"/><path d="m8 12.5 3 3 5-6"/>',
 materiales:'<path d="M12 5v16"/><path d="M2 5a2 2 0 0 1 2-2h4a4 4 0 0 1 4 4 4 4 0 0 1 4-4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a2 2 0 0 1-2-2z"/>',
 fijados:'<path d="M12 17v5"/><path d="M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
 chev:'<path d="m9 18 6-6-6-6"/>', flask:'<path d="M10 2v7.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7M7 16h10"/>',
 net:'<circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.2 8.3 10.8 15.6M15.8 8.3 13.2 15.6M8.5 7h7"/>',
 inf:'<path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.500 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.500-6 4z"/>', play:'<path d="M6 4v16l14-8z"/>'
};
function svg(n,extra){return '<svg viewBox="0 0 24 24" fill="'+(n==='play'?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'+(extra||'')+'>'+IC[n]+'</svg>'}
function pinSvg(on){return '<svg viewBox="0 0 24 24" fill="'+(on?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC.fijados+'</svg>'}
var VIEWS=[['inicio','Inicio'],['curso','Mi curso'],['repaso','Repaso'],['preguntas','Preguntas'],['materiales','Materiales'],['fijados','Fijados']];
var MODS=BIO.MODS;
var MATS=[
 {id:'a1',k:'PDF',t:'Resumen · Fundamentos',d:'Módulo 06 · Material de apoyo'},
 {id:'a2',k:'PDF',t:'Regulación enzimática · Mapa visual',d:'Módulo 06 · Esquema de repaso'},
 {id:'a3',k:'MAP',t:'Metabolismo integrado',d:'Conexiones principales'}
];
MODS.forEach(function(m){m.l=m.L?m.L.length:0});
var TOTAL=MODS.reduce(function(a,m){return a+m.l},0);
function tagOf(m){return m.tag||('MÓDULO '+m.n)}
function durOf(m,i){return m.L&&m.L[i-1]?m.L[i-1][1]:''}
function load(){try{var d=JSON.parse(localStorage.getItem(KEY));if(d&&d.done&&Array.isArray(d.pins)&&Array.isArray(d.notes))return d}catch(e){}return{done:{},pins:[],notes:[],open:'m0'}}
var S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function safeUrl(u){u=String(u||'').trim();if(!u)return'';if(!/^https?:\/\//i.test(u))u='https://'+u;try{var x=new URL(u);return/^https?:$/.test(x.protocol)?x.href:''}catch(e){return''}}
function doneIn(m){var c=0;for(var i=1;i<=m.l;i++)if(S.done[m.id+'-'+i])c++;return c}
function doneAll(){return MODS.reduce(function(a,m){return a+doneIn(m)},0)}
function lessonTitle(m,i){return m.L&&m.L[i-1]?m.L[i-1][0]:'Aula '+String(i).padStart(2,'0')}
function nextLesson(){for(var k=0;k<MODS.length;k++){var m=MODS[k];for(var i=1;i<=m.l;i++)if(!S.done[m.id+'-'+i])return{m:m,i:i}}return null}
function isPin(id){return S.pins.indexOf(id)>-1}
function toast(t){var e=document.getElementById('toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(function(){e.hidden=true},2600)}
function mod(m){var n=doneIn(m),pc=m.l?Math.round(n/m.l*100):0;
 return '<article class="mod"><button class="pinbtn'+(isPin(m.id)?' on':'')+'" data-pin="'+m.id+'" aria-label="'+(isPin(m.id)?'Quitar de Fijados':'Fijar')+' '+esc(m.t)+'">'+pinSvg(isPin(m.id))+'</button><div class="ico">'+svg(m.i)+'</div><span class="tag">'+tagOf(m)+'</span><h4>'+esc(m.t)+'</h4><p>'+esc(m.d)+'</p>'+
 (m.locked?'<div class="locked">Próximamente</div>':'<div class="bar"><i style="width:'+pc+'%"></i></div><small>'+n+' de '+m.l+' aulas</small><button class="open" data-view="curso" data-open="'+m.id+'">Abrir módulo →</button>')+'</article>'}
var R={
 inicio:function(){var nl=nextLesson(),da=doneAll(),pc=Math.round(da/TOTAL*100);
  var next=nl?('<div class="lesson"><div class="thumb"><div class="play">'+svg('play')+'</div><span>'+(durOf(nl.m,nl.i)||'Aula '+nl.i)+'</span></div><div class="linfo"><span class="tag">'+tagOf(nl.m)+' · '+esc(nl.m.t.toUpperCase())+'</span><h4>'+esc(lessonTitle(nl.m,nl.i))+'</h4><p>'+esc(nl.m.d)+'</p><button class="act" style="margin:0" data-done="'+nl.m.id+'-'+nl.i+'">Marcar como vista</button></div></div>'):'<p class="empty" style="margin-top:14px">Terminaste todas las aulas disponibles. Los módulos nuevos aparecerán aquí.</p>';
  return '<section class="hero"><div class="hero-copy"><span class="pill">TU ACADEMIA DE BIOQUÍMICA</span><h2>La Bioquímica no se memoriza.<br><em>¡Se domina!</em></h2><p>Aprende de forma visual, práctica y organizada con videoaulas, materiales de apoyo y repasos pensados para conectar cada concepto.</p><div class="actions"><button class="primary" data-view="curso">Continuar estudiando →</button><button class="secondary" data-view="fijados">Ver mis fijados</button></div></div><img src="assets/professora-boneca.png" alt=""></section>'+
  '<div class="two"><section class="card lift"><div class="sec-title"><div><span class="eyebrow">CONTINUAR DONDE LO DEJASTE</span><h3>Tu próxima clase</h3></div><button class="link" data-view="curso">Ver curso completo →</button></div>'+next+'</section>'+
  '<section class="card"><span class="eyebrow">MI PROGRESO</span><div class="ring" style="background:conic-gradient(var(--violet) '+pc+'%,var(--surface-2) 0)"><div><b>'+pc+'%</b><span>del curso</span></div></div><div class="stats"><div><b>'+da+'</b><span>Vistas</span></div><div><b>'+(TOTAL-da)+'</b><span>Restantes</span></div><div><b>'+MODS.length+'</b><span>Módulos</span></div></div></section></div>'+
  '<section class="card"><div class="sec-title"><div><span class="eyebrow">TU CAMINO DE APRENDIZAJE</span><h3>Módulos del curso</h3></div><button class="link" data-view="curso">Ver todos →</button></div><div class="mods">'+MODS.map(mod).join('')+'</div></section>'+
  '<section class="tip"><figure><img src="assets/coruja.png" alt=""></figure><div><span>DICA DE LA PROFE</span><h3>No estudies rutas metabólicas como listas aisladas.</h3><p>Pregúntate siempre: ¿de dónde viene este sustrato, qué necesita la célula y hacia dónde irá después?</p></div></section>'},
 curso:function(){return '<section class="workhead"><span class="eyebrow">MI CURSO</span><h2>Bioquímica paso a paso</h2><p>Continúa desde donde paraste o elige un módulo. Marca cada aula como vista para ver tu progreso.</p></section><div class="courselist">'+MODS.map(function(m){
   var n=doneIn(m),pc=m.l?Math.round(n/m.l*100):0,open=S.open===m.id&&!m.locked;
   var rows='';if(open){rows='<div class="lessons">';for(var i=1;i<=m.l;i++){var k=m.id+'-'+i,d=!!S.done[k];rows+='<div class="lrow'+(d?' done':'')+'"><input type="checkbox" id="c-'+k+'" data-chk="'+k+'"'+(d?' checked':'')+'><label for="c-'+k+'">'+esc(lessonTitle(m,i))+'</label>'+(durOf(m,i)?'<small>'+durOf(m,i)+'</small>':'')+'</div>'}rows+='</div>'}
   return '<article class="cmod'+(open?' open':'')+(m.locked?' locked-m':'')+'"><button class="chead" '+(m.locked?'disabled':'data-toggle="'+m.id+'"')+' aria-expanded="'+open+'"><b>'+m.n+'</b><div><span class="tag">'+tagOf(m)+'</span><h3>'+esc(m.t)+'</h3><p>'+(m.locked?esc(m.d)+' · Próximamente':m.l+(m.l===1?' aula':' aulas')+' · '+n+(n===1?' vista':' vistas'))+'</p>'+(m.locked?'':'<div class="bar"><i style="width:'+pc+'%"></i></div>')+'</div>'+(m.locked?'':'<span class="chev">'+svg('chev')+'</span>')+'</button>'+rows+'</article>'}).join('')+'</div>'},
 repaso:function(){var c=[['repaso','Flashcards','Repasa conceptos clave de los módulos estudiados.','Empezar repaso'],['net','Rutas metabólicas','Conecta sustratos, productos y regulación.','Repasar rutas'],['flask','Repaso de 10 min','Una selección rápida basada en tu progreso.','Iniciar']];
  return '<section class="workhead"><span class="eyebrow">REPASO INTELIGENTE</span><h2>¿Qué quieres reforzar hoy?</h2><p>Sesiones cortas para mantener los conceptos activos.</p></section><div class="tool-grid">'+c.map(function(x){return '<article><div class="ico">'+svg(x[0])+'</div><h3>'+x[1]+'</h3><p>'+x[2]+'</p><button class="act" data-soon>'+x[3]+'</button></article>'}).join('')+'</div>'},
 preguntas:function(){return '<section class="workhead"><span class="eyebrow">BANCO DE PREGUNTAS</span><h2>Practica para comprobar que entendiste.</h2><p>Filtra por módulo y revisa tus errores.</p></section><div class="quiz"><div><span>SESIÓN RECOMENDADA</span><h3>10 preguntas · Fundamentos</h3><p>Tiempo estimado: 12 minutos</p></div><button class="act" data-soon>Comenzar →</button></div><div class="qstats"><article><b>—</b><span>Aciertos</span></article><article><b>0</b><span>Respondidas</span></article><article><b>0</b><span>Para revisar</span></article></div>'},
 materiales:function(){return '<section class="workhead"><span class="eyebrow">BIBLIOTECA</span><h2>Materiales de apoyo</h2><p>Todo lo que acompaña tus clases, organizado por módulo.</p></section><div class="mlist">'+MATS.map(function(m){return '<article class="mat"><i>'+m.k+'</i><div><h3>'+esc(m.t)+'</h3><p>'+esc(m.d)+'</p></div><button class="pinbtn'+(isPin(m.id)?' on':'')+'" data-pin="'+m.id+'" aria-label="'+(isPin(m.id)?'Quitar de Fijados':'Fijar')+' '+esc(m.t)+'">'+pinSvg(isPin(m.id))+'</button><button class="act" style="margin:0" data-soon>Ver</button></article>'}).join('')+'</div>'},
 fijados:function(){var all=MODS.map(function(m){return{id:m.id,t:m.t,s:'Módulo '+m.n,v:'curso',o:m.id}}).concat(MATS.map(function(m){return{id:m.id,t:m.t,s:m.d,v:'materiales'}}));
  var pins=S.pins.map(function(id){return all.filter(function(x){return x.id===id})[0]}).filter(Boolean);
  var h='<section class="workhead"><span class="eyebrow">LO QUE QUIERES TENER A MANO</span><h2>Fijados</h2><p>Módulos y materiales que fijaste, más tus propios links y notas.</p></section>';
  h+='<div class="sub">Módulos y materiales</div>'+(pins.length?'<div class="fx-grid">'+pins.map(function(p){return '<div class="fx-card"><button class="rm" data-pin="'+p.id+'" aria-label="Quitar '+esc(p.t)+' de Fijados">✕</button><h3>'+esc(p.t)+'</h3><p>'+esc(p.s)+'</p><button class="go" data-view="'+p.v+'"'+(p.o?' data-open="'+p.o+'"':'')+'>Abrir →</button></div>'}).join('')+'</div>':'<div class="empty">Nada fijado todavía. Usa el alfiler en los módulos de Inicio y en Materiales.</div>');
  h+='<div class="sub">Links y notas</div><form class="fx-form" id="fx-form"><label for="fx-t">Título<input id="fx-t" name="t" maxlength="120" placeholder="Ej.: Grupo de estudio de Bioquímica" required></label><label for="fx-u">Link (opcional)<input id="fx-u" name="u" maxlength="500" placeholder="drive.google.com/…"></label><button class="act" style="margin:0" type="submit">Fijar</button></form>';
  h+=S.notes.length?'<div class="fx-grid">'+S.notes.map(function(n,i){var u=safeUrl(n.u);return '<div class="fx-card"><button class="rm" data-rn="'+i+'" aria-label="Quitar '+esc(n.t)+'">✕</button><h3>'+esc(n.t)+'</h3>'+(u?'<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">Abrir link</a>':'<p>Nota</p>')+'</div>'}).join('')+'</div>':'<div class="empty">Aún no agregaste links ni notas.</div>';
  return h}
};

function planBox(){var s=window.BioPay&&BioPay.sub(),el=document.getElementById('planbox'),f=document.getElementById('pfoot-plan');if(!el)return;
 if(!s){el.innerHTML='<b>Vista de demostración</b><span>Elige un plan para activar tu acceso</span><button data-pay="mensual">Elegir plan</button>';f.textContent='Sin plan activo';return}
 var p=BioPay.plan(s.plan),on=s.status==='active';
 el.innerHTML='<b>Plan '+esc(p.name)+'</b><span>'+BIO.money(p.price)+' · '+(on?'renueva el '+new Date(s.renews).toLocaleDateString('es',{day:'numeric',month:'short'}):'cancelado')+'</span><button data-manage>Gestionar plan</button>';
 f.textContent='Plan '+p.name+' · '+(on?'activo':'cancelado')}
document.addEventListener('biopay:change',planBox);
var cur='inicio';
function navHtml(){var c=S.pins.length+S.notes.length;return VIEWS.map(function(v){return '<button data-view="'+v[0]+'"'+(v[0]===cur?' aria-current="page"':'')+'>'+svg(v[0])+'<span>'+v[1]+'</span>'+(v[0]==='fijados'&&c?'<span class="badge">'+c+'</span>':'')+'</button>'}).join('')}
function paint(){document.getElementById('snav').innerHTML=navHtml();document.getElementById('tabs').innerHTML=VIEWS.filter(function(v){return v[0]!=='repaso'}).map(function(v){return '<button data-view="'+v[0]+'"'+(v[0]===cur?' aria-current="page"':'')+'>'+svg(v[0])+'<span>'+(v[0]==='materiales'?'Material':v[1])+'</span></button>'}).join('');
 document.getElementById('crumb').textContent=VIEWS.filter(function(v){return v[0]===cur})[0][1];
 document.getElementById('page').innerHTML=R[cur]();
 var f=document.getElementById('fx-form');if(f)f.onsubmit=function(e){e.preventDefault();var t=f.t.value.trim();if(!t)return;S.notes.unshift({t:t,u:f.u.value.trim()});save();paint()}}
function show(){var h=(location.hash||'').replace('#','');var inApp=VIEWS.some(function(v){return v[0]===h});
 document.getElementById('landing').hidden=inApp;document.getElementById('app').hidden=!inApp;
 if(inApp){cur=h;paint();planBox();window.scrollTo(0,0)}}
function go(v){if(location.hash==='#'+v)show();else location.hash=v}
window.addEventListener('hashchange',show);
document.addEventListener('click',function(e){var t=e.target.closest('[data-go],[data-enter],[data-leave],[data-view],[data-pin],[data-rn],[data-toggle],[data-done],[data-soon]');if(!t)return;
 if(t.dataset.go){var s=document.getElementById(t.dataset.go);if(s)s.scrollIntoView({behavior:'smooth'});return}
 if('enter' in t.dataset){go('inicio');return}
 if('leave' in t.dataset){if(location.hash){history.pushState('',document.title,location.pathname+location.search)}show();window.scrollTo(0,0);return}
 if('soon' in t.dataset){toast('Este contenido se activa cuando se carga el curso.');return}
 if(t.dataset.pin){var id=t.dataset.pin,i=S.pins.indexOf(id);if(i>-1)S.pins.splice(i,1);else S.pins.push(id);save();paint();return}
 if(t.dataset.rn){S.notes.splice(+t.dataset.rn,1);save();paint();return}
 if(t.dataset.toggle){S.open=S.open===t.dataset.toggle?'':t.dataset.toggle;save();paint();return}
 if(t.dataset.done){S.done[t.dataset.done]=true;save();paint();toast('Aula marcada como vista.');return}
 if(t.dataset.view){if(t.dataset.open){S.open=t.dataset.open;save()}document.getElementById('results').hidden=true;go(t.dataset.view)}});
document.addEventListener('change',function(e){var k=e.target.dataset&&e.target.dataset.chk;if(!k)return;if(e.target.checked)S.done[k]=true;else delete S.done[k];save();paint()});
var q=document.getElementById('q'),res=document.getElementById('results');
q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();if(!v){res.hidden=true;return}
 var hits=MODS.filter(function(m){return(m.t+' '+m.d).toLowerCase().indexOf(v)>-1}).map(function(m){return{t:m.t,s:'Módulo '+m.n,v:'curso',o:m.id}}).concat(MATS.filter(function(m){return(m.t+' '+m.d).toLowerCase().indexOf(v)>-1}).map(function(m){return{t:m.t,s:m.d,v:'materiales'}})).concat(S.notes.filter(function(n){return n.t.toLowerCase().indexOf(v)>-1}).map(function(n){return{t:n.t,s:'Fijados · nota',v:'fijados'}}));
 res.innerHTML=hits.length?hits.map(function(h){return '<button data-view="'+h.v+'"'+(h.o?' data-open="'+h.o+'"':'')+'>'+esc(h.t)+'<small>'+esc(h.s)+'</small></button>'}).join(''):'<button disabled>Sin resultados<small>Prueba con otra palabra</small></button>';res.hidden=false});
document.addEventListener('click',function(e){if(!e.target.closest('.searchbox')){res.hidden=true}});
show();
})();
