// As datas circulam pelo sistema como texto ISO ("2026-08-19").
// Texto evita os enganos de fuso horario que aparecem ao guardar objetos Date,
// e e o mesmo formato que o <input type="date"> usa.

const DIAS_CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

// O studio atende de terca (2) a sabado (6). Domingo e segunda sao fechados.
export const DIAS_DE_ATENDIMENTO = [2, 3, 4, 5, 6]
export const DIAS_DA_SEMANA_CURTOS = DIAS_CURTOS

export function paraData(iso) {
  const [ano, mes, dia] = String(iso).split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

export function paraIso(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

export function dataDeHoje() {
  return paraIso(new Date())
}

export function somarDias(iso, dias) {
  const data = paraData(iso)
  data.setDate(data.getDate() + dias)
  return paraIso(data)
}

export function diaDaSemana(iso) {
  return paraData(iso).getDay()
}

export function ehDiaDeAtendimento(iso) {
  return DIAS_DE_ATENDIMENTO.includes(diaDaSemana(iso))
}

export function ehPassado(iso) {
  return iso < dataDeHoje()
}

// Os cinco dias uteis (terca a sabado) da semana que contem a data informada.
// Domingo e segunda caem na semana seguinte, que e a util para quem agenda.
export function semanaDeTrabalho(iso) {
  const dia = diaDaSemana(iso)
  const ateTerca = dia <= 1 ? 2 - dia : -(dia - 2)
  const terca = somarDias(iso, ateTerca)
  return Array.from({ length: 5 }, (_, indice) => somarDias(terca, indice))
}

// Ex.: "TER 19"
export function rotuloDoDia(iso) {
  return `${DIAS_CURTOS[diaDaSemana(iso)]} ${paraData(iso).getDate()}`
}

// Ex.: "19 ago 2026"
export function dataCurta(iso) {
  return paraData(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Ex.: "Terça-feira, 19 de agosto"
export function dataPorExtenso(iso = dataDeHoje()) {
  const texto = paraData(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Ex.: "Agosto de 2026"
export function mesPorExtenso(iso) {
  const texto = paraData(iso).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Ex.: "19 — 23 de agosto de 2026"
export function rotuloDaSemana(dias) {
  const primeiro = paraData(dias[0])
  const ultimo = paraData(dias[dias.length - 1])
  const fim = ultimo.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  if (primeiro.getMonth() === ultimo.getMonth()) return `${primeiro.getDate()} — ${fim}`

  const inicio = primeiro.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
  return `${inicio} — ${fim}`
}

// Seis semanas de sete dias, alinhadas ao domingo, como todo calendario mensal.
// As casas fora do mes vem como null para o componente decidir o que fazer.
export function gradeDoMes(isoDoMes) {
  const referencia = paraData(isoDoMes)
  const ano = referencia.getFullYear()
  const mes = referencia.getMonth()

  const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay()
  const totalDeDias = new Date(ano, mes + 1, 0).getDate()

  return Array.from({ length: 42 }, (_, indice) => {
    const numero = indice - primeiroDiaDaSemana + 1
    if (numero < 1 || numero > totalDeDias) return null
    return paraIso(new Date(ano, mes, numero))
  })
}

export function somarMeses(iso, meses) {
  const data = paraData(iso)
  return paraIso(new Date(data.getFullYear(), data.getMonth() + meses, 1))
}
