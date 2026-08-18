import { useEffect } from 'react'
import { Etiqueta } from '../interface/Etiqueta'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { dataCurta, dataDeHoje } from '../../utilitarios/datas'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { precoDoServico } from '../../utilitarios/valores'
import { sinalDoAgendamento } from '../../utilitarios/metricas'
import { abrirWhatsapp, MODELOS } from '../../utilitarios/whatsapp'

export function HistoricoCliente({ cliente, aoFechar }) {
  const { agendamentos, servicos, configuracoes, marca } = useAplicacao()
  const hoje = dataDeHoje()

  useEffect(() => {
    const aoTeclar = evento => evento.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aoFechar])

  const dela = agendamentos
    .filter(item => item.cliente === cliente.nome)
    .sort((a, b) => b.data.localeCompare(a.data) || b.horario.localeCompare(a.horario))

  const realizados = dela.filter(item => item.data < hoje)
  const futuros = dela.filter(item => item.data >= hoje)

  const totalGasto = realizados.reduce(
    (soma, item) => soma + (item.preco ?? precoDoServico(servicos, item.servico)), 0,
  )
  const totalEmSinais = dela
    .filter(item => item.situacao === 'Pago')
    .reduce((soma, item) => soma + sinalDoAgendamento(item, servicos, configuracoes), 0)

  // Qual servico ela mais pede.
  const contagem = new Map()
  dela.forEach(item => contagem.set(item.servico, (contagem.get(item.servico) ?? 0) + 1))
  const preferido = [...contagem.entries()].sort((a, b) => b[1] - a[1])[0]

  const conversar = () => {
    const proximo = futuros[futuros.length - 1]
    abrirWhatsapp({
      telefone: cliente.telefone,
      mensagem: proximo
        ? MODELOS.lembrete({ agendamento: proximo, marca })
        : `Oi, ${cliente.nome}! Aqui é do ${marca.nome}. Que tal marcar seu próximo horário?`,
    })
  }

  return (
    <div className="modal open" role="presentation" onMouseDown={e => e.target === e.currentTarget && aoFechar()}>
      <div className="modal-box wide" role="dialog" aria-label={`Histórico de ${cliente.nome}`}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">Cliente</span>
            <h2>{cliente.nome}</h2>
          </div>
          <button type="button" onClick={aoFechar} aria-label="Fechar">×</button>
        </div>

        <div className="historico-resumo">
          <div><b>{dela.length}</b><span>atendimentos</span></div>
          <div><b>{formatarMoeda(totalGasto)}</b><span>já gastou</span></div>
          <div><b>{formatarMoeda(totalEmSinais)}</b><span>em sinais</span></div>
          <div><b>{preferido ? preferido[0] : '—'}</b><span>serviço preferido</span></div>
        </div>

        <div className="inline-control">
          <p>
            {cliente.telefone}
            <small>{futuros.length ? `${futuros.length} horário(s) marcado(s)` : 'Sem horário marcado'}</small>
          </p>
          <button className="small-btn" onClick={conversar}>Abrir WhatsApp</button>
        </div>

        <div className="table-wrap" style={{ maxHeight: 280, marginTop: 8 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Serviço</th>
                <th>Valor</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {dela.length === 0 && (
                <tr><td colSpan="4" className="empty">Nenhum atendimento registrado ainda.</td></tr>
              )}
              {dela.map(item => (
                <tr key={item.id}>
                  <td>
                    {dataCurta(item.data)} · {item.horario}
                    {item.data >= hoje && <small style={{ color: 'var(--p)', display: 'block' }}>a realizar</small>}
                  </td>
                  <td>{item.servico}</td>
                  <td>{formatarMoeda(item.preco ?? precoDoServico(servicos, item.servico))}</td>
                  <td><Etiqueta situacao={item.situacao} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
