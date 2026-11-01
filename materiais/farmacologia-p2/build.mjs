// Monta a apostila SINUS · Farmacologia P2 em um único HTML autocontido,
// no formato das apostilas SINUS (abas, cartões de vidro, «Já estudei»).
// Uso: node materiais/farmacologia-p2/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const DIR = dirname(fileURLToPath(import.meta.url));
const src = (p) => readFileSync(join(DIR, 'src', p), 'utf8');
const marca = (p) => readFileSync(join(DIR, '..', 'marca-sinus', p), 'utf8').replace(/<title>.*?<\/title>/, '');

const MODULOS = [
  { n: 1, file: 'mod1.html', titulo: 'Sistema nervoso autónomo', aula: 'Clase 6', q: 'm1' },
  { n: 2, file: 'mod2.html', titulo: 'Fármacos colinérgicos', aula: 'Clase 6', q: 'm2' },
  { n: 3, file: 'mod3.html', titulo: 'Fármacos adrenérgicos', aula: 'Clase 7', q: 'm3' },
  { n: 4, file: 'mod4.html', titulo: 'AINEs e analgésicos', aula: 'Clase 8', q: 'm4' },
  { n: 5, file: 'mod5.html', titulo: 'Dor e opioides', aula: 'Clase 8', q: 'm5' },
  { n: 6, file: 'mod6.html', titulo: 'Corticoides', aula: 'Clase 9', q: 'm6' },
  { n: 7, file: 'mod7.html', titulo: 'Integração e treino', aula: 'Clases 6–9', q: 'm7' },
];

const ctx = { window: {} };
vm.createContext(ctx);
['mapas.js', 'questoes.js', 'cartoes.js'].forEach((f) => vm.runInContext(src(f), ctx));
const MAPAS = ctx.window.SINUS_MAPAS, QUEST = ctx.window.SINUS_QUESTOES, CART = ctx.window.SINUS_CARTOES;
const NQ = Object.values(QUEST).reduce((a, l) => a + l.length, 0) + 17;
const NC = Object.values(CART).reduce((a, l) => a + l.length, 0);

const LOGO = marca('sinus-logo-horizontal.svg');
const strip = (h) => h.replace(/<[^>]+>/g, '').trim();
const LEG = '<div class="legend"><span><mark class="my">amarelo</mark> cai na prova</span><span><mark class="mr">vermelho</mark> alerta / erro clássico</span><span><b>negrito</b> termo-chave</span><span><b style="color:#176e5b">+</b> toque para abrir o detalhe</span></div>';

// converte <section class="pg cap" id="X">…</section> em cartão SINUS
function cartao(sec, { check = true, modTitulo = '' } = {}) {
  const id = sec.match(/id="([^"]+)"/)[1];
  const h1 = sec.match(/<h1 class="h1">([\s\S]*?)<\/h1>/)[1];
  const m = h1.match(/^(\d+)\.\s*(.*)$/);
  const num = m ? m[1] : '';
  const titulo = m ? m[2] : h1;
  const eyebrow = strip((sec.match(/<span class="eyebrow">([\s\S]*?)<\/span>/) || [, ''])[1]);
  let inner = sec.replace(/^<section[^>]*>/, '').replace(/<\/section>\s*$/, '')
    .replace(/<span class="eyebrow">[\s\S]*?<\/span>\s*/, '').replace(/<h1 class="h1">[\s\S]*?<\/h1>\s*/, '');
  const mp = num && MAPAS.find((x) => x.id === num);
  if (mp) inner += `<details class="mmdet"><summary>Mapa mental · completar</summary><p class="mmlegend">Diga a resposta e toque para conferir.</p><div class="mmwrap"><div class="mm" data-mm="${num}"></div></div></details>`;
  const head = `<div class="head"><div><span class="num">${num ? num + ' · ' : ''}${modTitulo || eyebrow}</span><h3>${titulo}</h3></div>${check && num ? `<label class="check"><input type="checkbox" data-lido="${num}"> Já estudei</label>` : ''}</div>`;
  return { id, num, titulo, html: `<article class="cap" id="${id}"${num ? ` data-cap="${num}"` : ''}>${head}${inner}</article>\n` };
}

let apostila = '', exerc = '', flash = '', toc = '';
let totalCaps = 0;
for (const m of MODULOS) {
  const secs = [...src(join('capitulos', m.file)).matchAll(/<section class="pg cap" id="cap\d\d">[\s\S]*?<\/section>/g)].map((x) => x[0]);
  const caps = secs.map((s) => cartao(s, { modTitulo: m.titulo }));
  totalCaps += caps.length;
  toc += caps.map((c) => `<a href="#${c.id}" data-toc="${c.num}">${c.num}. ${c.titulo}</a>`).join('');
  apostila += `<section class="grupo" id="mod${m.n}"><div class="grupo-h"><h2>${m.titulo}</h2><span class="mini">${caps.length} capítulos · ${m.aula}</span></div>${caps.map((c) => c.html).join('')}</section>\n`;
  exerc += `<section class="grupo" id="ex${m.n}"><div class="grupo-h"><h2>${m.titulo}</h2><span class="mini">${QUEST[m.q].length} questões</span></div><div class="quiz ex" data-quiz="${m.q}"></div></section>\n`;
  flash += `<section class="grupo" id="fc${m.n}"><div class="grupo-h"><h2>${m.titulo}</h2><span class="mini">${CART[m.q].length} cartões</span></div><div class="deck" data-deck="${m.q}"></div></section>\n`;
}
const consulta = [...src('apendice.html').matchAll(/<section class="pg cap" id="[^"]+">[\s\S]*?<\/section>/g)]
  .map((x) => cartao(x[0], { check: false }).html).join('');

const out = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Apostila de farmacologia · P2 · SINUS</title>
<meta name="description" content="Apostila SINUS de Farmacologia P2: SNA, colinérgicos, adrenérgicos, AINEs, opioides e corticoides, com esquemas interativos, mapas mentais, exercícios e flashcards.">
<meta name="theme-color" content="#155B48">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(marca('sinus-icone.svg'))}">
<style>
${src('estilo.css')}
</style>
</head>
<body>
<div class="wrap">
<div class="brandbar">${LOGO}<span class="rt">Cadernos de Medicina</span></div>
<header class="top">
<div class="kicker">Farmacología I · UCP · P2</div>
<h1>Apostila de farmacologia</h1>
<p class="lede">SNA, colinérgicos, adrenérgicos, AINEs, opioides e corticoides. Explicação em português com os termos em espanhol, esquemas interativos e exercícios que corrigem na hora.</p>
<div class="progress"><i id="progbar"></i></div>
<div class="mini" id="progtxt">Capítulos lidos: 0 de ${totalCaps}</div>
</header>
<nav class="tabs" role="tablist">
<button role="tab" data-tab="apostila" aria-selected="true">Apostila</button>
<button role="tab" data-tab="exercicios" aria-selected="false">Exercícios <span class="mini">${NQ - 17}</span></button>
<button role="tab" data-tab="flashcards" aria-selected="false">Flashcards <span class="mini">${NC}</span></button>
<button role="tab" data-tab="consulta" aria-selected="false">Consulta</button>
</nav>
<main>
<div data-pane="apostila">
<div class="howto glass">${LEG}</div>
<nav class="toc" aria-label="Capítulos">${toc}</nav>
${apostila}
</div>
<div data-pane="exercicios" hidden>
<p class="lede">Responda sem consultar. A correção e a justificativa aparecem na hora.</p>
${exerc}
</div>
<div data-pane="flashcards" hidden>
<p class="lede">Toque no cartão para virar. «Sei» tira da pilha; «Revisar de novo» manda para o fim.</p>
${flash}
</div>
<div data-pane="consulta" hidden>
${consulta}
</div>
</main>
<footer class="pe">${LOGO}<span>Seu estudo. Seu tempo. Seu ritmo.<br>Autoria: Felipe Guimarães de Souza · SINUS</span></footer>
</div>
<script>
${src('mapas.js')}
${src('questoes.js')}
${src('cartoes.js')}
${src('app.js')}
</script>
</body>
</html>
`;
writeFileSync(join(DIR, 'apostila-farmacologia-p2.html'), out);
console.log(`ok: ${totalCaps} capítulos · ${MAPAS.length} mapas · ${NQ} exercícios · ${NC} flashcards · ${(out.length / 1024).toFixed(0)} KB`);
