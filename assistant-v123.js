(()=>{
"use strict";

const $h = id => document.getElementById(id);

const TOPICOS = [
  {
    id:"despesa",
    palavras:["despesa","gasto","comprei","compra","paguei","lancar despesa","conta a pagar"],
    titulo:"Lançar uma despesa",
    passos:[
      "Abra a aba Financeiro.",
      "Toque em + Despesa / conta.",
      "Informe data, valor, categoria, pessoa/empresa e, se quiser, talhão e safra.",
      "Se já pagou, deixe o status como Pago. Se vai pagar depois, marque Pendente e informe o vencimento.",
      "Toque em Salvar."
    ],
    dica:"Se a compra tiver várias parcelas, marque “Parcelar este lançamento” antes de salvar.",
    acoes:[["Nova despesa","nova_despesa"],["Ir ao Financeiro","financeiro"]]
  },
  {
    id:"receita",
    palavras:["receita","recebi","entrada","dinheiro entrou","lancar receita"],
    titulo:"Lançar uma receita",
    passos:[
      "Abra Financeiro.",
      "Toque em + Receita.",
      "Informe o valor, a origem da receita e a data.",
      "Use Recebido se o dinheiro já entrou ou Pendente se ainda vai receber.",
      "Salve o lançamento."
    ],
    dica:"Venda de café já pode gerar a receita financeira automaticamente; evite lançar a mesma venda duas vezes.",
    acoes:[["Nova receita","nova_receita"],["Ir ao Financeiro","financeiro"]]
  },
  {
    id:"pagamento_parcial",
    palavras:["parcial","pagamento parcial","pagar parte","receber parte","baixa parcial","paguei uma parte"],
    titulo:"Registrar pagamento ou recebimento parcial",
    passos:[
      "Abra Financeiro e localize a conta pendente.",
      "Toque no botão R$ da conta.",
      "Informe quanto foi pago ou recebido agora.",
      "Escolha a conta/caixa usada e confirme a data.",
      "O app mantém o saldo restante em aberto automaticamente."
    ],
    dica:"A conta só fica como totalmente paga quando o saldo chega a zero.",
    acoes:[["Ver contas a pagar","contas"],["Ir ao Financeiro","financeiro"]]
  },
  {
    id:"parcelamento",
    palavras:["parcelar","parcelamento","parcelas","dividir conta","3 vezes","6 vezes"],
    titulo:"Parcelar uma conta",
    passos:[
      "Abra um novo lançamento em Financeiro.",
      "Informe o valor total da compra.",
      "Marque “Parcelar este lançamento”.",
      "Escolha a quantidade de parcelas.",
      "Informe o primeiro vencimento e salve."
    ],
    dica:"O aplicativo divide o valor e cria os vencimentos mensais automaticamente.",
    acoes:[["Nova despesa","nova_despesa"]]
  },
  {
    id:"recorrencia",
    palavras:["recorrente","recorrencia","todo mes","mensal","energia todo mes","repetir conta"],
    titulo:"Cadastrar uma conta recorrente",
    passos:[
      "Abra Perfil.",
      "Entre em Contas recorrentes.",
      "Cadastre descrição, valor, frequência e próxima data.",
      "Escolha se é receita ou despesa e a categoria.",
      "Salve. O app passa a gerar os próximos lançamentos."
    ],
    dica:"Você pode pausar uma recorrência sem apagar os lançamentos que já foram gerados.",
    acoes:[["Abrir recorrências","recorrencias"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"contas",
    palavras:["banco","conta bancaria","pix","dinheiro","caixa","sicoob","saldo da conta"],
    titulo:"Usar contas, bancos e caixas",
    passos:[
      "Abra Perfil.",
      "Entre em Contas / caixas.",
      "Cadastre cada local onde o dinheiro fica, como Dinheiro, Sicoob ou Banco do Brasil.",
      "Nos pagamentos e recebimentos, escolha a conta usada.",
      "O saldo realizado de cada conta é calculado pelas movimentações."
    ],
    dica:"Use contas separadas para conseguir saber onde está o dinheiro, e não apenas o saldo geral.",
    acoes:[["Abrir contas/caixas","contas_financeiras"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"latoes",
    palavras:["latao","latoes","colhedor","apanha","colheita por pessoa","pagar colhedor"],
    titulo:"Registrar latões de um colhedor",
    passos:[
      "Abra a aba Colheita.",
      "Entre na área de Colhedores / Latões.",
      "Toque para registrar uma nova apanha.",
      "Escolha o colhedor, talhão, quantidade de latões e valor por latão.",
      "Salve. O custo da colheita fica vinculado ao Financeiro."
    ],
    dica:"Se o colhedor ainda não recebeu, deixe como A pagar. Depois você pode fazer a baixa.",
    acoes:[["Ir aos colhedores","colhedores"],["Ir à Colheita","producao"]]
  },
  {
    id:"secador",
    palavras:["secador","secagem","lote","mandar para secador","fechar lote","sacas do secador"],
    titulo:"Usar o controle do secador",
    passos:[
      "Primeiro registre os latões dos colhedores.",
      "Na aba Colheita, abra a etapa Secador.",
      "Crie um lote e informe quantos latões serão enviados.",
      "Quando o café terminar de secar e limpar, abra o lote e informe quantas sacas resultaram.",
      "O app converte o lote em produção e atualiza o estoque."
    ],
    dica:"Se o lote misturar mais de um talhão, o app distribui as sacas proporcionalmente pelos latões de cada talhão.",
    acoes:[["Ir ao Secador","secador"],["Ir à Colheita","producao"]]
  },
  {
    id:"venda",
    palavras:["venda","vender cafe","vendi","sacas vendidas","comprador","preco da saca"],
    titulo:"Registrar uma venda de café",
    passos:[
      "Abra a área de Colheita / Produção.",
      "Toque em Registrar venda.",
      "Informe a quantidade de sacas, preço por saca, comprador e safra.",
      "Marque se já recebeu ou se ficou a receber.",
      "Salve. O estoque é reduzido automaticamente."
    ],
    dica:"Mantenha “Gerar receita” ativado para a venda aparecer também no Financeiro.",
    acoes:[["Registrar venda","venda"],["Ir à Colheita","producao"]]
  },
  {
    id:"estoque",
    palavras:["estoque","quantas sacas","sacas disponiveis","saldo de cafe"],
    titulo:"Consultar o estoque de café",
    passos:[
      "Veja o cartão Estoque de café na tela inicial.",
      "A produção fechada no secador aumenta o estoque.",
      "As vendas reduzem o estoque.",
      "O app impede venda maior do que a quantidade disponível na safra."
    ],
    dica:"Trocar a safra ativa não esconde o estoque geral; os filtros de relatório permitem analisar cada safra.",
    acoes:[["Ir ao Início","resumo"],["Ir à Colheita","producao"]]
  },
  {
    id:"relatorio",
    palavras:["relatorio","relatorios","competencia","caixa realizado","csv","resultado"],
    titulo:"Usar os relatórios",
    passos:[
      "Abra a aba Relatórios.",
      "Escolha período, talhão e safra.",
      "Use Competência para analisar pela data do lançamento.",
      "Use Caixa realizado para analisar quando o dinheiro realmente entrou ou saiu.",
      "Se precisar, exporte os dados em CSV."
    ],
    dica:"Para conferir o caixa real, prefira o regime Caixa realizado.",
    acoes:[["Abrir Relatórios","relatorios"]]
  },
  {
    id:"safra",
    palavras:["safra","mudar safra","fechar safra","abrir safra","safra ativa"],
    titulo:"Gerenciar safras",
    passos:[
      "Abra Perfil e entre em Safras.",
      "Cadastre a safra com nome e ano.",
      "Defina a safra que está trabalhando como ativa.",
      "Quando encerrar o período, feche a safra para impedir novos registros acidentais."
    ],
    dica:"Uma safra fechada continua disponível no histórico e nos relatórios.",
    acoes:[["Gerenciar safras","safras"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"talhao",
    palavras:["talhao","talhoes","area","plantas","variedade"],
    titulo:"Cadastrar ou editar um talhão",
    passos:[
      "Abra Perfil.",
      "Entre em Talhões.",
      "Cadastre nome, variedade, área, quantidade de plantas e observações.",
      "Depois use esse talhão nos lançamentos, colheitas e análises de solo."
    ],
    dica:"O vínculo com talhão é o que permite calcular custos e produção por área.",
    acoes:[["Novo talhão","novo_talhao"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"solo",
    palavras:["solo","analise de solo","ph","v%","calcio","magnesio","laboratorio"],
    titulo:"Cadastrar análise de solo",
    passos:[
      "Abra Perfil.",
      "Entre em Análises de solo.",
      "Escolha o talhão, data, profundidade e laboratório.",
      "Digite os valores do laudo nos campos correspondentes.",
      "Salve para manter o histórico do talhão."
    ],
    dica:"O app registra e compara dados; a recomendação de corretivos e adubação deve seguir o método do laboratório e orientação técnica.",
    acoes:[["Abrir análises de solo","solo"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"orcamento_safra",
    palavras:["orcamento","orçamento","planejamento","orcado","orçado","gasto planejado","previsao de gasto"],
    titulo:"Criar o orçamento da safra",
    passos:[
      "Abra Perfil.",
      "Na área Financeiro e negociações, toque em Orçamento da safra.",
      "Escolha a safra e adicione uma categoria de despesa.",
      "Informe quanto pretende gastar naquela categoria.",
      "A tabela mostra Orçado x Gasto x Pago e o saldo restante."
    ],
    dica:"O gasto considera a despesa registrada; o pago considera o que já saiu do caixa.",
    acoes:[["Abrir orçamento","orcamento"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"fechamento_safra",
    palavras:["fechamento","fechar safra","encerrar safra","resultado da safra","gestao da safra"],
    titulo:"Conferir e fechar uma safra",
    passos:[
      "Abra Perfil e toque em Gestão da safra.",
      "Escolha a safra que deseja conferir.",
      "Revise produção, vendas, estoque, receitas, despesas, resultado, custo por saca e pendências.",
      "Veja também o desempenho de cada talhão.",
      "Para fechar, primeiro deixe outra safra como ativa e depois toque em Fechar safra."
    ],
    dica:"O fechamento salva um resumo consolidado e não apaga contas pendentes nem estoque.",
    acoes:[["Abrir gestão da safra","gestao_safra"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"ficha_talhao",
    palavras:["ficha do talhao","ficha talhao","gestao por talhao","custo por talhao","produtividade do talhao","resultado do talhao"],
    titulo:"Ver a ficha completa de um talhão",
    passos:[
      "Abra Perfil e entre em Talhões.",
      "No cartão do talhão, toque em Ver ficha.",
      "Escolha uma safra específica ou Todas as safras.",
      "Veja produção, produtividade, custos, custo por saca, custo por hectare, custo por planta, receitas e resultado.",
      "Na mesma ficha você também encontra custos por categoria e a análise de solo mais recente."
    ],
    dica:"Use a ficha para comparar o desempenho do mesmo talhão entre safras.",
    acoes:[["Ir aos talhões","talhoes"],["Ir ao Perfil","perfil"]]
  },
  {
    id:"busca_global",
    palavras:["buscar","busca geral","procurar","achar lançamento","achar venda"],
    titulo:"Usar a busca geral",
    passos:[
      "Toque na lupa no canto superior do aplicativo.",
      "Digite nome, fornecedor, talhão, venda, lote, produto ou qualquer termo.",
      "O app procura em financeiro, talhões, colhedores, vendas, secador, solo, pessoas e insumos.",
      "Toque no resultado para abrir diretamente o registro."
    ],
    dica:"A busca é a forma mais rápida de encontrar algo antigo.",
    acoes:[["Abrir busca","busca"]]
  },
  {
    id:"estoque_insumos",
    palavras:["insumo","estoque de insumos","adubo estoque","defensivo estoque","entrada de produto","saida de produto"],
    titulo:"Controlar estoque de insumos",
    passos:[
      "Abra Perfil e toque em Estoque de insumos.",
      "Cadastre o produto, unidade e estoque mínimo.",
      "Use Movimentar para registrar compras, entradas ou uso no campo.",
      "Nas saídas, escolha o talhão quando souber onde o produto foi utilizado.",
      "O app mostra saldo, custo médio e valor estimado do estoque."
    ],
    dica:"O sistema impede uma saída maior que o saldo disponível.",
    acoes:[["Abrir insumos","insumos"]]
  },
  {
    id:"lixeira",
    palavras:["lixeira","restaurar","exclui sem querer","recuperar registro","atividade recente"],
    titulo:"Recuperar um registro excluído",
    passos:[
      "Abra Perfil.",
      "Entre em Lixeira e atividade.",
      "Na aba Lixeira, localize o registro.",
      "Toque em Restaurar para devolvê-lo ao aplicativo.",
      "A aba Atividade recente mostra ações importantes registradas."
    ],
    dica:"Apagar definitivamente da lixeira não pode ser desfeito.",
    acoes:[["Abrir lixeira","lixeira"]]
  },
  {
    id:"pdf",
    palavras:["pdf","relatorio pdf","exportar pdf","gerar pdf"],
    titulo:"Gerar relatório em PDF",
    passos:[
      "Abra Relatórios.",
      "Na seção Exportar, toque em Gerar relatório PDF.",
      "Escolha o tipo de relatório e a safra.",
      "Toque em Gerar PDF.",
      "O arquivo é baixado para o aparelho."
    ],
    dica:"Você pode gerar PDF de safra, financeiro, talhões, colhedores, insumos e solo.",
    acoes:[["Abrir Relatórios","relatorios"]]
  },
  {
    id:"backup",
    palavras:["backup","copia","salvar dados","restaurar","importar backup"],
    titulo:"Fazer backup dos dados",
    passos:[
      "Abra Perfil.",
      "Na área Dados e backup, toque em Baixar backup.",
      "Guarde o arquivo JSON em um local seguro.",
      "Para restaurar, use Importar e selecione o arquivo salvo."
    ],
    dica:"O Firebase sincroniza os dados, mas o backup manual é uma segurança adicional.",
    acoes:[["Ir ao Perfil","perfil"]]
  },
  {
    id:"sincronizacao",
    palavras:["sincronizar","sincronizacao","outro celular","dados outro telefone","firebase"],
    titulo:"Sincronização entre aparelhos",
    passos:[
      "Entre com a mesma conta do aplicativo nos aparelhos.",
      "Espere o indicador de sincronização concluir antes de fechar o app.",
      "Os dados ficam vinculados ao usuário logado no Firebase."
    ],
    dica:"Evite fazer alterações importantes ao mesmo tempo em dois aparelhos diferentes.",
    acoes:[["Ir ao Início","resumo"]]
  }
];

function normalizar(s=""){
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^\w\s]/g," ");
}

function abaAtual(){
  return document.querySelector(".navbtn.active")?.dataset?.nav || "resumo";
}

function nomeAba(id){
  return ({resumo:"Início",financeiro:"Financeiro",producao:"Colheita",relatorios:"Relatórios",perfil:"Perfil"})[id] || "Início";
}

function pontuar(topico, pergunta){
  const p=normalizar(pergunta);
  let pontos=0;
  for(const palavra of topico.palavras){
    const w=normalizar(palavra);
    if(p.includes(w)) pontos += Math.max(1,w.split(/\s+/).length*2);
  }
  return pontos;
}

function buscarTopico(pergunta){
  const ranked=TOPICOS.map(t=>({t,p:pontuar(t,pergunta)})).sort((a,b)=>b.p-a.p);
  return ranked[0]?.p>0 ? ranked[0].t : null;
}

function renderTopico(t){
  if(!t) return;
  $h("aiResumoV123").textContent=t.titulo;
  $h("helpRespostaV123").innerHTML=
    `<ol>${t.passos.map(x=>`<li>${x}</li>`).join("")}</ol>`+
    (t.dica?`<div class="tip"><strong>Dica:</strong> ${t.dica}</div>`:"");
  $h("aiAcoesV123").innerHTML=(t.acoes||[]).map(([label,acao],i)=>
    `<button type="button" class="${i?"secondary":""}" onclick="executarAjudaAcaoV123('${acao}')">${label}</button>`
  ).join("");
  $h("aiResultadoV123").classList.remove("hidden");
}

function respostaGenerica(){
  $h("aiResumoV123").textContent="Posso ajudar com estas funções";
  $h("helpRespostaV123").innerHTML=
    `<p>Não identifiquei exatamente sua dúvida. Tente escrever algo como:</p>
     <ol>
       <li>Como lançar uma conta a pagar?</li>
       <li>Como pagar uma conta parcialmente?</li>
       <li>Como registrar latões?</li>
       <li>Como mandar café para o secador?</li>
       <li>Como registrar uma venda?</li>
       <li>Como cadastrar análise de solo?</li>
       <li>Como ver o fluxo de caixa?</li>
     </ol>`;
  $h("aiAcoesV123").innerHTML="";
  $h("aiResultadoV123").classList.remove("hidden");
}

window.abrirAssistenteIA=function(){
  const atual=abaAtual();
  if($h("helpContextoV123")) $h("helpContextoV123").textContent=nomeAba(atual);
  if($h("aiTextoV123")) $h("aiTextoV123").value="";
  if($h("aiResultadoV123")) $h("aiResultadoV123").classList.add("hidden");
  abrirModal("modalAssistenteV123");
};

window.aiAnalisarV123=function(){
  const q=$h("aiTextoV123")?.value.trim()||"";
  if(!q){toast("Digite sua dúvida.");return}
  const t=buscarTopico(q);
  if(t) renderTopico(t); else respostaGenerica();
};

window.perguntarAjudaV123=function(q){
  $h("aiTextoV123").value=q;
  const t=buscarTopico(q);
  if(t) renderTopico(t); else respostaGenerica();
};

window.ajudaTelaAtualV123=function(){
  const atual=abaAtual();
  const mapa={
    resumo:"estoque",
    financeiro:"pagamento_parcial",
    producao:"secador",
    relatorios:"relatorio",
    perfil:"backup"
  };
  renderTopico(TOPICOS.find(t=>t.id===mapa[atual])||TOPICOS[0]);
};

function fecharAjuda(){
  fecharModal("modalAssistenteV123");
}

function irAba(id){
  fecharAjuda();
  const btn=document.querySelector(`[data-nav="${id}"]`);
  trocarAba(id,btn);
}

window.executarAjudaAcaoV123=function(acao){
  switch(acao){
    case "nova_despesa":
      irAba("financeiro"); setTimeout(()=>abrirLancamento("despesa"),80); break;
    case "nova_receita":
      irAba("financeiro"); setTimeout(()=>abrirLancamento("receita"),80); break;
    case "financeiro":
      irAba("financeiro"); break;
    case "contas":
      irAba("financeiro"); setTimeout(()=>document.querySelector(".accounts-panel")?.scrollIntoView({behavior:"smooth",block:"start"}),100); break;
    case "contas_financeiras":
      fecharAjuda(); setTimeout(()=>abrirContasFinanceirasV122(),60); break;
    case "recorrencias":
      fecharAjuda(); setTimeout(()=>abrirRecorrenciasV122(),60); break;
    case "producao":
      irAba("producao"); break;
    case "colhedores":
      irAba("producao"); setTimeout(()=>document.getElementById("sec-colhedores")?.scrollIntoView({behavior:"smooth",block:"start"}),100); break;
    case "secador":
      irAba("producao"); setTimeout(()=>document.getElementById("sec-secador")?.scrollIntoView({behavior:"smooth",block:"start"}),100); break;
    case "venda":
      irAba("producao"); setTimeout(()=>abrirVenda(),80); break;
    case "relatorios":
      irAba("relatorios"); break;
    case "perfil":
      irAba("perfil"); break;
    case "busca":
      fecharAjuda(); setTimeout(()=>abrirBuscaGlobalV126(),50); break;
    case "insumos":
      fecharAjuda(); setTimeout(()=>abrirEstoqueInsumosV126(),50); break;
    case "lixeira":
      fecharAjuda(); setTimeout(()=>abrirLixeiraV126(),50); break;
    case "orcamento":
      fecharAjuda(); setTimeout(()=>abrirOrcamentoV124(),60); break;
    case "gestao_safra":
      fecharAjuda(); setTimeout(()=>abrirGestaoSafraV124(),60); break;
    case "talhoes":
      fecharAjuda(); irAba("perfil"); setTimeout(()=>irParaTalhoes(),100); break;
    case "solo":
      fecharAjuda(); setTimeout(()=>abrirGerenciadorSolo(),60); break;
    case "safras":
      fecharAjuda(); setTimeout(()=>abrirSafras(),60); break;
    case "novo_talhao":
      fecharAjuda(); setTimeout(()=>abrirTalhao(),60); break;
    case "resumo":
      irAba("resumo"); break;
  }
};

document.addEventListener("DOMContentLoaded",()=>{
  const st=$h("aiProfileStatusV123");
  if(st) st.innerHTML=`ON<small>ajuda</small>`;
  const txt=$h("aiTextoV123");
  txt?.addEventListener("keydown",e=>{
    if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();aiAnalisarV123()}
  });
});
})();