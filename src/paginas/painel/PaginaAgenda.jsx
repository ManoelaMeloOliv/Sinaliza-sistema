import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { ListaEventos } from '../../componentes/agendamentos/ListaEventos'
import { FormularioAgendamento } from '../../componentes/agendamentos/FormularioAgendamento'
import { VisaoDia } from '../../componentes/agenda/VisaoDia'
import { VisaoSemana } from '../../componentes/agenda/VisaoSemana'
import { VisaoMes } from '../../componentes/agenda/VisaoMes'
import { VisaoLista } from '../../componentes/agenda/VisaoLista'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { RESUMO_DA_AGENDA, ROTULO_DA_SEMANA } from '../../dados/dadosPainel'

const VISOES = ['Dia', 'Semana', 'Mês', 'Lista']
const LIMITE_INICIAL = 5

export function PaginaAgenda() {
  const { agendamentos, mostrarAviso } = useAplicacao()
  const [visao, definirVisao] = useState('Semana')
  const [situacao, definirSituacao] = useState('')
  const [semana, definirSemana] = useState(0)
  const [limite, definirLimite] = useState(LIMITE_INICIAL)
  const [modal, definirModal] = useState(null) // 'agendamento' | 'bloqueio' | null

  const visiveis = agendamentos.filter(item => !situacao || item.situacao === situacao)

  const mudarSemana = passo => {
    const proxima = passo === 0 ? 0 : semana + passo
    definirSemana(proxima)
    mostrarAviso(
      proxima === 0
        ? 'Mostrando a semana atual.'
        : `Semana ${proxima > 0 ? '+' : ''}${proxima} em relação à atual.`,
    )
  }

  const verDetalhes = agendamento =>
    mostrarAviso(`${agendamento.cliente} · ${agendamento.servico} às ${agendamento.horario} (${agendamento.situacao}).`)

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Organização"
        titulo="Agenda"
        descricao="Gerencie horários, pagamentos e confirmações em um só lugar."
        acao={<button className="btn" onClick={() => definirModal('agendamento')}>+ Novo agendamento</button>}
      />

      <div className="agenda-summary">
        {RESUMO_DA_AGENDA.map(item => (
          <div className="agenda-kpi" key={item.rotulo}>
            <span>{item.rotulo}</span>
            <b>{item.valor}</b>
          </div>
        ))}
      </div>

      <div className="card toolbar">
        <div className="toolbar-left">
          <button className="small-btn" onClick={() => mudarSemana(-1)} aria-label="Semana anterior">‹</button>
          <button className="small-btn" onClick={() => mudarSemana(0)}>Hoje</button>
          <button className="small-btn" onClick={() => mudarSemana(1)} aria-label="Próxima semana">›</button>
          <b style={{ fontSize: 12 }}>{ROTULO_DA_SEMANA}</b>
        </div>

        <div className="toolbar-right">
          <select className="filter-select" value={situacao} onChange={evento => definirSituacao(evento.target.value)}>
            <option value="">Todos os status</option>
            <option value="Pago">Confirmados</option>
            <option value="Aguardando">Aguardando sinal</option>
          </select>

          <div className="segmented">
            {VISOES.map(nome => (
              <button
                key={nome}
                className={visao === nome ? 'active' : ''}
                onClick={() => definirVisao(nome)}
              >
                {nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-layout">
        <article className="card table-wrap">
          {visao === 'Dia' && <VisaoDia agendamentos={visiveis} />}
          {visao === 'Semana' && <VisaoSemana agendamentos={visiveis} />}
          {visao === 'Mês' && <VisaoMes agendamentos={visiveis} aoAbrirAgendamento={verDetalhes} />}
          {visao === 'Lista' && <VisaoLista agendamentos={visiveis} aoVerDetalhes={verDetalhes} />}
        </article>

        <aside className="card">
          <div className="card-title">
            <h2>Próximos horários</h2>
            <button onClick={() => { definirLimite(99); mostrarAviso('Todos os próximos horários estão visíveis.') }}>
              Ver todos
            </button>
          </div>

          <ListaEventos agendamentos={visiveis.slice(0, limite)} />

          <button
            className="btn secondary"
            style={{ width: '100%', marginTop: 15 }}
            onClick={() => definirModal('bloqueio')}
          >
            Bloquear horário
          </button>
        </aside>
      </div>

      {modal && <FormularioAgendamento modo={modal} aoConcluir={() => definirModal(null)} />}
    </section>
  )
}
