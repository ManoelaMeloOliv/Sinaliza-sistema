export const PERCENTUAL_SINAL = 0.3

export const calcularSinal = preco => Math.round((Number(preco) || 0) * PERCENTUAL_SINAL)

export const precoDoServico = (servicos, nomeDoServico) =>
  servicos.find(servico => servico.nome === nomeDoServico)?.preco ?? 0
