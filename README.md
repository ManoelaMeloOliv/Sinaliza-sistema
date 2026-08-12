# Sinaliza

Aplicacao React com duas experiencias: o painel administrativo e a pagina publica de agendamento.

## Executar

```bash
npm install
npm run dev
```

- Painel: `http://localhost:5173/painel`
- Pagina publica: `http://localhost:5173/agendamento`

## Estrutura

```
public/                    logotipo, icones e manifest (servidos na raiz do site)
src/
  principal.jsx            ponto de entrada
  Aplicacao.jsx            rotas
  estilos/                 CSS dividido por area
  dados/                   dados de demonstracao
  contexto/                estado compartilhado
  ganchos/                 hooks reutilizaveis
  utilitarios/             formatadores e funcoes puras
  componentes/
    estrutura/             barra lateral, barra superior, moldura do painel
    interface/             botoes, campos, cartoes, modal, etiquetas, avisos
    agenda/                visoes de dia, semana, mes e lista
    agendamentos/          formulario e lista de horarios
    servicos/              cartao e modal de servico
    clientes/              modal de cadastro
    configuracoes/         paineis das abas
    marca/                 editor de identidade e previa ao vivo
    paginaPublica/         etapas da pagina publica
  paginas/
    painel/                uma pagina por secao do painel
    agendamento/           pagina publica
```

### Estilos

O CSS e dividido por area e montado em `estilos/principal.css`, nesta ordem:

| Arquivo | Conteudo |
| --- | --- |
| `base.css` | tokens da marca, tema claro/escuro, reset e tipografia |
| `componentes.css` | botoes, cartoes, formularios, tabelas, modais, avisos |
| `painel.css` | telas do painel administrativo |
| `agendamento.css` | pagina publica |
| `responsivo.css` | ajustes por largura de tela |

Tudo em `agendamento.css` e escopado em `.pagina-publica`. Isso e necessario porque o painel e a
pagina publica definem os mesmos tokens (`--bg`, `--muted`) com valores diferentes e repetem classes
como `.btn`, `.card` e `.avatar` com estilos distintos. Sem o escopo, uma tela quebraria a outra.

## Convencoes

Todo o codigo usa nomes em portugues: componentes (`PaginaInicial`, `CabecalhoPagina`), campos de
dados (`nome`, `preco`, `situacao`) e funcoes (`formatarMoeda`, `calcularSinal`).

A unica excecao sao os hooks, que precisam do prefixo `use` exigido pelo React: `useAplicacao`,
`useArmazenamentoLocal`, `useTema`.

## Logotipo e icones

| Arquivo | Onde e usado |
| --- | --- |
| `logo.png` | topo da pagina publica (fundo claro) |
| `logo-branca.png` | menu lateral do painel (fundo escuro) |
| `favicon-32.png` | aba do navegador |
| `apple-touch-icon.png` | atalho no iOS |
| `icon-512.png`, `icon-maskable-512.png` | instalacao como aplicativo (`manifest.webmanifest`) |

A palavra "sinaliza" e escrita como texto ao lado do simbolo, nao faz parte da imagem. E assim que o
menu recolhido consegue esconder o nome e manter apenas o simbolo.

## Dados

Os dados de demonstracao persistem no `localStorage`:

| Chave | Conteudo |
| --- | --- |
| `sinaliza-servicos` | catalogo de servicos |
| `sinaliza-agendamentos` | horarios da agenda |
| `sinaliza-clientes` | base de clientes |
| `sinaliza-marca` | identidade visual da pagina publica |
| `sinaliza-perfil` | dados do negocio |
| `sinaliza-configuracoes` | regras de agenda, pagamento e avisos |
| `sinaliza-tema` | tema claro ou escuro |

O que e editavel pelo usuario fica em `dados/dadosIniciais.js`. Os numeros fixos da demonstracao
(graficos, movimentacoes, atividade recente) ficam em `dados/dadosPainel.js`.

## Historico

`sistema.html` e `agendamento.html`, na raiz, sao a versao anterior em HTML puro. Todo o conteudo
deles foi portado para `src/`; ficam apenas como referencia.
