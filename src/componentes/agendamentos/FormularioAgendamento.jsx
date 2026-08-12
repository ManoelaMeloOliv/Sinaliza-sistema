import { useState } from 'react'
import { Campo } from '../interface/Campo'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { formatarMoeda } from '../../utilitarios/formatadores'
import { PERCENTUAL_SINAL } from '../../utilitarios/valores'

// A agenda da demonstracao cobre terca (0) a sabado (4).
function diaDaSemanaDaAgenda(valorDoCampoData) {
  if (!valorDoCampoData) return 0
  const indice = new Date(valorDoCampoData).getDay() - 2
  return indice >= 0 && indice <= 4 ? indice : 0
}

export function FormularioAgendamento({ modo = 'agendamento', aoConcluir }) {
  const { servicos, definirAgendamentos, definirClientes, mostrarAviso } = useAplicacao()
  const bloqueio = modo === 'bloqueio'

  const [formulario, definirFormulario] = useState({
    cliente: bloqueio ? 'Horário bloqueado' : '',
    telefone: '',
    servico: servicos[0]?.nome ?? '',
    data: '',
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
  const sinal = formulario.situacao === 'Não cobrar' ? 0 : Math.round(valor * PERCENTUAL_SINAL)

  const enviar = evento => {
    evento.preventDefault()
    const horario = formulario.data
      ? new Date(formulario.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '09:00'

    definirAgendamentos(atual => [
      ...atual,
      {
        id: crypto.randomUUID(),
        horario,
        cliente: formulario.cliente,
        servico: bloqueio ? 'Bloqueio' : formulario.servico,
        situacao: formulario.situacao,
        dia: diaDaSemanaDaAgenda(formulario.data),
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
              <Campo rotulo="Data e horário">
                <input required type="datetime-local" value={formulario.data} onChange={atualizar('data')} />
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
              <div><span>Sinal previsto (30%)</span><b>{formatarMoeda(sinal)}</b></div>
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
