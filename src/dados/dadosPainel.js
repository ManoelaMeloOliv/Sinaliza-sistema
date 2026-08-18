// O que sobrou de fixo no painel. Os numeros (faturamento, ocupacao, ranking,
// financeiro) sao calculados em utilitarios/metricas.js a partir dos
// agendamentos reais.

// Faixas de horario que a agenda exibe nas visoes de semana e de dia.
export const HORARIOS_DA_GRADE = ['09:00', '11:30', '14:00', '16:30']
export const HORARIOS_DO_DIA = ['09:00', '10:00', '11:30', '13:00', '14:00', '16:30', '18:00']

// Texto do expediente mostrado em Configuracoes. As regras que o sistema
// aplica de fato estao em utilitarios/regras.js (EXPEDIENTE).
export const DISPONIBILIDADE_SEMANAL = [
  { periodo: 'Terça a sexta', detalhe: '09:00 às 19:00 · intervalo 12:00 às 13:00' },
  { periodo: 'Sábado', detalhe: '09:00 às 17:00' },
  { periodo: 'Domingo e segunda', detalhe: 'Indisponível' },
]
