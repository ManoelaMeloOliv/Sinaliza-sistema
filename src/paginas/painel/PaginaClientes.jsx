import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { IndicadorCompacto } from '../../componentes/interface/CartaoIndicador'
import { Etiqueta } from '../../componentes/interface/Etiqueta'
import { ModalCliente } from '../../componentes/clientes/ModalCliente'
import { HistoricoCliente } from '../../componentes/clientes/HistoricoCliente'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { iniciais } from '../../utilitarios/formatadores'
import { baixarCsv } from '../../utilitarios/csv'
import { resumoDeClientes } from '../../utilitarios/metricas'
import { planoInclui, planoPorId, planoQueInclui } from '../../dados/planos'

export function PaginaClientes() {
  const { clientes, agendamentos, configuracoes, definirClientes, mostrarAviso } = useAplicacao()
  const plano = planoPorId(configuracoes.plano)
  const podeBloquear = planoInclui(plano, 'bloquearClientes')
  const resumo = resumoDeClientes(clientes, agendamentos)
  const [busca, definirBusca] = useState('')
  const [situacao, definirSituacao] = useState('')
  const [modalAberto, definirModalAberto] = useState(false)
  const [historico, definirHistorico] = useState(null)

  const visiveis = clientes
    .filter(cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) || cliente.telefone.includes(busca))
    .filter(cliente => !situacao || cliente.situacao === situacao)

  const exportar = () => {
    baixarCsv('clientes.csv', [
      ['Cliente', 'WhatsApp', 'Último serviço', 'Agendamentos', 'Situação'],
      ...visiveis.map(c => [c.nome, c.telefone, c.ultimoServico, c.agendamentos, c.situacao]),
    ])
    mostrarAviso(`${visiveis.length} cliente(s) baixado(s). Abra o arquivo no Excel.`)
  }

  const alternarBloqueio = cliente => {
    if (!podeBloquear) {
      mostrarAviso(`Bloquear clientes faz parte do plano ${planoQueInclui("bloquearClientes").nome}.`)
      return
    }
    const bloqueada = cliente.situacao === 'Bloqueada'
    definirClientes(atual =>
      atual.map(item =>
        item.id === cliente.id ? { ...item, situacao: bloqueada ? 'Ativa' : 'Bloqueada' } : item,
      ),
    )
    mostrarAviso(bloqueada
      ? `${cliente.nome} foi desbloqueada.`
      : `${cliente.nome} não conseguirá mais agendar pela página pública.`)
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
              <option>Bloqueada</option>
            </select>
            <button className="small-btn" onClick={exportar}>Baixar lista</button>
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
                      onClick={() => definirHistorico(cliente)}
                    >
                      Ver histórico
                    </button>
                    <button
                      className={cliente.situacao === 'Bloqueada' ? 'table-action' : 'table-action perigo'}
                      onClick={() => alternarBloqueio(cliente)}
                    >
                      {cliente.situacao === 'Bloqueada' ? 'Desbloquear' : 'Bloquear'}
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
      {historico && <HistoricoCliente cliente={historico} aoFechar={() => definirHistorico(null)} />}
    </section>
  )
}
