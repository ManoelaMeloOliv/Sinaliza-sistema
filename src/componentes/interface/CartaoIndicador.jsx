export function CartaoIndicador({ rotulo, icone, valor, tendencia }) {
  return (
    <article className="card stat">
      <div className="stat-top">
        <span>{rotulo}</span>
        <i className="stat-icon">{icone}</i>
      </div>
      <strong>{valor}</strong>
      {tendencia && <span className="trend">{tendencia}</span>}
    </article>
  )
}

// Indicador compacto usado nos topos de Servicos, Clientes e Agenda.
export function IndicadorCompacto({ rotulo, valor }) {
  return (
    <article className="card mini-kpi">
      <span>{rotulo}</span>
      <b>{valor}</b>
    </article>
  )
}
