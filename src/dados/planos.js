// Planos como estao na landing page. Mudou o preco ou o que cada um inclui?
// E so editar aqui: o painel inteiro le deste arquivo.

export const PLANOS = [
  {
    id: 'free',
    nome: 'Free',
    chamada: 'Pra tirar o caderno da jogada',
    preco: 0,
    precoAnual: 0,
    observacao: 'Pra sempre, sem cartão',
    rotuloDoBotao: 'Começar de graça',
    limites: { servicos: 3, agendamentosPorMes: 30 },
    liberado: [],
    recursos: [
      'Página de agendamento personalizada',
      'Agenda do dia e da semana',
      'Até 3 serviços e 30 agendamentos por mês',
      'Sinal manual, com a sua chave Pix',
    ],
  },
  {
    id: 'pro',
    nome: 'Pro',
    chamada: 'Pra quem cansou de tomar furo',
    preco: 49.9,
    precoAnual: 499,
    observacao: 'Ou R$ 499 no ano — 2 meses grátis',
    rotuloDoBotao: 'Testar 14 dias grátis',
    destaque: 'Mais escolhido',
    limites: { servicos: Infinity, agendamentosPorMes: Infinity },
    liberado: ['bloquearClientes'],
    recursos: [
      'Tudo do Free, sem limite de agendamentos',
      'Sinal no Pix com confirmação automática, 24h por dia',
      'Lembretes no WhatsApp 24h e 2h antes',
      'Repasse diário direto pra sua conta',
      'Painel financeiro e bloqueio de clientes',
    ],
  },
  {
    id: 'studio',
    nome: 'Studio',
    chamada: 'Pra quem vive 100% da agenda',
    preco: 89.9,
    precoAnual: 899,
    observacao: 'Ou R$ 899 no ano — 2 meses grátis',
    rotuloDoBotao: 'Testar 14 dias grátis',
    limites: { servicos: Infinity, agendamentosPorMes: Infinity },
    liberado: ['bloquearClientes', 'listaDeEspera', 'relatorioMensal'],
    recursos: [
      'Tudo do Pro',
      'Lista de espera automática',
      'Relatório mensal "quanto você recuperou"',
      'Lembretes saindo do seu próprio número',
      'Página com a sua cara: capa e cores',
    ],
  },
]

export const planoPorId = id => PLANOS.find(plano => plano.id === id) ?? PLANOS[0]

// Quanto do plano ja foi usado. So o Free tem teto; nos outros o limite e Infinity.
export function usoDoPlano({ plano, servicos, agendamentos, hoje }) {
  const mes = hoje.slice(0, 7)
  const doMes = agendamentos.filter(item => item.data.slice(0, 7) === mes && item.servico !== 'Bloqueio')

  const medir = (usado, limite) => ({
    usado,
    limite,
    ilimitado: limite === Infinity,
    percentual: limite === Infinity ? 0 : Math.min(Math.round((usado / limite) * 100), 100),
    estourou: usado >= limite,
  })

  return {
    servicos: medir(servicos.length, plano.limites.servicos),
    agendamentos: medir(doMes.length, plano.limites.agendamentosPorMes),
  }
}

// Nomes amigaveis para explicar o que falta quando o recurso e de outro plano.
export const RECURSOS = {
  bloquearClientes: { nome: 'Bloquear clientes', plano: 'Pro' },
  listaDeEspera: { nome: 'Lista de espera', plano: 'Studio' },
  relatorioMensal: { nome: 'Relatório mensal', plano: 'Studio' },
}

export const planoInclui = (plano, recurso) => (plano.liberado ?? []).includes(recurso)

// Qual e o plano mais barato que tem esse recurso.
export function planoQueInclui(recurso) {
  return PLANOS.find(plano => (plano.liberado ?? []).includes(recurso))
}
