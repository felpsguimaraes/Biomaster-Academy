/* Cliente de la API (cuentas, suscripción, progreso, aulas). Inactivo si BIO_CONFIG.apiBase está vacío. */
(function(){
var base=(window.BIO_CONFIG&&BIO_CONFIG.apiBase||'').replace(/\/$/,'');
var S={on:!!base,ready:false,user:null,sub:null,access:false,admin:false,cfg:{stripe:false,sim:false},lessons:{}};
function fire(){document.dispatchEvent(new CustomEvent('bioapi:change'))}
function req(method,path,body){
 return fetch(base+path,{method:method,credentials:'include',headers:Object.assign({'X-Requested-With':'biomaster'},body!==undefined?{'Content-Type':'application/json'}:{}),body:body!==undefined?JSON.stringify(body):undefined})
 .then(function(r){return r.json().catch(function(){return{}}).then(function(d){if(!r.ok){var e=new Error(d.error||'Algo salió mal. Inténtalo de nuevo.');e.status=r.status;throw e}return d})})}
function refresh(){
 if(!S.on)return Promise.resolve(S);
 return Promise.all([req('GET','/api/me'),req('GET','/api/config').catch(function(){return S.cfg})]).then(function(a){
  S.user=a[0].user;S.sub=a[0].subscription;S.access=a[0].access;S.admin=!!a[0].admin;S.cfg=a[1];S.ready=true;return lessons()}).catch(function(){S.ready=true;S.offline=true}).then(function(){fire();return S})}
function lessons(){return req('GET','/api/lessons').then(function(d){S.lessons={};d.lessons.forEach(function(l){S.lessons[l.id]=l})}).catch(function(){})}
window.BioAPI={state:S,req:req,refresh:refresh,
 login:function(e,p){return req('POST','/api/auth/login',{email:e,password:p}).then(refresh)},
 register:function(e,p,n){return req('POST','/api/auth/register',{email:e,password:p,name:n}).then(refresh)},
 logout:function(){return req('POST','/api/auth/logout',{}).then(function(){S.user=null;S.sub=null;S.access=false;S.lessons={};return refresh()})}};
if(S.on)refresh();else S.ready=true;
})();
