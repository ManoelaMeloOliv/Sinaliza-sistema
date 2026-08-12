export function CabecalhoPagina({ etiqueta, titulo, descricao, acao }) {
  return (
    <div className="page-head">
      <div>
        <span className="eyebrow">{etiqueta}</span>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
      {acao}
    </div>
  )
}
