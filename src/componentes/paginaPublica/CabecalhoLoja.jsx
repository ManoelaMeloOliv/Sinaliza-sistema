import { iniciais } from '../../utilitarios/formatadores'
import { Logo } from '../interface/Logo'

function fundoDoCabecalho(marca) {
  if (marca.estiloCabecalho === 'solid') return marca.corPrincipal
  if (marca.estiloCabecalho === 'light') return '#fff'
  return `linear-gradient(135deg,${marca.corPrincipal},${marca.corDestaque})`
}

export function CabecalhoLoja({ marca }) {
  const claro = marca.estiloCabecalho === 'light'

  return (
    <>
      <header className="top">
        <Logo />
      </header>

      <section
        className="hero"
        style={{ background: fundoDoCabecalho(marca), color: claro ? '#201b2a' : undefined }}
      >
        <div className="hero-in">
          <div
            className="avatar"
            style={marca.logo ? { background: `#fff url("${marca.logo}") center/contain no-repeat` } : undefined}
          >
            {marca.logo ? '' : iniciais(marca.nome)}
          </div>

          <div>
            <h1>{marca.nome}</h1>
            <p style={claro ? { color: '#716b7d' } : undefined}>{marca.subtitulo}</p>

            <div className="hero-details">
              {marca.mostrarVerificado && <span className="verified">✓ Perfil verificado</span>}
              {marca.mostrarLocalizacao && <span className="hero-detail">⌖ Florianópolis, SC</span>}
              <span className="hero-detail">Atendimento com hora marcada</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
