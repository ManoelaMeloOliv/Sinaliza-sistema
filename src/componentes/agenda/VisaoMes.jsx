import { DIAS_DA_SEMANA_CURTOS, dataDeHoje, gradeDoMes, paraData } from '../../utilitarios/datas'

// Calendario mensal de verdade: seis semanas alinhadas ao domingo.
export function VisaoMes({ mes, agendamentos, aoSelecionar }) {
  const casas = gradeDoMes(mes)
  const hoje = dataDeHoje()

  return (
    <div className="month-view">
      <div className="month-weekdays">
        {DIAS_DA_SEMANA_CURTOS.map(dia => <span key={dia}>{dia}</span>)}
      </div>

      <div className="month-grid">
        {casas.map((data, indice) => {
          if (!data) return <div className="month-cell out" key={indice} />

          const eventos = agendamentos.filter(item => item.data === data)

          return (
            <div className={data === hoje ? 'month-cell today' : 'month-cell'} key={data}>
              <div className="month-number">
                <b>{paraData(data).getDate()}</b>
                {eventos.length > 0 && <span className="month-count">{eventos.length}</span>}
              </div>

              {eventos.slice(0, 3).map(evento => (
                <button
                  className={evento.situacao === 'Pago' ? 'month-event confirmed' : 'month-event'}
                  key={evento.id}
                  onClick={() => aoSelecionar(evento)}
                >
                  <b>{evento.horario}</b> {evento.cliente}
                </button>
              ))}

              {eventos.length > 3 && (
                <span className="month-count">+{eventos.length - 3} outros</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
