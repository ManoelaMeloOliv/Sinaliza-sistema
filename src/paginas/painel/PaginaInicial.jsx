import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { CartaoIndicador } from '../../componentes/interface/CartaoIndicador'
import { Icone } from '../../componentes/interface/Icones'
import { ListaEventos } from '../../componentes/agendamentos/ListaEventos'
import { FormularioAgendamento } from '../../componentes/agendamentos/FormularioAgendamento'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { dataCurta, dataDeHoje, dataPorExtenso } from '../../utilitarios/datas'
import { formatarMoeda } from '../../utilitarios/formatadores'
import {
  atividadeRecente,
  faturamentoDaSemana,
  ocupacaoDaSemana,
  resumoDoMes,
  servicosMaisAgendados,
} from '../../utilitarios/metricas'

const DIAS_CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

export function PaginaInicial() {
  const { agendamentos, servicos, configuracoes, perfil } = useAplicacao()
  const [modalAberto, definirModalAberto] = useState(false)
  const irPara = useNavigate()

  const hoje = dataDeHoje()
  const mes = resumoDoMes(agendamentos, servicos, configuracoes, hoje)
  const grafico = faturamentoDaSemana(agendamentos, servicos, hoje)
  const ocupacao = ocupacaoDaSemana(agendamentos, servicos, hoje)
  const ranking = servicosMaisAgendados(agendamentos)
  const atividade = atividadeRecente(agendamentos, servicos, configuracoes)

  const percentualOcupado = ocupacao.total ? Math.round((ocupacao.ocupados / ocupacao.total) * 100) : 0

  const deHoje = agendamentos
    .filter(item => item.data === hoje)
    .sort((a, b) => a.horario.localeCompare(b.horario))

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta={dataPorExtenso(hoje)}
        titulo="Visão geral"
        descricao={`Desempenho do ${perfil.nomeDoEspaco} e compromissos do dia.`}
        acao={<button className="btn" onClick={() => definirModalAberto(true)}>+ Novo agendamento</button>}
      />

      <div className="stats">
        <CartaoIndicador
          rotulo="Faturamento no mês"
          icone="dinheiro"
          valor={formatarMoeda(mes.faturamento)}
          tendencia={`${mes.agendamentos} atendimento(s) no mês`}
        />
        <CartaoIndicador
          rotulo="Agendamentos"
          icone="agendamentos"
          valor={mes.agendamentos}
          tendencia={mes.aguardando ? `${mes.aguardando} aguardando sinal` : 'Todos confirmados'}
        />
        <CartaoIndicador
          rotulo="Sinais recebidos"
          icone="recebido"
          valor={formatarMoeda(mes.sinais)}
          tendencia="Pagamentos confirmados"
        />
        <CartaoIndicador
          rotulo="Horários protegidos"
          icone="escudo"
          valor={formatarMoeda(mes.protegido)}
          tendencia={`${mes.horariosProtegidos} horário(s) com sinal pago`}
        />
      </div>

      <div className="grid-2">
        <article className="card">
          <div className="card-title">
            <h2>Faturamento nos últimos 7 dias</h2>
            <button onClick={() => irPara('/painel/financeiro')}>Ver relatório</button>
          </div>
          <div className="chart">
            {grafico.map(coluna => (
              <div className="bar-col" key={coluna.data} title={`${dataCurta(coluna.data)}: ${formatarMoeda(coluna.total)}`}>
                <div className="bar" style={{ height: `${coluna.altura}%` }} />
                <small>{DIAS_CURTOS[new Date(coluna.data + 'T00:00').getDay()]}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title">
            <h2>Agenda de hoje</h2>
            <button onClick={() => irPara('/painel/agenda')}>Ver agenda</button>
          </div>
          <ListaEventos agendamentos={deHoje.slice(0, 4)} mensagemVazia="Nenhum horário para hoje." />
        </article>
      </div>

      <div className="dashboard-bottom">
        <article className="card">
          <div className="card-title">
            <h2>Serviços mais agendados</h2>
            <button onClick={() => irPara('/painel/servicos')}>Detalhes</button>
          </div>
          <div className="metric-list">
            {ranking.length === 0 && <p className="empty">Ainda não há agendamentos.</p>}
            {ranking.map(servico => (
              <div className="metric-line" key={servico.nome}>
                <span>{servico.nome}</span>
                <b>{servico.percentual}%</b>
                <i style={{ '--value': `${servico.percentual}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title"><h2>Ocupação da agenda</h2></div>
          <div className="ring-wrap">
            <div
              className="ring"
              style={{ background: `conic-gradient(var(--p) 0 ${percentualOcupado}%, var(--soft) ${percentualOcupado}%)` }}
            />
            <div>
              <b>{ocupacao.ocupados} de {ocupacao.total} encaixes</b>
              <p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.6 }}>
                {ocupacao.livres} ainda disponíveis nesta semana.
              </p>
              <span className="trend">{percentualOcupado}% da semana ocupada</span>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="card-title"><h2>Atividade recente</h2></div>
          <div className="activity">
            {atividade.length === 0 && <p className="empty">Nada por aqui ainda.</p>}
            {atividade.map(item => (
              <div className="activity-item" key={item.id}>
                <i className="activity-dot"><Icone nome={item.icone} className="" /></i>
                <p>
                  <b>{item.titulo}{item.valor > 0 && ` · ${formatarMoeda(item.valor)}`}</b>
                  <small>{item.detalhe}</small>
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      {modalAberto && <FormularioAgendamento aoConcluir={() => definirModalAberto(false)} />}
    </section>
  )
}
