// O simbolo vem de public/. A palavra "sinaliza" e texto ao lado, e nao parte
// da imagem, para o menu recolhido poder esconder so o nome e manter o simbolo.
//
// "clara" = versao branca, para o menu escuro do painel.
// "escura" = versao roxa, para o topo branco da pagina publica.
export function Logo({ variante = 'escura' }) {
  const arquivo = variante === 'clara' ? '/logo-branca.png' : '/logo.png'

  return (
    <div className="brand">
      <img src={arquivo} alt="" />
      <span>sinaliza</span>
    </div>
  )
}
