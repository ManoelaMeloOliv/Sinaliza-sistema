// Icones em SVG inline, iguais aos da versao anterior do sistema.
// O tracado e controlado pelo CSS (.nav-icon / .icon-btn svg).

const CAMINHOS = {
  inicio: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10M9 20v-6h6v6" /></>,
  agenda: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  servicos: <><path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="8" /></>,
  clientes: <><circle cx="9" cy="8" r="4" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M16 11a4 4 0 0 1 5.5 3.7M17 21a5 5 0 0 1 4.5-5" /></>,
  financeiro: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M16 14h2" /></>,
  configuracoes: <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
  </>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sino: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
}

export function Icone({ nome, className = 'nav-icon' }) {
  return <svg className={className} viewBox="0 0 24 24">{CAMINHOS[nome]}</svg>
}
