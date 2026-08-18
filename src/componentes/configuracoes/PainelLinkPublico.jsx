import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useAplicacao } from '../../ganchos/useAplicacao'

// Enquanto nao existe servidor, o link e o proprio endereco da pagina publica.
function enderecoPublico() {
  return `${window.location.origin}/agendamento`
}

export function PainelLinkPublico() {
  const { marca, perfil, mostrarAviso } = useAplicacao()
  const [qr, definirQr] = useState('')

  const link = enderecoPublico()

  const textoParaDivulgar =
    `Agende seu horário no ${marca.nome} pelo link, escolha o serviço e garanta o seu horário. ${link}`

  useEffect(() => {
    QRCode.toDataURL(link, { width: 512, margin: 1, color: { dark: '#201b2a', light: '#ffffff' } })
      .then(definirQr)
      .catch(() => definirQr(''))
  }, [link])

  const copiar = (texto, mensagem) => {
    navigator.clipboard?.writeText(texto)
    mostrarAviso(mensagem)
  }

  const baixarQr = () => {
    const ancora = document.createElement('a')
    ancora.href = qr
    ancora.download = `qrcode-${marca.nome.toLowerCase().replace(/\s+/g, '-')}.png`
    ancora.click()
    mostrarAviso('QR Code baixado.')
  }

  return (
    <>
      <article className="card">
        <div className="card-title">
          <h2>Link da sua página</h2>
          <span className="tag">Público</span>
        </div>
        <p className="section-help">
          É por aqui que suas clientes agendam. Coloque na bio do Instagram, no WhatsApp e onde mais atender.
        </p>

        <div className="link-publico">
          <input readOnly value={link} onFocus={evento => evento.target.select()} />
          <button className="btn" onClick={() => copiar(link, 'Link copiado.')}>Copiar link</button>
        </div>

        <div className="inline-control">
          <p>
            Texto pronto para divulgar
            <small>{textoParaDivulgar}</small>
          </p>
          <button className="small-btn" onClick={() => copiar(textoParaDivulgar, 'Texto copiado.')}>
            Copiar texto
          </button>
        </div>

        <div className="inline-control">
          <p>
            Abrir a página
            <small>Veja exatamente o que a cliente vê.</small>
          </p>
          <a className="small-btn" href={link} target="_blank" rel="noreferrer">Abrir</a>
        </div>
      </article>

      <article className="card">
        <div className="card-title"><h2>QR Code</h2></div>
        <p className="section-help">
          Para imprimir e deixar no balcão, ou colar no espelho. A cliente aponta a câmera e cai direto na sua página.
        </p>

        <div className="qr-bloco">
          {qr ? <img src={qr} alt="QR Code da página de agendamento" /> : <div className="qr-vazio" />}
          <div>
            <b>{marca.nome}</b>
            <small>{perfil.especialidade}</small>
            <button className="btn secondary" onClick={baixarQr} disabled={!qr}>Baixar QR Code</button>
          </div>
        </div>
      </article>
    </>
  )
}
