import { useArmazenamentoLocal } from './useArmazenamentoLocal'

// O tutorial aparece uma vez. Depois so volta se a usuaria pedir em Configuracoes.
export function useTutorial() {
  const [jaViu, definirJaViu] = useArmazenamentoLocal('sinaliza-tutorial-visto', false)

  return {
    mostrando: !jaViu,
    fechar: () => definirJaViu(true),
    verDeNovo: () => definirJaViu(false),
  }
}
