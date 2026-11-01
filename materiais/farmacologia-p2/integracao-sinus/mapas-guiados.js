/* Mapas guiados da Apostila SINUS · Farmacologia P2 (Clases 6–9) no formato da plataforma SINUS.
   Cada folha: [pista, resposta curta (variações com ||), chaves sem acento].
   sl = [clase, slide inicial, slide final] (páginas citadas na apostila). */
module.exports = [
{id:'01',clase:'Clase 6',sl:[6,5,23],titulo:'Sistema nervoso autónomo',centro:'Sistema nervoso autónomo',sub:'regula as vísceras sem decisão consciente',ramas:[
 {t:'Função',hojas:[['Equilíbrio interno que o SNA mantém','Homeostasis || Homeostase','homeosta'],['Tipo de controle sobre as vísceras','Involuntário || Involuntario','involunt|inconscient|automat']]},
 {t:'Simpático',hojas:[['Origem medular do simpático (T1–L2)','Toracolombar','toracolomb'],['Resposta geral do simpático','Luta ou fuga || Alerta','luta|fuga|alerta']]},
 {t:'Parassimpático',hojas:[['Origem do parassimpático (pares III, VII, IX, X e S2–S4)','Craniossacra || Craneosacra || Craniossacral','cranios|craneos|craniosac'],['Resposta geral do parassimpático','Repouso e digestão || Repouso','repous|digest']]},
 {t:'Circuito',hojas:[['O 1º neurônio sai do SNC e termina no...','Gânglio || Ganglio','gangli'],['O 2º neurônio vai do gânglio até o...','Órgão efetor || Órgão || Efetor','orgao|efetor']]}]},
{id:'02',clase:'Clase 6',sl:[6,14,41],titulo:'Neurotransmissores e receptores',centro:'Quem libera o quê',sub:'transmissor e receptor em cada ponto',ramas:[
 {t:'Gânglios',hojas:[['Transmissor dos gânglios simpáticos e parassimpáticos','Acetilcolina || ACh','acetilcol|ach'],['Receptor ganglionar','Nn || Nicotínico neuronal','nn|nicotin']]},
 {t:'Órgão parassimpático',hojas:[['Transmissor pós-ganglionar parassimpático','Acetilcolina || ACh','acetilcol|ach'],['Receptor no órgão parassimpático','Muscarínico','muscarin']]},
 {t:'Órgão simpático',hojas:[['Transmissor da maioria das fibras simpáticas','Noradrenalina || Norepinefrina','noradren|norepinef'],['Exceção: sudoríparas écrinas usam este transmissor','Acetilcolina || ACh','acetilcol|ach']]},
 {t:'Via somática',hojas:[['Receptor da placa motora','Nm || Nicotínico muscular','nm|nicotin'],['Efeito na fibra esquelética','Contração || Contração muscular','contra']]}]},
{id:'03',clase:'Clase 6',sl:[6,23,29],titulo:'Sinapse colinérgica',centro:'Sinapse colinérgica',sub:'síntese, liberação e fim do sinal',ramas:[
 {t:'Síntese',hojas:[['Substrato captado com Na⁺ (bloqueado pelo hemicolínio)','Colina','colina'],['Enzima que sintetiza a ACh','Colina acetiltransferase || ChAT','acetiltransf|chat']]},
 {t:'Liberação',hojas:[['Íon que entra e dispara a fusão das vesículas','Cálcio || Ca2+','calci|ca2|ca'],['Etapa bloqueada pela toxina botulínica','Exocitose || Liberação','exocit|libera']]},
 {t:'Encerramento',hojas:[['Enzima que hidrolisa a ACh na fenda','Acetilcolinesterase || AChE','acetilcolinest|ache'],['Destino da colina após a hidrólise','Recaptação || Reciclagem','recapt|recicl']]},
 {t:'Modulação',hojas:[['Receptor pré-sináptico que reconhece o próprio transmissor','Autorreceptor','autorrecep|autorecep'],['Receptor pré-sináptico que responde a outro mensageiro','Heterorreceptor','heterorrecep|heterorecep']]}]},
{id:'04',clase:'Clase 6',sl:[6,30,41],titulo:'Receptores colinérgicos',centro:'Receptores colinérgicos',sub:'nicotínicos e muscarínicos',ramas:[
 {t:'Nicotínicos',hojas:[['Estrutura do receptor nicotínico','Canal iônico || Canal ionico','canal'],['Efeito rápido da abertura do canal','Despolarização','despolar']]},
 {t:'M1 · M3 · M5',hojas:[['Proteína G dos muscarínicos ímpares','Gq','gq'],['Segundos mensageiros gerados pela fosfolipase C','IP3 e DAG || IP3 y DAG','ip3;dag']]},
 {t:'M2 · M4',hojas:[['Proteína G dos muscarínicos pares','Gi','^gi'],['Efeito do M2 na frequência cardíaca','Bradicardia || Diminui a frequência','bradicard|diminu|reduz']]},
 {t:'Diferenças',hojas:[['Classe de receptor bloqueada pela atropina','Muscarínicos || Muscarínico','muscarin'],['A resposta final depende do...','Tecido || Tipo celular','tecido|celul']]}]},
{id:'05',clase:'Clase 6',sl:[6,42,66],titulo:'Agonistas colinérgicos diretos',centro:'Agonistas diretos',sub:'imitam a acetilcolina',ramas:[
 {t:'Classes',hojas:[['Grupo de acetilcolina, metacolina, carbacol e betanecol','Ésteres de colina','esteres|ester'],['Grupo de pilocarpina, muscarina e arecolina','Alcaloides naturais || Alcaloides','alcaloid']]},
 {t:'Bexiga / intestino',hojas:[['Éster M3 resistente à AChE para retenção urinária','Betanecol','betanecol'],['Contraindicação antes de estimular bexiga ou intestino','Obstrução mecânica || Obstrução','obstruc']]},
 {t:'Olho / brônquios',hojas:[['Alcaloide para glaucoma e miose','Pilocarpina','pilocarp'],['Agonista da prova de provocação brônquica','Metacolina','metacolin']]},
 {t:'Excesso',hojas:[['Efeito cardíaco do excesso muscarínico','Bradicardia','bradicard'],['Antídoto da intoxicação por cogumelos (muscarina)','Atropina','atropin']]}]},
{id:'06',clase:'Clase 6',sl:[6,49,70],titulo:'Anticolinesterásicos',centro:'Anticolinesterásicos',sub:'preservam a acetilcolina',ramas:[
 {t:'Mecanismo',hojas:[['Enzima inibida','Acetilcolinesterase || AChE','acetilcolinest|ache'],['Consequência na fenda sináptica','Aumenta a ACh || Mais acetilcolina','aument|mais;ach|acetilcol']]},
 {t:'Periféricos',hojas:[['Carbamato quaternário da reversão do bloqueio neuromuscular','Neostigmina','neostigmin'],['Carbamato quaternário de uso crônico na miastenia','Piridostigmina','piridostigmin']]},
 {t:'Centrais',hojas:[['Carbamato terciário que atravessa a BHE','Fisostigmina','fisostigmin'],['Inibidor central usado no Alzheimer (exemplo)','Donepezila || Donepezilo || Rivastigmina || Galantamina','donepez|rivastig|galantam']]},
 {t:'Organofosforados',hojas:[['Como o organofosforado liga-se à enzima','Fosforilação','fosforil'],['Processo que impede a reativação por oximas','Envelhecimento || Envejecimiento','envelhec|envejec']]}]},
{id:'07',clase:'Clase 6',sl:[6,61,69],titulo:'Aplicações colinérgicas',centro:'Aplicações colinérgicas',sub:'miastenia, reversão e Alzheimer',ramas:[
 {t:'Miastenia gravis',hojas:[['Mecanismo da doença','Autoimune || Anticorpos contra o receptor','autoimun|anticorp'],['O tratamento com piridostigmina é...','Sintomático','sintomat']]},
 {t:'Reversão muscular',hojas:[['Fármaco que reverte bloqueio neuromuscular não despolarizante','Neostigmina','neostigmin'],['Fármaco associado para proteger coração e glândulas','Antimuscarínico || Atropina || Glicopirrolato','antimuscar|atropin|glicopirr']]},
 {t:'Alzheimer',hojas:[['Os inibidores centrais oferecem benefício...','Sintomático','sintomat'],['Efeito cardíaco a vigiar','Bradicardia || Síncope','bradicard|sincop']]},
 {t:'Outros órgãos',hojas:[['Antes de estimular íleo ou bexiga, excluir...','Obstrução mecânica || Obstrução','obstruc'],['Efeito ocular útil no glaucoma','Miose','miose|miosis']]}]},
{id:'08',clase:'Clase 6',sl:[6,56,70],titulo:'Intoxicação por organofosforados',centro:'Organofosforados',sub:'excesso muscarínico, nicotínico e central',ramas:[
 {t:'Muscarínico',hojas:[['Mnemônico dos efeitos muscarínicos','DUMBBELSS','dumbbel'],['Fármaco que bloqueia os efeitos muscarínicos','Atropina','atropin']]},
 {t:'Nicotínico',hojas:[['Movimentos musculares finos do excesso nicotínico','Fasciculações || Fasciculaciones','fascicul'],['Risco grave da fraqueza nicotínica','Paralisia respiratória || Insuficiência respiratória','respirat|paralis']]},
 {t:'Central',hojas:[['Manifestação central grave','Convulsões || Coma','convuls|coma'],['Primeiro pilar do tratamento','Suporte || Suporte vital','suporte|vital']]},
 {t:'Enzima',hojas:[['Oxima que reativa a AChE','Pralidoxima || Obidoxima','pralidox|obidox'],['A janela da oxima depende do...','Envelhecimento || Envejecimiento','envelhec|envejec']]}]},
{id:'09',clase:'Clase 6',sl:[6,71,88],titulo:'Antimuscarínicos por órgão',centro:'Antimuscarínicos',sub:'o oposto do parassimpático',ramas:[
 {t:'Coração',hojas:[['Subtipo cardíaco bloqueado','M2','m2'],['Efeito na frequência','Taquicardia','taquicard']]},
 {t:'Olho',hojas:[['Dilatação da pupila','Midríase || Midriasis','midria'],['Perda da acomodação','Cicloplegia','ciclopleg']]},
 {t:'Glândulas / pulmão',hojas:[['Glândulas mais sensíveis à atropina (efeito)','Boca seca || Xerostomia','seca|xerostom'],['Efeito nos brônquios','Broncodilatação','broncodilat']]},
 {t:'Intestino / bexiga',hojas:[['Efeito intestinal','Constipação || Estreñimiento','constip|estren'],['Efeito vesical (risco na HPB)','Retenção urinária','retenc|retenç']]}]},
{id:'10',clase:'Clase 6',sl:[6,78,110],titulo:'Estrutura química e BHE',centro:'Estrutura e órgão',sub:'terciários × quaternários',ramas:[
 {t:'Terciários',hojas:[['Aminas terciárias podem chegar ao...','SNC || Sistema nervoso central','snc|central'],['Antimuscarínico da bexiga que cruza a BHE (risco cognitivo)','Oxibutinina','oxibutin']]},
 {t:'Quaternários',hojas:[['Passagem pela BHE dos quaternários','Baixa || Pouca','baixa|pouca'],['Quaternário da bexiga hiperativa','Trospio','trospi']]},
 {t:'Alvos locais',hojas:[['Antimuscarínico inalado de ação longa (LAMA)','Tiotrópio || Tiotropio','tiotrop'],['Midriático de curta duração','Tropicamida','tropicam']]},
 {t:'Precisão',hojas:[['Diciclomina e hiosciamina são aminas...','Terciárias','terciar'],['Antiespasmódico quaternário (Buscopan)','Butilbrometo de hioscina || Butilbromuro de hioscina','butilbrom']]}]},
{id:'11',clase:'Clase 6',sl:[6,91,101],titulo:'Síndrome anticolinérgica',centro:'Síndrome anticolinérgica',sub:'periférica, central e carga',ramas:[
 {t:'Periferia',hojas:[['Pupila no bloqueio antimuscarínico','Midríase || Midriasis','midria'],['Achado urinário','Retenção urinária','retenc|retenç']]},
 {t:'SNC',hojas:[['Quadro central grave','Delirium || Delírio','delir'],['Grupo vulnerável (confundido com demência)','Idosos','idos|ancian']]},
 {t:'Carga cumulativa',hojas:[['Antidepressivos com ação antimuscarínica','Tricíclicos','triciclic'],['O risco vem da ... das ações','Soma','soma|cumulat']]},
 {t:'Precisão',hojas:[['Antídoto de uso selecionado na intoxicação atropínica','Fisostigmina','fisostigmin'],['Contraindica a fisostigmina: intoxicação por...','Tricíclicos','triciclic']]}]},
{id:'12',clase:'Clase 7',sl:[7,4,18],titulo:'Catecolaminas: síntese e fim do sinal',centro:'Catecolaminas',sub:'da tirosina à resposta',ramas:[
 {t:'Síntese',hojas:[['Enzima limitante da síntese','Tirosina hidroxilase','tirosina hidrox'],['Enzima que forma noradrenalina dentro da vesícula','Dopamina β-hidroxilase || DBH','dbh|hidroxil']]},
 {t:'Adrenalina',hojas:[['Enzima que converte NA em adrenalina','PNMT','pnmt|metiltransf'],['Local dessa conversão','Medula suprarrenal','medula|suprarr']]},
 {t:'Fim do sinal',hojas:[['Principal mecanismo de término (transportador NET)','Recaptação','recapt'],['Enzima mitocondrial que degrada catecolaminas','MAO','mao']]},
 {t:'Fármacos',hojas:[['Bloqueia a recaptação','Cocaína','cocain'],['Esgota as vesículas (bloqueia o armazenamento)','Reserpina','reserpin']]}]},
{id:'13',clase:'Clase 7',sl:[7,13,42],titulo:'Adrenoceptores',centro:'Adrenoceptores',sub:'todos acoplados à proteína G',ramas:[
 {t:'α1 · Gq',hojas:[['Efeito vascular do α1','Vasoconstrição','vasoconstr'],['Efeito do α1 no músculo radial da íris','Midríase || Midriasis','midria']]},
 {t:'α2 · Gi',hojas:[['Papel do α2 pré-sináptico','Feedback negativo || Retroalimentação negativa','feedback|retroal|negativ'],['Agonista α2 central anti-hipertensivo','Clonidina','clonidin']]},
 {t:'β1 · Gs',hojas:[['Efeito cardíaco do β1 (cronotropismo)','Taquicardia || Aumenta a frequência','taquicard|aument'],['Hormônio liberado pelo β1 renal','Renina','renina']]},
 {t:'β2 / β3 · Gs',hojas:[['Efeito do β2 nos brônquios','Broncodilatação','broncodilat'],['Músculo relaxado pelo β3','Detrusor','detrusor']]}]},
{id:'14',clase:'Clase 7',sl:[7,21,24],titulo:'Agonistas α',centro:'Agonistas α',sub:'vasos, nariz e controle central',ramas:[
 {t:'α1 periférico',hojas:[['Agonista α1 midriático e descongestionante','Fenilefrina','fenilefr'],['Agonista α1 oral da hipotensão ortostática','Midodrina','midodrin']]},
 {t:'Mucosa nasal',hojas:[['Descongestionante nasal α1 + α2','Oximetazolina','oximetazol'],['Risco do uso por mais de 3 dias','Congestão de rebote || Rebote','rebote']]},
 {t:'α2 central',hojas:[['Risco da retirada abrupta da clonidina','Hipertensão de rebote || Rebote','rebote|hipertens'],['Outro agonista α2 central (TDAH)','Guanfacina','guanfacin']]},
 {t:'Alfametildopa',hojas:[['Indicação de escolha da alfametildopa','Hipertensão na gravidez || Pré-eclâmpsia','gravid|gestac|eclamp'],['A alfametildopa forma um falso...','Neurotransmissor || Transmissor','transmiss']]}]},
{id:'15',clase:'Clase 7',sl:[7,25,33],titulo:'Adrenalina, noradrenalina, dopamina e dobutamina',centro:'Catecolaminas clínicas',sub:'não são intercambiáveis',ramas:[
 {t:'Adrenalina',hojas:[['Fármaco de escolha no choque anafilático','Adrenalina || Epinefrina','adrenal|epinef'],['Via inicial na anafilaxia','Intramuscular || IM','intramusc|^im']]},
 {t:'Noradrenalina',hojas:[['Indicação principal','Choque séptico || Choque distributivo','septic|distribut'],['Antídoto local do extravasamento','Fentolamina','fentolamin']]},
 {t:'Dopamina',hojas:[['Receptor ativado em dose baixa (rim)','D1','d1'],['Receptor ativado em dose alta','α1 || Alfa 1','α1|alfa'] ]},
 {t:'Dobutamina',hojas:[['Receptor seletivo da dobutamina','β1 || Beta 1','β1|beta'],['Efeito predominante','Inotrópico || Aumenta a força','inotrop|forca']]}]},
{id:'16',clase:'Clase 7',sl:[7,34,65],titulo:'β2, β3 e agentes indiretos',centro:'β2 · β3 · indiretos',sub:'',ramas:[
 {t:'β2',hojas:[['β2 de ação curta para alívio','Salbutamol','salbutam'],['β2 de ação longa que nunca vai em monoterapia na asma','Salmeterol','salmeter']]},
 {t:'β3',hojas:[['Agonista β3 da bexiga hiperativa','Mirabegron','mirabegr'],['Efeito adverso eletrolítico do β2','Hipopotassemia || Hipocalemia','hipopotas|hipocalem']]},
 {t:'Indiretos',hojas:[['Indiretos que aumentam a liberação','Anfetamina e tiramina || Anfetamina','anfetamin|tiramin'],['Indireto que bloqueia o NET','Cocaína','cocain']]},
 {t:'Mistos',hojas:[['Misto usado na hipotensão perioperatória','Efedrina','^efedrin'],['Misto usado como descongestionante','Pseudoefedrina','pseudoefedr']]}]},
{id:'17',clase:'Clase 7',sl:[7,39,51],titulo:'Antagonistas α',centro:'Antagonistas α',sub:'e a reversão da adrenalina',ramas:[
 {t:'Não seletivos',hojas:[['Bloqueador α irreversível do feocromocitoma','Fenoxibenzamina','fenoxibenz'],['Bloqueador α competitivo do extravasamento de NA','Fentolamina','fentolamin']]},
 {t:'α1',hojas:[['Bloqueador α1 seletivo (exemplo)','Prazosina || Terazosina || Doxazosina','prazosin|terazosin|doxazosin'],['Efeito adverso no início do tratamento','Efeito de primeira dose || Hipotensão ortostática','primeira dose|ortostat']]},
 {t:'Uroseletivos',hojas:[['α1A seletivo da hiperplasia prostática','Tansulosina || Tamsulosina','tansulos|tamsulos'],['Síndrome na cirurgia de catarata','Íris flácida || IFIS','flacid|ifis']]},
 {t:'Reversão',hojas:[['Receptor que continua livre e vasodilata','β2 || Beta 2','β2|beta'],['O que acontece com a PA','Cai || Diminui || Queda','cai|diminu|queda|baixa']]}]},
{id:'18',clase:'Clase 7',sl:[7,52,65],titulo:'β-bloqueadores',centro:'β-bloqueadores',sub:'seletividade e diferenças',ramas:[
 {t:'Não seletivos',hojas:[['Protótipo lipofílico (enxaqueca, hipertireoidismo)','Propranolol','propranol'],['Não seletivo tópico do glaucoma','Timolol','timolol']]},
 {t:'β1 seletivos',hojas:[['β1 seletivo de ação ultracurta IV','Esmolol','esmolol'],['β1 seletivo da IC estável (exemplo)','Bisoprolol || Metoprolol','bisoprol|metoprol']]},
 {t:'Vasodilatadores',hojas:[['α1 + β da IC crônica estável','Carvedilol','carvedil'],['β1 que libera óxido nítrico','Nebivolol','nebivol']]},
 {t:'Riscos',hojas:[['Contraindicação dos não seletivos','Asma','asma'],['Risco da retirada abrupta','Rebote','rebote']]}]},
{id:'19',clase:'Clase 8',sl:[8,3,12],titulo:'Ácido araquidônico e eicosanoides',centro:'Ácido araquidônico',sub:'COX e lipoxigenase',ramas:[
 {t:'Origem',hojas:[['Enzima que libera o AA dos fosfolipídios','Fosfolipase A2 || PLA2','fosfolipas|pla2'],['Fármacos que inibem essa enzima (via lipocortina)','Corticoides || Glicocorticoides','corticoid|glicocort|glucocort']]},
 {t:'Via COX',hojas:[['Prostanoide plaquetário pró-agregante','Tromboxano || TXA2','tromboxan|txa2'],['Prostanoide endotelial antiagregante','Prostaciclina || PGI2','prostacicl|pgi2']]},
 {t:'Via lipoxigenase',hojas:[['Produtos da lipoxigenase','Leucotrienos','leucotrien'],['Efeito respiratório dos leucotrienos','Broncoespasmo','broncoesp']]},
 {t:'COX-1 × COX-2',hojas:[['COX expressa na mucosa gástrica e plaquetas','COX-1','cox-1|cox 1|cox1'],['COX induzida no foco inflamatório','COX-2','cox-2|cox 2|cox2']]}]},
{id:'20',clase:'Clase 8',sl:[8,12,16],titulo:'Efeitos dos AINEs',centro:'Efeitos dos AINEs',sub:'os 4 A e seus limites',ramas:[
 {t:'Alvo',hojas:[['Enzima inibida pelos AINEs','Ciclo-oxigenase || COX','ciclo|cox'],['AINE que inibe de forma irreversível (acetila)','AAS || Aspirina','aas|aspirin|acetilsal']]},
 {t:'4 A',hojas:[['Efeito ligado à PGE2 hipotalâmica','Antipirético','antipir'],['Efeito ligado ao TXA2 plaquetário','Antiagregante','antiagreg']]},
 {t:'Limites',hojas:[['Mais dose sem mais analgesia','Efeito teto || Efecto techo','teto|techo'],['Analgésico com fraca ação antiinflamatória','Paracetamol','paracetam']]},
 {t:'Interações',hojas:[['Estabilizador do humor com toxicidade aumentada','Lítio','litio'],['Antineoplásico com toxicidade aumentada','Metotrexato','metotrex']]}]},
{id:'21',clase:'Clase 8',sl:[8,9,32],titulo:'Riscos dos AINEs',centro:'Riscos dos AINEs',sub:'estômago, rim e circulação',ramas:[
 {t:'Gastrointestinal',hojas:[['Lesão gástrica clássica','Úlcera','ulcer'],['Prostaglandinas que protegem a mucosa','PGE2 e PGI2 || PGE2','pge2|pgi2']]},
 {t:'Renal',hojas:[['O que diminui no rim','Filtração glomerular || TFG','filtrac|tfg'],['O que o rim retém','Sódio e água || Sódio','sodio|agua']]},
 {t:'Cardiovascular',hojas:[['Eventos trombóticos de risco','Infarto e AVC || IAM','infart|iam|avc'],['Os AINEs ... efeito dos anti-hipertensivos','Reduzem || Diminuem','reduz|diminu']]},
 {t:'Respiratório',hojas:[['Quadro respiratório de pacientes suscetíveis','Broncoespasmo || Asma por AAS','broncoesp|asma'],['Via para onde o AA é desviado','Lipoxigenase || LOX','lipoxig|lox']]}]},
{id:'22',clase:'Clase 8',sl:[8,17,34],titulo:'Salicilatos',centro:'Salicilatos',sub:'por que AAS é diferente',ramas:[
 {t:'AAS',hojas:[['Duração do efeito antiagregante (vida da plaqueta)','7 a 10 dias || 7-10 dias','7;10'],['Síndrome que contraindica AAS em crianças','Síndrome de Reye || Reye','reye']]},
 {t:'Fase inicial',hojas:[['Efeito no centro respiratório','Estímulo || Hiperventilação','estimul|hiperventil'],['Distúrbio ácido-base inicial','Alcalose respiratória','alcalos']]},
 {t:'Fase tardia',hojas:[['Distúrbio ácido-base tardio','Acidose metabólica','acidos'],['Causa da hipertermia','Desacoplamento oxidativo || Desacoplamento','desacopl']]},
 {t:'Tratamento',hojas:[['Medida que aumenta a excreção renal do salicilato','Alcalinização urinária || Bicarbonato','alcaliniz|bicarbon'],['Sinal auditivo do salicilismo','Zumbido || Tinnitus','zumbid|tinnit']]}]},
{id:'23',clase:'Clase 8',sl:[8,16,29],titulo:'Famílias de AINEs',centro:'Famílias de AINEs',sub:'comparar sem decorar isoladamente',ramas:[
 {t:'Propiônicos / fenamatos',hojas:[['Propiônico de meia-vida longa (~14 h)','Naproxeno','naprox'],['Fenamato da dismenorreia','Ácido mefenâmico','mefenam']]},
 {t:'Acéticos',hojas:[['Acético que fecha o canal arterial','Indometacina','indometac'],['Acético de analgesia potente, máximo 5 dias','Cetorolaco || Ketorolaco','cetorol|ketorol']]},
 {t:'Oxicams',hojas:[['Oxicam com preferência relativa por COX-2','Meloxicam','meloxic'],['Outro oxicam','Piroxicam','piroxic']]},
 {t:'Coxibs',hojas:[['Coxib em uso (exemplo)','Celecoxibe || Celecoxib || Etoricoxibe','celecox|etoricox'],['Coxib retirado do mercado por risco cardiovascular','Rofecoxibe || Rofecoxib','rofecox']]}]},
{id:'24',clase:'Clase 8',sl:[8,30,36],titulo:'Paracetamol e dipirona',centro:'Paracetamol e dipirona',sub:'não cabem na mesma regra',ramas:[
 {t:'Paracetamol',hojas:[['Dose máxima diária','4 g || 4 g/dia','4'],['Toxicidade característica','Hepatotoxicidade || Necrose hepática','hepat']]},
 {t:'NAPQI',hojas:[['Substância que neutraliza o NAPQI','Glutationa || Glutatión','glutation'],['Padrão da necrose hepática','Centrolobular','centrolob']]},
 {t:'NAC',hojas:[['Antídoto da intoxicação por paracetamol','N-acetilcisteína || NAC','acetilcist|nac'],['Janela de maior benefício','Primeiras 8 horas || 8 h','8']]},
 {t:'Dipirona',hojas:[['Risco hematológico grave da dipirona','Agranulocitose','agranulocit'],['Primeira linha na anafilaxia por dipirona','Adrenalina || Epinefrina','adrenal|epinef']]}]},
{id:'25',clase:'Clase 8',sl:[8,38,58],titulo:'Dor e escada analgésica',centro:'Dor e opioides',sub:'vocabulário e modelo da OMS',ramas:[
 {t:'Tipos de dor',hojas:[['Dor com queimação, choque e alodinia','Neuropática','neuropat'],['Dor que responde bem a opioides','Nociceptiva','nocicept']]},
 {t:'Escada OMS',hojas:[['Degrau 1 (dor leve)','AINEs || AINE || Paracetamol','aine|paracet'],['Opioide fraco do degrau 2 (exemplo)','Tramadol || Codeína','tramad|codein']]},
 {t:'Vocabulário',hojas:[['Substância derivada do ópio','Opiáceo','opiac'],['Planta de origem do ópio','Papaver somniferum || Papoula','papaver|papoul']]},
 {t:'Endógenos',hojas:[['Peptídeo de afinidade κ','Dinorfinas || Dinorfina','dinorfin'],['Peptídeo derivado da POMC','β-endorfina || Endorfina','endorfin']]}]},
{id:'26',clase:'Clase 8',sl:[8,57,64],titulo:'Receptores opioides',centro:'Receptores opioides',sub:'μ, κ e δ · Gi/o',ramas:[
 {t:'Membranas',hojas:[['Íon cuja entrada diminui na pré-sinapse','Cálcio || Ca2+','calci|ca2'],['Íon cuja saída aumenta na pós-sinapse','Potássio || K+','potass|k+']]},
 {t:'Receptor μ',hojas:[['Subtipo da analgesia supraespinhal e euforia','μ1 || Mu 1','μ1|mu 1|mu1'],['Subtipo da depressão respiratória','μ2 || Mu 2','μ2|mu 2|mu2']]},
 {t:'Receptor κ',hojas:[['Efeito afetivo do κ','Disforia','disfor'],['Efeito renal do κ (inibe ADH)','Diurese','diures']]},
 {t:'Atividade',hojas:[['Agonista parcial','Buprenorfina','buprenorf'],['Antagonista puro IV da intoxicação','Naloxona','naloxon']]}]},
{id:'27',clase:'Clase 8',sl:[8,65,72],titulo:'Opioides: efeitos e comparação',centro:'Opioides: efeitos',sub:'',ramas:[
 {t:'Riscos',hojas:[['Efeito adverso mais grave','Depressão respiratória','depress'],['Efeito que não sofre tolerância','Constipação','constip']]},
 {t:'Pupila / biliar',hojas:[['Sinal pupilar dos opioides','Miose','miose|miosis'],['Esfíncter contraído (evitar na pancreatite)','Esfíncter de Oddi || Oddi','oddi']]},
 {t:'Comparação',hojas:[['Opioide 80 a 100 vezes mais potente que morfina','Fentanil || Fentanilo','fentan'],['Metabólito da morfina que acumula na insuficiência renal','M6G','m6g']]},
 {t:'Tramadol',hojas:[['Risco do tramadol na epilepsia','Convulsões','convuls'],['Síndrome por interação com ISRS ou IMAO','Síndrome serotoninérgica || Serotoninérgica','serotonin']]}]},
{id:'28',clase:'Clase 9',sl:[9,5,16],titulo:'Córtex suprarrenal',centro:'Córtex suprarrenal',sub:'hormônios e controle',ramas:[
 {t:'Zonas',hojas:[['Zona que produz aldosterona','Glomerulosa','glomerul'],['Zona que produz cortisol','Fasciculada','fascicul']]},
 {t:'Eixo HHA',hojas:[['Hormônio hipofisário que estimula o cortisol','ACTH','acth'],['Horário do pico de cortisol','Manhã || 8 h','manha|8']]},
 {t:'Síndromes',hojas:[['Insuficiência suprarrenal primária','Doença de Addison || Addison','addison'],['Excesso de ação glicocorticoide','Síndrome de Cushing || Cushing','cushing']]},
 {t:'Mineralocorticoide',hojas:[['Íon retido pela aldosterona','Sódio || Na+','sodio|na+'],['Íon excretado pela aldosterona','Potássio || K+','potass|k+']]}]},
{id:'29',clase:'Clase 9',sl:[9,17,29],titulo:'Mecanismo dos corticoides',centro:'Ação dos corticoides',sub:'do receptor intracelular à antiinflamação',ramas:[
 {t:'Receptor',hojas:[['Receptor citoplasmático onde o cortisol se liga (sigla)','GR || Receptor glicocorticoide','gr|glicocort|glucocort'],['Proteínas que mantêm o GR inativo','HSP90 || HSP70 || Proteínas de choque térmico','hsp|choque termic']]},
 {t:'Núcleo',hojas:[['Sequência do DNA onde o complexo se liga','GRE || Elemento de resposta','gre|elemento'],['Nome do mecanismo principal','Genômico','genomic']]},
 {t:'Mediadores',hojas:[['Proteína induzida que inibe a PLA2','Lipocortina || Anexina A1','lipocort|anexin'],['Fator de transcrição inibido','NF-κB || NF-kB','nf']]},
 {t:'Resultado',hojas:[['Efeito sobre edema, migração leucocitária e mediadores','Antiinflamatório || Anti-inflamatório','inflam'],['Efeito sobre a imunidade','Imunossupressão || Imunossupressor','imunossup|inmunosup']]}]},
{id:'30',clase:'Clase 9',sl:[9,23,36],titulo:'Potência, duração e metabolismo',centro:'Perfis dos corticoides',sub:'',ramas:[
 {t:'Duração',hojas:[['Corticoide de ação curta','Hidrocortisona || Cortisol','hidrocort|cortisol'],['Corticoide de ação longa com potência 25','Dexametasona','dexamet']]},
 {t:'Pró-fármacos',hojas:[['A prednisona é convertida em...','Prednisolona','prednisol'],['Órgão que faz a conversão','Fígado','figado']]},
 {t:'Mineral / crianças',hojas:[['Mineralocorticoide de reposição','Fludrocortisona','fludrocort'],['Corticoide de 1ª escolha em crianças','Deflazacorte || Deflazacort','deflazac']]},
 {t:'Formulação',hojas:[['Sal de absorção rápida','Fosfato','fosfat'],['Sal de depósito (absorção lenta)','Acetato','acetat']]}]},
{id:'31',clase:'Clase 9',sl:[9,27,35],titulo:'Efeitos adversos dos corticoides',centro:'Glicocorticoide em excesso',sub:'cada efeito é uma função exagerada',ramas:[
 {t:'Metabolismo',hojas:[['Efeito na glicemia','Hiperglicemia','hiperglic'],['Efeito no músculo proximal','Miopatia','miopat']]},
 {t:'Osso / gordura',hojas:[['Efeito ósseo','Osteoporose','osteopor'],['Distribuição da gordura','Central || Centrípeta','central|centrip']]},
 {t:'Eletrólitos',hojas:[['Distúrbio ácido-base','Alcalose hipocalêmica || Alcalose','alcalos'],['Infecção oral do corticoide inalado','Candidíase || Candidíase orofaríngea','candid']]},
 {t:'Olho',hojas:[['Opacificação do cristalino','Catarata','catarat'],['Aumento da pressão intraocular','Glaucoma','glaucom']]}]},
{id:'32',clase:'Clase 9',sl:[9,36,46],titulo:'Aplicações e retirada',centro:'Uso e retirada',sub:'interpretar sem generalizar',ramas:[
 {t:'Substituição',hojas:[['Corticoide da reposição na insuficiência suprarrenal','Hidrocortisona','hidrocort'],['Uso obstétrico: acelerar a maturação...','Pulmonar fetal || Pulmonar','pulmon']]},
 {t:'Precisão',hojas:[['O corticoide não substitui este fármaco na anafilaxia','Adrenalina || Epinefrina','adrenal|epinef'],['Unidades que diferem por fator de mil','mg e µg || mg e mcg','mg']]},
 {t:'Retirada',hojas:[['Complicação da retirada abrupta após uso prolongado','Insuficiência suprarrenal || Crise adrenal','insufic|crise'],['Duração abaixo da qual o desmame costuma ser dispensado','3 a 4 semanas || 3-4 semanas','3;4']]},
 {t:'Mecanismo da retirada',hojas:[['Zona que atrofia sem ACTH','Fasciculada','fascicul'],['Eixo suprimido','HHA || Hipotálamo-hipófise-suprarrenal','hha|hipotal']]}]},
{id:'34',clase:'Clase 9',sl:[9,44,46],titulo:'Corticoides: perguntas da aula',centro:'Corticoides',sub:'questionário da Clase 9',ramas:[
 {t:'Defina',hojas:[['Natureza química dos corticoides','Hormônios esteroides || Esteroides','esteroid'],['Precursor de todos os corticoides','Colesterol','colester']]},
 {t:'Classifique',hojas:[['Grupo com ação antiinflamatória (ex.: cortisol)','Glicocorticoides || Glucocorticoides','glicocort|glucocort'],['Grupo que regula sódio e potássio (ex.: aldosterona)','Mineralocorticoides','mineralocort']]},
 {t:'Relacione',hojas:[['Efeito imune','Imunossupressão','imunossup|inmunosup'],['Excesso iatrogênico','Cushing iatrogênico || Cushing','cushing']]},
 {t:'Conclua',hojas:[['O uso crônico suprime o eixo...','HHA || Hipotálamo-hipófise-suprarrenal','hha|hipotal'],['Por isso a retirada deve ser...','Gradual','gradual']]}]}
];
