// A lista de espera guarda quem quis um horario que nao existia.
// Quando abre uma vaga, o painel mostra quem chamar.

import { dataCurta } from './datas'
import { horariosDisponiveis } from './regras'

export function novaEntrada({ nome, telefone, servico, data, observacao = '' }) {
  return {
    id: crypto.randomUUID(),
    nome,
    telefone,
    servico,
    data,            // dia desejado; vazio significa "qualquer dia"
    observacao,
    criadoEm: new Date().toISOString(),
    situacao: 'Na espera',
  }
}

// Alguem da lista cabe agora nesta data? Devolve quem, com os horarios livres.
export function quemCabeEm({ data, listaDeEspera, agendamentos, servicos, configuracoes }) {
  return listaDeEspera
    .filter(pessoa => pessoa.situacao === 'Na espera')
    .filter(pessoa => !pessoa.data || pessoa.data === data)
    .map(pessoa => {
      const servico = servicos.find(item => item.nome === pessoa.servico)
      const livres = horariosDisponiveis({ data, servico, agendamentos, servicos, configuracoes })
      return { pessoa, livres }
    })
    .filter(item => item.livres.length > 0)
}

// Datas em que cada pessoa da fila ainda pode ser encaixada, olhando os
// proximos dias. Serve para o painel sugerir "chame a Ana para quinta".
export function oportunidades({ listaDeEspera, agendamentos, servicos, configuracoes, dias }) {
  return listaDeEspera
    .filter(pessoa => pessoa.situacao === 'Na espera')
    .map(pessoa => {
      const servico = servicos.find(item => item.nome === pessoa.servico)
      const candidatas = pessoa.data ? [pessoa.data] : dias

      const vagas = candidatas
        .map(data => ({
          data,
          livres: horariosDisponiveis({ data, servico, agendamentos, servicos, configuracoes }),
        }))
        .filter(vaga => vaga.livres.length > 0)

      return { pessoa, vagas, temVaga: vagas.length > 0 }
    })
}

export function resumoDaEspera(pessoa) {
  const quando = pessoa.data ? dataCurta(pessoa.data) : 'qualquer dia'
  return `${pessoa.servico} · ${quando}`
}
