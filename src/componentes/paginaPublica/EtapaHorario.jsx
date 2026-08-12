const DIAS_DA_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const TOTAL_DE_CELULAS = 42
const DESLOCAMENTO = 4      // o dia 1 cai na quinta celula
const PRIMEIRO_DIA_LIVRE = 11 // dias anteriores ja passaram

const HORARIOS_DISPONIVEIS = ['09:00', '10:30', '14:00', '16:30', '18:00']

export function EtapaHorario({ dia, horario, aoEscolherDia, aoEscolherHorario, aoVoltar, aoAvancar }) {
  const celulas = Array.from({ length: TOTAL_DE_CELULAS }, (_, indice) => indice - DESLOCAMENTO)

  return (
    <div className="screen active">
      <h2>Escolha o melhor horário</h2>
      <p className="intro">Mostramos apenas os horários realmente disponíveis.</p>

      <div className="calendar-head">
        <button type="button" aria-label="Mês anterior">‹</button>
        <b>Agosto de 2026</b>
        <button type="button" aria-label="Próximo mês">›</button>
      </div>

      <div className="weekdays">
        {DIAS_DA_SEMANA.map(nome => <span key={nome}>{nome}</span>)}
      </div>

      <div className="calendar">
        {celulas.map((numero, indice) => {
          const foraDoMes = numero < 1 || numero > 31
          if (foraDoMes) return <button className="day" disabled key={indice} />
          return (
            <button
              className={dia === numero ? 'day selected' : 'day'}
              key={indice}
              disabled={numero < PRIMEIRO_DIA_LIVRE}
              onClick={() => aoEscolherDia(numero)}
            >
              {numero}
            </button>
          )
        })}
      </div>

      {dia && (
        <div className="slots">
          {HORARIOS_DISPONIVEIS.map(hora => (
            <button
              className={horario === hora ? 'slot selected' : 'slot'}
              key={hora}
              onClick={() => aoEscolherHorario(hora)}
            >
              {hora}
            </button>
          ))}
        </div>
      )}

      <div className="actions">
        <button className="btn back" onClick={aoVoltar}>Voltar</button>
        <button className="btn next" disabled={!dia || !horario} onClick={aoAvancar}>Continuar</button>
      </div>
    </div>
  )
}
