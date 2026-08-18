import { HORARIOS_DA_GRADE } from '../../dados/dadosPainel'
import { dataDeHoje, rotuloDoDia } from '../../utilitarios/datas'

// Grade de horarios x dias. Cada celula mostra o agendamento daquele cruzamento.
export function VisaoSemana({ dias, agendamentos, aoSelecionar }) {
  const hoje = dataDeHoje()

  return (
    <div className="week">
      <div />
      {dias.map(dia => (
        <div className={dia === hoje ? 'day hoje' : 'day'} key={dia}>{rotuloDoDia(dia)}</div>
      ))}

      {HORARIOS_DA_GRADE.map(horario => (
        <Linha key={horario} horario={horario} dias={dias} agendamentos={agendamentos} aoSelecionar={aoSelecionar} />
      ))}
    </div>
  )
}

function Linha({ horario, dias, agendamentos, aoSelecionar }) {
  return (
    <>
      <div className="hour">{horario}</div>
      {dias.map(dia => {
        const agendamento = agendamentos.find(item => item.data === dia && item.horario === horario)
        return (
          <div key={dia}>
            {agendamento && (
              <button type="button" className={agendamento.situacao === 'Pago' ? 'booking green' : 'booking'} onClick={() => aoSelecionar(agendamento)}>
                <b>{agendamento.cliente}</b>
                <br />
                {agendamento.servico}
              </button>
            )}
          </div>
        )
      })}
    </>
  )
}
