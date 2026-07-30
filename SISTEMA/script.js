const PASTA_IMAGENS = "../EDICAO/imagens/";

const catalogo = document.getElementById("catalogo");
const busca = document.getElementById("busca");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroGenero = document.getElementById("filtroGenero");
document.getElementById("ano").textContent = new Date().getFullYear();
document.getElementById("linkWhatsappTopo").href = `https://wa.me/${NUMERO_WHATSAPP}`;

const modalFundo = document.getElementById("modalFundo");
const modalPerfume = document.getElementById("modalPerfume");
const inputNome = document.getElementById("inputNome");
const inputPagamento = document.getElementById("inputPagamento");
const inputEntrega = document.getElementById("inputEntrega");
const campoEndereco = document.getElementById("campoEndereco");
const campoHorario = document.getElementById("campoHorario");
const inputEndereco = document.getElementById("inputEndereco");
const inputHorario = document.getElementById("inputHorario");
const modalErro = document.getElementById("modalErro");

const CHAVE_PERFUMES = "clicksim_perfumes";

function normalizarImagem(p) {
  if (p.imagem && p.imagem.startsWith("imagens/")) {
    p.imagem = p.imagem.slice("imagens/".length);
  }
  return p;
}

function carregarPerfumes() {
  try {
    const salvos = localStorage.getItem(CHAVE_PERFUMES);
    if (salvos) {
      const lista = JSON.parse(salvos);
      if (Array.isArray(lista) && lista.length > 0) return lista.map(normalizarImagem);
    }
  } catch (erro) {
    console.warn("Não foi possível ler o catálogo salvo no painel:", erro);
  }
  return typeof PERFUMES !== "undefined" ? PERFUMES.map(normalizarImagem) : [];
}

let perfumes = carregarPerfumes();
let perfumeSelecionado = null;

if (perfumes.length === 0) {
  catalogo.innerHTML = '<p class="sem-resultados">Não foi possível carregar o catálogo (perfumes.js).</p>';
} else {
  renderizar(perfumes);
}

function formatarPreco(valor) {
  if (valor === null || valor === undefined) return "Consulte o valor";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function linkWhatsAppBase(p) {
  const mensagem = `Olá! Tenho interesse no produto: ${p.marca} - ${p.nome} (${formatarPreco(p.preco)}). Poderia me ajudar com o pedido?`;
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

function renderizar(lista) {
  if (lista.length === 0) {
    catalogo.innerHTML = '<p class="sem-resultados">Nenhum perfume encontrado.</p>';
    return;
  }

  catalogo.innerHTML = lista
    .map(
      (p) => `
    <article class="card">
      <div class="card-imagem">
        ${p.maisVendido ? '<span class="selo-mais-vendido">Mais vendido</span>' : ""}
        <img src="${PASTA_IMAGENS}${p.imagem}" alt="${p.nome}" onerror="this.parentElement.innerHTML='<span class=\\'sem-foto\\'>Sem foto</span>'">
      </div>
      <div class="card-corpo">
        <span class="card-marca">${p.marca}</span>
        <h2 class="card-nome">${p.nome}</h2>
        <p class="card-descricao">${p.descricao || ""}</p>
        <span class="card-preco">${formatarPreco(p.preco)}</span>
        <a class="btn-comprar" href="${linkWhatsAppBase(p)}" target="_blank" rel="noopener" data-nome="${p.nome}">Comprar</a>
      </div>
    </article>
  `
    )
    .join("");

  document.querySelectorAll(".btn-comprar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModal(btn.dataset.nome);
    });
  });
}

function abrirModal(nomePerfume) {
  perfumeSelecionado = perfumes.find((p) => p.nome === nomePerfume);
  if (!perfumeSelecionado) return;

  modalPerfume.textContent = `${perfumeSelecionado.marca} - ${perfumeSelecionado.nome} (${formatarPreco(perfumeSelecionado.preco)})`;
  inputNome.value = "";
  inputPagamento.value = "Pix";
  inputEntrega.value = "Retirada";
  inputEndereco.value = "";
  inputHorario.value = "";
  modalErro.textContent = "";
  atualizarCamposEntrega();
  modalFundo.classList.add("aberto");
}

function atualizarCamposEntrega() {
  const isEntrega = inputEntrega.value === "Entrega";
  campoEndereco.hidden = !isEntrega;
  campoHorario.hidden = isEntrega;
}

inputEntrega.addEventListener("change", atualizarCamposEntrega);

function fecharModal() {
  modalFundo.classList.remove("aberto");
  perfumeSelecionado = null;
}

document.getElementById("fecharModal").addEventListener("click", fecharModal);
modalFundo.addEventListener("click", (e) => {
  if (e.target === modalFundo) fecharModal();
});

document.getElementById("enviarPedido").addEventListener("click", () => {
  const nome = inputNome.value.trim();
  const pagamento = inputPagamento.value;
  const entrega = inputEntrega.value;
  const endereco = inputEndereco.value.trim();
  const horario = inputHorario.value;

  if (!nome) {
    modalErro.textContent = "Por favor, informe seu nome.";
    return;
  }
  if (entrega === "Entrega" && !endereco) {
    modalErro.textContent = "Por favor, informe o endereço para entrega.";
    return;
  }
  if (entrega === "Retirada" && !horario) {
    modalErro.textContent = "Por favor, escolha um horário para retirada.";
    return;
  }
  if (!perfumeSelecionado) return;

  let mensagem =
    `Olá! Gostaria de fazer um pedido:\n\n` +
    `*Cliente:* ${nome}\n` +
    `*Produto:* ${perfumeSelecionado.marca} - ${perfumeSelecionado.nome}\n` +
    `*Preço:* ${formatarPreco(perfumeSelecionado.preco)}\n` +
    `*Forma de pagamento:* ${pagamento}\n` +
    `*Entrega:* ${entrega === "Entrega" ? "Entrega no endereço" : "Retirar no local"}\n`;

  if (entrega === "Entrega") {
    mensagem += `*Endereço:* ${endereco}`;
  } else {
    mensagem += `*Horário de retirada:* ${horario}`;
  }

  const link = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.location.href = link;
  fecharModal();
});

const infoTester = document.getElementById("infoTester");

function aplicarFiltros() {
  const termo = busca.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;
  const genero = filtroGenero.value;

  infoTester.hidden = categoria !== "Tester";

  const filtrados = perfumes.filter((p) => {
    const combinaTexto =
      p.nome.toLowerCase().includes(termo) || p.marca.toLowerCase().includes(termo);
    const combinaCategoria =
      categoria === "todos" ||
      (categoria === "Promocao" ? p.promocao === true : p.categoria === categoria);
    const combinaGenero = genero === "todos" || p.genero === genero;
    return combinaTexto && combinaCategoria && combinaGenero;
  });

  renderizar(filtrados);
}

busca.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
filtroGenero.addEventListener("change", aplicarFiltros);
