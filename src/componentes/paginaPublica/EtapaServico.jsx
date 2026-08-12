import { formatarMoeda } from '../../utilitarios/formatadores'

export function EtapaServico({ servicos, servicoEscolhido, aoEscolher, aoAvancar }) {
  return (
    <div className="screen active">
      <h2>O que você quer fazer?</h2>
      <p className="intro">Escolha um serviço para ver os horários disponíveis.</p>

      <div className="services">
        {servicos.map(servico => (
          <button
            className={servicoEscolhido?.id === servico.id ? 'service selected' : 'service'}
            key={servico.id}
            onClick={() => aoEscolher(servico)}
          >
            <span className="service-icon">{servico.icone}</span>
            <span>
              <h3>{servico.nome}</h3>
              <small>{servico.duracao}</small>
            </span>
            <b>{formatarMoeda(servico.preco)}</b>
          </button>
        ))}
        {servicos.length === 0 && <p className="intro">Nenhum serviço publicado no momento.</p>}
      </div>

      <div className="actions">
        <span />
        <button className="btn next" disabled={!servicoEscolhido} onClick={aoAvancar}>
          Escolher horário
        </button>
      </div>
    </div>
  )
}
