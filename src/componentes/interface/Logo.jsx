// Marca desenhada em SVG, sem arquivo de imagem.
//
// O simbolo usa o roxo da marca; o nome herda a cor de quem o contem
// (branco no menu escuro, escuro no topo da pagina publica). Por isso o nome
// e texto de verdade, e nao parte do desenho: assim o menu recolhido consegue
// esconder so a palavra e manter o simbolo.
export function Logo() {
  return (
    <div className="brand">
      <SimboloSinaliza />
      <span>sinaliza</span>
    </div>
  )
}

function SimboloSinaliza() {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="sinaliza">
      <path
        d="M20.6 10.1c0-3-3.2-4.8-6.3-3.7-2.8 1-4.1 4.1-2.8 6.7.7 1.3 1.9 2.3 3.4 2.7l2.5.8c1.5.4 2.7 1.4 3.4 2.7 1.3 2.6 0 5.7-2.8 6.7-3.1 1.1-6.3-.7-6.3-3.7"
        fill="none"
        stroke="#6938ef"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
