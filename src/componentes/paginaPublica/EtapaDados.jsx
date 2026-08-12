export function EtapaDados({ dados, aoMudar, aoVoltar, aoAvancar }) {
  const enviar = evento => {
    evento.preventDefault()
    aoAvancar()
  }

  return (
    <div className="screen active">
      <h2>Agora, seus dados</h2>
      <p className="intro">Usaremos seu WhatsApp apenas para confirmação e lembretes.</p>

      <form className="form" onSubmit={enviar}>
        <div className="field">
          <label>Nome completo</label>
          <input
            required
            value={dados.nome}
            onChange={evento => aoMudar({ nome: evento.target.value })}
            placeholder="Como podemos te chamar?"
          />
        </div>

        <div className="field">
          <label>WhatsApp</label>
          <input
            required
            inputMode="tel"
            value={dados.telefone}
            onChange={evento => aoMudar({ telefone: evento.target.value })}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="field">
          <label>E-mail (opcional)</label>
          <input
            type="email"
            value={dados.email}
            onChange={evento => aoMudar({ email: evento.target.value })}
            placeholder="voce@email.com"
          />
        </div>

        <div className="notice">
          <b>♢</b>
          <span>
            Você receberá a confirmação agora e lembretes automáticos 24h e 2h antes do atendimento.
          </span>
        </div>

        <div className="actions">
          <button type="button" className="btn back" onClick={aoVoltar}>Voltar</button>
          <button className="btn">Revisar reserva</button>
        </div>
      </form>
    </div>
  )
}
