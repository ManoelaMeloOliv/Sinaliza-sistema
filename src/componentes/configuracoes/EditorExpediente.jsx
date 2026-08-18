import { Interruptor } from '../interface/Interruptor'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { EXPEDIENTE } from '../../utilitarios/regras'

const DIAS = [
  { indice: 2, nome: 'Terça-feira' },
  { indice: 3, nome: 'Quarta-feira' },
  { indice: 4, nome: 'Quinta-feira' },
  { indice: 5, nome: 'Sexta-feira' },
  { indice: 6, nome: 'Sábado' },
  { indice: 0, nome: 'Domingo' },
  { indice: 1, nome: 'Segunda-feira' },
]

const PADRAO_DE_DIA = { abre: '09:00', fecha: '18:00', intervalo: null }

export function EditorExpediente() {
  const { configuracoes, definirConfiguracoes, mostrarAviso } = useAplicacao()
  const expediente = configuracoes.expediente ?? EXPEDIENTE

  const alterar = (indice, valor) =>
    definirConfiguracoes(atual => ({
      ...atual,
      expediente: { ...(atual.expediente ?? EXPEDIENTE), [indice]: valor },
    }))

  const alternarDia = dia => {
    const aberto = Boolean(expediente[dia.indice])
    alterar(dia.indice, aberto ? null : { ...PADRAO_DE_DIA })
    mostrarAviso(`${dia.nome}: ${aberto ? 'fechado' : 'aberto'}.`)
  }

  const alterarCampo = (indice, campo) => evento =>
    alterar(indice, { ...expediente[indice], [campo]: evento.target.value })

  const alternarIntervalo = indice => {
    const atual = expediente[indice]
    alterar(indice, {
      ...atual,
      intervalo: atual.intervalo ? null : { inicio: '12:00', fim: '13:00' },
    })
  }

  const alterarIntervalo = (indice, campo) => evento =>
    alterar(indice, {
      ...expediente[indice],
      intervalo: { ...expediente[indice].intervalo, [campo]: evento.target.value },
    })

  return (
    <article className="card">
      <div className="card-title">
        <h2>Expediente</h2>
        <span className="tag">Vale na página pública</span>
      </div>
      <p className="section-help">
        Os horários oferecidos às clientes saem daqui. Fora do expediente, ninguém consegue agendar.
      </p>

      <div className="expediente">
        {DIAS.map(dia => {
          const doDia = expediente[dia.indice]
          const aberto = Boolean(doDia)

          return (
            <div className={aberto ? 'expediente-dia' : 'expediente-dia fechado'} key={dia.indice}>
              <div className="expediente-topo">
                <b>{dia.nome}</b>
                <Interruptor ligado={aberto} aoAlternar={() => alternarDia(dia)} rotulo={`Abrir ${dia.nome}`} />
              </div>

              {aberto ? (
                <div className="expediente-campos">
                  <label>
                    Abre
                    <input type="time" value={doDia.abre} onChange={alterarCampo(dia.indice, 'abre')} />
                  </label>
                  <label>
                    Fecha
                    <input type="time" value={doDia.fecha} onChange={alterarCampo(dia.indice, 'fecha')} />
                  </label>

                  <label className="expediente-intervalo">
                    <span>
                      Intervalo
                      <button type="button" className="small-btn" onClick={() => alternarIntervalo(dia.indice)}>
                        {doDia.intervalo ? 'Remover' : 'Adicionar'}
                      </button>
                    </span>
                    {doDia.intervalo && (
                      <span className="expediente-faixa">
                        <input type="time" value={doDia.intervalo.inicio} onChange={alterarIntervalo(dia.indice, 'inicio')} />
                        <i>às</i>
                        <input type="time" value={doDia.intervalo.fim} onChange={alterarIntervalo(dia.indice, 'fim')} />
                      </span>
                    )}
                  </label>
                </div>
              ) : (
                <small>Fechado — nenhum horário é oferecido.</small>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}
