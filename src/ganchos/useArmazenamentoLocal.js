import { useEffect, useState } from 'react'

// O prefixo "use" e exigido pelo React (regras de hooks e React Compiler).
export function useArmazenamentoLocal(chave, valorInicial) {
  const [valor, definirValor] = useState(() => {
    try { return JSON.parse(localStorage.getItem(chave)) ?? valorInicial } catch { return valorInicial }
  })
  useEffect(() => { localStorage.setItem(chave, JSON.stringify(valor)) }, [chave, valor])
  return [valor, definirValor]
}
