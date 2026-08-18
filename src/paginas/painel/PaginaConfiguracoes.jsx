import { useState } from 'react'
import { CabecalhoPagina } from '../../componentes/interface/CabecalhoPagina'
import { EditorMarca } from '../../componentes/marca/EditorMarca'
import { PainelPlano } from '../../componentes/configuracoes/PainelPlano'
import { PainelLinkPublico } from '../../componentes/configuracoes/PainelLinkPublico'
import { PainelBackup } from '../../componentes/configuracoes/PainelBackup'
import {
  PainelAgenda,
  PainelConta,
  PainelNotificacoes,
  PainelPagamentos,
  PainelPerfil,
} from '../../componentes/configuracoes/PaineisConfiguracoes'
import { useAplicacao } from '../../ganchos/useAplicacao'

const ABAS = [
  { chave: 'perfil', rotulo: 'Perfil e página', Painel: PainelPerfil },
  { chave: 'identidade', rotulo: 'Identidade visual', Painel: EditorMarca },
  { chave: 'link', rotulo: 'Link e QR Code', Painel: PainelLinkPublico },
  { chave: 'agenda', rotulo: 'Agenda e horários', Painel: PainelAgenda },
  { chave: 'pagamentos', rotulo: 'Pagamentos', Painel: PainelPagamentos },
  { chave: 'notificacoes', rotulo: 'Notificações', Painel: PainelNotificacoes },
  { chave: 'conta', rotulo: 'Conta e segurança', Painel: PainelConta },
  { chave: 'plano', rotulo: 'Plano e cobrança', Painel: PainelPlano },
  { chave: 'backup', rotulo: 'Cópia de segurança', Painel: PainelBackup },
]

export function PaginaConfiguracoes() {
  const { mostrarAviso } = useAplicacao()
  const [abaAtiva, definirAbaAtiva] = useState('perfil')

  const { Painel } = ABAS.find(aba => aba.chave === abaAtiva)

  return (
    <section className="page active">
      <CabecalhoPagina
        etiqueta="Preferências do negócio"
        titulo="Configurações"
        descricao="Controle sua página, agenda, cobranças e comunicações."
      />

      <div className="settings-layout">
        <nav className="card settings-nav">
          {ABAS.map(aba => (
            <button
              key={aba.chave}
              className={abaAtiva === aba.chave ? 'active' : ''}
              onClick={() => definirAbaAtiva(aba.chave)}
            >
              {aba.rotulo}
            </button>
          ))}
        </nav>

        <div>
          <div className="settings-panel active">
            <Painel />
          </div>

          {/* A identidade visual tem o proprio botao "Publicar identidade". */}
          {abaAtiva !== 'identidade' && abaAtiva !== 'plano' && abaAtiva !== 'link' && abaAtiva !== 'backup' && (
            <button
              className="btn"
              style={{ marginTop: 16 }}
              onClick={() => mostrarAviso('Alterações salvas com sucesso.')}
            >
              Salvar alterações
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
