import { Campo } from '../interface/Campo'
import { Interruptor } from '../interface/Interruptor'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { useTutorial } from '../../ganchos/useTutorial'
import { EditorExpediente } from './EditorExpediente'
import { SINAL_FIXO, TIPOS_DE_SINAL } from '../../utilitarios/valores'

// Linha "texto a esquerda, acao a direita" usada varias vezes nas configuracoes.
function LinhaDeControle({ titulo, detalhe, children }) {
  return (
    <div className="inline-control">
      <p>
        {titulo}
        <small>{detalhe}</small>
      </p>
      {children}
    </div>
  )
}

export function PainelPerfil() {
  const { perfil, definirPerfil, mostrarAviso } = useAplicacao()
  const tutorial = useTutorial()
  const alterar = campo => evento =>
    definirPerfil(atual => ({ ...atual, [campo]: evento.target.value }))

  return (
    <>
      <article className="card">
        <div className="card-title"><h2>Perfil profissional</h2></div>
        <p className="section-help">Estas informações aparecem na sua página pública de agendamento.</p>
        <div className="form-grid">
          <Campo rotulo="Nome do espaço">
            <input value={perfil.nomeDoEspaco} onChange={alterar('nomeDoEspaco')} />
          </Campo>
          <Campo rotulo="Especialidade">
            <input value={perfil.especialidade} onChange={alterar('especialidade')} />
          </Campo>
          <Campo rotulo="Descrição" largo>
            <input value={perfil.descricao} onChange={alterar('descricao')} />
          </Campo>
          <Campo rotulo="Link público" largo>
            <input value={perfil.linkPublico} onChange={alterar('linkPublico')} />
          </Campo>
        </div>
      </article>

      <article className="card">
        <div className="card-title"><h2>Endereço e atendimento</h2></div>
        <div className="form-grid">
          <Campo rotulo="Endereço" largo>
            <input value={perfil.endereco} onChange={alterar('endereco')} />
          </Campo>
          <Campo rotulo="Telefone comercial">
            <input value={perfil.telefone} onChange={alterar('telefone')} />
          </Campo>
          <Campo rotulo="Fuso horário">
            <select value={perfil.fusoHorario} onChange={alterar('fusoHorario')}>
              <option>Brasília (GMT−3)</option>
            </select>
          </Campo>
        </div>
      </article>

      <article className="card">
        <div className="card-title"><h2>Primeiros passos</h2></div>
        <LinhaDeControle
          titulo="Rever o tutorial"
          detalhe="Mostra de novo o passo a passo de como usar o painel."
        >
          <button
            className="small-btn"
            onClick={() => {
              tutorial.verDeNovo()
              mostrarAviso('O tutorial vai começar. Volte para a Visão geral.')
            }}
          >
            Ver tutorial
          </button>
        </LinhaDeControle>
      </article>
    </>
  )
}

export function PainelAgenda() {
  const { configuracoes, definirConfiguracoes } = useAplicacao()
  const alterar = campo => evento =>
    definirConfiguracoes(atual => ({ ...atual, [campo]: evento.target.value }))

  return (
    <>
      <article className="card">
        <div className="card-title"><h2>Regras de disponibilidade</h2></div>
        <div className="form-grid">
          <Campo rotulo="Antecedência mínima">
            <select value={configuracoes.antecedenciaMinima} onChange={alterar('antecedenciaMinima')}>
              <option>2 horas</option><option>4 horas</option><option>1 dia</option>
            </select>
          </Campo>
          <Campo rotulo="Janela máxima">
            <select value={configuracoes.janelaMaxima} onChange={alterar('janelaMaxima')}>
              <option>60 dias</option><option>30 dias</option><option>90 dias</option>
            </select>
          </Campo>
          <Campo rotulo="Intervalo entre serviços">
            <select value={configuracoes.intervaloEntreServicos} onChange={alterar('intervaloEntreServicos')}>
              <option>15 minutos</option><option>30 minutos</option><option>Sem intervalo</option>
            </select>
          </Campo>
          <Campo rotulo="Remarcações permitidas">
            <select value={configuracoes.remarcacoesPermitidas} onChange={alterar('remarcacoesPermitidas')}>
              <option>1 remarcação</option><option>Nenhuma</option><option>2 remarcações</option>
            </select>
          </Campo>
        </div>
      </article>

      <EditorExpediente />
    </>
  )
}

export function PainelPagamentos() {
  const { configuracoes, definirConfiguracoes, perfil, mostrarAviso } = useAplicacao()
  const alterar = campo => evento =>
    definirConfiguracoes(atual => ({ ...atual, [campo]: evento.target.value }))

  return (
    <>
      <article className="card">
        <div className="card-title"><h2>Regras do sinal</h2></div>
        <div className="form-grid">
          <Campo rotulo="Sinal padrão">
            <select value={configuracoes.sinalPadrao} onChange={alterar('sinalPadrao')}>
              {TIPOS_DE_SINAL.map(tipo => <option key={tipo}>{tipo}</option>)}
            </select>
          </Campo>

          {/* So faz sentido pedir o valor quando o sinal padrao e fixo. */}
          {configuracoes.sinalPadrao === SINAL_FIXO && (
            <Campo rotulo="Valor do sinal (R$)">
              <input
                type="number"
                min="0"
                value={configuracoes.valorDoSinalPadrao ?? ''}
                onChange={alterar('valorDoSinalPadrao')}
                placeholder="50"
              />
            </Campo>
          )}

          <Campo rotulo="Validade do Pix">
            <select value={configuracoes.validadeDoPix} onChange={alterar('validadeDoPix')}>
              <option>15 minutos</option><option>10 minutos</option><option>30 minutos</option>
            </select>
          </Campo>
          <Campo rotulo="Cancelamento com reembolso">
            <select value={configuracoes.cancelamentoComReembolso} onChange={alterar('cancelamentoComReembolso')}>
              <option>Até 24 horas antes</option><option>Até 48 horas antes</option><option>Sem reembolso</option>
            </select>
          </Campo>
          <Campo rotulo="Conta de repasse">
            <select value={configuracoes.contaDeRepasse} onChange={alterar('contaDeRepasse')}>
              <option>Nubank · final 4821</option>
            </select>
          </Campo>
        </div>
      </article>

      <article className="card">
        <div className="card-title">
          <h2>Conta de recebimento</h2>
          <span className="tag">Verificada</span>
        </div>
        <LinhaDeControle
          titulo={`${perfil.profissional} · CPF final 091-**`}
          detalhe="Repasses diários automáticos"
        >
          <button className="small-btn" onClick={() => mostrarAviso('Gerenciamento de conta disponível nesta demonstração.')}>
            Gerenciar conta
          </button>
        </LinhaDeControle>
      </article>
    </>
  )
}

const MENSAGENS = [
  { campo: 'confirmacao', titulo: 'Confirmação de agendamento', detalhe: 'Enviada imediatamente após o pagamento' },
  { campo: 'lembrete24h', titulo: 'Lembrete de 24 horas', detalhe: 'Inclui botões para confirmar ou remarcar' },
  { campo: 'lembrete2h', titulo: 'Lembrete de 2 horas', detalhe: 'Último aviso antes do atendimento' },
  { campo: 'avaliacao', titulo: 'Pedido de avaliação', detalhe: 'Enviado 2 horas depois do atendimento' },
]

export function PainelNotificacoes() {
  const { configuracoes, definirConfiguracoes } = useAplicacao()

  const alternar = campo =>
    definirConfiguracoes(atual => ({
      ...atual,
      avisos: { ...atual.avisos, [campo]: !atual.avisos[campo] },
    }))

  return (
    <article className="card">
      <div className="card-title"><h2>Mensagens automáticas</h2></div>
      {MENSAGENS.map(mensagem => (
        <LinhaDeControle key={mensagem.campo} titulo={mensagem.titulo} detalhe={mensagem.detalhe}>
          <Interruptor
            ligado={configuracoes.avisos[mensagem.campo]}
            aoAlternar={() => alternar(mensagem.campo)}
            rotulo={mensagem.titulo}
          />
        </LinhaDeControle>
      ))}
    </article>
  )
}

export function PainelConta() {
  const { configuracoes, definirConfiguracoes } = useAplicacao()

  return (
    <article className="card">
      <div className="card-title"><h2>Acesso e segurança</h2></div>
      <div className="form-grid">
        <Campo rotulo="E-mail de acesso" largo>
          <input
            value={configuracoes.emailDeAcesso}
            onChange={evento => definirConfiguracoes(atual => ({ ...atual, emailDeAcesso: evento.target.value }))}
          />
        </Campo>
        <Campo rotulo="Nova senha">
          <input type="password" placeholder="••••••••" />
        </Campo>
        <Campo rotulo="Confirmar senha">
          <input type="password" placeholder="••••••••" />
        </Campo>
      </div>

      <div style={{ marginTop: 18 }}>
        <LinhaDeControle
          titulo="Verificação em duas etapas"
          detalhe="Proteja sua conta com um código adicional."
        >
          <Interruptor
            ligado={configuracoes.verificacaoEmDuasEtapas}
            aoAlternar={() =>
              definirConfiguracoes(atual => ({ ...atual, verificacaoEmDuasEtapas: !atual.verificacaoEmDuasEtapas }))
            }
            rotulo="Verificação em duas etapas"
          />
        </LinhaDeControle>
      </div>
    </article>
  )
}
