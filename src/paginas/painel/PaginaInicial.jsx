import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { CartaoIndicador } from '../../componentes/interface/CartaoIndicador'
import { Icone } from '../../componentes/interface/Icones'
import { ListaEventos } from '../../componentes/agendamentos/ListaEventos'
import { FormularioAgendamento } from '../../componentes/agendamentos/FormularioAgendamento'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { dataDeHoje, dataPorExtenso } from '../../utilitarios/datas'
import {
  ATIVIDADE_RECENTE,
  FATURAMENTO_SEMANAL,
  OCUPACAO,
  SERVICOS_MAIS_AGENDADOS,
} from '../../dados/dadosPainel'

export function PaginaInicial() {
  const { agendamentos, perfil } = useAplicacao()
  const [modalAberto, definirModalAberto] = useState(false)
  const irPara = useNavigate()

  const percentualOcupado = Math.round((OCUPACAO.ocupados / OCUPACAO.total) * 100)

  const hoje = dataDeHoje()
  const deHoje = agendamentos
    .filter(item => item.data === hoje)
    .sort((a, b) => a.horario.localeCompare(b.horario))

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta={dataPorExtenso()}
        titulo="Visão geral"
        descricao={`Desempenho do ${perfil.nomeDoEspaco} e compromissos do dia.`}
        acao={<button className="btn" onClick={() => definirModalAberto(true)}>+ Novo agendamento</button>}
      />

      <div className="stats">
        <CartaoIndicador rotulo="Faturamento no mês" icone="dinheiro" valor="R$ 4.860" tendencia="↑ 18% comparado a julho" />
        <CartaoIndicador rotulo="Agendamentos" icone="agendamentos" valor={34 + agendamentos.length} tendencia="↑ 6 novos esta semana" />
        <CartaoIndicador rotulo="Sinais recebidos" icone="recebido" valor="R$ 1.458" tendencia="100% repassados" />
        <CartaoIndicador rotulo="Faltas evitadas" icone="escudo" valor="R$ 720" tendencia="6 horários protegidos" />
      </div>

      <div className="grid-2">
        <article className="card">
          <div className="card-title">
            <h2>Faturamento nos últimos 7 dias</h2>
            <button onClick={() => irPara('/painel/financeiro')}>Ver relatório</button>
          </div>
          <div className="chart">
            {FATURAMENTO_SEMANAL.map(coluna => (
              <div className="bar-col" key={coluna.dia}>
                <div className="bar" style={{ height: `${coluna.altura}%` }} />
                <small>{coluna.dia}</small>
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
            {SERVICOS_MAIS_AGENDADOS.map(servico => (
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
              <b>{OCUPACAO.ocupados} de {OCUPACAO.total} horários</b>
              <p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.6 }}>{OCUPACAO.observacao}</p>
              <span className="trend">{OCUPACAO.tendencia}</span>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="card-title"><h2>Atividade recente</h2></div>
          <div className="activity">
            {ATIVIDADE_RECENTE.map(item => (
              <div className="activity-item" key={item.titulo}>
                <i className="activity-dot"><Icone nome={item.icone} className="" /></i>
                <p>
                  <b>{item.titulo}</b>
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
