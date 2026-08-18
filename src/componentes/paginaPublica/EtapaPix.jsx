import { useEffect, useState } from 'react'
import { formatarMoeda } from '../../utilitarios/formatadores'

const CHAVE_PIX = '00020126580014BR.GOV.BCB.PIX0136sinaliza-demo-studiodaju'

function relogio(restante) {
  const minutos = String(Math.floor(restante / 60)).padStart(2, '0')
  const segundos = String(restante % 60).padStart(2, '0')
  return `${minutos}:${segundos}`
}

// "minutosDeValidade" vem de Configuracoes > Pagamentos.
export function EtapaPix({ sinal, minutosDeValidade = 15, aoConfirmar }) {
  const [restante, definirRestante] = useState(minutosDeValidade * 60)
  const [copiado, definirCopiado] = useState(false)

  useEffect(() => {
    const intervalo = setInterval(() => {
      definirRestante(atual => (atual <= 0 ? 0 : atual - 1))
    }, 1000)
    return () => clearInterval(intervalo)
  }, [])

  const copiar = () => {
    navigator.clipboard?.writeText(CHAVE_PIX)
    definirCopiado(true)
    setTimeout(() => definirCopiado(false), 2000)
  }

  return (
    <div className="screen pix-screen active">
      <h2>Pague o sinal via Pix</h2>
      <p className="intro">A vaga fica guardada enquanto você realiza o pagamento.</p>

      <span className="timer">⏱ Expira em <b>{relogio(restante)}</b></span>

      <div className="qr" aria-label="QR Code Pix ilustrativo" />

      <b>{formatarMoeda(sinal)}</b>

      <div className="copy-box">
        <input readOnly value={CHAVE_PIX} />
        <button onClick={copiar}>{copiado ? 'Copiado' : 'Copiar'}</button>
      </div>

      <button className="btn" onClick={aoConfirmar}>Simular pagamento confirmado</button>

      <p className="terms">
        Esta é uma demonstração visual. Nenhuma cobrança real será feita.
      </p>
    </div>
  )
}
