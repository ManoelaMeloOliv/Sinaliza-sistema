import { useEffect } from 'react'

// Modal padrao em forma de formulario. Fecha no Esc, no X, no botao Cancelar
// e no clique fora da caixa.
export function ModalBase({ etiqueta, titulo, largo = false, aoFechar, aoEnviar, rotuloEnviar, children }) {
  useEffect(() => {
    const aoTeclar = evento => evento.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aoFechar])

  const enviar = evento => {
    evento.preventDefault()
    aoEnviar(evento)
  }

  return (
    <div
      className="modal open"
      role="presentation"
      onMouseDown={evento => evento.target === evento.currentTarget && aoFechar()}
    >
      <form className={largo ? 'modal-box wide' : 'modal-box'} onSubmit={enviar}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">{etiqueta}</span>
            <h2>{titulo}</h2>
          </div>
          <button type="button" onClick={aoFechar} aria-label="Fechar">×</button>
        </div>

        <div className="form-grid">{children}</div>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={aoFechar}>Cancelar</button>
          <button className="btn">{rotuloEnviar}</button>
        </div>
      </form>
    </div>
  )
}
