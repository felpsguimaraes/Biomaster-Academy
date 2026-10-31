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
})();
