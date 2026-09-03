
(()=>{
"use strict";
const el=id=>document.getElementById(id);

function precoCafe1210(){
  try{
    const regional=Number(typeof cotacaoRegional==="function"?cotacaoRegional():0);
    if(Number.isFinite(regional)&&regional>0)return regional;
  }catch(e){}
  try{
    const c=estado?.cotacaoCafe||{};
    const p=Number(c.precoPainel||0)-Number(c.descontoRegional||0);
    if(Number.isFinite(p)&&p>0)return p;
  }catch(e){}
  return 0;
}

window.atualizarValorEstoqueV129=function(){
  const valorEl=el("v129EstoqueValor"),precoEl=el("v129EstoquePreco");
  if(!valorEl||!precoEl)return;
  let sacas=0;
  try{sacas=Number(estoqueTotalGeral?.()||0)}catch(e){sacas=0}
  const preco=precoCafe1210();

  if(preco>0){
    valorEl.textContent=`Valor de mercado: ${moeda(sacas*preco)}`;
    let atualizado="";
    try{
      const iso=estado?.cotacaoCafe?.atualizadoEm;
      if(iso)atualizado=` • ${new Date(iso).toLocaleDateString("pt-BR")}`;
    }catch(e){}
    precoEl.textContent=`${moeda(preco)} / saca • ${num(sacas)} sc${atualizado}`;
  }else{
    valorEl.textContent="Valor de mercado: cotação indisponível";
    precoEl.textContent=`${num(sacas)} sc disponíveis`;
  }
};

window.acaoAdicionarV1210=function(tipo){
  fecharAdicionarV129?.();
  if(tipo==="solo"){
    if(typeof abrirAnaliseSolo==="function")abrirAnaliseSolo();
    else toast("Análise de solo indisponível.");
    return;
  }
  if(tipo==="talhao"){
    if(typeof abrirTalhao==="function")abrirTalhao();
    else toast("Cadastro de talhão indisponível.");
  }
};

if(typeof window.abrirModal==="function"){
  const base=window.abrirModal;
  window.abrirModal=function(id){
    try{fecharAdicionarV129?.()}catch(e){}
    return base(id);
  };
}

if(typeof window.renderTudo==="function"){
  const base=window.renderTudo;
  window.renderTudo=function(){
    base();
    setTimeout(()=>window.atualizarValorEstoqueV129?.(),0);
  };
}

window.baixarBackup=function(){
  const payload={versao:"12.10",exportadoEm:new Date().toISOString(),estado};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`backup-financeiro-sitio-v12-10-${hoje()}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
};

document.addEventListener("keydown",e=>{
  const tag=document.activeElement?.tagName||"";
  if(e.key==="+"&&!["INPUT","TEXTAREA","SELECT"].includes(tag)){
    e.preventDefault();
    alternarAdicionarV129?.();
  }
});

document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>window.atualizarValorEstoqueV129?.(),500));
})();
