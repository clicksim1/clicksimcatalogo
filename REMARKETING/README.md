# Remarketing — captação de leads

## Arquivos desta pasta

- **`LEADS.xlsx`** — planilha mestra de leads/contatos (colunas `DATA, NOME, TELEFONE, PRODUTO
  DA ULTIMA COMPRA`). Hoje tem 3.218 linhas importadas de uma base de clientes de outro negócio
  do usuário (sushi, mesma cidade), reaproveitada como leads pra oferta de perfume — marcadas
  com "Lead externo (cliente sushi...)" na coluna de produto pra não confundir com compra real
  na Click Sim.
- **`reativacao.html`** — painel interativo pra mandar mensagem de reativação via WhatsApp pra
  essa base (segmenta por tempo sem comprar, presente/cupom configurável, marca quem já
  recebeu, backup). Não depende de nada de `EDICAO/`. Adaptado de um painel equivalente já
  validado em outro projeto do usuário.
- **`reativacao-dados.js`** — os mesmos ~3.218 contatos, no formato que `reativacao.html`
  precisa (`const DATA = [...]`, ver comentário no topo do arquivo pra entender os campos).

**Atenção:** `LEADS.xlsx` e `reativacao-dados.js` guardam a mesma informação em formatos
diferentes (planilha de referência × dado pronto pro painel). Se atualizar a lista de leads,
atualizar os dois.

## Pendência: captura automática de novos pedidos

Ainda não implementado. Hoje, quando o cliente clica em "Enviar pedido pelo WhatsApp" no
catálogo, os dados (nome, produto, pagamento, entrega) só vão pra mensagem do WhatsApp — nada
fica salvo automaticamente pra alimentar essa planilha com os pedidos que vierem daqui pra
frente pelo próprio site.

### Como vamos resolver (mesmo padrão do projeto Cardápio Delivery)

1. Transformar `LEADS.xlsx` num Google Sheets nativo (Apps Script só roda em Sheets, não em
   `.xlsx`), com as mesmas colunas.
2. Publicar um Google Apps Script (Web App, `doPost`) ligado a essa planilha.
3. No `SISTEMA/script.js`, além de abrir o link do WhatsApp, mandar um `fetch(...)` com os
   dados do pedido pro Web App do Apps Script, salvando a linha na planilha automaticamente.

### Propriedade dos dados

Assim como no projeto Cardápio Delivery: a planilha e o Apps Script ficam na conta Google da
consultoria (não na do cliente final), que recebe só acesso de leitura/edição pra acompanhar.

## Pendências

- Aguardando decisão: montar a integração automática (Google Sheets + Apps Script) agora ou depois.
- Preencher o link real do catálogo em `reativacao.html` (campo "Link do catálogo" no painel,
  hoje com `[LINK DO CATÁLOGO QUANDO PUBLICAR]`).
