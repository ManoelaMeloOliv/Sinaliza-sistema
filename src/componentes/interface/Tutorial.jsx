import { useCallback, useEffect, useState } from 'react'
import { PASSOS } from '../../dados/passosDoTutorial'

const MARGEM = 10       // respiro entre o destaque e o balao
const LARGURA_BALAO = 320

// Onde o balao cabe sem sair da tela: embaixo do alvo se houver espaco,
// senao em cima; e sempre dentro das bordas na horizontal.
function posicaoDoBalao(area) {
  if (!area) return null

  const alturaEstimada = 190
  const cabeEmbaixo = area.bottom + MARGEM + alturaEstimada < window.innerHeight

  const topo = cabeEmbaixo
    ? area.bottom + MARGEM
    : Math.max(MARGEM, area.top - alturaEstimada - MARGEM)

  const centro = area.left + area.width / 2 - LARGURA_BALAO / 2
  const esquerda = Math.min(
    Math.max(MARGEM, centro),
    window.innerWidth - LARGURA_BALAO - MARGEM,
  )

  return { top: topo, left: esquerda }
}

function areaDoAlvo(alvo) {
  if (!alvo) return null
  const elemento = document.querySelector(`[data-tutorial="${alvo}"]`)
  if (!elemento) return null

  const area = elemento.getBoundingClientRect()
  if (area.width === 0 || area.height === 0) return null // escondido (celular)
  return area
}

export function Tutorial({ aoFechar }) {
  const [indice, definirIndice] = useState(0)
  const [area, definirArea] = useState(null)

  const passo = PASSOS[indice]

  // Recalcula quando muda de passo, ao rolar e ao redimensionar.
  const medir = useCallback(() => {
    definirArea(areaDoAlvo(passo?.alvo))
  }, [passo])

  useEffect(() => {
    // Medir depois da pintura: o elemento ja esta no lugar final e evita
    // atualizar estado no meio do efeito.
    const quadro = requestAnimationFrame(medir)

    window.addEventListener('resize', medir)
    window.addEventListener('scroll', medir, true)

    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('resize', medir)
      window.removeEventListener('scroll', medir, true)
    }
  }, [medir])

  useEffect(() => {
    const aoTeclar = evento => {
      if (evento.key === 'Escape') aoFechar()
      if (evento.key === 'ArrowRight') definirIndice(atual => Math.min(atual + 1, PASSOS.length - 1))
      if (evento.key === 'ArrowLeft') definirIndice(atual => Math.max(atual - 1, 0))
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aoFechar])

  if (!passo) return null

  const ultimo = indice === PASSOS.length - 1
  const posicao = posicaoDoBalao(area)

  return (
    <div className="tutorial" role="dialog" aria-label="Tutorial da plataforma">
      {/* O recorte: uma caixa vazia com sombra gigante escurece todo o resto. */}
      {area ? (
        <div
          className="tutorial-foco"
          style={{
            top: area.top - 6,
            left: area.left - 6,
            width: area.width + 12,
            height: area.height + 12,
          }}
        />
      ) : (
        <div className="tutorial-fundo" />
      )}

      <div
        className={posicao ? 'tutorial-balao' : 'tutorial-balao centralizado'}
        style={posicao ?? undefined}
      >
        <div className="tutorial-topo">
          <span>Passo {indice + 1} de {PASSOS.length}</span>
          <button type="button" onClick={aoFechar}>Sair do tutorial</button>
        </div>

        <h3>{passo.titulo}</h3>
        <p>{passo.texto}</p>

        <div className="tutorial-pontos" aria-hidden="true">
          {PASSOS.map((item, i) => (
            <i key={item.id} className={i === indice ? 'atual' : undefined} />
          ))}
        </div>

        <div className="tutorial-acoes">
          {indice > 0 && (
            <button type="button" className="btn secondary" onClick={() => definirIndice(indice - 1)}>
              Voltar
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => (ultimo ? aoFechar() : definirIndice(indice + 1))}
          >
            {ultimo ? 'Começar a usar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  )
}
