import { useState } from 'react'
import { Campo } from '../interface/Campo'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { calcularSinal, regraDeSinal, rotuloDoSinal, servicoPorNome } from '../../utilitarios/valores'
import { dataDeHoje } from '../../utilitarios/datas'

export function FormularioAgendamento({ modo = 'agendamento', dataSugerida, aoConcluir }) {
  const { servicos, agendamentos, configuracoes, definirAgendamentos, definirClientes, mostrarAviso } = useAplicacao()
  const bloqueio = modo === 'bloqueio'

  const [formulario, definirFormulario] = useState({
    cliente: bloqueio ? 'Horário bloqueado' : '',
    telefone: '',
    servico: servicos[0]?.nome ?? '',
    data: dataSugerida ?? dataDeHoje(),
    horario: '09:00',
    preco: servicos[0]?.preco ?? 0,
    situacao: bloqueio ? 'Não cobrar' : 'Pago',
    observacoes: '',
  })

  const atualizar = campo => evento =>
    definirFormulario(atual => ({ ...atual, [campo]: evento.target.value }))

  // Trocar o servico ja traz o preco dele, como na versao anterior.
  const trocarServico = evento => {
    const nome = evento.target.value
    const servico = servicos.find(item => item.nome === nome)
    definirFormulario(atual => ({ ...atual, servico: nome, preco: servico ? servico.preco : atual.preco }))
  }

  const valor = Number(formulario.preco) || 0
  const regra = regraDeSinal(servicoPorNome(servicos, formulario.servico), configuracoes)
  const sinal = formulario.situacao === 'Não cobrar' ? 0 : calcularSinal(valor, regra)

  // Ja existe alguem neste dia e horario?
  const ocupado = agendamentos.some(
    item => item.data === formulario.data && item.horario === formulario.horario,
  )

  const enviar = evento => {
    evento.preventDefault()

    if (ocupado) {
      mostrarAviso('Já existe um agendamento nesse dia e horário.')
      return
    }

    definirAgendamentos(atual => [
      ...atual,
      {
        id: crypto.randomUUID(),
        data: formulario.data,
        horario: formulario.horario,
        cliente: formulario.cliente,
        servico: bloqueio ? 'Bloqueio' : formulario.servico,
        situacao: formulario.situacao,
        observacoes: formulario.observacoes,
      },
    ])

    if (!bloqueio && formulario.telefone) {
      definirClientes(atual =>
        atual.some(cliente => cliente.telefone === formulario.telefone)
          ? atual
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
    aoConcluir()
  }

  return (
    <div className="modal open" role="presentation" onMouseDown={e => e.target === e.currentTarget && aoConcluir()}>
      <form className="modal-box booking-modern" onSubmit={enviar}>
        <div className="booking-modal-head">
          <div>
            <span className="eyebrow">Agenda</span>
            <h2>{bloqueio ? 'Bloquear horário' : 'Novo agendamento'}</h2>
            <p>
              {bloqueio
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
                <input required type="time" value={formulario.horario} onChange={atualizar('horario')} />
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
          </section>
        </div>

        <div className="booking-modal-footer">
          <p>A cliente receberá a confirmação e os lembretes configurados.</p>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={aoConcluir}>Cancelar</button>
            <button className="btn">{bloqueio ? 'Bloquear horário' : 'Criar agendamento'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}
