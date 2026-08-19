// Roteiro do tour de boas-vindas. "alvo" e o valor de data-tutorial no elemento;
// sem alvo, o passo aparece centralizado na tela.
//
// Para mudar o texto, a ordem ou acrescentar um passo, e so editar esta lista.

export const PASSOS = [
  {
    id: 'boas-vindas',
    titulo: 'Bem-vinda ao Sinaliza',
    texto:
      'Em um minuto eu mostro onde fica cada coisa. Você pode sair a qualquer momento e ver de novo depois, em Configurações.',
  },
  {
    id: 'menu',
    alvo: 'menu',
    titulo: 'Por aqui você navega',
    texto:
      'Agenda, serviços, clientes e financeiro. É o caminho para tudo no painel.',
  },
  {
    id: 'numeros',
    alvo: 'numeros',
    titulo: 'Seus números do mês',
    texto:
      'Faturamento, agendamentos e sinais recebidos. Tudo calculado a partir da sua agenda de verdade — nada é chute.',
  },
  {
    id: 'agenda',
    alvo: 'agenda-de-hoje',
    titulo: 'Os horários de hoje',
    texto:
      'Clique em qualquer agendamento, aqui ou na Agenda, para editar, remarcar, cancelar ou avisar a cliente no WhatsApp.',
  },
  {
    id: 'busca',
    alvo: 'busca',
    titulo: 'Procure qualquer coisa',
    texto:
      'Digite o nome de uma cliente, um serviço ou um horário e aperte Enter.',
  },
  {
    id: 'pagina-publica',
    alvo: 'pagina-publica',
    titulo: 'A página que a cliente vê',
    texto:
      'É este link que você divulga. Ela escolhe o serviço, o horário e paga o sinal sozinha — e o agendamento cai direto na sua agenda.',
  },
  {
    id: 'final',
    titulo: 'É isso!',
    texto:
      'Dois lugares valem uma visita agora: Configurações → Link e QR Code, para divulgar sua página, e Cópia de segurança, para não perder seus dados.',
  },
]
