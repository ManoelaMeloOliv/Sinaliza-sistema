import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { ListaEventos } from '../../componentes/agendamentos/ListaEventos'
import { FormularioAgendamento } from '../../componentes/agendamentos/FormularioAgendamento'
import { VisaoDia } from '../../componentes/agenda/VisaoDia'
import { VisaoSemana } from '../../componentes/agenda/VisaoSemana'
import { VisaoMes } from '../../componentes/agenda/VisaoMes'
import { VisaoLista } from '../../componentes/agenda/VisaoLista'
import { useAplicacao } from '../../ganchos/useAplicacao'
import {
  dataCurta,
  dataDeHoje,
  mesPorExtenso,
  rotuloDaSemana,
  semanaDeTrabalho,
  somarDias,
  somarMeses,
} from '../../utilitarios/datas'

const VISOES = ['Dia', 'Semana', 'Mês', 'Lista']
const LIMITE_INICIAL = 5

export function PaginaAgenda() {
  const { agendamentos, mostrarAviso } = useAplicacao()
  const [visao, definirVisao] = useState('Semana')
  const [situacao, definirSituacao] = useState('')
  const [referencia, definirReferencia] = useState(dataDeHoje())
  const [limite, definirLimite] = useState(LIMITE_INICIAL)
  const [modal, definirModal] = useState(null) // { modo } ou { agendamento }

  const dias = semanaDeTrabalho(referencia)
  const hoje = dataDeHoje()

  // Cancelados viram historico: aparecem so na Lista, com o filtro certo.
  const visiveis = agendamentos.filter(item => item.situacao !== 'Cancelado')
  const porSituacao = (situacao === 'Cancelado' ? agendamentos : visiveis)
    .filter(item => !situacao || item.situacao === situacao)

  // Cada visao mostra um recorte diferente do tempo.
  const doPeriodo = {
    Dia: porSituacao.filter(item => item.data === referencia),
    Semana: porSituacao.filter(item => dias.includes(item.data)),
    Mês: porSituacao.filter(item => item.data.slice(0, 7) === referencia.slice(0, 7)),
    Lista: porSituacao,
  }[visao]

  // Na lateral ficam sempre os proximos horarios, independente do periodo exibido.
  const proximos = porSituacao
    .filter(item => item.data >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario))

  const navegar = passo => {
    if (passo === 0) {
      definirReferencia(hoje)
      mostrarAviso('Voltando para hoje.')
      return
    }
    if (visao === 'Mês') definirReferencia(somarMeses(referencia, passo))
    else if (visao === 'Dia') definirReferencia(somarDias(referencia, passo))
    else definirReferencia(somarDias(referencia, passo * 7))
  }

  const periodo = {
    Dia: dataCurta(referencia),
    Semana: rotuloDaSemana(dias),
    Mês: mesPorExtenso(referencia),
    Lista: `${agendamentos.length} no total`,
  }[visao]

  const abrir = agendamento => definirModal({ agendamento })

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Organização"
        titulo="Agenda"
        descricao="Gerencie horários, pagamentos e confirmações em um só lugar."
        acao={<button className="btn" onClick={() => definirModal({ modo: 'agendamento' })}>+ Novo agendamento</button>}
      />

      <div className="agenda-summary">
        <div className="agenda-kpi">
          <span>Agendamentos na semana</span>
          <b>{agendamentos.filter(item => dias.includes(item.data)).length}</b>
        </div>
        <div className="agenda-kpi">
          <span>Confirmados</span>
          <b>{agendamentos.filter(item => dias.includes(item.data) && item.situacao === 'Pago').length}</b>
        </div>
        <div className="agenda-kpi">
          <span>Aguardando sinal</span>
          <b>{agendamentos.filter(item => dias.includes(item.data) && item.situacao === 'Aguardando').length}</b>
        </div>
        <div className="agenda-kpi">
          <span>Próximos horários</span>
          <b>{proximos.length}</b>
        </div>
      </div>

      <div className="card toolbar">
        <div className="toolbar-left">
          <button className="small-btn" onClick={() => navegar(-1)} aria-label="Período anterior">‹</button>
          <button className="small-btn" onClick={() => navegar(0)}>Hoje</button>
          <button className="small-btn" onClick={() => navegar(1)} aria-label="Próximo período">›</button>
          <b style={{ fontSize: 12 }}>{periodo}</b>
        </div>

        <div className="toolbar-right">
          <select className="filter-select" value={situacao} onChange={evento => definirSituacao(evento.target.value)}>
            <option value="">Todos os status</option>
            <option value="Pago">Confirmados</option>
            <option value="Aguardando">Aguardando sinal</option>
            <option value="Cancelado">Cancelados</option>
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
          {visao === 'Dia' && <VisaoDia dia={referencia} agendamentos={doPeriodo} aoSelecionar={abrir} />}
          {visao === 'Semana' && <VisaoSemana dias={dias} agendamentos={doPeriodo} aoSelecionar={abrir} />}
          {visao === 'Mês' && <VisaoMes mes={referencia} agendamentos={doPeriodo} aoSelecionar={abrir} />}
          {visao === 'Lista' && <VisaoLista agendamentos={doPeriodo} aoSelecionar={abrir} />}
        </article>

        <aside className="card">
          <div className="card-title">
            <h2>Próximos horários</h2>
            <button onClick={() => { definirLimite(99); mostrarAviso('Todos os próximos horários estão visíveis.') }}>
              Ver todos
            </button>
          </div>

          <ListaEventos agendamentos={proximos.slice(0, limite)} mostrarData />

          <button
            className="btn secondary"
            style={{ width: '100%', marginTop: 15 }}
            onClick={() => definirModal({ modo: 'bloqueio' })}
          >
            Bloquear horário
          </button>
        </aside>
      </div>

      {modal && (
        <FormularioAgendamento
          modo={modal.modo}
          agendamento={modal.agendamento}
          dataSugerida={referencia}
          aoConcluir={() => definirModal(null)}
        />
      )}
    </section>
  )
}
