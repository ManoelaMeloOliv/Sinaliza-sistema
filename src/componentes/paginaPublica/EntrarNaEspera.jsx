import { useState } from 'react'
import { dataPorExtenso } from '../../utilitarios/datas'

// Aparece quando o dia escolhido nao tem horario livre. Em vez de a cliente
// simplesmente desistir, ela deixa o contato e a loja chama quando abrir vaga.
export function EntrarNaEspera({ data, servico, aoEntrar }) {
  const [aberto, definirAberto] = useState(false)
  const [dados, definirDados] = useState({ nome: '', telefone: '', qualquerDia: false })
  const [pronto, definirPronto] = useState(false)

  const enviar = evento => {
    evento.preventDefault()
    aoEntrar({
      nome: dados.nome,
      telefone: dados.telefone,
      servico: servico?.nome,
      data: dados.qualquerDia ? '' : data,
    })
    definirPronto(true)
  }

  if (pronto) {
    return (
      <div className="notice espera-pronto">
        <b>✓</b>
        <span>
          Pronto, {dados.nome}! Você está na lista de espera.
          Se abrir uma vaga, entramos em contato pelo WhatsApp.
        </span>
      </div>
    )
  }

  if (!aberto) {
    return (
      <div className="espera-convite">
        <div>
          <b>Quer entrar na lista de espera?</b>
          <small>Se alguém desmarcar, avisamos você antes de abrir para o público.</small>
        </div>
        <button type="button" className="btn secondary" onClick={() => definirAberto(true)}>
          Entrar na lista
        </button>
      </div>
    )
  }

  return (
    <form className="espera-formulario" onSubmit={enviar}>
      <b>Lista de espera · {dataPorExtenso(data)}</b>

      <div className="field">
        <label>Seu nome</label>
        <input
          required
          value={dados.nome}
          onChange={evento => definirDados(atual => ({ ...atual, nome: evento.target.value }))}
          placeholder="Como podemos te chamar?"
        />
      </div>

      <div className="field">
        <label>WhatsApp</label>
        <input
          required
          inputMode="tel"
          value={dados.telefone}
          onChange={evento => definirDados(atual => ({ ...atual, telefone: evento.target.value }))}
          placeholder="(00) 00000-0000"
        />
      </div>

      <label className="espera-qualquer-dia">
        <input
          type="checkbox"
          checked={dados.qualquerDia}
          onChange={evento => definirDados(atual => ({ ...atual, qualquerDia: evento.target.checked }))}
        />
        <span>Aceito qualquer outro dia que abrir</span>
      </label>

      <div className="actions">
        <button type="button" className="btn back" onClick={() => definirAberto(false)}>Voltar</button>
        <button className="btn">Entrar na lista</button>
      </div>
    </form>
  )
}
