// Abre a conversa no WhatsApp com a mensagem ja escrita. Nao envia sozinho:
// a usuaria confere e aperta enviar. Funciona sem servidor nenhum.

import { dataPorExtenso } from './datas'
import { formatarMoeda } from './formatadores'

// "(48) 99912-3456" -> "5548999123456"
export function numeroInternacional(telefone) {
  const digitos = String(telefone ?? '').replace(/\D/g, '')
  if (!digitos) return ''
  return digitos.startsWith('55') ? digitos : `55${digitos}`
}

export const MODELOS = {
  confirmacao: ({ agendamento, marca }) =>
    `Oi, ${agendamento.cliente}! Aqui é do ${marca.nome}. ` +
    `Seu horário de ${agendamento.servico} está confirmado para ${dataPorExtenso(agendamento.data)}, às ${agendamento.horario}. ` +
    'Qualquer coisa, é só chamar por aqui!',

  lembrete: ({ agendamento, marca }) =>
    `Oi, ${agendamento.cliente}! Passando para lembrar do seu horário no ${marca.nome}: ` +
    `${agendamento.servico}, ${dataPorExtenso(agendamento.data)} às ${agendamento.horario}. Até logo!`,

  cobranca: ({ agendamento, sinal }) =>
    `Oi, ${agendamento.cliente}! Seu horário de ${agendamento.servico} em ${dataPorExtenso(agendamento.data)} ` +
    `às ${agendamento.horario} está reservado. Para confirmar, falta o sinal de ${formatarMoeda(sinal)}. ` +
    'Assim que cair, eu confirmo por aqui.',

  remarcacao: ({ agendamento, marca }) =>
    `Oi, ${agendamento.cliente}! Precisei ajustar sua agenda no ${marca.nome}. ` +
    `Seu horário ficou para ${dataPorExtenso(agendamento.data)}, às ${agendamento.horario}. Pode ser?`,
}

export function abrirWhatsapp({ telefone, mensagem }) {
  const numero = numeroInternacional(telefone)
  const texto = encodeURIComponent(mensagem)
  const url = numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`
  window.open(url, '_blank', 'noopener')
}
