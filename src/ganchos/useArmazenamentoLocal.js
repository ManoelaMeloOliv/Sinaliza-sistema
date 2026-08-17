import { useEffect, useState } from 'react'

// O prefixo "use" e exigido pelo React (regras de hooks e React Compiler).
//
// "migrar" recebe o que estava salvo e devolve no formato atual. Serve para
// quando o formato dos dados muda e ja existe coisa gravada no navegador.
export function useArmazenamentoLocal(chave, valorInicial, migrar) {
  const [valor, definirValor] = useState(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(chave))
      if (guardado === null || guardado === undefined) return valorInicial
      return migrar ? migrar(guardado) : guardado
    } catch { return valorInicial }
  })

  useEffect(() => { localStorage.setItem(chave, JSON.stringify(valor)) }, [chave, valor])

  // O painel e a pagina publica costumam ficar abertos em abas diferentes.
  // Sem isto, uma aba nao enxerga o que a outra gravou ate ser recarregada.
  useEffect(() => {
    const aoMudarEmOutraAba = evento => {
      if (evento.key !== chave || evento.newValue === null) return
      try {
        const recebido = JSON.parse(evento.newValue)
        definirValor(migrar ? migrar(recebido) : recebido)
      } catch { /* valor corrompido: mantem o atual */ }
    }
    window.addEventListener('storage', aoMudarEmOutraAba)
    return () => window.removeEventListener('storage', aoMudarEmOutraAba)
  }, [chave, migrar])

  return [valor, definirValor]
}
