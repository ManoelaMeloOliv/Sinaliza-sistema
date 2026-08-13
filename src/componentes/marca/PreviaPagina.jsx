import { formatarMoeda, iniciais } from '../../utilitarios/formatadores'
import { regraDeSinal, rotuloDoSinal } from '../../utilitarios/valores'

// Fundo do cabecalho: a capa tem prioridade; senao segue o estilo escolhido.
function fundoDoCabecalho(marca) {
  if (marca.capa) return `linear-gradient(#0006,#0006),url("${marca.capa}") center/cover`
  if (marca.estiloCabecalho === 'solid') return marca.corPrincipal
  if (marca.estiloCabecalho === 'light') return '#ffffff'
  return `linear-gradient(135deg,${marca.corPrincipal},${marca.corDestaque})`
}

export function PreviaPagina({ marca, servicos, configuracoes }) {
  const claro = marca.estiloCabecalho === 'light'
  const legenda = [
    marca.mostrarVerificado && 'Perfil verificado',
    marca.mostrarLocalizacao && 'Florianópolis, SC',
  ].filter(Boolean).join(' · ')

  return (
    <aside
      className="page-preview"
      style={{
        '--brand-primary': marca.corPrincipal,
        '--brand-accent': marca.corDestaque,
        '--brand-radius': marca.arredondamento,
      }}
    >
      <div
        className={`preview-browser font-${marca.tipografia} cards-${marca.estiloCartoes}`}
        style={{ background: marca.corFundo, color: marca.corTexto }}
      >
        <div className="preview-browser-bar"><i /><i /><i /></div>

        <div
          className="preview-hero"
          style={{ background: fundoDoCabecalho(marca), color: claro ? '#201b2a' : '#fff' }}
        >
          <div className="preview-profile">
            {marca.logo
              ? <img className={`preview-logo logo-${marca.formatoLogo}`} src={marca.logo} alt="" />
              : <div className={`preview-logo logo-${marca.formatoLogo}`}>{iniciais(marca.nome)}</div>}
            <div>
              <h3>{marca.nome || 'Sua marca'}</h3>
              <p>{marca.subtitulo}</p>
            </div>
          </div>

          {legenda && (
            <div style={{ fontSize: 7, marginTop: 9, opacity: 0.8 }}>{legenda}</div>
          )}
        </div>

        <div className="preview-body">
          <small>{marca.descricao}</small>

          {servicos.slice(0, 2).map(servico => (
            <div className="preview-service" key={servico.id}>
              <div>
                <b>{servico.nome}</b>
                <small>{servico.duracao} · {rotuloDoSinal(regraDeSinal(servico, configuracoes))}</small>
              </div>
              <span>{formatarMoeda(servico.preco)}</span>
            </div>
          ))}

          <button className="preview-cta" type="button">Escolher serviço</button>

          {marca.mostrarPoliticas && (
            <div style={{ fontSize: 7, color: '#7a7488', marginTop: 12 }}>
              Pagamento seguro · Lembretes automáticos · Remarcação em até 24h
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
