const CHAVE_PERFUMES = "clicksim_perfumes";
const CHAVE_CONFIG = "clicksim_config";
const PASTA_IMAGENS = "imagens/";

inicializarPainel();

function inicializarPainel() {
  let perfumes = carregarPerfumes();
  let idEmEdicao = null;

  const listaEl = document.getElementById("listaPerfumes");
  const totalEl = document.getElementById("totalProdutos");
  const form = document.getElementById("formPerfume");
  const tituloForm = document.getElementById("tituloForm");
  const btnSalvarProduto = document.getElementById("btnSalvarProduto");
  const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");

  const fNome = document.getElementById("fNome");
  const fMarca = document.getElementById("fMarca");
  const fCategoria = document.getElementById("fCategoria");
  const fGenero = document.getElementById("fGenero");
  const fPreco = document.getElementById("fPreco");
  const fImagem = document.getElementById("fImagem");
  const fImagemPreview = document.getElementById("fImagemPreview");
  const fImagemSemFoto = document.getElementById("fImagemSemFoto");
  const fDescricao = document.getElementById("fDescricao");
  const fMaisVendido = document.getElementById("fMaisVendido");
  const fPromocao = document.getElementById("fPromocao");

  const fWhatsapp = document.getElementById("fWhatsapp");

  function carregarNumeroWhatsapp() {
    try {
      const salvo = localStorage.getItem(CHAVE_CONFIG);
      if (salvo) {
        const config = JSON.parse(salvo);
        if (config && config.numeroWhatsapp) return config.numeroWhatsapp;
      }
    } catch (erro) {
      console.warn("Não foi possível ler a configuração salva:", erro);
    }
    return typeof NUMERO_WHATSAPP !== "undefined" ? NUMERO_WHATSAPP : "";
  }

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
      console.warn("Não foi possível ler o catálogo salvo:", erro);
    }
    return typeof PERFUMES !== "undefined" ? JSON.parse(JSON.stringify(PERFUMES)).map(normalizarImagem) : [];
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE_PERFUMES, JSON.stringify(perfumes));
    } catch (erro) {
      console.warn("Não foi possível salvar no localStorage:", erro);
    }
  }

  function formatarPreco(valor) {
    if (valor === null || valor === undefined || valor === "") return "Consulte o valor";
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function renderizarLista() {
    totalEl.textContent = perfumes.length;

    if (perfumes.length === 0) {
      listaEl.innerHTML = '<p class="sem-resultados">Nenhum produto cadastrado ainda.</p>';
      return;
    }

    listaEl.innerHTML = perfumes
      .map(
        (p, indice) => `
      <div class="item-perfume" draggable="true" data-indice="${indice}">
        <span class="item-arraste">☰</span>
        <div class="item-foto">
          <img src="${p.imagem ? PASTA_IMAGENS + p.imagem : ""}" alt="${p.nome}" onerror="this.parentElement.innerHTML='<span class=\\'sem-foto\\'>Sem foto</span>'">
        </div>
        <div class="item-info">
          <div class="item-marca">${p.marca}</div>
          <div class="item-nome">${p.nome}</div>
          <div class="item-tags">
            <span class="item-tag">${p.categoria}</span>
            <span class="item-tag">${p.genero}</span>
            ${p.maisVendido ? '<span class="item-tag">Mais vendido</span>' : ""}
            ${p.promocao ? '<span class="item-tag">Promoção</span>' : ""}
          </div>
        </div>
        <div class="item-preco">${formatarPreco(p.preco)}</div>
        <div class="item-botoes">
          <button type="button" class="btn-editar" data-indice="${indice}">Editar</button>
          <button type="button" class="btn-excluir" data-indice="${indice}">Excluir</button>
        </div>
      </div>
    `
      )
      .join("");

    listaEl.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", () => iniciarEdicao(Number(btn.dataset.indice)));
    });
    listaEl.querySelectorAll(".btn-excluir").forEach((btn) => {
      btn.addEventListener("click", () => excluirProduto(Number(btn.dataset.indice)));
    });

    ativarArraste();
  }

  function ativarArraste() {
    const itens = listaEl.querySelectorAll(".item-perfume");
    let indiceOrigem = null;

    itens.forEach((item) => {
      item.addEventListener("dragstart", () => {
        indiceOrigem = Number(item.dataset.indice);
        item.classList.add("arrastando");
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("arrastando");
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      item.addEventListener("drop", (e) => {
        e.preventDefault();
        const indiceDestino = Number(item.dataset.indice);
        if (indiceOrigem === null || indiceOrigem === indiceDestino) return;
        const [movido] = perfumes.splice(indiceOrigem, 1);
        perfumes.splice(indiceDestino, 0, movido);
        salvar();
        renderizarLista();
      });
    });
  }

  function limparFormulario() {
    idEmEdicao = null;
    form.reset();
    fCategoria.value = "Perfume";
    fGenero.value = "Feminino";
    atualizarPreviewImagem();
    tituloForm.textContent = "Adicionar novo perfume";
    btnSalvarProduto.textContent = "Adicionar produto";
    btnCancelarEdicao.hidden = true;
  }

  function iniciarEdicao(indice) {
    const p = perfumes[indice];
    idEmEdicao = indice;
    fNome.value = p.nome || "";
    fMarca.value = p.marca || "";
    fCategoria.value = p.categoria || "Perfume";
    fGenero.value = p.genero || "Feminino";
    fPreco.value = p.preco === null || p.preco === undefined ? "" : p.preco;
    fImagem.value = p.imagem || "";
    fDescricao.value = p.descricao || "";
    fMaisVendido.checked = !!p.maisVendido;
    fPromocao.checked = !!p.promocao;
    atualizarPreviewImagem();
    tituloForm.textContent = "Editando: " + p.nome;
    btnSalvarProduto.textContent = "Salvar alterações";
    btnCancelarEdicao.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function excluirProduto(indice) {
    const p = perfumes[indice];
    if (!confirm(`Remover "${p.nome}" do catálogo?`)) return;
    perfumes.splice(indice, 1);
    salvar();
    renderizarLista();
    if (idEmEdicao === indice) limparFormulario();
  }

  function atualizarPreviewImagem() {
    const caminho = fImagem.value.trim();
    if (!caminho) {
      fImagemPreview.hidden = true;
      fImagemSemFoto.hidden = false;
      return;
    }
    fImagemPreview.src = PASTA_IMAGENS + caminho;
    fImagemPreview.hidden = false;
    fImagemSemFoto.hidden = true;
    fImagemPreview.onerror = () => {
      fImagemPreview.hidden = true;
      fImagemSemFoto.hidden = false;
      fImagemSemFoto.textContent = "Não achei essa imagem em EDICAO/imagens/";
    };
  }

  fImagem.addEventListener("input", atualizarPreviewImagem);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const dados = {
      nome: fNome.value.trim(),
      marca: fMarca.value.trim(),
      categoria: fCategoria.value,
      preco: fPreco.value === "" ? null : Number(fPreco.value),
      genero: fGenero.value,
      imagem: fImagem.value.trim(),
      descricao: fDescricao.value.trim(),
    };
    if (fMaisVendido.checked) dados.maisVendido = true;
    if (fPromocao.checked) dados.promocao = true;

    if (idEmEdicao !== null) {
      perfumes[idEmEdicao] = dados;
    } else {
      perfumes.push(dados);
    }

    salvar();
    renderizarLista();
    limparFormulario();
  });

  btnCancelarEdicao.addEventListener("click", limparFormulario);

  function gerarTextoPerfumesJs(lista) {
    const blocos = lista.map((p) => {
      const campos = [
        `    nome: ${JSON.stringify(p.nome)}`,
        `    marca: ${JSON.stringify(p.marca)}`,
        `    categoria: ${JSON.stringify(p.categoria)}`,
        `    preco: ${p.preco === null || p.preco === undefined ? "null" : Number(p.preco)}`,
        `    genero: ${JSON.stringify(p.genero)}`,
      ];
      if (p.maisVendido) campos.push(`    maisVendido: true`);
      if (p.promocao) campos.push(`    promocao: true`);
      campos.push(`    imagem: ${JSON.stringify(p.imagem || "")}`);
      campos.push(`    descricao: ${JSON.stringify(p.descricao || "")}`);
      return "  {\n" + campos.join(",\n") + "\n  }";
    });

    return (
      `// Edite esta lista para adicionar, remover ou alterar produtos.\n` +
      `// "imagem" é só o nome do arquivo dentro da pasta EDICAO/imagens (sem caminho).\n` +
      `// Se "preco" for null, o card mostra "Consulte o valor".\n` +
      `const PERFUMES = [\n${blocos.join(",\n")}\n];\n`
    );
  }

  document.getElementById("btnBaixar").addEventListener("click", () => {
    const texto = gerarTextoPerfumesJs(perfumes);
    const blob = new Blob([texto], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "perfumes.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  document.getElementById("btnRestaurar").addEventListener("click", () => {
    if (!confirm("Isso apaga as alterações salvas neste navegador e volta pro catálogo original do arquivo perfumes.js. Continuar?")) return;
    try {
      localStorage.removeItem(CHAVE_PERFUMES);
    } catch (erro) {
      console.warn("Não foi possível limpar o localStorage:", erro);
    }
    perfumes = typeof PERFUMES !== "undefined" ? JSON.parse(JSON.stringify(PERFUMES)) : [];
    salvar();
    renderizarLista();
    limparFormulario();
  });

  document.getElementById("btnSalvarWhatsapp").addEventListener("click", () => {
    const numero = fWhatsapp.value.replace(/\D/g, "");
    if (!numero) {
      alert("Digite o número de WhatsApp (só números, com DDI+DDD).");
      return;
    }
    fWhatsapp.value = numero;
    try {
      localStorage.setItem(CHAVE_CONFIG, JSON.stringify({ numeroWhatsapp: numero }));
      alert("Número salvo neste navegador. Clique em \"Baixar config.js atualizado\" e substitua o arquivo antes de publicar.");
    } catch (erro) {
      console.warn("Não foi possível salvar a configuração:", erro);
    }
  });

  document.getElementById("btnBaixarConfig").addEventListener("click", () => {
    const numero = fWhatsapp.value.replace(/\D/g, "") || carregarNumeroWhatsapp();
    const texto =
      `// Número de WhatsApp da loja: DDI + DDD + número, só dígitos (ex: 5547988587295).\n` +
      `const NUMERO_WHATSAPP = ${JSON.stringify(numero)};\n`;
    const blob = new Blob([texto], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  fWhatsapp.value = carregarNumeroWhatsapp();

  limparFormulario();
  renderizarLista();
}
