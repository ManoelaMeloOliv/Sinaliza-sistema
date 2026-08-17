import { Icone } from '../interface/Icones'

const PASSOS = ['Serviço', 'Horário', 'Seus dados', 'Sinal']

// O CSS distingue tres estados: concluida (roxo claro, com visto),
// atual (roxo solido, com o numero) e futura (cinza).
export function PassosAgendamento({ etapa }) {
  return (
    <div className="steps">
      {PASSOS.map((rotulo, indice) => {
        const concluida = indice < etapa
        const atual = indice === etapa

        return (
          <div
            className={['step', concluida && 'done', atual && 'active'].filter(Boolean).join(' ')}
            key={rotulo}
          >
            <i>{concluida ? <Icone nome="check" className="ui-icon" /> : indice + 1}</i>
            <span>{rotulo}</span>
          </div>
        )
      })}
    </div>
  )
}
