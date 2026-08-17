// Numeros fixos da demonstracao do painel. Nao sao editaveis pelo usuario,
// por isso ficam separados dos dados que vao para o localStorage.

export const FATURAMENTO_SEMANAL = [
  { dia: 'SEG', altura: 42 },
  { dia: 'TER', altura: 62 },
  { dia: 'QUA', altura: 48 },
  { dia: 'QUI', altura: 85 },
  { dia: 'SEX', altura: 70 },
  { dia: 'SÁB', altura: 94 },
  { dia: 'DOM', altura: 22 },
]

export const SERVICOS_MAIS_AGENDADOS = [
  { nome: 'Volume russo', percentual: 42 },
  { nome: 'Manutenção', percentual: 31 },
  { nome: 'Fio a fio', percentual: 19 },
  { nome: 'Outros', percentual: 8 },
]

export const ATIVIDADE_RECENTE = [
  { icone: '✓', titulo: 'Pix de Ana confirmado', detalhe: 'R$ 54,00 · há 12 minutos' },
  { icone: '↗', titulo: 'Repasse enviado', detalhe: 'R$ 216,00 · hoje às 09:00' },
  { icone: '+', titulo: 'Novo agendamento', detalhe: 'Marina Lima · há 1 hora' },
]

export const OCUPACAO = {
  ocupados: 26,
  total: 33,
  observacao: '7 horários ainda disponíveis nesta semana.',
  tendencia: '+9% sobre a semana anterior',
}

export const RESUMO_DA_AGENDA = [
  { rotulo: 'Agendamentos na semana', valor: '26' },
  { rotulo: 'Confirmados', valor: '22' },
  { rotulo: 'Aguardando sinal', valor: '3' },
  { rotulo: 'Horários livres', valor: '7' },
]

export const ENTRADAS_POR_SEMANA = [
  { rotulo: 'SEM 1', altura: 42 },
  { rotulo: 'SEM 2', altura: 68 },
  { rotulo: 'SEM 3', altura: 55 },
  { rotulo: 'SEM 4', altura: 88 },
  { rotulo: 'SEM 5', altura: 72 },
]

export const COMPOSICAO_DOS_RECEBIMENTOS = [
  { nome: 'Volume russo', valor: 'R$ 612,00' },
  { nome: 'Manutenção', valor: 'R$ 432,00' },
  { nome: 'Fio a fio', valor: 'R$ 324,00' },
  { nome: 'Outros serviços', valor: 'R$ 90,00' },
  { nome: 'Taxa do provedor', valor: '− R$ 18,74' },
]

export const MOVIMENTACOES = [
  { data: 'Hoje, 10:42', descricao: 'Ana Souza · Volume russo', identificador: 'PIX-8F2A19', valor: 'R$ 54,00', situacao: 'Recebido' },
  { data: 'Hoje, 09:15', descricao: 'Marina Lima · Manutenção', identificador: 'PIX-7D411C', valor: 'R$ 36,00', situacao: 'Recebido' },
  { data: 'Ontem, 17:30', descricao: 'Repasse diário · Nubank final 4821', identificador: 'REP-1098', valor: '− R$ 216,00', situacao: 'Repassado' },
  { data: '08 ago, 14:20', descricao: 'Bia Martins · Fio a fio', identificador: 'PIX-38BC20', valor: 'R$ 45,00', situacao: 'Recebido' },
]

export const INDICADORES_DO_FINANCEIRO = [
  { rotulo: 'Recebido em sinais', valor: 'R$ 1.458', detalhe: '38 pagamentos confirmados', largura: 82, cor: '' },
  { rotulo: 'Já repassado', valor: 'R$ 1.284', detalhe: 'Direto para sua conta', largura: 72, cor: '#12b981' },
  { rotulo: 'Próximo repasse', valor: 'R$ 174', detalhe: 'Amanhã até 18h', largura: 38, cor: '#ff6b5c' },
]

export const DISPONIBILIDADE_SEMANAL = [
  { periodo: 'Terça a sexta', detalhe: '09:00 às 19:00 · intervalo 12:00 às 13:00' },
  { periodo: 'Sábado', detalhe: '09:00 às 17:00' },
  { periodo: 'Domingo e segunda', detalhe: 'Indisponível' },
]

// Faixas de horario que a agenda exibe. Os dias vem das datas reais.
export const HORARIOS_DA_GRADE = ['09:00', '11:30', '14:00', '16:30']
export const HORARIOS_DO_DIA = ['09:00', '10:00', '11:30', '13:00', '14:00', '16:30', '18:00']
