// Icones em SVG inline, todos no mesmo tracado: sem preenchimento, linha de
// 1.8 e pontas arredondadas. A cor vem do elemento que os contem (currentColor),
// entao eles acompanham o tema claro/escuro sem ajuste extra.

const CAMINHOS = {
  // Menu lateral
  inicio: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10M9 20v-6h6v6" /></>,
  agenda: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  espera: <><path d="M7 3h10M7 21h10" /><path d="M8 3v3.5a4 4 0 0 0 1.6 3.2L12 12l2.4-2.3A4 4 0 0 0 16 6.5V3" /><path d="M8 21v-3.5a4 4 0 0 1 1.6-3.2L12 12l2.4 2.3a4 4 0 0 1 1.6 3.2V21" /></>,
  servicos: <><path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="8" /></>,
  clientes: <><circle cx="9" cy="8" r="4" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M16 11a4 4 0 0 1 5.5 3.7M17 21a5 5 0 0 1 4.5-5" /></>,
  financeiro: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M16 14h2" /></>,
  configuracoes: <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
  </>,

  // Barra superior
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sino: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" /></>,
  lua: <path d="M20.5 14.8A8.6 8.6 0 0 1 9.2 3.5a8.6 8.6 0 1 0 11.3 11.3Z" />,

  // Indicadores da visao geral
  dinheiro: <><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><circle cx="12" cy="12" r="2.6" /><path d="M6 12h.6M17.4 12h.6" /></>,
  agendamentos: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /><path d="M9 15.2l2 2 4-4" /></>,
  recebido: <><circle cx="12" cy="12" r="8.6" /><path d="M8.3 12.4l2.6 2.6 4.8-5.2" /></>,
  escudo: <><path d="M12 3.2l7.2 3v5.1c0 4.5-3 8-7.2 9.9-4.2-1.9-7.2-5.4-7.2-9.9V6.2z" /><path d="M9.2 12.2l2 2 3.8-4" /></>,

  // Atividade recente
  check: <path d="M5 12.5 9.2 17 19 7" />,
  repasse: <path d="M7.5 16.5 16.5 7.5M9.5 7.5h7v7" />,
  mais: <path d="M12 5.5v13M5.5 12h13" />,

  // Pagina publica
  pix: <><path d="M12 2.9 21.1 12 12 21.1 2.9 12z" /><path d="M8.6 8.6 12 12l3.4-3.4" /></>,
  estrela: <path d="M12 3.6l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z" />,
  recarregar: <><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20.2 3.8v4.4h-4.4" /></>,
  brilho: <><path d="M10 3.8l1.5 4.2 4.2 1.5-4.2 1.5L10 15.2 8.5 11 4.3 9.5 8.5 8z" /><path d="M17.5 14.6l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" /></>,
  xis: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
}

// Os servicos guardavam simbolos de texto antes deste conjunto existir. Quem ja
// tinha servicos salvos continua funcionando sem precisar migrar os dados.
const LEGADO = { '✦': 'estrela', '↻': 'recarregar', '✧': 'brilho', '×': 'xis' }

export function Icone({ nome, className = 'nav-icon' }) {
  // Nome desconhecido cai na estrela: um icone trocado incomoda menos que um buraco.
  const caminho = CAMINHOS[nome] ?? CAMINHOS[LEGADO[nome]] ?? CAMINHOS.estrela
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true">{caminho}</svg>
}
