import { formatarMoeda } from '../../utilitarios/formatadores'
import { calcularSinal, PERCENTUAL_SINAL } from '../../utilitarios/valores'

export function EtapaRevisao({ servico, quando, profissional, nomeDaLoja, mostrarPoliticas, aoVoltar, aoAvancar }) {
  return (
    <div className="screen active">
      <h2>Revise antes de reservar</h2>
      <p className="intro">O sinal protege este horário e será descontado do valor final.</p>

      <div className="review">
        <div className="review-row"><span>Serviço</span><b>{servico.nome}</b></div>
        <div className="review-row"><span>Data e horário</span><b>{quando}</b></div>
        <div className="review-row"><span>Profissional</span><b>{profissional}</b></div>
        <div className="review-row"><span>Valor do serviço</span><b>{formatarMoeda(servico.preco)}</b></div>
      </div>

      <div className="pix">
        <div className="pix-top">
          <div className="pix-icon">◇</div>
          <div>
            <h3>Sinal via Pix</h3>
            <p>Confirmação automática assim que o pagamento cair.</p>
          </div>
        </div>
        <div className="total">
          <span>
            <small>Pague agora</small>
            Sinal de {PERCENTUAL_SINAL * 100}%
          </span>
          <b>{formatarMoeda(calcularSinal(servico.preco))}</b>
        </div>
      </div>

      {mostrarPoliticas && (
        <p className="terms">
          Ao continuar, você concorda com a política do {nomeDaLoja}: é possível remarcar uma vez;
          cancelamentos com menos de 24h não recebem devolução do sinal.
        </p>
      )}

      <div className="actions">
        <button className="btn back" onClick={aoVoltar}>Voltar</button>
        <button className="btn next" onClick={aoAvancar}>Gerar Pix e reservar</button>
      </div>
    </div>
  )
}
