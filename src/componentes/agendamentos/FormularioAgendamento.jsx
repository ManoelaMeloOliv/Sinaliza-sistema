import { useState } from 'react'
import { Campo } from '../interface/Campo'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { calcularSinal, regraDeSinal, rotuloDoSinal, servicoPorNome } from '../../utilitarios/valores'
import { dataDeHoje } from '../../utilitarios/datas'
import { existeConflito, horariosDisponiveis } from '../../utilitarios/regras'
import { planoPorId, usoDoPlano } from '../../dados/planos'
import { abrirWhatsapp, MODELOS } from '../../utilitarios/whatsapp'

function limiteDeRemarcacoes(texto) {
  if (/nenhuma/i.test(texto ?? '')) return 0
  return Number(String(texto ?? '').match(/\d+/)?.[0] ?? 1)
}

export function FormularioAgendamento({ modo = 'agendamento', agendamento, dataSugerida, aoConcluir }) {
  const { servicos, agendamentos, configuracoes, marca, definirAgendamentos, definirClientes, mostrarAviso } = useAplicacao()

  const editando = Boolean(agendamento)
  const bloqueio = modo === 'bloqueio' || agendamento?.servico === 'Bloqueio'

  const [formulario, definirFormulario] = useState({
    cliente: agendamento?.cliente ?? (bloqueio ? 'Horário bloqueado' : ''),
    telefone: agendamento?.telefone ?? '',
    servico: agendamento?.servico ?? servicos[0]?.nome ?? '',
    data: agendamento?.data ?? dataSugerida ?? dataDeHoje(),
    horario: agendamento?.horario ?? '09:00',
    preco: agendamento?.preco ?? servicos[0]?.preco ?? 0,
    situacao: agendamento?.situacao ?? (bloqueio ? 'Não cobrar' : 'Pago'),
    observacoes: agendamento?.observacoes ?? '',
  })

  const [confirmandoExclusao, definirConfirmandoExclusao] = useState(false)

  const atualizar = campo => evento =>
    definirFormulario(atual => ({ ...atual, [campo]: evento.target.value }))

  const trocarServico = evento => {
    const nome = evento.target.value
    const servico = servicos.find(item => item.nome === nome)
    definirFormulario(atual => ({ ...atual, servico: nome, preco: servico ? servico.preco : atual.preco }))
  }

  const servicoEscolhido = servicoPorNome(servicos, formulario.servico)
  const valor = Number(formulario.preco) || 0
  const regra = regraDeSinal(servicoEscolhido, configuracoes)
  const sinal = formulario.situacao === 'Não cobrar' ? 0 : calcularSinal(valor, regra)

  // Sugere os horarios que realmente cabem, mas sem impedir um encaixe manual.
  const sugestoes = horariosDisponiveis({
    data: formulario.data,
    servico: servicoEscolhido,
    agendamentos,
    servicos,
    configuracoes,
    ignorarId: agendamento?.id,
  })

  const mudouOHorario =
    editando && (agendamento.data !== formulario.data || agendamento.horario !== formulario.horario)

  const remarcacoesFeitas = agendamento?.remarcacoes ?? 0
  const limite = limiteDeRemarcacoes(configuracoes.remarcacoesPermitidas)

  const plano = planoPorId(configuracoes.plano)
  const uso = usoDoPlano({ plano, servicos, agendamentos, hoje: dataDeHoje() })

  const enviar = evento => {
    evento.preventDefault()

    if (!editando && uso.agendamentos.estourou) {
      mostrarAviso(
        `O plano ${plano.nome} permite ${plano.limites.agendamentosPorMes} agendamentos por mês. Suba de plano em Configurações.`,
      )
      return
    }

    if (mudouOHorario && remarcacoesFeitas >= limite) {
      mostrarAviso(
        limite === 0
          ? 'As configurações não permitem remarcação.'
          : `Este agendamento já usou as ${limite} remarcação(ões) permitidas.`,
      )
      return
    }

    const conflito = existeConflito({
      data: formulario.data,
      horario: formulario.horario,
      servico: servicoEscolhido,
      agendamentos,
      servicos,
      configuracoes,
      ignorarId: agendamento?.id,
    })

    if (conflito) {
      mostrarAviso('Esse horário conflita com outro atendimento.')
      return
    }

    const dados = {
      data: formulario.data,
      horario: formulario.horario,
      cliente: formulario.cliente,
      telefone: formulario.telefone,
      servico: bloqueio ? 'Bloqueio' : formulario.servico,
      situacao: formulario.situacao,
      observacoes: formulario.observacoes,
    }

    if (editando) {
      definirAgendamentos(atual =>
        atual.map(item =>
          item.id === agendamento.id
            ? { ...item, ...dados, remarcacoes: remarcacoesFeitas + (mudouOHorario ? 1 : 0) }
            : item,
        ),
      )
      mostrarAviso(mudouOHorario ? 'Agendamento remarcado.' : 'Agendamento atualizado.')
    } else {
      definirAgendamentos(atual => [...atual, { ...dados, id: crypto.randomUUID(), remarcacoes: 0 }])

      if (!bloqueio && formulario.telefone) {
        definirClientes(atual =>
          atual.some(cliente => cliente.telefone === formulario.telefone)
            ? atual.map(cliente =>
                cliente.telefone === formulario.telefone
                  ? { ...cliente, agendamentos: (cliente.agendamentos ?? 0) + 1, ultimoServico: formulario.servico }
                  : cliente,
              )
            : [...atual, {
                id: crypto.randomUUID(),
                nome: formulario.cliente,
                telefone: formulario.telefone,
                ultimoServico: formulario.servico,
                agendamentos: 1,
                situacao: 'Ativa',
              }],
        )
      }
      mostrarAviso(bloqueio ? 'Horário bloqueado na agenda.' : 'Agendamento criado com sucesso.')
    }

    aoConcluir()
  }

  // A mensagem muda conforme o estado do sinal: cobrar, confirmar ou avisar da mudanca.
  const avisarNoWhatsapp = () => {
    const dados = { agendamento: { ...formulario }, marca, sinal }
    const modelo = mudouOHorario
      ? MODELOS.remarcacao
      : formulario.situacao === 'Aguardando'
        ? MODELOS.cobranca
        : MODELOS.confirmacao

    abrirWhatsapp({ telefone: formulario.telefone, mensagem: modelo(dados) })
  }

  // Bloqueio some. Agendamento vira 'Cancelado' e guarda se o sinal ficou retido,
  // porque isso alimenta o relatorio de quanto a loja recuperou.
  const excluir = () => {
    if (bloqueio) {
      definirAgendamentos(atual => atual.filter(item => item.id !== agendamento.id))
      mostrarAviso('Bloqueio removido.')
      aoConcluir()
      return
    }

    definirAgendamentos(atual =>
      atual.map(item =>
        item.id === agendamento.id
          ? { ...item, situacao: 'Cancelado', sinalRetido: agendamento.situacao === 'Pago' }
          : item,
      ),
    )

    mostrarAviso(
      agendamento.situacao === 'Pago'
        ? `Horário de ${agendamento.cliente} cancelado. O sinal fica retido.`
        : `Horário de ${agendamento.cliente} cancelado.`,
    )
    aoConcluir()
  }

  const titulo = editando
    ? (bloqueio ? 'Editar bloqueio' : 'Editar agendamento')
    : (bloqueio ? 'Bloquear horário' : 'Novo agendamento')

  return (
    <div className="modal open" role="presentation" onMouseDown={e => e.target === e.currentTarget && aoConcluir()}>
      <form className="modal-box booking-modern" onSubmit={enviar}>
        <div className="booking-modal-head">
          <div>
            <span className="eyebrow">Agenda</span>
            <h2>{titulo}</h2>
            <p>
              {editando
                ? 'Altere os dados, remarque ou cancele este horário.'
                : bloqueio
                  ? 'Reserve um horário para que ninguém possa agendar nele.'
                  : 'Cadastre manualmente um horário e defina a situação do sinal.'}
            </p>
          </div>
          <button type="button" className="modal-head-close" onClick={aoConcluir} aria-label="Fechar">×</button>
        </div>

        <div className="booking-modal-body">
          <section className="booking-section">
            <div className="booking-section-title"><i>01</i>Informações da cliente</div>
            <div className="form-grid">
              <Campo rotulo={bloqueio ? 'Motivo' : 'Nome da cliente'}>
                <input required value={formulario.cliente} onChange={atualizar('cliente')} placeholder="Ex.: Camila Santos" autoComplete="name" />
              </Campo>
              <Campo rotulo="WhatsApp">
                <input required={!bloqueio} value={formulario.telefone} onChange={atualizar('telefone')} placeholder="(48) 99999-9999" inputMode="tel" />
              </Campo>
            </div>
          </section>

          <section className="booking-section">
            <div className="booking-section-title"><i>02</i>Serviço e horário</div>
            <div className="form-grid">
              <Campo rotulo="Serviço">
                <select value={formulario.servico} onChange={trocarServico}>
                  {servicos.map(servico => <option key={servico.id}>{servico.nome}</option>)}
                </select>
              </Campo>
              <Campo rotulo="Data">
                <input required type="date" value={formulario.data} onChange={atualizar('data')} />
              </Campo>
              <Campo rotulo="Horário">
                <input required type="time" list="horarios-livres" value={formulario.horario} onChange={atualizar('horario')} />
                <datalist id="horarios-livres">
                  {sugestoes.map(hora => <option key={hora} value={hora} />)}
                </datalist>
              </Campo>
              <Campo rotulo="Valor do serviço">
                <input type="number" min="0" step="1" value={formulario.preco} onChange={atualizar('preco')} />
              </Campo>
              <Campo rotulo="Status do sinal">
                <select value={formulario.situacao} onChange={atualizar('situacao')}>
                  <option>Pago</option>
                  <option>Aguardando</option>
                  <option>Não cobrar</option>
                </select>
              </Campo>
              <Campo rotulo="Observações internas" largo>
                <input value={formulario.observacoes} onChange={atualizar('observacoes')} placeholder="Preferências, restrições ou observações deste atendimento" />
              </Campo>
            </div>

            <div className="booking-summary">
              <div><span>Valor do serviço</span><b>{formatarMoeda(valor)}</b></div>
              <div><span>{rotuloDoSinal(regra)}</span><b>{formatarMoeda(sinal)}</b></div>
              <div><span>Restante no atendimento</span><b>{formatarMoeda(valor - sinal)}</b></div>
            </div>

            {sugestoes.length === 0 && (
              <p className="section-help" style={{ marginTop: 14 }}>
                Não há horário livre nesse dia para este serviço. Você ainda pode salvar, mas confira a agenda.
              </p>
            )}
          </section>
        </div>

        <div className="booking-modal-footer">
          {editando ? (
            confirmandoExclusao ? (
              <p><b>Cancelar mesmo este horário?</b></p>
            ) : (
              <p>
                {remarcacoesFeitas > 0 && `${remarcacoesFeitas} remarcação(ões) usada(s) de ${limite}. `}
                A cliente será avisada da alteração.
              </p>
            )
          ) : (
            <p>A cliente receberá a confirmação e os lembretes configurados.</p>
          )}

          <div className="modal-actions">
            {editando && !confirmandoExclusao && !bloqueio && formulario.telefone && (
              <button type="button" className="btn secondary" onClick={avisarNoWhatsapp}>
                Avisar no WhatsApp
              </button>
            )}
            {editando && !confirmandoExclusao && (
              <button type="button" className="btn secondary" onClick={() => definirConfirmandoExclusao(true)}>
                Cancelar horário
              </button>
            )}
            {confirmandoExclusao ? (
              <>
                <button type="button" className="btn secondary" onClick={() => definirConfirmandoExclusao(false)}>Voltar</button>
                <button type="button" className="btn" onClick={excluir}>Confirmar cancelamento</button>
              </>
            ) : (
              <>
                <button type="button" className="btn secondary" onClick={aoConcluir}>Fechar</button>
                <button className="btn">{editando ? 'Salvar alterações' : bloqueio ? 'Bloquear horário' : 'Criar agendamento'}</button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
