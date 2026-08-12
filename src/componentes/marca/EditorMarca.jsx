import { useState } from 'react'
import { Campo } from '../interface/Campo'
import { PreviaPagina } from './PreviaPagina'
import { useAplicacao } from '../../ganchos/useAplicacao'
import { marcaInicial } from '../../dados/dadosIniciais'

const TAMANHO_MAXIMO = 1_500_000 // 1,5 MB

const ARREDONDAMENTOS = [
  { valor: '9px', rotulo: 'Suave' },
  { valor: '2px', rotulo: 'Reto' },
  { valor: '999px', rotulo: 'Arredondado' },
]
const CABECALHOS = [
  { valor: 'gradient', rotulo: 'Gradiente' },
  { valor: 'solid', rotulo: 'Cor sólida' },
  { valor: 'light', rotulo: 'Claro' },
]
const TIPOGRAFIAS = [
  { valor: 'jakarta', rotulo: 'Moderna' },
  { valor: 'rounded', rotulo: 'Arredondada' },
  { valor: 'serif', rotulo: 'Elegante' },
]
const FORMATOS_DE_LOGO = [
  { valor: 'rounded', rotulo: 'Cantos suaves' },
  { valor: 'circle', rotulo: 'Circular' },
  { valor: 'square', rotulo: 'Quadrado' },
]
const ESTILOS_DE_CARTAO = [
  { valor: 'soft', rotulo: 'Suave com sombra' },
  { valor: 'outline', rotulo: 'Contorno da marca' },
  { valor: 'flat', rotulo: 'Minimalista' },
]
const LARGURAS = [
  { valor: 'wide', rotulo: 'Ampla' },
  { valor: 'compact', rotulo: 'Compacta' },
]

const VISIBILIDADE = [
  { campo: 'mostrarLocalizacao', titulo: 'Localização', detalhe: 'Exibir cidade no cabeçalho' },
  { campo: 'mostrarVerificado', titulo: 'Perfil verificado', detalhe: 'Mostrar selo de confiança' },
  { campo: 'mostrarPoliticas', titulo: 'Políticas da reserva', detalhe: 'Exibir regras no resumo' },
  { campo: 'mostrarAssinatura', titulo: 'Marca Sinaliza', detalhe: 'Assinatura no rodapé' },
]

export function EditorMarca() {
  const { marca, definirMarca, servicos, mostrarAviso } = useAplicacao()
  const [rascunho, definirRascunho] = useState(marca)

  const alterar = campo => valor => definirRascunho(atual => ({ ...atual, [campo]: valor }))
  const doCampo = campo => evento => alterar(campo)(evento.target.value)
  const daCaixa = campo => evento => alterar(campo)(evento.target.checked)

  const lerImagem = (campo, mensagemDeErro) => evento => {
    const arquivo = evento.target.files[0]
    if (!arquivo) return
    if (arquivo.size > TAMANHO_MAXIMO) {
      mostrarAviso(mensagemDeErro)
      return
    }
    const leitor = new FileReader()
    leitor.onload = () => alterar(campo)(leitor.result)
    leitor.readAsDataURL(arquivo)
  }

  const publicar = () => {
    try {
      definirMarca(rascunho)
      mostrarAviso('Identidade publicada na página da cliente.')
    } catch {
      mostrarAviso('As imagens são grandes demais para salvar no navegador.')
    }
  }

  const restaurar = () => {
    definirRascunho(marcaInicial)
    definirMarca(marcaInicial)
    mostrarAviso('Identidade visual restaurada.')
  }

  return (
    <div className="brand-editor">
      <div>
        <article className="card">
          <div className="card-title">
            <h2>Identidade da sua página</h2>
            <span className="tag">Prévia ao vivo</span>
          </div>
          <p className="section-help">Aplique as cores, o nome e o estilo visual usados pela sua loja.</p>

          <div className="form-grid">
            <Campo rotulo="Nome da marca">
              <input value={rascunho.nome} onChange={doCampo('nome')} />
            </Campo>
            <Campo rotulo="Segmento ou localização">
              <input value={rascunho.subtitulo} onChange={doCampo('subtitulo')} />
            </Campo>
            <Campo rotulo="Frase de apresentação" largo>
              <input value={rascunho.descricao} onChange={doCampo('descricao')} />
            </Campo>
          </div>

          <div className="card-title" style={{ margin: '22px 0 10px' }}><h2>Cores da marca</h2></div>
          <div className="color-grid">
            <SeletorDeCor rotulo="Cor principal" valor={rascunho.corPrincipal} aoMudar={doCampo('corPrincipal')} />
            <SeletorDeCor rotulo="Cor de destaque" valor={rascunho.corDestaque} aoMudar={doCampo('corDestaque')} />
          </div>

          <div className="form-grid" style={{ marginTop: 14 }}>
            <Campo rotulo="Estilo dos botões">
              <Opcoes lista={ARREDONDAMENTOS} valor={rascunho.arredondamento} aoMudar={doCampo('arredondamento')} />
            </Campo>
            <Campo rotulo="Estilo do cabeçalho">
              <Opcoes lista={CABECALHOS} valor={rascunho.estiloCabecalho} aoMudar={doCampo('estiloCabecalho')} />
            </Campo>
          </div>

          <div className="card-title" style={{ margin: '22px 0 10px' }}><h2>Logotipo</h2></div>
          <div className="upload-box">
            {rascunho.logo
              ? <img className="brand-logo-preview" src={rascunho.logo} alt="Prévia do logotipo" />
              : <div className="brand-logo-preview" />}
            <div>
              <p>Logotipo da loja</p>
              <small>PNG, JPG ou SVG, preferencialmente quadrado.</small>
              <label className="small-btn" style={{ display: 'inline-block', cursor: 'pointer' }}>
                Escolher arquivo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  hidden
                  onChange={lerImagem('logo', 'Use uma imagem com até 1,5 MB.')}
                />
              </label>
            </div>
          </div>

          <section className="brand-advanced">
            <h2>Aparência e conteúdo</h2>
            <p>Defina como os elementos da sua página pública serão apresentados.</p>

            <div className="color-grid">
              <SeletorDeCor rotulo="Fundo da página" valor={rascunho.corFundo} aoMudar={doCampo('corFundo')} />
              <SeletorDeCor rotulo="Cor dos textos" valor={rascunho.corTexto} aoMudar={doCampo('corTexto')} />
            </div>

            <div className="form-grid" style={{ marginTop: 14 }}>
              <Campo rotulo="Tipografia">
                <Opcoes lista={TIPOGRAFIAS} valor={rascunho.tipografia} aoMudar={doCampo('tipografia')} />
              </Campo>
              <Campo rotulo="Formato do logotipo">
                <Opcoes lista={FORMATOS_DE_LOGO} valor={rascunho.formatoLogo} aoMudar={doCampo('formatoLogo')} />
              </Campo>
              <Campo rotulo="Estilo dos cartões">
                <Opcoes lista={ESTILOS_DE_CARTAO} valor={rascunho.estiloCartoes} aoMudar={doCampo('estiloCartoes')} />
              </Campo>
              <Campo rotulo="Largura da página">
                <Opcoes lista={LARGURAS} valor={rascunho.largura} aoMudar={doCampo('largura')} />
              </Campo>
            </div>

            <div className="visibility-grid">
              {VISIBILIDADE.map(opcao => (
                <label className="visibility-option" key={opcao.campo}>
                  <span>
                    {opcao.titulo}
                    <small>{opcao.detalhe}</small>
                  </span>
                  <input type="checkbox" checked={rascunho[opcao.campo]} onChange={daCaixa(opcao.campo)} />
                </label>
              ))}
            </div>

            <div className="brand-cover-upload">
              <div>
                <p>Imagem de capa</p>
                <small>Opcional · JPG ou PNG horizontal, até 1,5 MB.</small>
              </div>
              <label className="small-btn" style={{ cursor: 'pointer' }}>
                Escolher capa
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  hidden
                  onChange={lerImagem('capa', 'Use uma capa com até 1,5 MB.')}
                />
              </label>
            </div>
          </section>

          <div className="branding-actions">
            <button className="btn secondary" type="button" onClick={restaurar}>Restaurar padrão</button>
            <button className="btn" type="button" onClick={publicar}>Publicar identidade</button>
          </div>
        </article>
      </div>

      <PreviaPagina marca={rascunho} servicos={servicos} />
    </div>
  )
}

function SeletorDeCor({ rotulo, valor, aoMudar }) {
  return (
    <div className="color-field">
      <input type="color" value={valor} onChange={aoMudar} aria-label={rotulo} />
      <div>
        <label>{rotulo}</label>
        <output>{valor.toUpperCase()}</output>
      </div>
    </div>
  )
}

function Opcoes({ lista, valor, aoMudar }) {
  return (
    <select value={valor} onChange={aoMudar}>
      {lista.map(opcao => <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>)}
    </select>
  )
}
