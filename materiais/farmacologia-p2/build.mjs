// Monta a apostila SINUS · Farmacologia P2 em um único HTML autocontido.
// Uso: node materiais/farmacologia-p2/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const DIR = dirname(fileURLToPath(import.meta.url));
const src = (p) => readFileSync(join(DIR, 'src', p), 'utf8');

const MODULOS = [
  { n: 1, file: 'mod1.html', titulo: 'Sistema nervoso autónomo', aula: 'Clase 6', q: 'm1',
    desc: 'O circuito antes do fármaco: quem libera o quê, a sinapse colinérgica e os receptores nicotínicos e muscarínicos.' },
  { n: 2, file: 'mod2.html', titulo: 'Fármacos colinérgicos', aula: 'Clase 6', q: 'm2',
    desc: 'Agonistas diretos, anticolinesterásicos, miastenia e Alzheimer, organofosforados, antimuscarínicos e síndrome anticolinérgica.' },
  { n: 3, file: 'mod3.html', titulo: 'Fármacos adrenérgicos', aula: 'Clase 7', q: 'm3',
    desc: 'Catecolaminas, adrenoceptores, agonistas α e β, agentes indiretos, bloqueadores α e β-bloqueadores.' },
  { n: 4, file: 'mod4.html', titulo: 'AINEs e analgésicos', aula: 'Clase 8', q: 'm4',
    desc: 'Eicosanoides, os quatro efeitos e seus limites, riscos, salicilatos, famílias, paracetamol e dipirona.' },
  { n: 5, file: 'mod5.html', titulo: 'Dor e opioides', aula: 'Clase 8', q: 'm5',
    desc: 'Dor, escada analgésica, receptores μ, κ e δ, classificação dos opioides e efeitos sistêmicos.' },
  { n: 6, file: 'mod6.html', titulo: 'Corticoides', aula: 'Clase 9', q: 'm6',
    desc: 'Córtex suprarrenal e eixo HHA, mecanismo genômico, potência e duração, efeitos adversos, aplicações e retirada.' },
  { n: 7, file: 'mod7.html', titulo: 'Integração e treino', aula: 'Clases 6–9', q: 'm7',
    desc: 'Treino de mecanismos com resposta aberta e as nove perguntas oficiais da aula de corticoides.' },
];

// dados (executa os arquivos de dados num sandbox para contar itens)
const ctx = { window: {} };
vm.createContext(ctx);
['mapas.js', 'questoes.js', 'cartoes.js'].forEach((f) => vm.runInContext(src(f), ctx));
const MAPAS = ctx.window.SINUS_MAPAS, QUEST = ctx.window.SINUS_QUESTOES, CART = ctx.window.SINUS_CARTOES;
const NQ = Object.values(QUEST).reduce((a, l) => a + l.length, 0) + 17; // + 8 treinos + 9 perguntas da aula
const NC = Object.values(CART).reduce((a, l) => a + l.length, 0);

const LOGO = '<span class="logo"><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#2a7a52" stroke-width="2.4"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.6" fill="#2a7a52" stroke="none"/></svg></span><span class="wm">sinus<i>.</i></span></span>';

const strip = (h) => h.replace(/<[^>]+>/g, '').trim();
let body = src('frente.html').replaceAll('{{LOGO}}', LOGO).replaceAll('{{NQ}}', NQ).replaceAll('{{NC}}', NC);
let nav = '';
let toc = '';

for (const m of MODULOS) {
  const html = src(join('capitulos', m.file));
  const caps = [...html.matchAll(/<section class="pg cap" id="cap(\d\d)">[\s\S]*?<\/section>/g)];
  const itens = caps.map((c) => ({ id: c[1], html: c[0], titulo: strip(c[0].match(/<h1 class="h1">([\s\S]*?)<\/h1>/)[1]) }));
  const mod = String(m.n).padStart(2, '0');

  nav += `<div class="sec">Módulo ${m.n} · ${m.titulo}</div>` + itens.map((c) => `<a href="#cap${c.id}">${c.titulo}</a>`).join('') +
    `<a href="#ex${m.n}">✎ Exercícios</a><a href="#fc${m.n}">⧉ Flashcards</a>`;
  toc += `<a href="#mod${m.n}"><b>${mod}</b><span><strong>${m.titulo}</strong> · ${m.aula}<br><small>${itens.map((c) => c.titulo.replace(/^\d+\.\s*/, '')).join(' · ')}</small></span></a>`;

  body += `<section class="pg cap modcover" id="mod${m.n}"><span class="tag-mod">MÓDULO ${mod} · ${m.aula.toUpperCase()}</span><h1 class="h1">${m.titulo}</h1><p class="lead">${m.desc}</p>
<div class="list">${itens.map((c) => `<a href="#cap${c.id}"><b>${c.id}</b><span>${c.titulo.replace(/^\d+\.\s*/, '')}</span></a>`).join('')}
<a href="#ex${m.n}"><b>✎</b><span>Exercícios (${QUEST[m.q].length})</span></a><a href="#fc${m.n}"><b>⧉</b><span>Flashcards (${CART[m.q].length})</span></a></div></section>\n`;

  for (const c of itens) {
    body += c.html + '\n';
    const mp = MAPAS.find((x) => x.id === c.id);
    if (mp) body += `<section class="pg cap" id="mm${c.id}"><span class="eyebrow">Mapa mental ${c.id} · Recuperação ativa</span><h1 class="h1">${mp.title}</h1>
<p class="mmlegend">Diga a resposta e toque para conferir.</p>
<div class="mmwrap"><div class="mm" data-mm="${c.id}"></div></div></section>\n`;
  }
  body += `<section class="pg cap" id="ex${m.n}"><span class="eyebrow">Exercícios · Módulo ${mod}</span><h1 class="h1">Pratique: ${m.titulo}</h1>
<div class="quiz ex" data-quiz="${m.q}"></div></section>\n`;
  body += `<section class="pg cap" id="fc${m.n}"><span class="eyebrow">Flashcards · Módulo ${mod}</span><h1 class="h1">Flashcards: ${m.titulo}</h1>
<div class="deck" data-deck="${m.q}"></div></section>\n`;
}

body += src('apendice.html');
nav += '<div class="sec">Apêndice</div><a href="#fichas">Fichas de doses de referência</a><a href="#fontes">Fontes, divergências e créditos</a>';

// sumário logo após "Antes de começar"
const sumario = `<section class="pg cap modcover" id="sumario"><span class="eyebrow">Guia de navegação</span><h1 class="h1">Módulos e assuntos</h1><div class="list">${toc}</div></section>\n`;
body = body.replace('<section class="pg cap modcover" id="mod1">', sumario + '<section class="pg cap modcover" id="mod1">');

const out = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SINUS · Farmacología I · P2 — Clases 6–9 (edição completa)</title>
<meta name="description" content="Apostila SINUS de Farmacologia P2: SNA, colinérgicos, adrenérgicos, AINEs, opioides e corticoides, com mapas mentais para completar, exercícios e flashcards.">
<style>
${src('estilo.css')}
</style>
</head>
<body>
<nav class="nav" aria-label="Sumário">${LOGO}<div class="prog">Seu progresso<div><i id="progbar"></i></div><span id="progtxt"></span></div><div class="legend"><span><mark class="my">amarelo</mark> cai na prova</span><span><mark class="mr">vermelho</mark> alerta / erro clássico</span><span><b>negrito</b> termo-chave</span></div>
<a href="#capa">Capa</a><a href="#antes">Antes de começar</a><a href="#sumario">Módulos e assuntos</a>${nav}</nav>
<main class="main">
${body}
<p style="text-align:center;color:#6b7770;font-size:12px;margin:24px 0 40px">sinus. · Seu estudo. Seu tempo. Seu ritmo.</p>
</main>
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
console.log(`ok: ${MAPAS.length} mapas · ${NQ} exercícios · ${NC} flashcards · ${(out.length / 1024).toFixed(0)} KB`);
