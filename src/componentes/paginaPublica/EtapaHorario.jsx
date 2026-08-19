import { useState } from 'react'
import {
  DIAS_DA_SEMANA_CURTOS,
  dataDeHoje,
  dataPorExtenso,
  gradeDoMes,
  mesPorExtenso,
  paraData,
  somarMeses,
} from '../../utilitarios/datas'

export function EtapaHorario({ data, horario, horarios, podeEscolher, espera, aoEscolherData, aoEscolherHorario, aoVoltar, aoAvancar }) {
  const hoje = dataDeHoje()
  const [mes, definirMes] = useState(data ?? hoje)

  const casas = gradeDoMes(mes)
  const podeVoltar = mes.slice(0, 7) > hoje.slice(0, 7)

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

          return (
            <button
              className={data === dia ? 'day selected' : 'day'}
              key={dia}
              disabled={!podeEscolher(dia)}
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
            {horarios.length > 0 ? ` · ${horarios.length} opções` : ''}
          </p>

          {horarios.length === 0 ? (
            <>
              <p className="empty">Não há horário livre neste dia para o serviço escolhido.</p>
              {espera}
            </>
          ) : (
            <div className="slots">
              {horarios.map(hora => (
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
