import { useEffect } from 'react'
import { useArmazenamentoLocal } from './useArmazenamentoLocal'

// O tema vai no <html> porque as variaveis de cor moram em [data-theme=dark].
export function useTema() {
  const [tema, definirTema] = useArmazenamentoLocal('sinaliza-tema', 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = tema
  }, [tema])
  const alternarTema = () => definirTema(atual => (atual === 'dark' ? 'light' : 'dark'))
  return { tema, alternarTema }
}
