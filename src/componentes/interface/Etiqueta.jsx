// Verde: tudo certo. Amarelo: esperando algo. Vermelho: impedido.
const AGUARDANDO = ['Aguardando', 'Pendente', 'Na espera']
const IMPEDIDO = ['Bloqueada', 'Cancelado']

export function Etiqueta({ situacao }) {
  if (IMPEDIDO.includes(situacao)) return <span className="tag cancel">{situacao}</span>
  if (AGUARDANDO.includes(situacao)) return <span className="tag wait">{situacao}</span>
  return <span className="tag">{situacao}</span>
}
