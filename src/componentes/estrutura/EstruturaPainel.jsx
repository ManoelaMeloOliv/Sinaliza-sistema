import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BarraLateral } from './BarraLateral'
import { BarraSuperior } from './BarraSuperior'
import { Aviso } from '../interface/Aviso'
import { useTema } from '../../ganchos/useTema'
import { useTutorial } from '../../ganchos/useTutorial'
import { Tutorial } from '../interface/Tutorial'
import { useArmazenamentoLocal } from '../../ganchos/useArmazenamentoLocal'

const LARGURA_MOBILE = 760

export function EstruturaPainel() {
  // No celular o menu abre por cima; no computador ele recolhe para so mostrar os icones.
  const [menuAberto, definirMenuAberto] = useState(false)
  const [recolhida, definirRecolhida] = useArmazenamentoLocal('sinaliza-barra-lateral', false)
  const { tema, alternarTema } = useTema()
  const tutorial = useTutorial()

  const alternarMenu = () => {
    if (window.innerWidth <= LARGURA_MOBILE) definirMenuAberto(valor => !valor)
    else definirRecolhida(valor => !valor)
  }

  return (
    <>
      <div className={recolhida ? 'app sidebar-collapsed' : 'app'}>
        <BarraLateral aberta={menuAberto} aoNavegar={() => definirMenuAberto(false)} />

        <button
          className={menuAberto ? 'sidebar-backdrop open' : 'sidebar-backdrop'}
          onClick={() => definirMenuAberto(false)}
          aria-label="Fechar menu"
        />

        <main className="main">
          <BarraSuperior
            tema={tema}
            aoAlternarTema={alternarTema}
            aoAlternarMenu={alternarMenu}
            menuExpandido={!recolhida}
          />
          <div className="content">
            <Outlet />
          </div>
        </main>
      </div>

      <Aviso />

      {tutorial.mostrando && <Tutorial aoFechar={tutorial.fechar} />}
    </>
  )
}
