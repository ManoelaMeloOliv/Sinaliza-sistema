import { Icone } from '../interface/Icones'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { dataDeHoje } from '../../utilitarios/datas'
import { PLANOS, planoPorId, usoDoPlano } from '../../dados/planos'

function Medidor({ rotulo, medida, unidade }) {
  if (medida.ilimitado) {
    return (
      <div className="medidor">
        <div className="medidor-topo">
          <span>{rotulo}</span>
          <b>{medida.usado} · ilimitado</b>
        </div>
        <div className="progress"><i style={{ width: '100%', background: '#12b981' }} /></div>
      </div>
    )
  }

  const perto = medida.percentual >= 80

  return (
    <div className="medidor">
      <div className="medidor-topo">
        <span>{rotulo}</span>
        <b className={medida.estourou ? 'estourou' : undefined}>
          {medida.usado} de {medida.limite} {unidade}
        </b>
      </div>
      <div className="progress">
        <i style={{
          width: `${medida.percentual}%`,
          background: medida.estourou ? '#e0483c' : perto ? '#e8a33d' : undefined,
        }} />
      </div>
      {medida.estourou && <small className="medidor-alerta">Limite atingido. Suba de plano para continuar.</small>}
    </div>
  )
}

export function PainelPlano() {
  const { configuracoes, definirConfiguracoes, servicos, agendamentos, mostrarAviso } = useAplicacao()

  const atual = planoPorId(configuracoes.plano)
  const uso = usoDoPlano({ plano: atual, servicos, agendamentos, hoje: dataDeHoje() })

  const trocar = plano => {
    definirConfiguracoes(anterior => ({ ...anterior, plano: plano.id }))
    mostrarAviso(
      plano.id === atual.id
        ? `Você já está no ${plano.nome}.`
        : `Plano alterado para ${plano.nome}.`,
    )
  }

  return (
    <>
      <article className="card">
        <div className="card-title">
          <h2>Seu plano</h2>
          <span className="tag">{atual.nome}</span>
        </div>
        <p className="section-help">{atual.chamada}</p>

        <div className="plano-atual">
          <div>
            <strong>{atual.preco === 0 ? 'Grátis' : formatarMoeda(atual.preco)}</strong>
            {atual.preco > 0 && <span>/mês</span>}
            <small>{atual.observacao}</small>
          </div>

          <div className="medidores">
            <Medidor rotulo="Serviços cadastrados" medida={uso.servicos} unidade="serviços" />
            <Medidor rotulo="Agendamentos no mês" medida={uso.agendamentos} unidade="no mês" />
          </div>
        </div>
      </article>

      <article className="card">
        <div className="card-title"><h2>Mudar de plano</h2></div>
        <p className="section-help">Você pode subir ou descer de plano quando quiser.</p>

        <div className="planos-grid">
          {PLANOS.map(plano => {
            const ehOAtual = plano.id === atual.id

            return (
              <div className={ehOAtual ? 'plano-cartao atual' : 'plano-cartao'} key={plano.id}>
                {plano.destaque && <span className="plano-selo">{plano.destaque}</span>}

                <h3>{plano.nome}</h3>
                <p className="plano-chamada">{plano.chamada}</p>

                <div className="plano-preco">
                  <strong>{plano.preco === 0 ? 'R$ 0' : formatarMoeda(plano.preco)}</strong>
                  <span>/mês</span>
                </div>
                <small className="plano-observacao">{plano.observacao}</small>

                <button
                  className={ehOAtual ? 'btn secondary' : 'btn'}
                  onClick={() => trocar(plano)}
                  disabled={ehOAtual}
                >
                  {ehOAtual ? 'Plano atual' : plano.rotuloDoBotao}
                </button>

                <ul className="plano-recursos">
                  {plano.recursos.map(recurso => (
                    <li key={recurso}>
                      <Icone nome="check" className="ui-icon" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </article>
    </>
  )
}
