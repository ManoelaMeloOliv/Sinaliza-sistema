import { formatarMoeda, iniciais } from '../../utilitarios/formatadores'
import { calcularSinal, PERCENTUAL_SINAL } from '../../utilitarios/valores'

const POLITICAS = [
  'Seu horário é confirmado automaticamente após o Pix.',
  'Você recebe lembretes no WhatsApp antes do atendimento.',
  'Uma remarcação permitida com até 24h de antecedência.',
]

export function ResumoLateral({ marca, servico, quando }) {
  return (
    <aside className="aside">
      <div className="aside-brand">
        <div
          className="aside-brand-logo"
          style={marca.logo ? { background: `#fff url("${marca.logo}") center/contain no-repeat` } : undefined}
        >
          {marca.logo ? '' : iniciais(marca.nome)}
        </div>
        <div>
          <b>{marca.nome}</b>
          <small>Agendamento online seguro</small>
        </div>
      </div>

      <div className="aside-content">
        <h3>Resumo da reserva</h3>

        {!servico ? (
          <div className="summary-empty">Escolha um serviço para começar seu agendamento.</div>
        ) : (
          <div>
            <div className="summary-service">
              <i>{servico.icone}</i>
              <div>
                <b>{servico.nome}</b>
                <small>{servico.duracao} · {marca.nome}</small>
              </div>
            </div>

            <div className="summary-lines">
              <div className="summary-line"><span>Data</span><b>{quando}</b></div>
              <div className="summary-line"><span>Valor</span><b>{formatarMoeda(servico.preco)}</b></div>
            </div>

            <div className="total">
              <span>
                <small>Sinal para reservar</small>
                {PERCENTUAL_SINAL * 100}% do serviço
              </span>
              <b>{formatarMoeda(calcularSinal(servico.preco))}</b>
            </div>

            <div className="secure">Pagamento Pix protegido</div>
          </div>
        )}
      </div>

      <div className="aside-policy">
        {POLITICAS.map(politica => (
          <div className="policy-line" key={politica}>
            <i>✓</i>
            <span>{politica}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
