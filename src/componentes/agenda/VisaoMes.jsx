const DIAS_DA_SEMANA_CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const TOTAL_DE_CELULAS = 42
const DESLOCAMENTO = 5 // o dia 1 cai na sexta celula neste mes da demonstracao
const DIA_DE_HOJE = 19

// Calendario mensal: 6 semanas de 7 dias, com os agendamentos da semana da demonstracao.
export function VisaoMes({ agendamentos, aoAbrirAgendamento }) {
  const celulas = Array.from({ length: TOTAL_DE_CELULAS }, (_, indice) => {
    const dia = indice - DESLOCAMENTO
    const foraDoMes = dia < 1 || dia > 31
    return {
      chave: indice,
      foraDoMes,
      numero: foraDoMes ? (dia < 1 ? 31 + dia : dia - 31) : dia,
      hoje: dia === DIA_DE_HOJE,
      eventos: foraDoMes ? [] : agendamentos.filter(item => 19 + item.dia === dia),
    }
  })

  return (
    <div className="month-view">
      <div className="month-weekdays">
        {DIAS_DA_SEMANA_CURTOS.map(dia => <span key={dia}>{dia}</span>)}
      </div>

      <div className="month-grid">
        {celulas.map(celula => (
          <div
            className={['month-cell', celula.foraDoMes && 'out', celula.hoje && 'today'].filter(Boolean).join(' ')}
            key={celula.chave}
          >
            <div className="month-number">
              <b>{celula.numero}</b>
              {celula.eventos.length > 0 && <span className="month-count">{celula.eventos.length}</span>}
            </div>

            {celula.eventos.slice(0, 3).map(evento => (
              <button
                className={evento.situacao === 'Pago' ? 'month-event confirmed' : 'month-event'}
                key={evento.id}
                onClick={() => aoAbrirAgendamento(evento)}
              >
                <b>{evento.horario}</b> {evento.cliente}
              </button>
            ))}

            {celula.eventos.length > 3 && (
              <span className="month-count">+{celula.eventos.length - 3} outros</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
