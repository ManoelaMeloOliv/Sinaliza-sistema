import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { IndicadorCompacto } from '../../componentes/interface/CartaoIndicador'
import { CartaoServico } from '../../componentes/servicos/CartaoServico'
import { ModalServico } from '../../componentes/servicos/ModalServico'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { SERVICOS_MAIS_AGENDADOS } from '../../dados/dadosPainel'

export function PaginaServicos() {
  const { servicos, definirServicos, configuracoes, mostrarAviso } = useAplicacao()
  const [busca, definirBusca] = useState('')
  const [filtro, definirFiltro] = useState('Todos')
  const [ordenado, definirOrdenado] = useState(false)
  const [modal, definirModal] = useState(null) // null | { servico? }

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

  const excluir = servico => {
    definirServicos(atual => atual.filter(item => item.id !== servico.id))
    mostrarAviso(`${servico.nome} foi removido.`)
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
        <IndicadorCompacto rotulo="Mais agendado" valor={SERVICOS_MAIS_AGENDADOS[0].nome} />
        <IndicadorCompacto rotulo="Receita potencial" valor="R$ 8.420" />
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
            aoExcluir={() => excluir(servico)}
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
    </section>
  )
}
