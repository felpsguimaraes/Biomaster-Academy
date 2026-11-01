/* Mapas mentais · 34 assuntos · 4 ramos × 2 folhas cada.
   mod = módulo (1–7) · id = número do assunto (mesmo número do capítulo). */
window.SINUS_MAPAS = [
{id:'01',mod:1,title:'Sistema nervoso autónomo',root:'Sistema nervoso autónomo',ramos:[
 {t:'Função',f:['Homeostasis','Controle visceral involuntário']},
 {t:'Simpático',f:['Origem toracolombar (T1–L2)','Alerta e mobilização de energia']},
 {t:'Parassimpático',f:['Origem craneossacra (III, VII, IX, X; S2–S4)','Repouso, digestão e eliminação']},
 {t:'Circuito',f:['Neurônio pré-ganglionar → gânglio','Neurônio pós-ganglionar → órgão']}]},
{id:'02',mod:1,title:'Neurotransmissores',root:'Neurotransmissores',ramos:[
 {t:'Gânglios',f:['ACh no simpático e no parassimpático','Receptor Nn']},
 {t:'Órgão parassimpático',f:['Acetilcolina (ACh)','Receptor muscarínico']},
 {t:'Órgão simpático',f:['Maioria: noradrenalina → α / β','Sudoríparas: ACh → muscarínico']},
 {t:'Via somática',f:['ACh → Nm','Contração muscular esquelética']}]},
{id:'03',mod:1,title:'Sinapse colinérgica',root:'Sinapse colinérgica',ramos:[
 {t:'Síntese',f:['Colina + acetil-CoA','Colina acetiltransferase (ChAT)']},
 {t:'Liberação',f:['Vesículas + entrada de Ca²⁺','Exocitose de ACh']},
 {t:'Encerramento',f:['Acetilcolinesterase degrada ACh','Colina é recaptada']},
 {t:'Modulação',f:['Autorreceptor: próprio transmissor','Heterorreceptor: outro mensageiro']}]},
{id:'04',mod:1,title:'Receptores colinérgicos',root:'Receptores colinérgicos',ramos:[
 {t:'Nicotínicos',f:['Canal iônico → despolarização','Nn: gânglio · Nm: músculo']},
 {t:'M1 · M3 · M5',f:['Proteína Gq','IP3 / DAG / Ca²⁺']},
 {t:'M2 · M4',f:['Proteína Gi','M2: freio cardíaco']},
 {t:'Diferenças',f:['Atropina bloqueia muscarínicos','Efeito depende do tecido']}]},
{id:'05',mod:2,title:'Agonistas diretos',root:'Agonistas diretos',ramos:[
 {t:'Mecanismo',f:['Ligam-se diretamente ao receptor','Imitam a acetilcolina']},
 {t:'Bexiga / intestino',f:['Betanecol','Contração sem obstrução mecânica']},
 {t:'Olho / brônquios',f:['Pilocarpina e carbacol: miose','Metacolina: provocação brônquica']},
 {t:'Excesso',f:['Secreções, diarreia, bradicardia','Broncoespasmo']}]},
{id:'06',mod:2,title:'Anticolinesterásicos',root:'Anticolinesterásicos',ramos:[
 {t:'Mecanismo',f:['Inibem a degradação de ACh','Aumentam efeitos M e N']},
 {t:'Periféricos',f:['Neostigmina','Piridostigmina']},
 {t:'Centrais',f:['Fisostigmina atravessa a BHE','Donepezila / rivastigmina / galantamina']},
 {t:'Organofosforados',f:['Fosforilação da enzima','Envelhecimento limita a reativação']}]},
{id:'07',mod:2,title:'Aplicações colinérgicas',root:'Aplicações colinérgicas',ramos:[
 {t:'Miastenia gravis',f:['Melhora sintomática da transmissão','Piridostigmina']},
 {t:'Reversão muscular',f:['Neostigmina → aumenta ACh','Antimuscarínico protege órgão M']},
 {t:'Cérebro',f:['Inibidores centrais em demências','Benefício sintomático, não cura']},
 {t:'Outros órgãos',f:['Íleo / bexiga: excluir obstrução','Olho: miose e drenagem']}]},
{id:'08',mod:2,title:'Organofosforados',root:'Organofosforados',ramos:[
 {t:'Muscarínico',f:['Broncorreia, miose, secreções','Atropina bloqueia esses efeitos']},
 {t:'Nicotínico',f:['Fasciculações e fraqueza','Risco de paralisia respiratória']},
 {t:'Central',f:['Convulsões e coma','Suporte das funções vitais']},
 {t:'Enzima',f:['Pralidoxima pode reativar a AChE','Janela depende do envelhecimento']}]},
{id:'09',mod:2,title:'Antimuscarínicos',root:'Antimuscarínicos',ramos:[
 {t:'Coração',f:['Bloqueio M2','Retira freio vagal → taquicardia']},
 {t:'Olho',f:['Midríase','Cicloplegia']},
 {t:'Glândulas / pulmão',f:['Menos secreção e sudorese','Broncodilatação']},
 {t:'Intestino / bexiga',f:['Menos motilidade','Constipação e retenção urinária']}]},
{id:'10',mod:2,title:'Estrutura e órgão',root:'Estrutura e órgão',ramos:[
 {t:'Aminas terciárias',f:['Penetração central variável','Diciclomina e hiosciamina']},
 {t:'Quaternários',f:['Baixa passagem pela BHE','Trospio / ipratropio / glicopirrolato']},
 {t:'Alvos locais',f:['Ipratropio e tiotropio: brônquios','Tropicamida: olho']},
 {t:'Bexiga hiperativa',f:['Oxibutinina / tolterodina','Solifenacina / darifenacina / trospio']}]},
{id:'11',mod:2,title:'Síndrome anticolinérgica',root:'Síndrome anticolinérgica',ramos:[
 {t:'Periferia',f:['Pele seca e midríase','Retenção urinária / íleo']},
 {t:'SNC',f:['Desatenção e confusão','Delírio']},
 {t:'Carga cumulativa',f:['Tricíclicos e outros fármacos','Soma de ação antimuscarínica']},
 {t:'Precisão',f:['Fisostigmina: uso selecionado','Não é antídoto universal']}]},
{id:'12',mod:3,title:'Catecolaminas',root:'Catecolaminas',ramos:[
 {t:'Síntese',f:['Tirosina → L-DOPA → dopamina','Dopamina → noradrenalina (DBH)']},
 {t:'Adrenalina',f:['PNMT converte NA em adrenalina','Conversão na medula suprarrenal']},
 {t:'Fim do sinal',f:['Recaptação neuronal (NET)','Metabolismo: MAO e COMT']},
 {t:'Fármacos',f:['Cocaína: bloqueia recaptação','Reserpina: bloqueia armazenamento']}]},
{id:'13',mod:3,title:'Adrenoceptores',root:'Adrenoceptores',ramos:[
 {t:'α1 · Gq',f:['Vasoconstrição','Midríase']},
 {t:'α2 · Gi',f:['Feedback negativo','Menor saída simpática']},
 {t:'β1 · Gs',f:['Mais frequência e força','Liberação de renina']},
 {t:'β2 / β3 · Gs',f:['β2: relaxa brônquios e útero','β3: relaxa detrusor']}]},
{id:'14',mod:3,title:'Agonistas α',root:'Agonistas α',ramos:[
 {t:'α1 periférico',f:['Fenilefrina','Midodrina']},
 {t:'Mucosa nasal',f:['Oximetazolina','Congestão de rebote']},
 {t:'α2 central',f:['Clonidina','Menor comando simpático']},
 {t:'Alfametildopa',f:['Metabólito α2 central','Contexto obstétrico']}]},
{id:'15',mod:3,title:'Agonistas e hemodinâmica',root:'Agonistas e hemodinâmica',ramos:[
 {t:'Adrenalina',f:['α + β','Anafilaxia / parada cardíaca']},
 {t:'Noradrenalina',f:['Vasoconstrição α','Pressão e barorreflexo']},
 {t:'Dobutamina',f:['Predomínio inotrópico β1','Baixo débito selecionado']},
 {t:'Comparar',f:['Dopamina: perfil dependente da dose','Isoproterenol: β1 + β2']}]},
{id:'16',mod:3,title:'β2 · β3 · indiretos',root:'β2 · β3 · indiretos',ramos:[
 {t:'β2',f:['Salbutamol: ação curta','Salmeterol + corticoide inalado (asma)']},
 {t:'β3',f:['Mirabegron','Relaxamento do detrusor']},
 {t:'Indiretos',f:['Anfetamina: liberação','Cocaína: recaptação']},
 {t:'Mistos',f:['Efedrina e pseudoefedrina','Indicações não são equivalentes']}]},
{id:'17',mod:3,title:'Antagonistas α',root:'Antagonistas α',ramos:[
 {t:'Não seletivos',f:['Fenoxibenzamina: prolongada','Fentolamina: competitiva']},
 {t:'α1',f:['Prazosina / terazosina / doxazosina','Hipotensão ortostática']},
 {t:'Vias urinárias',f:['Tansulosina e relacionados','Relaxamento da saída vesical']},
 {t:'Reversão',f:['Bloqueio α + adrenalina','Vasodilatação β2 permanece']}]},
{id:'18',mod:3,title:'β-bloqueadores',root:'β-bloqueadores',ramos:[
 {t:'Não seletivos',f:['Propranolol / nadolol / timolol','Bloqueiam β1 e β2']},
 {t:'β1 preferenciais',f:['Metoprolol / bisoprolol / atenolol','Seletividade diminui em dose alta']},
 {t:'Perfis próprios',f:['Esmolol: muito breve','Nebivolol: libera óxido nítrico']},
 {t:'Mistos / riscos',f:['Carvedilol e labetalol: α1 + β','Bradicardia / broncoespasmo']}]},
{id:'19',mod:4,title:'Ácido araquidónico e eicosanoides',root:'Ácido araquidónico',ramos:[
 {t:'Origem',f:['Fosfolipídios de membrana','Fosfolipase A2 libera AA']},
 {t:'Via COX',f:['Prostaglandinas / PGI2','Tromboxano TXA2']},
 {t:'Via lipoxigenase',f:['Leucotrienos','Inflamação e broncoespasmo']},
 {t:'Funções',f:['Dor / febre / agregação','Proteção gástrica e perfusão renal']}]},
{id:'20',mod:4,title:'Efeitos dos AINEs',root:'Efeitos dos AINEs',ramos:[
 {t:'Alvo',f:['Inibição de COX','Menos prostanoides']},
 {t:'Dor e febre',f:['Menor sensibilização nociceptiva','Menor sinalização febril']},
 {t:'Inflamação / plaqueta',f:['Menos mediadores','AAS: efeito antiagregante particular']},
 {t:'Limites',f:['Efeito techo','Os "4 A" não são iguais para todos']}]},
{id:'21',mod:4,title:'Riscos dos AINEs',root:'Riscos dos AINEs',ramos:[
 {t:'Gastrointestinal',f:['Menos PG protetoras da mucosa','Úlcera e sangramento']},
 {t:'Renal',f:['Menos vasodilatação compensatória','Menor filtração e retenção de Na⁺/água']},
 {t:'Cardiovascular',f:['Pressão e edema','Risco trombótico não só dos coxibs']},
 {t:'Interações',f:['Anticoagulantes / corticoides','Lítio / metotrexato']}]},
{id:'22',mod:4,title:'Salicilatos',root:'Salicilatos',ramos:[
 {t:'AAS',f:['Inibição irreversível de COX','TXA2 plaquetário reduzido']},
 {t:'Excesso inicial',f:['Estímulo respiratório','Alcalose respiratória']},
 {t:'Metabolismo tóxico',f:['Desacoplamento oxidativo','Hipertermia / acidose metabólica']},
 {t:'Reconhecer',f:['Zumbido / hipoacusia','Risco digestivo e renal']}]},
{id:'23',mod:4,title:'Famílias de AINEs',root:'Famílias de AINEs',ramos:[
 {t:'Propiónicos / fenamatos',f:['Ibuprofeno e naproxeno','Ácido mefenâmico']},
 {t:'Acéticos',f:['Indometacina / diclofenaco','Cetorolaco: analgesia breve']},
 {t:'Oxicams',f:['Meloxicam','Piroxicam']},
 {t:'Coxibs',f:['Celecoxib / etoricoxib','Seletividade não elimina riscos']}]},
{id:'24',mod:4,title:'Paracetamol e dipirona',root:'Paracetamol e dipirona',ramos:[
 {t:'Paracetamol',f:['Analgesia + antipirese','Pouca ação antiinflamatória']},
 {t:'NAPQI',f:['Detoxificação por glutationa','Excesso → necrose hepática centrolobular']},
 {t:'NAC',f:['Repõe glutationa','Tratamento indicado: iniciar cedo']},
 {t:'Dipirona / metamizol',f:['Analgesia e antipirese','Agranulocitose / hipersensibilidade']}]},
{id:'25',mod:5,title:'Dor e opioides',root:'Dor e opioides',ramos:[
 {t:'Caracterizar',f:['Intensidade e duração','Nociceptiva / neuropática']},
 {t:'Vocabulário',f:['Opiáceo: derivado do ópio','Opioide: age no sistema opioide']},
 {t:'Endógenos',f:['Encefalinas e endorfinas','Dinorfinas']},
 {t:'História / modelo',f:['Papaver somniferum → fármacos','Escada analgésica: modelo contextual']}]},
{id:'26',mod:5,title:'Receptores opioides',root:'Receptores opioides',ramos:[
 {t:'Famílias',f:['μ / κ / δ','Acoplamento Gi/o']},
 {t:'Presináptico',f:['Menor entrada de Ca²⁺','Menor liberação de transmissores']},
 {t:'Pós-sináptico',f:['Maior condutância de K⁺','Hiperpolarização']},
 {t:'Atividade',f:['Pleno / parcial / misto','Antagonistas: naloxona e naltrexona']}]},
{id:'27',mod:5,title:'Opioides: efeitos e comparação',root:'Opioides: efeitos',ramos:[
 {t:'Benefício',f:['Analgesia','Modulação da percepção e da transmissão']},
 {t:'Riscos',f:['Depressão respiratória','Sedação / constipação']},
 {t:'Comparação',f:['Morfina / fentanil / oxicodona','Codeína / hidrocodona / tramadol']},
 {t:'Tramadol',f:['Opioide + monoaminas','Convulsões / síndrome serotoninérgica']}]},
{id:'28',mod:6,title:'Córtex suprarrenal',root:'Córtex suprarrenal',ramos:[
 {t:'Zonas',f:['Glomerulosa: aldosterona','Fasciculada: cortisol']},
 {t:'Controle',f:['CRH → ACTH → cortisol','Retroalimentação negativa']},
 {t:'Mineralocorticoides',f:['Sódio / água / potássio','SRAA e K⁺']},
 {t:'Síndromes',f:['Addison: insuficiência primária','Cushing: excesso de ação']}]},
{id:'29',mod:6,title:'Ação dos corticoides',root:'Ação dos corticoides',ramos:[
 {t:'Entrada / receptor',f:['Atravessam a membrana','Receptor GR intracelular']},
 {t:'Núcleo',f:['Modulam a expressão gênica','Efeito genômico']},
 {t:'Mediadores',f:['Anexina A1 / PLA2 / COX-2','Citocinas e funções leucocitárias']},
 {t:'Resultado',f:['Antiinflamação','Imunossupressão']}]},
{id:'30',mod:6,title:'Perfis dos corticoides',root:'Perfis dos corticoides',ramos:[
 {t:'Curta / intermediária',f:['Hidrocortisona','Prednisona / prednisolona']},
 {t:'Longa / mineral',f:['Dexametasona / betametasona','Fludrocortisona: ação mineral']},
 {t:'Conversão',f:['Prednisona → prednisolona','Cortisona → cortisol']},
 {t:'Via e formulação',f:['Via local não exclui absorção sistêmica','Vida plasmática ≠ duração biológica']}]},
{id:'31',mod:6,title:'Efeitos metabólicos',root:'Efeitos metabólicos',ramos:[
 {t:'Glicose / proteína',f:['Hiperglicemia','Catabolismo → miopatia']},
 {t:'Osso / gordura',f:['Osteoporose','Redistribuição adiposa central']},
 {t:'Imunidade / SNC',f:['Maior risco de infecções','Sono e humor']},
 {t:'Eixo / outros',f:['Supressão do eixo HHA','Catarata / glaucoma / edema']}]},
{id:'32',mod:6,title:'Uso e retirada',root:'Uso e retirada',ramos:[
 {t:'Finalidades',f:['Substituição hormonal','Controle de inflamação / imunidade']},
 {t:'Via / contexto',f:['Pulmão, pele, intestino, transplante','Indicação depende da doença']},
 {t:'Precisão',f:['Anafilaxia: adrenalina primeiro','Conferir mg versus µg']},
 {t:'Retirada',f:['Risco depende da exposição','Curso curto nem sempre exige desmame']}]},
{id:'33',mod:7,title:'Raciocínio de prova',root:'Raciocínio de prova',ramos:[
 {t:'Identifique',f:['Receptor','Local de ação']},
 {t:'Explique',f:['Mecanismo','Efeito no órgão']},
 {t:'Conecte',f:['Indicação','Reação adversa']},
 {t:'Revise',f:['Responda sem consulta','Registre o elo que faltou']}]},
{id:'34',mod:7,title:'Corticoides: oral',root:'Corticoides',ramos:[
 {t:'Defina',f:['Hormônios esteroides','Glicocorticoides / mineralocorticoides']},
 {t:'Explique',f:['Receptor intracelular','Expressão gênica']},
 {t:'Relacione',f:['Imunossupressão e metabolismo','Reações adversas']},
 {t:'Conclua',f:['Cushing iatrogênico','Supressão do eixo e retirada']}]}
];
