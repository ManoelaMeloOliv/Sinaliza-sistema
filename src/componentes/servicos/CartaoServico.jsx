import { Interruptor } from '../interface/Interruptor'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { calcularSinal, PERCENTUAL_SINAL } from '../../utilitarios/valores'

export function CartaoServico({ servico, posicao, aoPublicar, aoEditar, aoDuplicar, aoExcluir }) {
  return (
    <article className="card service-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div className="stat-icon">{String(posicao).padStart(2, '0')}</div>
        <Interruptor ligado={servico.publicado} aoAlternar={aoPublicar} rotulo="Publicar serviço" />
      </div>

      <h3>{servico.nome}</h3>
      <p>{servico.duracao} · {formatarMoeda(servico.preco)}</p>

      <div className="service-row">
        <span>Sinal de {PERCENTUAL_SINAL * 100}%</span>
        <b>{formatarMoeda(calcularSinal(servico.preco))}</b>
      </div>

      <div className="service-actions">
        <button className="small-btn" onClick={aoEditar}>Editar</button>
        <button className="small-btn" onClick={aoDuplicar}>Duplicar</button>
        <button className="small-btn danger" onClick={aoExcluir}>Excluir</button>
      </div>
    </article>
  )
}
