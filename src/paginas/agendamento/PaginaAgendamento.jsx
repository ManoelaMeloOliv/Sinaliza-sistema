import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CabecalhoLoja } from '../../componentes/paginaPublica/CabecalhoLoja'
import { PassosAgendamento } from '../../componentes/paginaPublica/PassosAgendamento'
import { EtapaServico } from '../../componentes/paginaPublica/EtapaServico'
import { EtapaHorario } from '../../componentes/paginaPublica/EtapaHorario'
import { EtapaDados } from '../../componentes/paginaPublica/EtapaDados'
import { EtapaRevisao } from '../../componentes/paginaPublica/EtapaRevisao'
import { EtapaPix } from '../../componentes/paginaPublica/EtapaPix'
import { EtapaConfirmacao } from '../../componentes/paginaPublica/EtapaConfirmacao'
import { ResumoLateral } from '../../componentes/paginaPublica/ResumoLateral'
import { useAplicacao } from '../../ganchos/useAplicacao'

const SERVICO = 0
const HORARIO = 1
const DADOS = 2
const REVISAO = 3
const PIX = 4
const CONFIRMACAO = 5

export function PaginaAgendamento() {
  const { servicos, marca, perfil, definirAgendamentos, definirClientes } = useAplicacao()
  const publicados = servicos.filter(servico => servico.publicado)

  const [etapa, definirEtapa] = useState(SERVICO)
  const [servico, definirServico] = useState(null)
  const [dia, definirDia] = useState(null)
  const [horario, definirHorario] = useState(null)
  const [dados, definirDados] = useState({ nome: '', telefone: '', email: '' })

  useEffect(() => {
    document.title = `Agende seu horário — ${marca.nome}`
  }, [marca.nome])

  const quando = dia
    ? `${dia} de agosto${horario ? ` · ${horario}` : ''}`
    : 'Horário a escolher'

  const escolherDia = novoDia => {
    definirDia(novoDia)
    definirHorario(null)
  }

  // Registra a reserva no painel: vira agendamento e, se for nova, tambem cliente.
  const confirmar = () => {
    definirAgendamentos(atual => [...atual, {
      id: crypto.randomUUID(),
      horario,
      cliente: dados.nome,
      servico: servico.nome,
      situacao: 'Pago',
      dia: 0,
    }])

    definirClientes(atual =>
      atual.some(cliente => cliente.telefone === dados.telefone)
        ? atual
        : [...atual, {
            id: crypto.randomUUID(),
            nome: dados.nome,
            telefone: dados.telefone,
            ultimoServico: servico.nome,
            agendamentos: 1,
            situacao: 'Ativa',
          }],
    )

    definirEtapa(CONFIRMACAO)
  }

  return (
    <div
      className={`pagina-publica font-${marca.tipografia} cards-${marca.estiloCartoes}`}
      style={{
        '--p': marca.corPrincipal,
        '--p2': marca.corPrincipal,
        '--bg': marca.corFundo,
        '--ink': marca.corTexto,
        '--raio': marca.arredondamento,
      }}
    >
      <Link to="/painel" className="voltar-painel">← Painel</Link>

      <CabecalhoLoja marca={marca} />

      <main className={marca.largura === 'compact' ? 'shell compact' : 'shell'}>
        <div className="booking">
          <section className="main">
            {etapa < CONFIRMACAO && <PassosAgendamento etapa={Math.min(etapa, REVISAO)} />}

            {etapa === SERVICO && (
              <EtapaServico
                servicos={publicados}
                servicoEscolhido={servico}
                aoEscolher={definirServico}
                aoAvancar={() => definirEtapa(HORARIO)}
              />
            )}

            {etapa === HORARIO && (
              <EtapaHorario
                dia={dia}
                horario={horario}
                aoEscolherDia={escolherDia}
                aoEscolherHorario={definirHorario}
                aoVoltar={() => definirEtapa(SERVICO)}
                aoAvancar={() => definirEtapa(DADOS)}
              />
            )}

            {etapa === DADOS && (
              <EtapaDados
                dados={dados}
                aoMudar={alteracao => definirDados(atual => ({ ...atual, ...alteracao }))}
                aoVoltar={() => definirEtapa(HORARIO)}
                aoAvancar={() => definirEtapa(REVISAO)}
              />
            )}

            {etapa === REVISAO && (
              <EtapaRevisao
                servico={servico}
                quando={quando}
                profissional={perfil.profissional}
                nomeDaLoja={marca.nome}
                mostrarPoliticas={marca.mostrarPoliticas}
                aoVoltar={() => definirEtapa(DADOS)}
                aoAvancar={() => definirEtapa(PIX)}
              />
            )}

            {etapa === PIX && <EtapaPix servico={servico} aoConfirmar={confirmar} />}

            {etapa === CONFIRMACAO && (
              <EtapaConfirmacao
                servico={servico}
                quando={quando}
                nome={dados.nome}
                nomeDaLoja={marca.nome}
              />
            )}
          </section>

          {etapa < CONFIRMACAO && <ResumoLateral marca={marca} servico={servico} quando={quando} />}
        </div>
      </main>

      {marca.mostrarAssinatura && (
        <footer className="footer">
          Agendamento seguro por <b>sinaliza</b> · seus dados estão protegidos
        </footer>
      )}
    </div>
  )
}
