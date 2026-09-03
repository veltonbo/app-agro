const DEFAULT_FIREBASE_API_KEY = "AIzaSyD773S1h91tovlKTPbaeAZbN2o1yxROcOc";
const DEFAULT_ALLOWED_ORIGIN = "https://veltonbo.github.io";

function cors(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  const allowOrigin = allowed === "*" ? "*" : (origin === allowed ? origin : allowed);
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function json(data, status, request, env) { return new Response(JSON.stringify(data), {status, headers:{"Content-Type":"application/json; charset=utf-8",...cors(request,env)}}); }
function base64Bytes(base64) { const bin=atob(base64); const out=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) out[i]=bin.charCodeAt(i); return out; }
async function verifyFirebase(request, env) {
  const auth=request.headers.get("Authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!token) throw new Error("AUTH_MISSING");
  const apiKey=env.FIREBASE_API_KEY||DEFAULT_FIREBASE_API_KEY;
  const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:token})});
  if(!r.ok) throw new Error("AUTH_INVALID");
  const data=await r.json();
  if(!data.users?.[0]?.localId) throw new Error("AUTH_INVALID");
  return {uid:data.users[0].localId,email:data.users[0].email||""};
}
async function transcribeAudio(media, env) {
  const bytes=base64Bytes(media.data||"");
  const blob=new Blob([bytes],{type:media.mime||"audio/webm"});
  const fd=new FormData();
  fd.append("file",blob,media.name||"audio.webm");
  fd.append("model",env.OPENAI_TRANSCRIBE_MODEL||"gpt-transcribe");
  fd.append("prompt","Português brasileiro. Contexto: gestão rural, café Conilon, talhões, latões, colhedores, secador, sacas, adubos, defensivos, fornecedores e pagamentos.");
  const r=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{"Authorization":`Bearer ${env.OPENAI_API_KEY}`},body:fd});
  const data=await r.json();
  if(!r.ok) throw new Error(data?.error?.message||"Falha na transcrição do áudio.");
  return data.text||"";
}
const schema={type:"object",additionalProperties:false,properties:{summary:{type:"string"},confidence:{type:"number"},needs_clarification:{type:"boolean"},question:{type:["string","null"]},actions:{type:"array",items:{type:"object",additionalProperties:false,properties:{type:{type:"string",enum:["criar_lancamento","registrar_latoes","enviar_secador","fechar_secador","registrar_venda","registrar_pagamento","registrar_analise_solo","consulta"]},note:{type:["string","null"]},data:{type:"object",additionalProperties:true}},required:["type","note","data"]}}},required:["summary","confidence","needs_clarification","question","actions"]};
function instructions(context){return `Você é o Assistente do Sítio, especializado em transformar mensagens, fotos de notas/recibos/laudos e transcrições de áudio em ações estruturadas para um aplicativo de gestão de café Conilon no Brasil.

REGRAS IMPORTANTES:
1. Responda em português brasileiro.
2. Nunca invente valor, quantidade, pessoa, talhão, conta, safra, data, preço, categoria ou identificação.
3. Use IDs SOMENTE quando conseguir associar de forma inequívoca aos cadastros fornecidos.
4. Quando faltar uma informação essencial ou houver ambiguidade, needs_clarification=true, faça UMA pergunta curta e não crie a ação incompleta.
5. Data de hoje: ${context.hoje}. Quando o usuário disser “hoje” ou não informar data para um fato claramente atual, use ${context.hoje}.
6. Para despesa já paga, criar_lancamento com tipo=despesa e status=pago. Para compra a prazo, status=pendente e vencimento quando disponível.
7. Se o usuário disser que pagou/recebeu uma conta que já está em contas_em_aberto e a correspondência for inequívoca, use registrar_pagamento com lancamento_id. Não crie uma duplicata.
8. Para latões colhidos por pessoa, use registrar_latoes. Use valor_latao do cadastro se o usuário não informar outro e houver colhedor inequívoco.
9. Para café indo ao secador, use enviar_secador. Para resultado final do secador, use fechar_secador.
10. Para venda de café em sacas, use registrar_venda. O app validará estoque antes de salvar.
11. Para foto de laudo de solo, use registrar_analise_solo somente se os números estiverem legíveis. Não dê recomendação agronômica inventada; apenas transcreva a recomendação se ela estiver no laudo.
12. Para perguntas sem pedido de lançamento, use consulta com data.resposta e actions pode conter somente essa consulta.
13. confidence deve representar sua confiança real entre 0 e 1. Para lançamento automático, somente valores muito claros devem chegar perto de 1.
14. Se houver dois “João”, dois talhões parecidos ou duas contas possíveis, pergunte em vez de escolher.

CONTEXTO ATUAL DO APLICATIVO:\n${JSON.stringify(context)}`;}
async function callOpenAI(text, media, context, transcript, env) {
  const content=[{type:"input_text",text:[text||"", transcript?`Transcrição do áudio: ${transcript}`:""].filter(Boolean).join("\n\n")||"Analise o arquivo enviado e prepare as ações corretas."}];
  if(media?.kind==="image"&&media.data){content.push({type:"input_image",image_url:`data:${media.mime||"image/jpeg"};base64,${media.data}`,detail:"high"});}
  const body={model:env.OPENAI_MODEL||"gpt-5.6-sol",instructions:instructions(context),input:[{role:"user",content}],store:false,max_output_tokens:2200,text:{format:{type:"json_schema",name:"FinanceiroSitioActions",strict:false,schema}}};
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await r.json();
  if(!r.ok) throw new Error(data?.error?.message||"Falha ao consultar a OpenAI.");
  const out=(data.output||[]).flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text||"";
  if(!out) throw new Error("A IA não retornou uma resposta estruturada.");
  try{return JSON.parse(out)}catch{throw new Error("A IA retornou uma resposta que não pôde ser interpretada.")}
}
export default {
  async fetch(request, env) {
    if(request.method==="OPTIONS") return new Response(null,{status:204,headers:cors(request,env)});
    const url=new URL(request.url);
    if(url.pathname==="/health"&&request.method==="GET") return json({ok:true,service:"financeiro-sitio-ai",model:env.OPENAI_MODEL||"gpt-5.6-sol",transcribe_model:env.OPENAI_TRANSCRIBE_MODEL||"gpt-transcribe"},200,request,env);
    if(url.pathname!=="/analyze"||request.method!=="POST") return json({error:"Rota não encontrada."},404,request,env);
    if(!env.OPENAI_API_KEY) return json({error:"OPENAI_API_KEY não configurada no servidor."},500,request,env);
    try{await verifyFirebase(request,env);}catch(e){return json({error:e.message==="AUTH_MISSING"?"Login do Firebase não enviado.":"Login do Firebase inválido ou expirado."},401,request,env)}
    try{
      const body=await request.json();
      const context=body.context||{};
      const media=body.media||null;
      let transcript="";
      if(media?.kind==="audio") transcript=await transcribeAudio(media,env);
      const result=await callOpenAI(body.text||"",media,context,transcript,env);
      return json({...result,transcript:transcript||null},200,request,env);
    }catch(e){console.error(e);return json({error:e?.message||"Erro interno do Assistente IA."},500,request,env)}
  }
};
