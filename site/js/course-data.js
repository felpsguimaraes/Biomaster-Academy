/* Datos compartidos: temario (estructura definida por la Dra. Andrea) y planes. */
(function(){
var MODS=[
 {id:'m0',n:'00',tag:'EMPIEZA POR AQUÍ',t:'Bienvenida Biomáster',d:'Conoce la plataforma y cómo sacar el máximo provecho del curso.',i:'flask',L:[['¡Bienvenido, Biomáster! Empieza por aquí','01:09']]},
 {id:'m1',n:'01',t:'Química básica',d:'Átomos, enlaces químicos y química orgánica.',i:'flask',locked:true},
 {id:'m2',n:'02',t:'Fundamentos de Bioquímica',d:'Introducción a la bioquímica, bioelementos, agua y pH, biomoléculas orgánicas.',i:'net',locked:true},
 {id:'m3',n:'03',t:'Aminoácidos y proteínas',d:'Bioquímica estructural: monómeros (aminoácidos, nucleótidos, monosacáridos), péptidos de importancia fisiológica, proteínas y su ciclo de vida, niveles estructurales, mal plegamiento proteico, hemoglobina y mioglobina.',i:'inf',locked:true},
 {id:'m4',n:'04',t:'Carbohidratos y lípidos',d:'Estructura y función de los carbohidratos y los lípidos.',i:'flask',locked:true},
 {id:'m5',n:'05',t:'Ácidos nucleicos y vitaminas',d:'Nucleótidos, ADN, ARN y el papel de las vitaminas.',i:'net',locked:true},
 {id:'m6',n:'06',t:'Fundamentos del Metabolismo',d:'Introducción al metabolismo y regulación enzimática.',i:'inf',L:[['Introducción al Metabolismo I','11:32'],['Introducción al Metabolismo II','26:05'],['Regulación Enzimática I','23:56'],['Regulación Enzimática II','18:14']]},
 {id:'m7',n:'07',t:'Trilogía de la respiración celular',d:'Ciclo de Krebs, cadena de transporte de electrones y fosforilación oxidativa.',i:'flask',locked:true},
 {id:'m8',n:'08',t:'Escudo antioxidante y síntesis celular',d:'Defensa antioxidante y rutas de síntesis celular.',i:'net',locked:true},
 {id:'m9',n:'09',t:'Gestión del nitrógeno y detoxificación celular',d:'Metabolismo de aminoácidos, ciclo de la urea y detoxificación.',i:'inf',locked:true},
 {id:'m10',n:'10',t:'Eje insulina-glucagón',d:'Regulación hormonal del metabolismo energético.',i:'flask',locked:true},
 {id:'m11',n:'11',t:'Reserva y producción de glucosa',d:'Glucólisis, glucogenogénesis, glucogenólisis y gluconeogénesis.',i:'net',locked:true},
 {id:'m12',n:'12',t:'Metabolismo de lípidos I: Energía',d:'Obtención de energía a partir de los lípidos.',i:'inf',locked:true},
 {id:'m13',n:'13',t:'Metabolismo de lípidos II: Síntesis',d:'Síntesis de ácidos grasos, triglicéridos y colesterol.',i:'flask',locked:true},
 {id:'m14',n:'14',t:'Metabolismo del grupo hemo',d:'Síntesis y degradación del grupo hemo.',i:'net',locked:true},
 {id:'m15',n:'15',t:'Integración metabólica',d:'Conecta todas las rutas en estados de ayuno, alimentación y ejercicio.',i:'inf',locked:true},
 {id:'m16',n:'16',t:'Metabolismo del eritrocito',d:'Particularidades metabólicas del glóbulo rojo.',i:'flask',locked:true},
 {id:'m17',n:'17',t:'Bioquímica clínica',d:'Interpretación clínica de los exámenes de laboratorio.',i:'net',locked:true}
];
/* Planes (propuesta: mensual 25,90 · semestral -16% · anual -29%). Precios a confirmar por la profesora. */
var PLANS=[
 {id:'mensual',name:'Mensual',price:25.90,months:1,badge:'',note:'Cancela cuando quieras'},
 {id:'semestral',name:'Semestral',price:129.90,months:6,badge:'Ahorra 16%',note:'6 meses de acceso'},
 {id:'anual',name:'Anual · Fundadores',price:219.90,months:12,badge:'Ahorra 29%',note:'12 meses · precio de lanzamiento'}
];
PLANS.forEach(function(p){p.perMonth=Math.round(p.price*100/p.months+1e-9)/100;p.save=Math.round((1-p.perMonth/PLANS[0].price)*100)});
function money(n){return 'USD '+n.toFixed(2).replace('.',',')}
window.BIO={MODS:MODS,PLANS:PLANS,money:money};
/* ---------- Monedas, precios locales y ruta de cobro más barata ---------- */
/* Precios locales redondeados "atractivos". Referencia: USD 25,90 / 129,90 / 219,90. El guaraní se apreció ~10% en 2026:
   revisar los precios en Gs y R$ cada trimestre. */
var PRICES={USD:{mensual:25.90,semestral:129.90,anual:219.90},PYG:{mensual:149000,semestral:749000,anual:1249000},BRL:{mensual:139.90,semestral:699.90,anual:1189.90}};
var CURS=[['USD','USD'],['PYG','Gs'],['BRL','R$']];
var BRL_TZ=/^America\/(Sao_Paulo|Manaus|Fortaleza|Recife|Bahia|Belem|Cuiaba|Campo_Grande|Porto_Velho|Rio_Branco|Araguaina|Maceio|Noronha|Boa_Vista|Santarem|Eirunepe)$/;
function detect(){try{var s=localStorage.getItem('biomaster.cur');if(s&&PRICES[s])return s}catch(e){}
 var tz='',l=(navigator.language||'').toLowerCase();try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
 if(tz==='America/Asuncion'||/-py$/.test(l))return'PYG';if(BRL_TZ.test(tz)||/-br$/.test(l))return'BRL';return'USD'}
var CUR=detect();
function getCur(){return CUR}
function setCur(c){if(!PRICES[c])return;CUR=c;try{localStorage.setItem('biomaster.cur',c)}catch(e){}document.dispatchEvent(new CustomEvent('biocur:change'))}
function num(c,n){return c==='PYG'?Math.round(n).toLocaleString('es-PY'):n.toLocaleString(c==='BRL'?'pt-BR':'es',{minimumFractionDigits:2,maximumFractionDigits:2})}
function fmt(c,n){return (c==='USD'?'USD ':c==='PYG'?'Gs ':'R$ ')+num(c,n)}
function perMonth(p,c){c=c||CUR;var v=PRICES[c][p.id]/p.months;return c==='PYG'?Math.round(v/1000)*1000:Math.round(v*100)/100}
function planPrice(p,c){c=c||CUR;return fmt(c,PRICES[c][p.id])}
function planPer(p,c){c=c||CUR;return fmt(c,perMonth(p,c))}
function saveOf(p,c){c=c||CUR;return Math.round((1-perMonth(p,c)/PRICES[c].mensual)*100)}
/* Rutas de cobro por moneda y método (comisiones de fuentes secundarias: confirmar con cada proveedor).
   Se elige siempre la opción más barata disponible para cada comprador. */
var ROUTES={'PYG:card':{prov:'Pagopar',fee:.03,note:'Crédito ≈ 3% · débito ≈ 2%'},'PYG:qr':{prov:'Pagopar (QR)',fee:.02,note:'QR ≈ 2%'},
 'BRL:pix':{prov:'Pagopar (QR Pix)',fee:.029,note:'QR Pix ≈ 2,9%'},'BRL:card':{prov:'Hotmart',fee:.099,fixed:.5,note:'9,9% + fija'},'USD:card':{prov:'Hotmart',fee:.099,fixed:.5,note:'9,9% + fija'}};
function methodsFor(c){return c==='PYG'?['card','qr']:c==='BRL'?['pix','card']:['card']}
function route(c,m){return ROUTES[c+':'+m]||ROUTES['USD:card']}
function feeUsd(c,m,usd){var r=route(c,m);return usd*r.fee+(r.fixed||0)}
Object.assign(window.BIO,{PRICES:PRICES,CURS:CURS,getCur:getCur,setCur:setCur,fmt:fmt,planPrice:planPrice,planPer:planPer,saveOf:saveOf,methodsFor:methodsFor,route:route,feeUsd:feeUsd});

})();
