// Integra a Apostila SINUS · Farmacologia P2 na plataforma SINUS (repositório ritmo-sinusal).
// Uso: node materiais/farmacologia-p2/integracao-sinus/gerar.mjs /caminho/para/ritmo-sinusal
// Gera/atualiza (idempotente):
//   aulas/apostila-farmacologia/index.html      → aba Apostila da matéria
//   mapas/dados/farmacologia-apostila.js        → Mapas guiados (níveis 1–2) e questões (nível 3 · casos)
//   aulas/flashcards/cartoes.js (bloco marcado) → aba Flashcards (baralho farmacologia/gimenez)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const AP = join(HERE, '..');
const SINUS = process.argv[2];
if (!SINUS) { console.error('informe o caminho do repositório ritmo-sinusal'); process.exit(1); }
const require = createRequire(import.meta.url);
const MAPAS = require('./mapas-guiados.js');

const ctx = { window: {} }; vm.createContext(ctx);
['questoes.js', 'cartoes.js'].forEach((f) => vm.runInContext(readFileSync(join(AP, 'src', f), 'utf8'), ctx));
const Q = ctx.window.SINUS_QUESTOES, C = ctx.window.SINUS_CARTOES;
const J = (x) => JSON.stringify(x);
const MODS = { m1: ['Clase 6', 'SNA e receptores', [6, 5, 41]], m2: ['Clase 6', 'Fármacos colinérgicos', [6, 42, 110]], m3: ['Clase 7', 'Fármacos adrenérgicos', [7, 4, 65]], m4: ['Clase 8', 'AINEs e analgésicos', [8, 3, 36]], m5: ['Clase 8', 'Dor e opioides', [8, 38, 72]], m6: ['Clase 9', 'Corticoides', [9, 5, 46]], m7: ['Clases 6 a 9', 'Integração', null] };
const FONTE = 'Apostila SINUS · Farmacologia P2 (Clases 6–9) · autoria Felipe Guimarães de Souza';

/* 1) Mapas guiados + questões (casos) */
let mods = MAPAS.map((m) => ({
  id: 'ap_' + m.id, clase: m.clase, titulo: 'Apostila · ' + m.titulo, tipo: 'mapa', sl: [m.sl],
  centro: m.centro, sub: m.sub || 'Apostila SINUS P2', fuente: FONTE,
  ramas: m.ramas.map((r) => ({ t: r.t, hojas: r.hojas })),
}));
const L = 'abcd';
for (const [k, lista] of Object.entries(Q)) {
  const [clase, nome, sl] = MODS[k];
  const casos = lista.filter((q) => q.tipo !== 'ab').map((q) => {
    if (q.tipo === 'vf') {
      const ops = ['a) Verdadeiro', 'b) Falso'], r = q.r ? 0 : 1;
      return [q.q, 'Verdadeiro ou falso?', ops[r], L[r], q.ex, ops];
    }
    const ops = q.ops.map((o, i) => L[i] + ') ' + o);
    return [q.q, 'Escolha a alternativa correta.', ops[q.r], L[q.r], q.ex, ops];
  });
  const mod = { id: 'ap_q_' + k, clase, titulo: 'Apostila · Questões: ' + nome, tipo: 'casos', resumen: 'Múltipla escolha e verdadeiro ou falso, com justificativa.', fuente: FONTE, casos };
  if (sl) mod.sl = [sl];
  mods.push(mod);
}
const mapasJs = `/* Sinus · Mapas guiados · Farmacología I · APOSTILA SINUS P2 (Clases 6 a 9)
   Complemento de farmacologia.js: ${MAPAS.length} mapas da apostila (níveis Guiado e Desafío) e
   ${Object.keys(Q).length} blocos de questões de múltipla escolha e V/F (nível Prova).
   Texto em português com os termos técnicos em espanhol, como na apostila.
   Gerado por materiais/farmacologia-p2/integracao-sinus/gerar.mjs (Biomaster-Academy). Não editar à mão. */
(function () {
  var F = window.SINUS_MAPAS && window.SINUS_MAPAS.farmacologia;
  if (!F) return;
  var novos = ${JSON.stringify(mods, null, 1)};
  var ids = {}; F.modulos.forEach(function (m) { ids[m.id] = 1; });
  novos.forEach(function (m) { if (!ids[m.id]) F.modulos.push(m); });
})();
`;
writeFileSync(join(SINUS, 'mapas/dados/farmacologia-apostila.js'), mapasJs);

/* 2) Flashcards: baralho farmacologia/gimenez (cartões + respostas abertas) */
const cards = [];
const GN = { m1: 'SNA e receptores', m2: 'Colinérgicos', m3: 'Adrenérgicos', m4: 'AINEs', m5: 'Opioides', m6: 'Corticoides', m7: 'Integração' };
for (const [k, lista] of Object.entries(C)) lista.forEach((c, i) => cards.push({ id: 'ap-' + k + '-' + (i + 1), g: GN[k], t: MODS[k][0] + ' · ' + GN[k], q: c.f, a: c.b, x: 'Apostila SINUS P2' }));
for (const [k, lista] of Object.entries(Q)) lista.filter((q) => q.tipo === 'ab').forEach((q, i) => cards.push({ id: 'ap-ab-' + k + '-' + (i + 1), g: 'Respostas abertas', t: MODS[k][0] + ' · resposta aberta', q: q.q, a: q.resp, x: 'Responda em voz alta antes de virar. Apostila SINUS P2.' }));
// treino de mecanismos e as nove perguntas da Clase 9 (capítulos 33 e 34 da apostila)
const mod7 = readFileSync(join(AP, 'src/capitulos/mod7.html'), 'utf8');
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
[...mod7.matchAll(/<div class="qt">([\s\S]*?)<\/div>[\s\S]*?<div class="ans">([\s\S]*?)<\/div>/g)].forEach((m, i) => {
  const clase9 = i >= 8;
  cards.push({ id: 'ap-ab-' + (clase9 ? 'c9-' + (i - 7) : 'treino-' + (i + 1)), g: 'Respostas abertas', t: clase9 ? 'Clase 9 · questionário da aula' : 'Clases 6 a 9 · treino de mecanismos', q: strip(m[1]), a: strip(m[2]), x: clase9 ? 'Pergunta oficial da Clase 9 (páginas 44 e 46).' : 'Treino de mecanismos da Apostila SINUS P2.' });
});
const deck = { nome: 'Dr. Cristhiam Giménez · Apostila P2', fonte: 'Apostila SINUS · Farmacologia P2 (Clases 6 a 9)', area: 'teoria', cartoes: cards };
const INI = '/* >>> farmacologia/gimenez · gerado por gerar.mjs (Apostila SINUS P2) */', FIM = '/* <<< farmacologia/gimenez */';
const cfile = join(SINUS, 'aulas/flashcards/cartoes.js');
let cs = readFileSync(cfile, 'utf8');
const bloco = `${INI}\nwindow.SINUS_CARTOES = window.SINUS_CARTOES || {};\nwindow.SINUS_CARTOES["farmacologia/gimenez"] = ${JSON.stringify(deck, null, 1)};\n${FIM}\n`;
const a = cs.indexOf(INI), b = cs.indexOf(FIM);
cs = a >= 0 ? cs.slice(0, a) + bloco + cs.slice(b + FIM.length + 1) : cs.replace(/\s*$/, '\n') + bloco;
writeFileSync(cfile, cs);

/* 3) Apostila (aba Apostila da matéria) */
let html = readFileSync(join(AP, 'apostila-farmacologia-p2.html'), 'utf8');
html = html.replace('<span class="rt">Cadernos de Medicina</span>', '<a class="rt" href="/" style="text-decoration:none">← Voltar ao Sinus</a>');
mkdirSync(join(SINUS, 'aulas/apostila-farmacologia'), { recursive: true });
writeFileSync(join(SINUS, 'aulas/apostila-farmacologia/index.html'), html);

console.log(`mapas: ${MAPAS.length} · blocos de questões: ${Object.keys(Q).length} (${mods.filter((m) => m.tipo === 'casos').reduce((s, m) => s + m.casos.length, 0)} questões) · flashcards: ${cards.length} (${cards.filter((c) => c.g === 'Respostas abertas').length} de resposta aberta) · apostila: ${(html.length / 1024).toFixed(0)} KB`);
