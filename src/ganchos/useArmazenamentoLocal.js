import { useEffect, useState } from 'react'

// O prefixo "use" e exigido pelo React (regras de hooks e React Compiler).
export function useArmazenamentoLocal(chave, valorInicial) {
  const [valor, definirValor] = useState(() => {
    try { return JSON.parse(localStorage.getItem(chave)) ?? valorInicial } catch { return valorInicial }
  })

  useEffect(() => { localStorage.setItem(chave, JSON.stringify(valor)) }, [chave, valor])

  // O painel e a pagina publica costumam ficar abertos em abas diferentes.
  // Sem isto, uma aba nao enxerga o que a outra gravou ate ser recarregada.
  useEffect(() => {
    const aoMudarEmOutraAba = evento => {
      if (evento.key !== chave || evento.newValue === null) return
      try { definirValor(JSON.parse(evento.newValue)) } catch { /* valor corrompido: mantem o atual */ }
    }
    window.addEventListener('storage', aoMudarEmOutraAba)
    return () => window.removeEventListener('storage', aoMudarEmOutraAba)
  }, [chave])

  return [valor, definirValor]
}
