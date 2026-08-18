import { dataDeHoje, semanaDeTrabalho } from '../utilitarios/datas'
import { EXPEDIENTE as EXPEDIENTE_PADRAO } from '../utilitarios/regras'

// Dados de demonstracao que o usuario edita pelo painel. Ficam salvos no localStorage.

// A demonstracao sempre nasce na semana atual, para a agenda nunca parecer vazia.
const SEMANA = semanaDeTrabalho(dataDeHoje())

export const servicosIniciais = [
  { id: 's1', nome: 'Volume russo', duracao: '2h', preco: 180, publicado: true, icone: 'estrela' },
  { id: 's2', nome: 'Manutenção', duracao: '1h30', preco: 120, publicado: true, icone: 'recarregar' },
  { id: 's3', nome: 'Fio a fio', duracao: '1h45', preco: 150, publicado: true, icone: 'brilho' },
  { id: 's4', nome: 'Remoção', duracao: '40min', preco: 45, publicado: true, icone: 'xis' },
]

export const agendamentosIniciais = [
  { id: 'a1', data: SEMANA[0], horario: '09:00', cliente: 'Marina Lima', servico: 'Manutenção', situacao: 'Pago' },
  { id: 'a2', data: SEMANA[0], horario: '11:30', cliente: 'Bia Martins', servico: 'Fio a fio', situacao: 'Pago' },
  { id: 'a3', data: SEMANA[1], horario: '14:00', cliente: 'Ana Souza', servico: 'Volume russo', situacao: 'Pago' },
  { id: 'a4', data: SEMANA[2], horario: '16:30', cliente: 'Luiza Rocha', servico: 'Manutenção', situacao: 'Aguardando' },
]

// Ate aqui os agendamentos guardavam "dia" (0 a 4), um indice numa semana fixa
// cravada no codigo. Quem ja tem dados salvos passa a ter data de verdade.
export function migrarAgendamentos(guardados) {
  if (!Array.isArray(guardados)) return agendamentosIniciais

  return guardados.map(agendamento => {
    if (agendamento.data) return agendamento
    const { dia, ...resto } = agendamento
    const indice = Math.min(Math.max(Number(dia) || 0, 0), SEMANA.length - 1)
    return { ...resto, data: SEMANA[indice] }
  })
}

export const clientesIniciais = [
  { id: 'c1', nome: 'Ana Souza', telefone: '(48) 99912-3456', ultimoServico: 'Volume russo', agendamentos: 8, situacao: 'Ativa' },
  { id: 'c2', nome: 'Marina Lima', telefone: '(48) 99102-8890', ultimoServico: 'Manutenção', agendamentos: 12, situacao: 'Ativa' },
  { id: 'c3', nome: 'Bia Martins', telefone: '(48) 98821-3301', ultimoServico: 'Fio a fio', agendamentos: 4, situacao: 'Ativa' },
  { id: 'c4', nome: 'Luiza Rocha', telefone: '(48) 99771-2040', ultimoServico: 'Manutenção', agendamentos: 2, situacao: 'Pendente' },
]

// Identidade visual aplicada na pagina publica, editavel em Configuracoes > Identidade visual.
export const marcaInicial = {
  nome: 'Studio da Ju',
  subtitulo: 'Extensão de cílios · Florianópolis, SC',
  descricao: 'Realce seu olhar com atendimento especializado.',
  corPrincipal: '#6938ef',
  corDestaque: '#ef6b7b',
  corFundo: '#f6f5fa',
  corTexto: '#201b2a',
  arredondamento: '9px',
  estiloCabecalho: 'gradient',
  tipografia: 'jakarta',
  formatoLogo: 'rounded',
  estiloCartoes: 'soft',
  largura: 'wide',
  mostrarLocalizacao: true,
  mostrarVerificado: true,
  mostrarPoliticas: true,
  mostrarAssinatura: true,
  logo: '',
  capa: '',
}

export const perfilInicial = {
  nomeDoEspaco: 'Studio da Ju',
  especialidade: 'Extensão de cílios',
  descricao: 'Atendimento especializado em extensão e manutenção de cílios.',
  linkPublico: 'usesinaliza.com.br/studiodaju',
  endereco: 'Rua das Flores, 142 · Florianópolis, SC',
  telefone: '(48) 99912-3456',
  fusoHorario: 'Brasília (GMT−3)',
  profissional: 'Juliana Silva',
}

export const configuracoesIniciais = {
  plano: 'free',
  expediente: EXPEDIENTE_PADRAO,
  antecedenciaMinima: '2 horas',
  janelaMaxima: '60 dias',
  intervaloEntreServicos: '15 minutos',
  remarcacoesPermitidas: '1 remarcação',
  sinalPadrao: '30% do serviço',
  valorDoSinalPadrao: 50, // usado quando o sinal padrao e "Valor fixo"
  validadeDoPix: '15 minutos',
  cancelamentoComReembolso: 'Até 24 horas antes',
  contaDeRepasse: 'Nubank · final 4821',
  emailDeAcesso: 'ju@studiodaju.com.br',
  avisos: {
    confirmacao: true,
    lembrete24h: true,
    lembrete2h: true,
    avaliacao: false,
  },
  verificacaoEmDuasEtapas: true,
}
