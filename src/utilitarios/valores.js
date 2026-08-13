export const PERCENTUAL_SINAL = 0.3

export const SINAL_PERCENTUAL = '30% do serviço'
export const SINAL_FIXO = 'Valor fixo'
export const SINAL_NENHUM = 'Sem sinal'

export const TIPOS_DE_SINAL = [SINAL_PERCENTUAL, SINAL_FIXO, SINAL_NENHUM]

// Cada servico pode ter sua propria regra de sinal. Quando ele nao define nada,
// vale o padrao do negocio (Configuracoes > Pagamentos).
export function regraDeSinal(servico, configuracoes) {
  return {
    tipo: servico?.tipoDeSinal ?? configuracoes?.sinalPadrao ?? SINAL_PERCENTUAL,
    valorFixo: servico?.valorDoSinal ?? configuracoes?.valorDoSinalPadrao ?? 0,
  }
}

// O sinal nunca passa do preco do servico, senao o restante ficaria negativo.
export function calcularSinal(preco, regra) {
  const valor = Number(preco) || 0
  const tipo = regra?.tipo ?? SINAL_PERCENTUAL

  if (tipo === SINAL_NENHUM) return 0
  if (tipo === SINAL_FIXO) return Math.min(Number(regra?.valorFixo) || 0, valor)
  return Math.round(valor * PERCENTUAL_SINAL)
}

export function rotuloDoSinal(regra) {
  const tipo = regra?.tipo ?? SINAL_PERCENTUAL

  if (tipo === SINAL_NENHUM) return 'Sem sinal'
  if (tipo === SINAL_FIXO) return 'Sinal fixo'
  return `Sinal de ${PERCENTUAL_SINAL * 100}%`
}

export const servicoPorNome = (servicos, nome) =>
  servicos.find(servico => servico.nome === nome)

export const precoDoServico = (servicos, nomeDoServico) =>
  servicoPorNome(servicos, nomeDoServico)?.preco ?? 0
