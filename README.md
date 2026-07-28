# Click Sim — estrutura do projeto

Esse projeto é a referência/template pra outras lojas — a ideia é replicar essa estrutura pra
cada novo cliente, trocando só o conteúdo (produtos, imagens, textos), mantendo o mesmo
esqueleto. Segue o padrão de organização usado nos catálogos/cardápios da consultoria:

- **SISTEMA/** — o site em si, o que o cliente final visita. Não precisa mexer aqui no dia a dia.
  - `index.html`, `style.css`, `script.js`
- **EDICAO/** — tudo que muda com frequência: as fotos dos produtos e o painel de cadastro.
  - `imagens/` — fotos usadas no catálogo (o nome do arquivo é o que você digita no painel, sem "imagens/" na frente)
  - `imagens perfume click sim/` — fotos originais recebidas por WhatsApp, ainda não processadas/cadastradas
  - `painel.html`, `painel.css`, `painel.js` — painel pra cadastrar/editar/reordenar os perfumes (sem senha — não linkar publicamente se o site for hospedado)
  - `perfumes.js` — o "banco de dados" dos produtos, gerado/editado pelo painel
- **BOT/** — módulo **opcional** (item à parte pro cliente comprar ou não): painel de
  palavras-chave/respostas prontas pro atendimento no WhatsApp. Totalmente independente —
  não usa nada de `EDICAO/`, só as cores de `SISTEMA/style.css`. Pra vender o catálogo sem o
  bot, é só não entregar/remover essa pasta e o link "Configurar mensagens do bot" em
  `EDICAO/painel.html`.
- **REMARKETING/** — reservado para a planilha de contatos/leads (ver `REMARKETING/README.md`)

## Como abrir

- Catálogo: abra `SISTEMA/index.html`
- Painel de produtos: abra `EDICAO/painel.html`
- Painel do bot (opcional): abra `BOT/bot-clicksim.html`

## Publicando o site

Se for hospedar (Netlify, Hostinger etc.), suba a pasta `CLICK SIM` inteira mantendo essa
estrutura de subpastas — os caminhos entre `SISTEMA` e `EDICAO` são relativos e dependem disso.

**Atenção:** os nomes das pastas são propositalmente sem acento (`EDICAO`, não `EDIÇÃO`) porque
viram parte do endereço (URL) do site quando publicado, e acentos/cedilha em URL podem dar
problema dependendo do servidor. Mantenha assim nas próximas atualizações.
