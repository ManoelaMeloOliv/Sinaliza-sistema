import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { IndicadorCompacto } from '../../componentes/interface/CartaoIndicador'
import { CartaoServico } from '../../componentes/servicos/CartaoServico'
import { ModalServico } from '../../componentes/servicos/ModalServico'
import { ConfirmarExclusao } from '../../componentes/interface/ConfirmarExclusao'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { receitaPotencial, servicosMaisAgendados } from '../../utilitarios/metricas'

export function PaginaServicos() {
  const { servicos, agendamentos, definirServicos, configuracoes, mostrarAviso } = useAplicacao()
  const ranking = servicosMaisAgendados(agendamentos)
  const [busca, definirBusca] = useState('')
  const [filtro, definirFiltro] = useState('Todos')
  const [ordenado, definirOrdenado] = useState(false)
  const [modal, definirModal] = useState(null) // null | { servico? }
  const [aExcluir, definirAExcluir] = useState(null)

  const publicados = servicos.filter(servico => servico.publicado)
  const ticketMedio = servicos.length
    ? servicos.reduce((soma, servico) => soma + servico.preco, 0) / servicos.length
    : 0

  const visiveis = servicos
    .filter(servico => servico.nome.toLowerCase().includes(busca.toLowerCase()))
    .filter(servico => {
      if (filtro === 'Publicados') return servico.publicado
      if (filtro === 'Ocultos') return !servico.publicado
      return true
    })
    .sort((a, b) => (ordenado ? a.nome.localeCompare(b.nome) : 0))

  const alterar = (id, alteracao) =>
    definirServicos(atual => atual.map(servico => (servico.id === id ? { ...servico, ...alteracao } : servico)))

  const salvar = dados => {
    if (modal.servico) {
      alterar(modal.servico.id, dados)
      mostrarAviso('Serviço atualizado.')
    } else {
      definirServicos(atual => [...atual, { ...dados, id: crypto.randomUUID(), icone: 'estrela' }])
      mostrarAviso('Serviço adicionado ao catálogo.')
    }
    definirModal(null)
  }

  const duplicar = servico => {
    definirServicos(atual => [...atual, { ...servico, id: crypto.randomUUID(), nome: `${servico.nome} (cópia)` }])
    mostrarAviso('Serviço duplicado.')
  }

  const excluir = () => {
    definirServicos(atual => atual.filter(item => item.id !== aExcluir.id))
    mostrarAviso(`${aExcluir.nome} foi removido do catálogo.`)
    definirAExcluir(null)
  }

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Catálogo"
        titulo="Serviços"
        descricao="Controle preços, duração, sinal e disponibilidade na página pública."
        acao={<button className="btn" onClick={() => definirModal({})}>+ Novo serviço</button>}
      />

      <div className="service-summary">
        <IndicadorCompacto rotulo="Serviços publicados" valor={publicados.length} />
        <IndicadorCompacto rotulo="Ticket médio" valor={formatarMoeda(ticketMedio)} />
        <IndicadorCompacto rotulo="Mais agendado" valor={ranking[0]?.nome ?? '—'} />
        <IndicadorCompacto rotulo="Receita potencial" valor={formatarMoeda(receitaPotencial(servicos, agendamentos))} />
      </div>

      <div className="card toolbar">
        <div className="toolbar-left">
          <input
            className="filter-input"
            value={busca}
            onChange={evento => definirBusca(evento.target.value)}
            placeholder="Buscar serviço..."
          />
          <select className="filter-select" value={filtro} onChange={evento => definirFiltro(evento.target.value)}>
            <option>Todos</option>
            <option>Publicados</option>
            <option>Ocultos</option>
          </select>
        </div>

        <div className="toolbar-right">
          <button
            className="small-btn"
            onClick={() => {
              definirOrdenado(valor => !valor)
              mostrarAviso(ordenado ? 'Ordem original restaurada.' : 'Serviços ordenados por nome.')
            }}
          >
            Ordenar serviços
          </button>
        </div>
      </div>

      <div className="service-grid">
        {visiveis.map((servico, indice) => (
          <CartaoServico
            key={servico.id}
            servico={servico}
            configuracoes={configuracoes}
            posicao={indice + 1}
            aoPublicar={() => alterar(servico.id, { publicado: !servico.publicado })}
            aoEditar={() => definirModal({ servico })}
            aoDuplicar={() => duplicar(servico)}
            aoExcluir={() => definirAExcluir(servico)}
          />
        ))}
        {visiveis.length === 0 && <p className="empty">Nenhum serviço encontrado.</p>}
      </div>

      {modal && (
        <ModalServico
          servico={modal.servico}
          sinalPadrao={configuracoes.sinalPadrao}
          aoSalvar={salvar}
          aoFechar={() => definirModal(null)}
        />
      )}
      {aExcluir && (
        <ConfirmarExclusao
          titulo={`Excluir ${aExcluir.nome}?`}
          descricao="O serviço sai do catálogo e da página pública. Os agendamentos já feitos continuam na agenda."
          rotuloConfirmar="Excluir serviço"
          aoConfirmar={excluir}
          aoCancelar={() => definirAExcluir(null)}
        />
      )}
    </section>
  )
}
