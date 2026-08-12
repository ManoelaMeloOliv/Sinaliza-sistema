import { useAplicacao } from '../../ganchos/useAplicacao'

// Mensagem flutuante no rodape, exibida por 2,6 segundos.
export function Aviso() {
  const { aviso } = useAplicacao()
  return <div className={aviso ? 'toast show' : 'toast'}>{aviso}</div>
}
