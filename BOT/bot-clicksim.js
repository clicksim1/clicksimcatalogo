const CHAVE_MENSAGENS = "clicksim_bot_mensagens";
const CHAVE_BOT_ATIVO = "clicksim_bot_ativo";

const MENSAGENS_PADRAO = [
  {
    ativa: true,
    tipo: "Saudação",
    titulo: "Boas-vindas",
    palavrasChave: "",
    resposta:
      "Olá! Seja bem-vindo(a) à Click Sim Perfumaria! Meu nome é Jefferson, sou o responsável pelo atendimento por aqui.\nPara agilizar seu atendimento, segue o link do nosso catálogo, onde você pode escolher o perfume ideal e enviar o resumo do seu pedido 😊\n[LINK DO CATÁLOGO QUANDO PUBLICAR]\nTemos perfumes originais, testers com desconto e sabonetes — é só me falar o que você procura! 💛",
  },
  {
    ativa: true,
    tipo: "Ausência",
    titulo: "Fora do horário",
    palavrasChave: "",
    resposta:
      "Oi! No momento estamos fora do nosso horário de atendimento (09h às 18h), mas já anotei sua mensagem e te respondo assim que possível. Se quiser adiantar, me conta o nome do perfume ou o que você está procurando! 🕐",
  },
  {
    ativa: true,
    tipo: "Saudação Fora do Horário",
    titulo: "1º contato do dia, fora do horário",
    palavrasChave: "",
    resposta:
      "Olá! Seja bem-vindo(a) à Click Sim Perfumaria! Meu nome é Jefferson, sou o responsável pelo atendimento por aqui.\nNo momento estamos fora do nosso horário de atendimento (09h às 18h), mas fique à vontade pra já dar uma olhada no catálogo e montar seu pedido — assim que abrirmos, confirmamos tudo certinho pra você! 😊\n[LINK DO CATÁLOGO QUANDO PUBLICAR]",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "Enviar o catálogo",
    palavrasChave: "catálogo, produtos, o que vocês têm, ver perfumes",
    resposta:
      "Aqui está nosso catálogo completo, com fotos, preços e a opção de pedir direto por aqui: [LINK DO CATÁLOGO QUANDO PUBLICAR]",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "O que é Tester",
    palavrasChave: "tester, o que é tester, é original, tem caixa",
    resposta:
      "Tester é perfume 100% original, só que vem sem a caixa e/ou sem a tampa de fábrica — por isso o fornecedor dá um desconto, que a gente repassa pra você. A foto do produto no catálogo é a original, de como ele chega. 😉",
  },
  {
    ativa: true,
    tipo: "Follow-up",
    titulo: "Cliente sumiu depois do catálogo",
    palavrasChave: "",
    resposta:
      "Oi! Conseguiu localizar o perfume do seu interesse? Caso queira algum específico que não está no catálogo, me informe aqui que podemos verificar se temos no estoque e foi esquecido de lançar. 😊",
  },
  {
    ativa: true,
    tipo: "Fallback",
    titulo: "Não entendi / fora do script",
    palavrasChave: "",
    resposta: "Aguarde um momento que vou verificar para você! 🙏",
    notaInterna:
      "Marcar a conversa como NÃO LIDA no WhatsApp. A partir daqui o vendedor assume esse cliente — não usar mais respostas do bot com ele pelo resto do dia.",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "Formas de pagamento",
    palavrasChave: "pagamento, pix, cartão, como pago, forma de pagamento",
    resposta: "Aceitamos Pix, Cartão de Débito, Cartão de Crédito e Dinheiro. 💳💵",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "Prazo e área de entrega",
    palavrasChave: "entrega, prazo, quanto tempo demora, chega quando, frete",
    resposta: "Entregamos em todo o Brasil! O prazo varia entre 1 e 10 dias, dependendo da sua região. 📦",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "Retirada sem horário informado",
    palavrasChave: "vou retirar, retirada, passo aí, passo pra pegar, vou buscar",
    resposta:
      "Para retirar seu pedido é obrigatório informar o horário, já que trabalhamos com atendimento personalizado. Pode me confirmar que horas você pretende passar aqui? 🕐",
  },
  {
    ativa: false,
    tipo: "Resposta Rápida",
    titulo: "Promoções ativas",
    palavrasChave: "promoção, desconto, tem promoção",
    resposta:
      "No momento não temos promoção ativa, mas fica de olho no catálogo — assim que tiver eu te aviso!",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "Confirmação de pedido recebido",
    palavrasChave: "fiz o pedido, confirma meu pedido",
    resposta:
      "Perfeito, [NOME DO CLIENTE]! Seu pedido já foi recebido, aguarde um momento que receberá a confirmação 👍\nÓtima escolha! 😍 Esse perfume tem uma fragrância incrível, vamos confirmar sua compra em alguns minutos.",
    notaInterna: "Depois de mandar, marcar a conversa como NÃO LIDA no WhatsApp pra o vendedor ver e confirmar a compra.",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "Perguntar disponibilidade",
    palavrasChave: "tem esse perfume, disponível, ainda tem",
    resposta: "Deixa eu confirmar a disponibilidade desse perfume pra você, só um instante! 🔎",
  },
  {
    ativa: true,
    tipo: "Resposta Rápida",
    titulo: "Agradecimento pós-venda",
    palavrasChave: "obrigado, valeu, chegou certinho",
    resposta:
      "Muito obrigado pela compra! 💛 Qualquer coisa é só chamar por aqui. Se puder, adoraríamos sua avaliação — ajuda muito a gente!",
  },
];

let mensagens = carregarMensagens();
let indiceEmEdicao = null;

const listaEl = document.getElementById("listaMensagens");
const totalEl = document.getElementById("totalMensagens");
const form = document.getElementById("formMensagem");
const tituloForm = document.getElementById("tituloForm");
const btnSalvarMensagem = document.getElementById("btnSalvarMensagem");
const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");

const fTipo = document.getElementById("fTipo");
const fTitulo = document.getElementById("fTitulo");
const fPalavrasChave = document.getElementById("fPalavrasChave");
const fResposta = document.getElementById("fResposta");
const fNotaInterna = document.getElementById("fNotaInterna");
const fAtiva = document.getElementById("fAtiva");
const campoPalavrasChave = document.getElementById("campoPalavrasChave");

const btnBotToggle = document.getElementById("btnBotToggle");
const botStatusTexto = document.getElementById("botStatusTexto");

function lerStorage(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (erro) {
    console.warn("localStorage indisponível:", erro);
    return null;
  }
}

function gravarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (erro) {
    console.warn("localStorage indisponível:", erro);
  }
}

function carregarMensagens() {
  try {
    const salvas = localStorage.getItem(CHAVE_MENSAGENS);
    if (salvas) {
      const lista = JSON.parse(salvas);
      if (Array.isArray(lista) && lista.length > 0) return lista;
    }
  } catch (erro) {
    console.warn("Não foi possível ler as mensagens salvas:", erro);
  }
  return JSON.parse(JSON.stringify(MENSAGENS_PADRAO));
}

function salvar() {
  gravarStorage(CHAVE_MENSAGENS, JSON.stringify(mensagens));
}

function atualizarCampoPalavrasChave() {
  campoPalavrasChave.hidden = fTipo.value !== "Resposta Rápida";
}

fTipo.addEventListener("change", atualizarCampoPalavrasChave);

function renderizarBotStatus() {
  const ativo = lerStorage(CHAVE_BOT_ATIVO) !== "nao";
  btnBotToggle.classList.toggle("ligado", ativo);
  btnBotToggle.setAttribute("aria-pressed", String(ativo));
  botStatusTexto.textContent = ativo ? "Bot ativado" : "Bot desligado";
}

btnBotToggle.addEventListener("click", () => {
  const ativoAtual = lerStorage(CHAVE_BOT_ATIVO) !== "nao";
  gravarStorage(CHAVE_BOT_ATIVO, ativoAtual ? "nao" : "sim");
  renderizarBotStatus();
});

function renderizarLista() {
  totalEl.textContent = mensagens.length;

  if (mensagens.length === 0) {
    listaEl.innerHTML = '<p class="sem-resultados">Nenhuma mensagem cadastrada ainda.</p>';
    return;
  }

  listaEl.innerHTML = mensagens
    .map(
      (m, indice) => `
    <div class="item-mensagem ${m.ativa ? "" : "item-mensagem-inativa"}">
      <div class="item-mensagem-topo">
        <span class="item-tag">${m.tipo}</span>
        <span class="item-tag">${m.ativa ? "Ativa" : "Desativada"}</span>
      </div>
      <div class="item-mensagem-titulo">${m.titulo}</div>
      ${m.palavrasChave ? `<p class="item-mensagem-palavras">Palavras-chave: ${m.palavrasChave}</p>` : ""}
      <p class="item-mensagem-texto">${m.resposta.replace(/\n/g, "<br>")}</p>
      ${m.notaInterna ? `<p class="item-mensagem-nota">📌 Nota interna: ${m.notaInterna}</p>` : ""}
      <div class="item-botoes">
        <button type="button" class="btn-copiar" data-indice="${indice}">Copiar resposta</button>
        <button type="button" class="btn-ativar" data-indice="${indice}">${m.ativa ? "Desativar" : "Ativar"}</button>
        <button type="button" class="btn-editar" data-indice="${indice}">Editar</button>
        <button type="button" class="btn-excluir" data-indice="${indice}">Excluir</button>
      </div>
    </div>
  `
    )
    .join("");

  listaEl.querySelectorAll(".btn-copiar").forEach((btn) => {
    btn.addEventListener("click", () => copiarTexto(Number(btn.dataset.indice)));
  });
  listaEl.querySelectorAll(".btn-ativar").forEach((btn) => {
    btn.addEventListener("click", () => alternarAtiva(Number(btn.dataset.indice)));
  });
  listaEl.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => iniciarEdicao(Number(btn.dataset.indice)));
  });
  listaEl.querySelectorAll(".btn-excluir").forEach((btn) => {
    btn.addEventListener("click", () => excluirMensagem(Number(btn.dataset.indice)));
  });
}

function copiarTexto(indice) {
  const texto = mensagens[indice].resposta;
  navigator.clipboard.writeText(texto).catch(() => {
    prompt("Copie o texto abaixo:", texto);
  });
}

function alternarAtiva(indice) {
  mensagens[indice].ativa = !mensagens[indice].ativa;
  salvar();
  renderizarLista();
}

function limparFormulario() {
  indiceEmEdicao = null;
  form.reset();
  fTipo.value = "Resposta Rápida";
  fAtiva.checked = true;
  atualizarCampoPalavrasChave();
  tituloForm.textContent = "Adicionar nova mensagem";
  btnSalvarMensagem.textContent = "Adicionar mensagem";
  btnCancelarEdicao.hidden = true;
}

function iniciarEdicao(indice) {
  const m = mensagens[indice];
  indiceEmEdicao = indice;
  fTipo.value = m.tipo;
  fTitulo.value = m.titulo;
  fPalavrasChave.value = m.palavrasChave || "";
  fResposta.value = m.resposta;
  fNotaInterna.value = m.notaInterna || "";
  fAtiva.checked = m.ativa !== false;
  atualizarCampoPalavrasChave();
  tituloForm.textContent = "Editando: " + m.titulo;
  btnSalvarMensagem.textContent = "Salvar alterações";
  btnCancelarEdicao.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirMensagem(indice) {
  const m = mensagens[indice];
  if (!confirm(`Remover a mensagem "${m.titulo}"?`)) return;
  mensagens.splice(indice, 1);
  salvar();
  renderizarLista();
  if (indiceEmEdicao === indice) limparFormulario();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dados = {
    ativa: fAtiva.checked,
    tipo: fTipo.value,
    titulo: fTitulo.value.trim(),
    palavrasChave: fTipo.value === "Resposta Rápida" ? fPalavrasChave.value.trim() : "",
    resposta: fResposta.value.trim(),
    notaInterna: fNotaInterna.value.trim(),
  };

  if (indiceEmEdicao !== null) {
    mensagens[indiceEmEdicao] = dados;
  } else {
    mensagens.push(dados);
  }

  salvar();
  renderizarLista();
  limparFormulario();
});

btnCancelarEdicao.addEventListener("click", limparFormulario);

document.getElementById("btnBaixar").addEventListener("click", () => {
  const texto = mensagens
    .map(
      (m) =>
        `[${m.tipo}]${m.ativa ? "" : " (DESATIVADA)"} ${m.titulo}\n` +
        (m.palavrasChave ? `Palavras-chave: ${m.palavrasChave}\n` : "") +
        m.resposta +
        (m.notaInterna ? `\n\n📌 Nota interna (não enviar): ${m.notaInterna}` : "") +
        "\n"
    )
    .join("\n---\n\n");
  const blob = new Blob([texto], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bot-clicksim-mensagens.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

document.getElementById("btnRestaurar").addEventListener("click", () => {
  if (!confirm("Isso apaga suas edições e volta pras mensagens padrão. Continuar?")) return;
  mensagens = JSON.parse(JSON.stringify(MENSAGENS_PADRAO));
  salvar();
  renderizarLista();
  limparFormulario();
});

renderizarBotStatus();
limparFormulario();
renderizarLista();
