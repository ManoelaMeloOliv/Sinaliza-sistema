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
import { calcularSinal, regraDeSinal, rotuloDoSinal } from '../../utilitarios/valores'
import { dataCurta } from '../../utilitarios/datas'

const SERVICO = 0
const HORARIO = 1
const DADOS = 2
const REVISAO = 3
const PIX = 4
const CONFIRMACAO = 5

export function PaginaAgendamento() {
  const { servicos, agendamentos, marca, perfil, configuracoes, definirAgendamentos, definirClientes } = useAplicacao()
  const publicados = servicos.filter(servico => servico.publicado)

  const [etapa, definirEtapa] = useState(SERVICO)
  // Guardamos o id, e nao o objeto: assim o preco acompanha o que o painel mudar.
  const [servicoId, definirServicoId] = useState(null)
  const [data, definirData] = useState(null)
  const [horario, definirHorario] = useState(null)
  const [dados, definirDados] = useState({ nome: '', telefone: '', email: '' })

  useEffect(() => {
    document.title = `Agende seu horário — ${marca.nome}`
  }, [marca.nome])

  const servico = servicos.find(item => item.id === servicoId) ?? null

  // Se o servico sair do ar no meio da reserva, voltamos para a escolha
  // em vez de quebrar nas etapas seguintes.
  const etapaVisivel = servico || etapa === SERVICO ? etapa : SERVICO

  const quando = data
    ? `${dataCurta(data)}${horario ? ` · ${horario}` : ''}`
    : 'Horário a escolher'

  // Horarios ja reservados no dia escolhido, para nao oferecer de novo.
  const ocupadosNoDia = agendamentos
    .filter(item => item.data === data)
    .map(item => item.horario)

  // A regra de sinal do servico escolhido vale para todas as etapas seguintes.
  const regra = regraDeSinal(servico, configuracoes)
  const sinal = calcularSinal(servico?.preco, regra)
  const rotuloSinal = rotuloDoSinal(regra)

  const escolherData = novaData => {
    definirData(novaData)
    definirHorario(null)
  }

  // Registra a reserva no painel: vira agendamento e, se for nova, tambem cliente.
  const confirmar = () => {
    definirAgendamentos(atual => [...atual, {
      id: crypto.randomUUID(),
      data,
      horario,
      cliente: dados.nome,
      servico: servico.nome,
      situacao: 'Pago',
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
            {etapaVisivel < CONFIRMACAO && <PassosAgendamento etapa={Math.min(etapaVisivel, REVISAO)} />}

            {etapaVisivel === SERVICO && (
              <EtapaServico
                servicos={publicados}
                servicoEscolhido={servico}
                aoEscolher={escolhido => definirServicoId(escolhido.id)}
                aoAvancar={() => definirEtapa(HORARIO)}
              />
            )}

            {etapaVisivel === HORARIO && (
              <EtapaHorario
                data={data}
                horario={horario}
                ocupados={ocupadosNoDia}
                aoEscolherData={escolherData}
                aoEscolherHorario={definirHorario}
                aoVoltar={() => definirEtapa(SERVICO)}
                aoAvancar={() => definirEtapa(DADOS)}
              />
            )}

            {etapaVisivel === DADOS && (
              <EtapaDados
                dados={dados}
                aoMudar={alteracao => definirDados(atual => ({ ...atual, ...alteracao }))}
                aoVoltar={() => definirEtapa(HORARIO)}
                aoAvancar={() => definirEtapa(REVISAO)}
              />
            )}

            {etapaVisivel === REVISAO && (
              <EtapaRevisao
                servico={servico}
                sinal={sinal}
                rotuloSinal={rotuloSinal}
                quando={quando}
                profissional={perfil.profissional}
                nomeDaLoja={marca.nome}
                mostrarPoliticas={marca.mostrarPoliticas}
                aoVoltar={() => definirEtapa(DADOS)}
                aoAvancar={() => definirEtapa(PIX)}
              />
            )}

            {etapaVisivel === PIX && <EtapaPix sinal={sinal} aoConfirmar={confirmar} />}

            {etapaVisivel === CONFIRMACAO && (
              <EtapaConfirmacao
                servico={servico}
                sinal={sinal}
                quando={quando}
                nome={dados.nome}
                nomeDaLoja={marca.nome}
              />
            )}
          </section>

          {etapaVisivel < CONFIRMACAO && <ResumoLateral marca={marca} servico={servico} quando={quando} sinal={sinal} rotuloSinal={rotuloSinal} />}
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
