import { DIAS_DA_SEMANA, HORARIOS_DA_GRADE } from '../../dados/dadosPainel'

// Grade de horarios x dias. Cada celula mostra o agendamento daquele cruzamento.
export function VisaoSemana({ agendamentos }) {
  return (
    <div className="week">
      <div />
      {DIAS_DA_SEMANA.map(dia => <div className="day" key={dia}>{dia}</div>)}

      {HORARIOS_DA_GRADE.map(horario => (
        <Linha key={horario} horario={horario} agendamentos={agendamentos} />
      ))}
    </div>
  )
}

function Linha({ horario, agendamentos }) {
  return (
    <>
      <div className="hour">{horario}</div>
      {DIAS_DA_SEMANA.map((_, indiceDoDia) => {
        const agendamento = agendamentos.find(item => item.dia === indiceDoDia && item.horario === horario)
        return (
          <div key={indiceDoDia}>
            {agendamento && (
              <div className={agendamento.situacao === 'Pago' ? 'booking green' : 'booking'}>
                <b>{agendamento.cliente}</b>
                <br />
                {agendamento.servico}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
