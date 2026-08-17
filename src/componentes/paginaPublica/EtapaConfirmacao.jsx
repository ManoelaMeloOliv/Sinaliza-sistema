import { formatarMoeda } from '../../utilitarios/formatadores'
import { Icone } from '../interface/Icones'

export function EtapaConfirmacao({ servico, sinal, quando, nome, nomeDaLoja }) {
  return (
    <div className="screen confirm active">
      <div className="check"><Icone nome="check" className="ui-icon" /></div>
      <h2>Seu horário está confirmado!</h2>
      <p className="intro">
        Prontinho, {nome}. O {nomeDaLoja} já recebeu sua reserva.
      </p>

      <div className="confirm-card">
        <div className="review-row"><span>Serviço</span><b>{servico.nome}</b></div>
        <div className="review-row"><span>Quando</span><b>{quando}</b></div>
        <div className="review-row"><span>Sinal pago</span><b>{formatarMoeda(sinal)}</b></div>
        <div className="review-row"><span>Restante no dia</span><b>{formatarMoeda(servico.preco - sinal)}</b></div>
      </div>

      <div className="whats">
        <b>✓</b>
        <span>
          <strong>Confirmação enviada no WhatsApp</strong>
          <br />
          Também vamos lembrar você 24h e 2h antes.
        </span>
      </div>
    </div>
  )
}
