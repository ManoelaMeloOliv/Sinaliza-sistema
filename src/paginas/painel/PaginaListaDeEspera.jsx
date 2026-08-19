import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { IndicadorCompacto } from '../../componentes/interface/CartaoIndicador'
import { Etiqueta } from '../../componentes/interface/Etiqueta'
import { ConfirmarExclusao } from '../../componentes/interface/ConfirmarExclusao'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { dataCurta, dataDeHoje, semanaDeTrabalho, somarDias } from '../../utilitarios/datas'
import { oportunidades, resumoDaEspera } from '../../utilitarios/listaDeEspera'
import { abrirWhatsapp } from '../../utilitarios/whatsapp'
import { planoInclui, planoPorId, planoQueInclui } from '../../dados/planos'

const DIAS_A_OLHAR = 14

export function PaginaListaDeEspera() {
  const {
    listaDeEspera, definirListaDeEspera,
    agendamentos, definirAgendamentos,
    servicos, configuracoes, marca, mostrarAviso,
  } = useAplicacao()

  const [aRemover, definirARemover] = useState(null)
  const plano = planoPorId(configuracoes.plano)
  const liberado = planoInclui(plano, 'listaDeEspera')

  const hoje = dataDeHoje()
  const dias = Array.from({ length: DIAS_A_OLHAR }, (_, i) => somarDias(hoje, i))

  const fila = oportunidades({ listaDeEspera, agendamentos, servicos, configuracoes, dias })
  const naEspera = fila.filter(item => item.pessoa.situacao === 'Na espera')
  const comVaga = naEspera.filter(item => item.temVaga)

  const chamar = ({ pessoa, vagas }) => {
    const vaga = vagas[0]
    const mensagem = vaga
      ? `Oi, ${pessoa.nome}! Aqui é do ${marca.nome}. Abriu uma vaga de ${pessoa.servico} ` +
        `em ${dataCurta(vaga.data)} às ${vaga.livres[0]}. Quer que eu reserve para você?`
      : `Oi, ${pessoa.nome}! Aqui é do ${marca.nome}. Assim que abrir uma vaga de ${pessoa.servico} eu te aviso.`

    abrirWhatsapp({ telefone: pessoa.telefone, mensagem })
  }

  // Encaixa direto na primeira vaga e marca de onde veio, para o relatorio.
  const encaixar = ({ pessoa, vagas }) => {
    const vaga = vagas[0]
    if (!vaga) return

    definirAgendamentos(atual => [...atual, {
      id: crypto.randomUUID(),
      data: vaga.data,
      horario: vaga.livres[0],
      cliente: pessoa.nome,
      telefone: pessoa.telefone,
      servico: pessoa.servico,
      situacao: 'Aguardando',
      vindoDaEspera: true,
      remarcacoes: 0,
    }])

    definirListaDeEspera(atual =>
      atual.map(item => (item.id === pessoa.id ? { ...item, situacao: 'Encaixada' } : item)),
    )

    mostrarAviso(`${pessoa.nome} encaixada em ${dataCurta(vaga.data)} às ${vaga.livres[0]}.`)
  }

  const remover = () => {
    definirListaDeEspera(atual => atual.filter(item => item.id !== aRemover.id))
    mostrarAviso(`${aRemover.nome} saiu da lista.`)
    definirARemover(null)
  }

  if (!liberado) {
    return (
      <section className="page active">
        <CabecalhoPagina
          etiqueta="Agenda"
          titulo="Lista de espera"
          descricao="Quando um horário lota, a cliente entra na fila em vez de desistir."
        />
        <article className="card recurso-bloqueado">
          <h2>Disponível no plano {planoQueInclui('listaDeEspera').nome}</h2>
          <p>
            Com a lista de espera, quem não encontrou horário deixa o contato. Quando alguém
            desmarca, você vê na hora quem chamar — e recupera o horário que ficaria vazio.
          </p>
          <a className="btn" href="/painel/configuracoes">Ver planos</a>
        </article>
      </section>
    )
  }

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Agenda"
        titulo="Lista de espera"
        descricao="Quem ficou sem horário. Chame quando abrir uma vaga."
      />

      <div className="client-summary">
        <IndicadorCompacto rotulo="Na espera" valor={naEspera.length} />
        <IndicadorCompacto rotulo="Com vaga agora" valor={comVaga.length} />
        <IndicadorCompacto rotulo="Já encaixadas" valor={listaDeEspera.filter(p => p.situacao === 'Encaixada').length} />
        <IndicadorCompacto rotulo="Semana atual" valor={semanaDeTrabalho(hoje).length + ' dias'} />
      </div>

      {comVaga.length > 0 && (
        <article className="card destaque-vaga">
          <div className="card-title">
            <h2>Abriu vaga para {comVaga.length} pessoa(s)</h2>
            <span className="tag">Chame agora</span>
          </div>
          <p className="section-help">
            Estas pessoas cabem em algum horário livre dos próximos {DIAS_A_OLHAR} dias.
          </p>
          {comVaga.map(item => (
            <div className="inline-control" key={item.pessoa.id}>
              <p>
                {item.pessoa.nome}
                <small>
                  {resumoDaEspera(item.pessoa)} · vaga em {dataCurta(item.vagas[0].data)} às {item.vagas[0].livres[0]}
                </small>
              </p>
              <button className="small-btn" onClick={() => chamar(item)}>WhatsApp</button>
              <button className="btn" onClick={() => encaixar(item)}>Encaixar</button>
            </div>
          ))}
        </article>
      )}

      <article className="card table-wrap">
        <div className="card-title"><h2>Fila completa</h2></div>
        <table className="table">
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Quer</th>
              <th>Entrou</th>
              <th>Situação</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {listaDeEspera.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  Ninguém na lista. Quando um dia lotar, a cliente poderá entrar na fila pela página pública.
                </td>
              </tr>
            )}
            {fila.map(({ pessoa, temVaga }) => (
              <tr key={pessoa.id}>
                <td>
                  <b>{pessoa.nome}</b>
                  <small style={{ display: 'block', color: 'var(--muted)' }}>{pessoa.telefone}</small>
                </td>
                <td>{resumoDaEspera(pessoa)}</td>
                <td>{dataCurta(pessoa.criadoEm.slice(0, 10))}</td>
                <td>
                  <Etiqueta situacao={pessoa.situacao} />
                  {temVaga && pessoa.situacao === 'Na espera' && (
                    <small style={{ display: 'block', color: 'var(--green)', marginTop: 4 }}>tem vaga</small>
                  )}
                </td>
                <td>
                  <button className="table-action" onClick={() => definirARemover(pessoa)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      {aRemover && (
        <ConfirmarExclusao
          titulo={`Tirar ${aRemover.nome} da lista?`}
          descricao="Ela deixa de aparecer aqui e não será avisada quando abrir vaga."
          rotuloConfirmar="Tirar da lista"
          aoConfirmar={remover}
          aoCancelar={() => definirARemover(null)}
        />
      )}
    </section>
  )
}
