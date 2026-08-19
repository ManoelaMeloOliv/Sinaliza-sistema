import { Link } from 'react-router-dom'
import { Icone } from '../interface/Icones'
import { useAplicacao } from '../../ganchos/useAplicacao'

export function BarraSuperior({ tema, aoAlternarTema, aoAlternarMenu, menuExpandido }) {
  const { agendamentos, clientes, servicos, mostrarAviso } = useAplicacao()

  // A busca global procura em clientes, servicos e agendamentos e responde num aviso.
  const buscar = evento => {
    if (evento.key !== 'Enter') return
    const termo = evento.target.value.trim().toLowerCase()
    if (!termo) return

    const encontrados = [
      ...clientes.filter(c => c.nome.toLowerCase().includes(termo) || c.telefone.includes(termo)).map(c => c.nome),
      ...servicos.filter(s => s.nome.toLowerCase().includes(termo)).map(s => s.nome),
      ...agendamentos.filter(a => a.cliente.toLowerCase().includes(termo) || a.horario.includes(termo)).map(a => `${a.cliente} às ${a.horario}`),
    ]

    mostrarAviso(
      encontrados.length
        ? `${encontrados.length} resultado(s): ${encontrados.slice(0, 3).join(', ')}`
        : `Nada encontrado para "${evento.target.value.trim()}".`,
    )
    evento.target.value = ''
  }

  return (
    <header className="topbar">
      <div className="top-actions">
        <button
          className="icon-btn mobile-menu"
          onClick={aoAlternarMenu}
          aria-label="Recolher menu"
          aria-expanded={menuExpandido}
        >
          <Icone nome="menu" className="" />
        </button>
        <input
          className="search"
          data-tutorial="busca"
          onKeyDown={buscar}
          placeholder="Buscar cliente, serviço ou horário..."
        />
      </div>

      <div className="top-actions">
        <Link className="btn secondary" data-tutorial="pagina-publica" to="/agendamento" style={{ textDecoration: 'none', padding: '9px 12px' }}>
          Ver página pública
        </Link>
        <button className="icon-btn" onClick={aoAlternarTema} title="Alternar tema" aria-label="Alternar tema">
          <Icone nome={tema === 'dark' ? 'sol' : 'lua'} className="" />
        </button>
        <button
          className="icon-btn"
          onClick={() => mostrarAviso('Você não tem novas notificações.')}
          title="Notificações"
          aria-label="Abrir notificações"
        >
          <Icone nome="sino" className="" />
        </button>
      </div>
    </header>
  )
}
