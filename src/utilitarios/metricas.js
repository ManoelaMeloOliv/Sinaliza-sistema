// Numeros do painel calculados a partir dos agendamentos reais.
// Antes eram valores fixos no codigo, que nao correspondiam ao negocio.

import { dataCurta, dataDeHoje, ehDiaDeAtendimento, semanaDeTrabalho, somarDias } from './datas'
import { calcularSinal, precoDoServico, regraDeSinal, servicoPorNome } from './valores'
import { duracaoEmMinutos, expedienteDoDia, horarioEmMinutos, PASSO_DA_GRADE } from './regras'

const PAGO = 'Pago'

export const ehBloqueio = agendamento => agendamento.servico === 'Bloqueio'

function valorDoAgendamento(agendamento, servicos) {
  return agendamento.preco ?? precoDoServico(servicos, agendamento.servico)
}

export function sinalDoAgendamento(agendamento, servicos, configuracoes) {
  if (agendamento.situacao === 'Não cobrar') return 0
  const servico = servicoPorNome(servicos, agendamento.servico)
  return calcularSinal(valorDoAgendamento(agendamento, servicos), regraDeSinal(servico, configuracoes))
}

const doMes = (agendamentos, mes) => agendamentos.filter(item => item.data.slice(0, 7) === mes)

export function resumoDoMes(agendamentos, servicos, configuracoes, hoje = dataDeHoje()) {
  const mes = hoje.slice(0, 7)
  const atendimentos = doMes(agendamentos, mes).filter(item => !ehBloqueio(item))
  const pagos = atendimentos.filter(item => item.situacao === PAGO)

  const faturamento = atendimentos.reduce((soma, item) => soma + valorDoAgendamento(item, servicos), 0)
  const sinais = pagos.reduce((soma, item) => soma + sinalDoAgendamento(item, servicos, configuracoes), 0)

  // O sinal ja pago de horarios que ainda vao acontecer e o que protege a agenda.
  const protegidos = pagos.filter(item => item.data >= hoje)
  const protegido = protegidos.reduce((soma, item) => soma + sinalDoAgendamento(item, servicos, configuracoes), 0)

  return {
    faturamento,
    sinais,
    protegido,
    horariosProtegidos: protegidos.length,
    agendamentos: atendimentos.length,
    aguardando: atendimentos.filter(item => item.situacao === 'Aguardando').length,
  }
}

// Faturamento de cada um dos ultimos sete dias, em percentual do maior deles,
// que e o que o grafico de barras precisa.
export function faturamentoDaSemana(agendamentos, servicos, hoje = dataDeHoje()) {
  const dias = Array.from({ length: 7 }, (_, indice) => somarDias(hoje, indice - 6))

  const valores = dias.map(data => ({
    data,
    total: agendamentos
      .filter(item => item.data === data && !ehBloqueio(item))
      .reduce((soma, item) => soma + valorDoAgendamento(item, servicos), 0),
  }))

  const maior = Math.max(...valores.map(item => item.total), 1)

  return valores.map(item => ({
    ...item,
    altura: Math.round((item.total / maior) * 100),
  }))
}

// Quantos encaixes de 30 minutos existem na semana e quantos ja estao tomados.
export function ocupacaoDaSemana(agendamentos, servicos, hoje = dataDeHoje(), configuracoes = {}) {
  const dias = semanaDeTrabalho(hoje)

  let total = 0
  dias.filter(ehDiaDeAtendimento).forEach(data => {
    const expediente = expedienteDoDia(data, configuracoes.expediente)
    if (!expediente) return
    const minutos = horarioEmMinutos(expediente.fecha) - horarioEmMinutos(expediente.abre)
    const almoco = expediente.intervalo
      ? horarioEmMinutos(expediente.intervalo.fim) - horarioEmMinutos(expediente.intervalo.inicio)
      : 0
    total += Math.floor((minutos - almoco) / PASSO_DA_GRADE)
  })

  const ocupados = agendamentos
    .filter(item => dias.includes(item.data))
    .reduce((soma, item) => {
      const servico = servicoPorNome(servicos, item.servico)
      return soma + Math.ceil(duracaoEmMinutos(servico?.duracao) / PASSO_DA_GRADE)
    }, 0)

  return { ocupados: Math.min(ocupados, total), total, livres: Math.max(total - ocupados, 0) }
}

// Ranking dos servicos por quantidade de agendamentos, em percentual.
export function servicosMaisAgendados(agendamentos, limite = 4) {
  const contagem = new Map()
  agendamentos.filter(item => !ehBloqueio(item)).forEach(item => {
    contagem.set(item.servico, (contagem.get(item.servico) ?? 0) + 1)
  })

  const total = [...contagem.values()].reduce((soma, valor) => soma + valor, 0)
  if (!total) return []

  const ordenados = [...contagem.entries()].sort((a, b) => b[1] - a[1])
  const principais = ordenados.slice(0, limite - 1)
  const resto = ordenados.slice(limite - 1).reduce((soma, [, valor]) => soma + valor, 0)

  const linhas = principais.map(([nome, quantidade]) => ({
    nome,
    percentual: Math.round((quantidade / total) * 100),
  }))

  if (resto > 0) linhas.push({ nome: 'Outros', percentual: Math.round((resto / total) * 100) })
  return linhas
}

// Os ultimos movimentos da agenda, para a coluna "Atividade recente".
export function atividadeRecente(agendamentos, servicos, configuracoes, limite = 3) {
  return agendamentos
    .filter(item => !ehBloqueio(item))
    .slice()
    .sort((a, b) => b.data.localeCompare(a.data) || b.horario.localeCompare(a.horario))
    .slice(0, limite)
    .map(item => {
      const sinal = sinalDoAgendamento(item, servicos, configuracoes)
      const pago = item.situacao === PAGO

      return {
        id: item.id,
        icone: pago ? 'check' : 'mais',
        titulo: pago ? `Sinal de ${item.cliente} confirmado` : `${item.cliente} aguardando sinal`,
        valor: sinal,
        detalhe: `${item.servico} · ${dataCurta(item.data)} às ${item.horario}`,
      }
    })
}

export function resumoDeClientes(clientes, agendamentos, hoje = dataDeHoje()) {
  const mes = hoje.slice(0, 7)
  const nomesDoMes = new Set(doMes(agendamentos, mes).filter(item => !ehBloqueio(item)).map(item => item.cliente))

  const comRetorno = clientes.filter(cliente => (cliente.agendamentos ?? 0) > 1).length

  return {
    total: clientes.length,
    novasNoMes: clientes.filter(cliente => nomesDoMes.has(cliente.nome) && (cliente.agendamentos ?? 0) <= 1).length,
    taxaDeRetorno: clientes.length ? Math.round((comRetorno / clientes.length) * 100) : 0,
    pendentes: clientes.filter(cliente => cliente.situacao === 'Pendente').length,
  }
}

// Quanto os horarios ainda livres da semana renderiam se todos fossem vendidos.
export function receitaPotencial(servicos, agendamentos, hoje = dataDeHoje()) {
  const publicados = servicos.filter(servico => servico.publicado)
  if (!publicados.length) return 0

  const media = publicados.reduce((soma, servico) => soma + servico.preco, 0) / publicados.length
  const mediaDeEncaixes =
    publicados.reduce((soma, servico) => soma + duracaoEmMinutos(servico.duracao), 0) / publicados.length / PASSO_DA_GRADE

  const { livres } = ocupacaoDaSemana(agendamentos, servicos, hoje)
  return Math.round((livres / Math.max(mediaDeEncaixes, 1)) * media)
}

// --- financeiro ---------------------------------------------------------

export function movimentacoes(agendamentos, servicos, configuracoes, hoje = dataDeHoje()) {
  return agendamentos
    .filter(item => !ehBloqueio(item))
    .filter(item => item.data <= hoje)
    .sort((a, b) => b.data.localeCompare(a.data) || b.horario.localeCompare(a.horario))
    .map(item => ({
      id: item.id,
      data: item.data,
      horario: item.horario,
      descricao: `${item.cliente} · ${item.servico}`,
      valor: sinalDoAgendamento(item, servicos, configuracoes),
      situacao: item.situacao === PAGO ? 'Recebido' : 'Aguardando',
    }))
}

export function resumoFinanceiro(agendamentos, servicos, configuracoes, hoje = dataDeHoje()) {
  const atendimentos = agendamentos.filter(item => !ehBloqueio(item))
  const pagos = atendimentos.filter(item => item.situacao === PAGO)

  const recebido = pagos.reduce((soma, item) => soma + sinalDoAgendamento(item, servicos, configuracoes), 0)
  const repassado = pagos
    .filter(item => item.data < hoje)
    .reduce((soma, item) => soma + sinalDoAgendamento(item, servicos, configuracoes), 0)

  const aguardando = atendimentos
    .filter(item => item.situacao === 'Aguardando')
    .reduce((soma, item) => soma + sinalDoAgendamento(item, servicos, configuracoes), 0)

  return {
    recebido,
    repassado,
    aReceber: recebido - repassado,
    aguardando,
    pagamentos: pagos.length,
    emEspera: atendimentos.length - pagos.length,
  }
}

// Quanto cada servico trouxe em sinais.
export function composicaoDosRecebimentos(agendamentos, servicos, configuracoes) {
  const porServico = new Map()

  agendamentos
    .filter(item => !ehBloqueio(item) && item.situacao === PAGO)
    .forEach(item => {
      const valor = sinalDoAgendamento(item, servicos, configuracoes)
      porServico.set(item.servico, (porServico.get(item.servico) ?? 0) + valor)
    })

  return [...porServico.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([nome, valor]) => ({ nome, valor }))
}
