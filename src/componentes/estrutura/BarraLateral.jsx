import { NavLink } from 'react-router-dom'
import { Icone } from '../interface/Icones'
import { Logo } from '../interface/Logo'
import { iniciais } from '../../utilitarios/formatadores'
import { useAplicacao } from '../../ganchos/useAplicacao'

const ATALHOS = [
  { caminho: '', icone: 'inicio', rotulo: 'Visão geral' },
  { caminho: 'agenda', icone: 'agenda', rotulo: 'Agenda' },
  { caminho: 'servicos', icone: 'servicos', rotulo: 'Serviços' },
  { caminho: 'clientes', icone: 'clientes', rotulo: 'Clientes' },
  { caminho: 'financeiro', icone: 'financeiro', rotulo: 'Financeiro' },
  { caminho: 'configuracoes', icone: 'configuracoes', rotulo: 'Configurações' },
]

export function BarraLateral({ aberta, aoNavegar }) {
  const { perfil } = useAplicacao()

  return (
    <aside className={aberta ? 'sidebar open' : 'sidebar'}>
      <Logo />

      <nav className="nav">
        {ATALHOS.map(atalho => (
          <NavLink
            key={atalho.rotulo}
            to={`/painel${atalho.caminho ? `/${atalho.caminho}` : ''}`}
            end={!atalho.caminho}
            onClick={aoNavegar}
          >
            <Icone nome={atalho.icone} />
            <span>{atalho.rotulo}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-bottom">
        <div className="profile">
          <div className="avatar">{iniciais(perfil.profissional)}</div>
          <div>
            <b>{perfil.profissional}</b>
            <small>{perfil.nomeDoEspaco}</small>
          </div>
        </div>
      </div>
    </aside>
  )
}
