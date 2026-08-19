// Traduz o que a usuaria escolhe em Configuracoes para numeros que o sistema usa,
// e decide quais horarios podem ser oferecidos num dia.

import { diaDaSemana, paraData } from './datas'

// --- conversoes ---------------------------------------------------------

// "2h", "1h30", "40min" -> minutos
export function duracaoEmMinutos(duracao) {
  const texto = String(duracao ?? '').trim()
  const horas = texto.match(/(\d+)\s*h/)
  const minutos = texto.match(/(\d+)\s*min/) ?? (horas ? texto.match(/h\s*(\d+)/) : null)
  const total = (horas ? Number(horas[1]) * 60 : 0) + (minutos ? Number(minutos[1]) : 0)
  return total || 60
}

// "09:30" -> 570
export function horarioEmMinutos(horario) {
  const [hora, minuto] = String(horario).split(':').map(Number)
  return hora * 60 + (minuto || 0)
}

export function minutosEmHorario(minutos) {
  const hora = String(Math.floor(minutos / 60)).padStart(2, '0')
  const minuto = String(minutos % 60).padStart(2, '0')
  return `${hora}:${minuto}`
}

// "2 horas", "1 dia", "30 minutos", "Sem intervalo" -> minutos
export function periodoEmMinutos(texto) {
  const valor = String(texto ?? '')
  const numero = Number(valor.match(/\d+/)?.[0] ?? 0)
  if (/dia/i.test(valor)) return numero * 24 * 60
  if (/hora/i.test(valor)) return numero * 60
  if (/minuto/i.test(valor)) return numero
  return 0
}

export function periodoEmDias(texto) {
  return Number(String(texto ?? '').match(/\d+/)?.[0] ?? 0)
}

// --- expediente ---------------------------------------------------------

// Indexado pelo dia da semana (0 = domingo). null significa fechado.
export const EXPEDIENTE = {
  0: null,
  1: null,
  2: { abre: '09:00', fecha: '19:00', intervalo: { inicio: '12:00', fim: '13:00' } },
  3: { abre: '09:00', fecha: '19:00', intervalo: { inicio: '12:00', fim: '13:00' } },
  4: { abre: '09:00', fecha: '19:00', intervalo: { inicio: '12:00', fim: '13:00' } },
  5: { abre: '09:00', fecha: '19:00', intervalo: { inicio: '12:00', fim: '13:00' } },
  6: { abre: '09:00', fecha: '17:00', intervalo: null },
}

export const PASSO_DA_GRADE = 30 // de quanto em quanto tempo um horario pode comecar

// O expediente pode ser editado em Configuracoes; sem isso vale o padrao.
export function expedienteDoDia(data, expedientes = EXPEDIENTE) {
  return expedientes[diaDaSemana(data)] ?? null
}

// --- disponibilidade ----------------------------------------------------

function ocupaIntervalo(inicioA, fimA, inicioB, fimB) {
  return inicioA < fimB && inicioB < fimA
}

// Minutos ja tomados no dia, considerando a duracao de cada servico
// e o intervalo de descanso configurado entre atendimentos.
function faixasOcupadas(agendamentosDoDia, servicos, minutosDeIntervalo, ignorarId) {
  return agendamentosDoDia
    .filter(item => item.id !== ignorarId)
    .filter(item => item.situacao !== 'Cancelado') // cancelado libera a vaga
    .map(item => {
      const servico = servicos.find(s => s.nome === item.servico)
      const inicio = horarioEmMinutos(item.horario)
      const duracao = servico ? duracaoEmMinutos(servico.duracao) : 60
      return { inicio, fim: inicio + duracao + minutosDeIntervalo }
    })
}

/**
 * Horarios em que um servico cabe num dia, respeitando expediente, almoco,
 * agendamentos existentes e as regras de antecedencia definidas pela usuaria.
 */
export function horariosDisponiveis({
  data,
  servico,
  agendamentos = [],
  servicos = [],
  configuracoes = {},
  agora = new Date(),
  ignorarId = null,
}) {
  const expediente = expedienteDoDia(data, configuracoes.expediente)
  if (!expediente) return []

  const duracao = duracaoEmMinutos(servico?.duracao)
  const intervalo = periodoEmMinutos(configuracoes.intervaloEntreServicos)
  const antecedencia = periodoEmMinutos(configuracoes.antecedenciaMinima)

  const abre = horarioEmMinutos(expediente.abre)
  const fecha = horarioEmMinutos(expediente.fecha)

  const almoco = expediente.intervalo
    ? { inicio: horarioEmMinutos(expediente.intervalo.inicio), fim: horarioEmMinutos(expediente.intervalo.fim) }
    : null

  const ocupadas = faixasOcupadas(
    agendamentos.filter(item => item.data === data),
    servicos,
    intervalo,
    ignorarId,
  )

  // Quanto falta, em minutos, entre agora e a meia-noite do dia consultado.
  const inicioDoDia = paraData(data).getTime()
  const minutosDesdeAgora = Math.round((agora.getTime() - inicioDoDia) / 60000)

  const livres = []
  for (let inicio = abre; inicio + duracao <= fecha; inicio += PASSO_DA_GRADE) {
    const fim = inicio + duracao

    if (almoco && ocupaIntervalo(inicio, fim, almoco.inicio, almoco.fim)) continue
    if (ocupadas.some(faixa => ocupaIntervalo(inicio, fim, faixa.inicio, faixa.fim))) continue
    if (inicio - minutosDesdeAgora < antecedencia) continue

    livres.push(minutosEmHorario(inicio))
  }

  return livres
}

// A data esta dentro da janela que a usuaria aceita receber agendamentos?
export function dentroDaJanela(data, hoje, configuracoes = {}) {
  const dias = periodoEmDias(configuracoes.janelaMaxima) || 60
  const limite = paraData(hoje)
  limite.setDate(limite.getDate() + dias)
  return paraData(data) <= limite
}

// Um horario novo conflita com o que ja existe naquele dia?
export function existeConflito({ data, horario, servico, agendamentos, servicos, configuracoes = {}, ignorarId = null }) {
  const inicio = horarioEmMinutos(horario)
  const fim = inicio + duracaoEmMinutos(servico?.duracao)
  const intervalo = periodoEmMinutos(configuracoes.intervaloEntreServicos)

  return faixasOcupadas(
    agendamentos.filter(item => item.data === data),
    servicos,
    intervalo,
    ignorarId,
  ).some(faixa => ocupaIntervalo(inicio, fim, faixa.inicio, faixa.fim))
}
