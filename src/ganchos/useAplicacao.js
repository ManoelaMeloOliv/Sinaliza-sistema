import { useContext } from 'react'
import { ContextoAplicacao } from '../contexto/contextoAplicacao'

// O prefixo "use" e exigido pelo React (regras de hooks e React Compiler).
export function useAplicacao() {
  const valor = useContext(ContextoAplicacao)
  if (!valor) throw new Error('useAplicacao deve ser usado dentro de ProvedorAplicacao')
  return valor
}
