import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { Etiqueta } from '../../componentes/interface/Etiqueta'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { baixarCsv } from '../../utilitarios/csv'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { dataCurta, dataDeHoje, mesPorExtenso, somarMeses } from '../../utilitarios/datas'
import {
  composicaoDosRecebimentos,
  faturamentoDaSemana,
  movimentacoes,
  quantoRecuperou,
  resumoFinanceiro,
} from '../../utilitarios/metricas'
import { planoInclui, planoPorId, planoQueInclui } from '../../dados/planos'

const LINHAS_INICIAIS = 6

export function PaginaFinanceiro() {
  const { agendamentos, servicos, configuracoes, mostrarAviso } = useAplicacao()
  const hoje = dataDeHoje()

  const [mes, definirMes] = useState(hoje)
  const [extratoCompleto, definirExtratoCompleto] = useState(false)

  // O periodo escolhido filtra tudo o que a tela mostra.
  const doMes = agendamentos.filter(item => item.data.slice(0, 7) === mes.slice(0, 7))

  const resumo = resumoFinanceiro(doMes, servicos, configuracoes, hoje)
  const composicao = composicaoDosRecebimentos(doMes, servicos, configuracoes)
  const semana = faturamentoDaSemana(agendamentos, servicos, hoje)
  const lancamentos = movimentacoes(doMes, servicos, configuracoes, hoje)

  // "Quanto voce recuperou" e um recurso do plano Studio.
  const plano = planoPorId(configuracoes.plano)
  const temRelatorio = planoInclui(plano, 'relatorioMensal')
  const recuperado = quantoRecuperou(agendamentos, servicos, configuracoes, mes.slice(0, 7))

  const linhas = extratoCompleto ? lancamentos : lancamentos.slice(0, LINHAS_INICIAIS)
  const totalDaComposicao = composicao.reduce((soma, item) => soma + item.valor, 0)

  const exportar = () => {
    baixarCsv(`financeiro-${mes.slice(0, 7)}.csv`, [
      ['Data', 'Horário', 'Descrição', 'Valor do sinal', 'Situação'],
      ...lancamentos.map(m => [dataCurta(m.data), m.horario, m.descricao, m.valor, m.situacao]),
    ])
    mostrarAviso(`${lancamentos.length} lançamento(s) baixado(s). Abra o arquivo no Excel.`)
  }

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Pagamentos e repasses"
        titulo="Financeiro"
        descricao="Conciliação dos sinais recebidos e valores enviados à sua conta."
        acao={
          <div className="toolbar-right">
            <select className="filter-select" value={mes} onChange={evento => definirMes(evento.target.value)}>
              {[0, -1, -2].map(passo => {
                const opcao = somarMeses(hoje, passo)
                return <option key={opcao} value={opcao}>{mesPorExtenso(opcao)}</option>
              })}
            </select>
            <button className="btn secondary" onClick={exportar}>Baixar relatório</button>
          </div>
        }
      />

      <div className="finance-grid">
        <article className="card">
          <small>Recebido em sinais</small>
          <div className="amount">{formatarMoeda(resumo.recebido)}</div>
          <span className="trend">{resumo.pagamentos} pagamento(s) confirmado(s)</span>
          <div className="progress">
            <i style={{ width: `${resumo.recebido ? 100 : 0}%` }} />
          </div>
        </article>

        <article className="card">
          <small>Já repassado</small>
          <div className="amount">{formatarMoeda(resumo.repassado)}</div>
          <span className="trend">Atendimentos já realizados</span>
          <div className="progress">
            <i style={{
              width: `${resumo.recebido ? Math.round((resumo.repassado / resumo.recebido) * 100) : 0}%`,
              background: '#12b981',
            }} />
          </div>
        </article>

        <article className="card">
          <small>A repassar</small>
          <div className="amount">{formatarMoeda(resumo.aReceber)}</div>
          <span style={{ color: 'var(--muted)' }}>Sinais de horários futuros</span>
          <div className="progress">
            <i style={{
              width: `${resumo.recebido ? Math.round((resumo.aReceber / resumo.recebido) * 100) : 0}%`,
              background: '#ff6b5c',
            }} />
          </div>
        </article>
      </div>

      <article className={temRelatorio ? 'card recuperado' : 'card recuperado bloqueado'}>
        <div className="card-title">
          <h2>Quanto você recuperou</h2>
          <span className="tag">{temRelatorio ? mesPorExtenso(mes) : planoQueInclui('relatorioMensal').nome}</span>
        </div>

        {temRelatorio ? (
          <>
            <p className="section-help">
              Dinheiro que ia embora e voltou: horários preenchidos pela lista de espera e sinais
              retidos de quem cancelou fora do prazo.
            </p>

            <div className="recuperado-total">
              <strong>{formatarMoeda(recuperado.total)}</strong>
              <div>
                <span>{recuperado.horariosRecuperados} horário(s) preenchido(s) pela lista de espera</span>
                <span>{recuperado.cancelamentosComSinalRetido} sinal(is) retido(s) de cancelamento</span>
              </div>
            </div>

            {recuperado.detalhes.length > 0 && (
              <div className="finance-breakdown" style={{ marginTop: 16 }}>
                {recuperado.detalhes.map(item => (
                  <div className="finance-item" key={item.id}>
                    <span>{item.cliente} · {item.servico} · {dataCurta(item.data)}</span>
                    <b>{formatarMoeda(item.valor)}</b>
                  </div>
                ))}
              </div>
            )}

            {recuperado.total === 0 && (
              <p className="empty">
                Nada recuperado neste mês ainda. Quando alguém da lista de espera ocupar um horário,
                o valor aparece aqui.
              </p>
            )}
          </>
        ) : (
          <p className="section-help">
            Veja em reais quanto a lista de espera e os sinais retidos trouxeram de volta.
            Disponível no plano {planoQueInclui('relatorioMensal').nome}.
          </p>
        )}
      </article>

      <div className="finance-layout">
        <article className="card">
          <div className="card-title">
            <h2>Entradas dos últimos 7 dias</h2>
            <span className="tag">{formatarMoeda(semana.reduce((soma, dia) => soma + dia.total, 0))}</span>
          </div>
          <div className="finance-chart">
            {semana.map(dia => (
              <div className="finance-bar" key={dia.data} title={`${dataCurta(dia.data)}: ${formatarMoeda(dia.total)}`}>
                <i style={{ '--h': `${dia.altura}%` }} />
                {dataCurta(dia.data).slice(0, 6)}
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title"><h2>Composição dos recebimentos</h2></div>
          <div className="finance-breakdown">
            {composicao.length === 0 && <p className="empty">Nenhum sinal recebido neste período.</p>}
            {composicao.map(item => (
              <div className="finance-item" key={item.nome}>
                <span>
                  {item.nome}
                  {totalDaComposicao > 0 && ` · ${Math.round((item.valor / totalDaComposicao) * 100)}%`}
                </span>
                <b>{formatarMoeda(item.valor)}</b>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="card table-wrap">
        <div className="card-title">
          <h2>Movimentações do período</h2>
          {lancamentos.length > LINHAS_INICIAIS && !extratoCompleto && (
            <button onClick={() => definirExtratoCompleto(true)}>
              Ver extrato completo ({lancamentos.length})
            </button>
          )}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor do sinal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {linhas.length === 0 && (
              <tr><td colSpan="4" className="empty">Nenhuma movimentação neste período.</td></tr>
            )}
            {linhas.map(item => (
              <tr key={item.id}>
                <td>{dataCurta(item.data)} · {item.horario}</td>
                <td>{item.descricao}</td>
                <td>{formatarMoeda(item.valor)}</td>
                <td><Etiqueta situacao={item.situacao} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  )
}
