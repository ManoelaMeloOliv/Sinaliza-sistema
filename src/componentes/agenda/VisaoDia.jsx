import { Etiqueta } from '../interface/Etiqueta'
import { HORARIOS_DO_DIA } from '../../dados/dadosPainel'

// Linha do tempo de um dia, marcando os horarios ainda livres.
export function VisaoDia({ agendamentos }) {
  const doDia = agendamentos.filter(item => item.dia === 0)

  return (
    <div className="agenda-day-view">
      <div className="day-view-head">
        <div>
          <span className="eyebrow">Hoje</span>
          <b>Terça-feira, 19 de agosto</b>
        </div>
        <span>{doDia.length} compromissos</span>
      </div>

      <div className="day-timeline">
        {HORARIOS_DO_DIA.map(horario => {
          const noHorario = doDia.filter(item => item.horario === horario)
          return (
            <div className="day-slot" key={horario}>
              <time>{horario}</time>
              <div>
                {noHorario.length === 0 && <span className="free-slot">Horário disponível</span>}
                {noHorario.map(agendamento => (
                  <article
                    className={agendamento.situacao === 'Pago' ? 'day-booking confirmed' : 'day-booking'}
                    key={agendamento.id}
                  >
                    <b>{agendamento.cliente}</b>
                    <span>{agendamento.servico}</span>
                    <Etiqueta situacao={agendamento.situacao} />
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
