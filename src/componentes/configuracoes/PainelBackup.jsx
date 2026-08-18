import { useRef, useState } from 'react'
import { ConfirmarExclusao } from '../interface/ConfirmarExclusao'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { dataDeHoje, paraIso } from '../../utilitarios/datas'
import {
  apagarTudo,
  baixarBackup,
  dataDaUltimaCopia,
  EXTENSAO,
  restaurarBackup,
  validarBackup,
} from '../../utilitarios/backup'

// "há 3 dias", "hoje", "há 2 meses" — mais facil de entender que uma data seca.
function quandoFoi(iso) {
  if (!iso) return null

  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  if (dias < 30) return `há ${dias} dias`
  const meses = Math.floor(dias / 30)
  return meses === 1 ? 'há 1 mês' : `há ${meses} meses`
}

export function PainelBackup() {
  const { servicos, agendamentos, clientes, marca, mostrarAviso } = useAplicacao()
  const campoDeArquivo = useRef(null)

  const [aRestaurar, definirARestaurar] = useState(null)
  const [confirmandoLimpeza, definirConfirmandoLimpeza] = useState(false)
  const [ultimaCopia, definirUltimaCopia] = useState(dataDaUltimaCopia)

  const quando = quandoFoi(ultimaCopia)
  const faltaSalvar = !ultimaCopia

  const nomeDoArquivo = () => {
    const loja = marca.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `${loja || 'sinaliza'}-${dataDeHoje()}${EXTENSAO}`
  }

  const salvarCopia = () => {
    const agora = new Date()
    baixarBackup(nomeDoArquivo(), agora)
    definirUltimaCopia(paraIso(agora))
    mostrarAviso('Cópia salva. Guarde o arquivo num lugar seguro.')
  }

  const escolherArquivo = evento => {
    const arquivo = evento.target.files[0]
    if (!arquivo) return

    const leitor = new FileReader()
    leitor.onload = () => {
      const resultado = validarBackup(leitor.result)
      if (!resultado.ok) {
        mostrarAviso(resultado.mensagem)
        return
      }
      definirARestaurar(resultado)
    }
    leitor.readAsText(arquivo)

    evento.target.value = '' // permite escolher o mesmo arquivo de novo
  }

  // Recarregar e o jeito mais seguro de o sistema reler tudo do zero.
  const restaurar = () => {
    restaurarBackup(aRestaurar.conteudo)
    definirARestaurar(null)
    window.location.reload()
  }

  const limpar = () => {
    apagarTudo()
    definirConfirmandoLimpeza(false)
    window.location.reload()
  }

  return (
    <>
      <article className="card">
        <div className="card-title">
          <h2>Cópia de segurança</h2>
          {faltaSalvar
            ? <span className="tag wait">Você ainda não salvou</span>
            : <span className="tag">Salva {quando}</span>}
        </div>

        <p className="section-help">
          Sua agenda fica guardada dentro deste navegador, neste computador. Se você limpar o histórico,
          formatar a máquina ou trocar de computador, tudo se perde. Salvar uma cópia protege você disso.
        </p>

        <div className="backup-resumo">
          <div><b>{servicos.length}</b><span>serviços</span></div>
          <div><b>{agendamentos.length}</b><span>agendamentos</span></div>
          <div><b>{clientes.length}</b><span>clientes</span></div>
        </div>

        <div className="backup-acao">
          <div>
            <b>Salvar uma cópia agora</b>
            <small>
              Baixa um arquivo com tudo o que está aqui. Guarde no celular, no e-mail ou na nuvem —
              é ele que traz sua agenda de volta se algo acontecer.
            </small>
          </div>
          <button className="btn" onClick={salvarCopia}>Salvar cópia</button>
        </div>

        <div className="backup-acao">
          <div>
            <b>Trazer uma cópia de volta</b>
            <small>
              Escolha um arquivo que você salvou aqui antes. Ele substitui o que está no sistema hoje.
            </small>
          </div>
          <button className="small-btn" onClick={() => campoDeArquivo.current?.click()}>
            Escolher arquivo
          </button>
          <input
            ref={campoDeArquivo}
            type="file"
            accept={`${EXTENSAO},application/json,.json`}
            hidden
            onChange={escolherArquivo}
          />
        </div>
      </article>

      <article className="card">
        <div className="card-title"><h2>Recomeçar do zero</h2></div>
        <p className="section-help">
          Apaga seus serviços, sua agenda e suas clientes, e devolve o sistema como veio no começo.
          Não tem como voltar atrás, então salve uma cópia antes.
        </p>
        <button className="small-btn danger" onClick={() => definirConfirmandoLimpeza(true)}>
          Apagar tudo e recomeçar
        </button>
      </article>

      {aRestaurar && (
        <ConfirmarExclusao
          titulo="Trazer esta cópia de volta?"
          descricao={
            `Esta cópia tem ${aRestaurar.itens.servicos} serviços, ${aRestaurar.itens.agendamentos} agendamentos ` +
            `e ${aRestaurar.itens.clientes} clientes. Ela vai substituir o que está no sistema agora.`
          }
          rotuloConfirmar="Trazer de volta"
          aoConfirmar={restaurar}
          aoCancelar={() => definirARestaurar(null)}
        />
      )}

      {confirmandoLimpeza && (
        <ConfirmarExclusao
          titulo="Apagar tudo mesmo?"
          descricao="Seus serviços, sua agenda e suas clientes serão apagados deste computador. Isso não pode ser desfeito."
          rotuloConfirmar="Sim, apagar tudo"
          aoConfirmar={limpar}
          aoCancelar={() => definirConfirmandoLimpeza(false)}
        />
      )}
    </>
  )
}
