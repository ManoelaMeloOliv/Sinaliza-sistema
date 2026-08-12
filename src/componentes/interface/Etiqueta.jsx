// "Aguardando" e "Pendente" usam a variacao amarela (.wait).
export function Etiqueta({ situacao }) {
  const aguardando = situacao === 'Aguardando' || situacao === 'Pendente'
  return <span className={aguardando ? 'tag wait' : 'tag'}>{situacao}</span>
}
