import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { IndicadorCompacto } from '../../componentes/interface/CartaoIndicador'
import { Etiqueta } from '../../componentes/interface/Etiqueta'
import { ModalCliente } from '../../componentes/clientes/ModalCliente'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { iniciais } from '../../utilitarios/formatadores'
import { baixarCsv } from '../../utilitarios/csv'
import { resumoDeClientes } from '../../utilitarios/metricas'

export function PaginaClientes() {
  const { clientes, agendamentos, definirClientes, mostrarAviso } = useAplicacao()
  const resumo = resumoDeClientes(clientes, agendamentos)
  const [busca, definirBusca] = useState('')
  const [situacao, definirSituacao] = useState('')
  const [modalAberto, definirModalAberto] = useState(false)

  const visiveis = clientes
    .filter(cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) || cliente.telefone.includes(busca))
    .filter(cliente => !situacao || cliente.situacao === situacao)

  const exportar = () => {
    baixarCsv('clientes.csv', [
      ['Cliente', 'WhatsApp', 'Último serviço', 'Agendamentos', 'Situação'],
      ...visiveis.map(c => [c.nome, c.telefone, c.ultimoServico, c.agendamentos, c.situacao]),
    ])
    mostrarAviso(`${visiveis.length} cliente(s) exportado(s) em CSV.`)
  }

  const salvar = dados => {
    definirClientes(atual => [...atual, {
      ...dados,
      id: crypto.randomUUID(),
      ultimoServico: '—',
      agendamentos: 0,
      situacao: 'Ativa',
    }])
    mostrarAviso(`${dados.nome} foi cadastrada.`)
    definirModalAberto(false)
  }

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Relacionamento"
        titulo="Clientes"
        descricao="Consulte histórico, frequência, sinais pagos e restrições."
        acao={<button className="btn" onClick={() => definirModalAberto(true)}>+ Nova cliente</button>}
      />

      <div className="client-summary">
        <IndicadorCompacto rotulo="Total de clientes" valor={resumo.total} />
        <IndicadorCompacto rotulo="Novas neste mês" valor={resumo.novasNoMes} />
        <IndicadorCompacto rotulo="Taxa de retorno" valor={`${resumo.taxaDeRetorno}%`} />
        <IndicadorCompacto rotulo="Situação pendente" valor={resumo.pendentes} />
      </div>

      <article className="card">
        <div className="client-toolbar">
          <input
            className="filter-input"
            value={busca}
            onChange={evento => definirBusca(evento.target.value)}
            placeholder="Buscar por nome ou WhatsApp..."
          />
          <div className="toolbar-right">
            <select className="filter-select" value={situacao} onChange={evento => definirSituacao(evento.target.value)}>
              <option value="">Todas as situações</option>
              <option>Ativa</option>
              <option>Pendente</option>
            </select>
            <button className="small-btn" onClick={exportar}>Exportar</button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>WhatsApp</th>
                <th>Último serviço</th>
                <th>Agendamentos</th>
                <th>Situação</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visiveis.map(cliente => (
                <tr key={cliente.id}>
                  <td>
                    <div className="client">
                      <div className="avatar">{iniciais(cliente.nome)}</div>
                      <div>
                        <b>{cliente.nome}</b>
                        <small style={{ display: 'block', color: 'var(--muted)' }}>Cliente desde mai/2026</small>
                      </div>
                    </div>
                  </td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.ultimoServico}</td>
                  <td>{cliente.agendamentos}</td>
                  <td><Etiqueta situacao={cliente.situacao} /></td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => mostrarAviso(`${cliente.nome}: ${cliente.agendamentos} agendamentos registrados.`)}
                    >
                      Ver histórico
                    </button>
                  </td>
                </tr>
              ))}
              {visiveis.length === 0 && (
                <tr><td colSpan="6" className="empty">Nenhuma cliente encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      {modalAberto && <ModalCliente aoSalvar={salvar} aoFechar={() => definirModalAberto(false)} />}
    </section>
  )
}
