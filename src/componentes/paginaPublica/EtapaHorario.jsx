import { useState } from 'react'
import {
  DIAS_DA_SEMANA_CURTOS,
  dataDeHoje,
  dataPorExtenso,
  ehDiaDeAtendimento,
  gradeDoMes,
  mesPorExtenso,
  paraData,
  somarMeses,
} from '../../utilitarios/datas'

const HORARIOS_DISPONIVEIS = ['09:00', '10:30', '14:00', '16:30', '18:00']

export function EtapaHorario({ data, horario, ocupados, aoEscolherData, aoEscolherHorario, aoVoltar, aoAvancar }) {
  const hoje = dataDeHoje()
  const [mes, definirMes] = useState(data ?? hoje)

  const casas = gradeDoMes(mes)
  const primeiroDoMes = `${mes.slice(0, 7)}-01`
  const podeVoltar = primeiroDoMes > hoje.slice(0, 7) + '-01'

  // So oferece o que ainda nao foi reservado naquele dia.
  const livres = HORARIOS_DISPONIVEIS.filter(hora => !ocupados.includes(hora))

  return (
    <div className="screen active">
      <h2>Escolha o melhor horário</h2>
      <p className="intro">Mostramos apenas os horários realmente disponíveis.</p>

      <div className="calendar-head">
        <button type="button" onClick={() => definirMes(somarMeses(mes, -1))} disabled={!podeVoltar} aria-label="Mês anterior">‹</button>
        <b>{mesPorExtenso(mes)}</b>
        <button type="button" onClick={() => definirMes(somarMeses(mes, 1))} aria-label="Próximo mês">›</button>
      </div>

      <div className="weekdays">
        {DIAS_DA_SEMANA_CURTOS.map(nome => <span key={nome}>{nome}</span>)}
      </div>

      <div className="calendar">
        {casas.map((dia, indice) => {
          if (!dia) return <button className="day" disabled key={indice} />

          // Dia passado ou fechado nao pode ser escolhido.
          const indisponivel = dia < hoje || !ehDiaDeAtendimento(dia)

          return (
            <button
              className={data === dia ? 'day selected' : 'day'}
              key={dia}
              disabled={indisponivel}
              onClick={() => aoEscolherData(dia)}
            >
              {paraData(dia).getDate()}
            </button>
          )
        })}
      </div>

      {data && (
        <section className="slots-bloco">
          <h3>Horários disponíveis</h3>
          <p>
            {dataPorExtenso(data)}
            {livres.length > 0 ? ` · ${livres.length} opções` : ''}
          </p>

          {livres.length === 0 ? (
            <p className="empty">Todos os horários deste dia já foram reservados. Escolha outra data.</p>
          ) : (
            <div className="slots">
              {livres.map(hora => (
                <button
                  className={horario === hora ? 'slot selected' : 'slot'}
                  key={hora}
                  onClick={() => aoEscolherHorario(hora)}
                  aria-pressed={horario === hora}
                >
                  {hora}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="actions">
        <button className="btn back" onClick={aoVoltar}>Voltar</button>
        <button className="btn next" disabled={!data || !horario} onClick={aoAvancar}>Continuar</button>
      </div>
    </div>
  )
}
