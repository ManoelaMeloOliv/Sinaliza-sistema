const PASSOS = ['Serviço', 'Horário', 'Seus dados', 'Sinal']

export function PassosAgendamento({ etapa }) {
  return (
    <div className="steps">
      {PASSOS.map((rotulo, indice) => (
        <div className={indice <= etapa ? 'step active' : 'step'} key={rotulo}>
          <i>{indice + 1}</i>
          <span>{rotulo}</span>
        </div>
      ))}
    </div>
  )
}
