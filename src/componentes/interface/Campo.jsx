// Campo de formulario padrao: rotulo em cima, controle embaixo.
// "largo" ocupa as duas colunas do .form-grid.
export function Campo({ rotulo, largo = false, children }) {
  return (
    <div className={largo ? 'field full' : 'field'}>
      <label>{rotulo}</label>
      {children}
    </div>
  )
}
