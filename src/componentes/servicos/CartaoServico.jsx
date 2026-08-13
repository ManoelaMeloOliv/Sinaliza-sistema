import { Interruptor } from '../interface/Interruptor'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { calcularSinal, regraDeSinal, rotuloDoSinal } from '../../utilitarios/valores'

export function CartaoServico({ servico, configuracoes, posicao, aoPublicar, aoEditar, aoDuplicar, aoExcluir }) {
  const regra = regraDeSinal(servico, configuracoes)

  return (
    <article className="card service-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div className="stat-icon">{String(posicao).padStart(2, '0')}</div>
        <Interruptor ligado={servico.publicado} aoAlternar={aoPublicar} rotulo="Publicar serviço" />
      </div>

      <h3>{servico.nome}</h3>
      <p>{servico.duracao} · {formatarMoeda(servico.preco)}</p>

      <div className="service-row">
        <span>{rotuloDoSinal(regra)}</span>
        <b>{formatarMoeda(calcularSinal(servico.preco, regra))}</b>
      </div>

      <div className="service-actions">
        <button className="small-btn" onClick={aoEditar}>Editar</button>
        <button className="small-btn" onClick={aoDuplicar}>Duplicar</button>
        <button className="small-btn danger" onClick={aoExcluir}>Excluir</button>
      </div>
    </article>
  )
}
