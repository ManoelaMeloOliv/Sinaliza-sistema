import { useEffect } from 'react'

// Excluir e irreversivel, entao pede confirmacao antes. Fecha no Esc,
// no botao Cancelar e no clique fora.
export function ConfirmarExclusao({ titulo, descricao, rotuloConfirmar = 'Excluir', aoConfirmar, aoCancelar }) {
  useEffect(() => {
    const aoTeclar = evento => evento.key === 'Escape' && aoCancelar()
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aoCancelar])

  return (
    <div
      className="modal open"
      role="presentation"
      onMouseDown={evento => evento.target === evento.currentTarget && aoCancelar()}
    >
      <div className="modal-box" style={{ maxWidth: 420 }} role="alertdialog" aria-label={titulo}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">Confirmação</span>
            <h2>{titulo}</h2>
          </div>
        </div>

        <p className="section-help" style={{ margin: 0 }}>{descricao}</p>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={aoCancelar}>Cancelar</button>
          <button type="button" className="btn" onClick={aoConfirmar}>{rotuloConfirmar}</button>
        </div>
      </div>
    </div>
  )
}
