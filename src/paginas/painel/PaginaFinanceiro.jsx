import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { Etiqueta } from '../../componentes/interface/Etiqueta'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { baixarCsv } from '../../utilitarios/csv'
import {
  COMPOSICAO_DOS_RECEBIMENTOS,
  ENTRADAS_POR_SEMANA,
  INDICADORES_DO_FINANCEIRO,
  MOVIMENTACOES,
} from '../../dados/dadosPainel'

export function PaginaFinanceiro() {
  const { mostrarAviso } = useAplicacao()
  const [periodo, definirPeriodo] = useState('Agosto de 2026')
  const [extratoCompleto, definirExtratoCompleto] = useState(false)

  const linhas = extratoCompleto ? MOVIMENTACOES : MOVIMENTACOES.slice(0, 4)

  const exportar = () => {
    baixarCsv('financeiro.csv', [
      ['Data', 'Descrição', 'Identificador', 'Valor', 'Situação'],
      ...MOVIMENTACOES.map(m => [m.data, m.descricao, m.identificador, m.valor, m.situacao]),
    ])
    mostrarAviso('Relatório exportado em CSV.')
  }

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Pagamentos e repasses"
        titulo="Financeiro"
        descricao="Conciliação dos sinais recebidos e valores enviados à sua conta."
        acao={
          <div className="toolbar-right">
            <select className="filter-select" value={periodo} onChange={evento => definirPeriodo(evento.target.value)}>
              <option>Agosto de 2026</option>
              <option>Julho de 2026</option>
            </select>
            <button className="btn secondary" onClick={exportar}>Exportar relatório</button>
          </div>
        }
      />

      <div className="finance-grid">
        {INDICADORES_DO_FINANCEIRO.map(indicador => (
          <article className="card" key={indicador.rotulo}>
            <small>{indicador.rotulo}</small>
            <div className="amount">{indicador.valor}</div>
            <span className="trend">{indicador.detalhe}</span>
            <div className="progress">
              <i style={{ width: `${indicador.largura}%`, background: indicador.cor || undefined }} />
            </div>
          </article>
        ))}
      </div>

      <div className="finance-layout">
        <article className="card">
          <div className="card-title">
            <h2>Entradas por semana</h2>
            <span className="tag">+18,4%</span>
          </div>
          <div className="finance-chart">
            {ENTRADAS_POR_SEMANA.map(semana => (
              <div className="finance-bar" key={semana.rotulo}>
                <i style={{ '--h': `${semana.altura}%` }} />
                {semana.rotulo}
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title"><h2>Composição dos recebimentos</h2></div>
          <div className="finance-breakdown">
            {COMPOSICAO_DOS_RECEBIMENTOS.map(item => (
              <div className="finance-item" key={item.nome}>
                <span>{item.nome}</span>
                <b>{item.valor}</b>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="card table-wrap">
        <div className="card-title">
          <h2>Movimentações recentes</h2>
          <button onClick={() => { definirExtratoCompleto(true); mostrarAviso('Exibindo o extrato completo do período.') }}>
            Ver extrato completo
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Identificador</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(movimentacao => (
              <tr key={movimentacao.identificador}>
                <td>{movimentacao.data}</td>
                <td>{movimentacao.descricao}</td>
                <td>{movimentacao.identificador}</td>
                <td>{movimentacao.valor}</td>
                <td><Etiqueta situacao={movimentacao.situacao} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  )
}
