import { useCallback, useRef, useState } from 'react'
import {
  agendamentosIniciais,
  clientesIniciais,
  configuracoesIniciais,
  marcaInicial,
  perfilInicial,
  servicosIniciais,
} from '../dados/dadosIniciais'
import { useArmazenamentoLocal } from '../ganchos/useArmazenamentoLocal'
import { ContextoAplicacao } from './contextoAplicacao'

export function ProvedorAplicacao({ children }) {
  const [servicos, definirServicos] = useArmazenamentoLocal('sinaliza-servicos', servicosIniciais)
  const [agendamentos, definirAgendamentos] = useArmazenamentoLocal('sinaliza-agendamentos', agendamentosIniciais)
  const [clientes, definirClientes] = useArmazenamentoLocal('sinaliza-clientes', clientesIniciais)
  const [marca, definirMarca] = useArmazenamentoLocal('sinaliza-marca', marcaInicial)
  const [perfil, definirPerfil] = useArmazenamentoLocal('sinaliza-perfil', perfilInicial)
  const [configuracoes, definirConfiguracoes] = useArmazenamentoLocal('sinaliza-configuracoes', configuracoesIniciais)

  // Aviso flutuante (o "toast" da versao anterior).
  const [aviso, definirAviso] = useState('')
  const temporizador = useRef(0)
  const mostrarAviso = useCallback(mensagem => {
    definirAviso(mensagem)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => definirAviso(''), 2600)
  }, [])

  const valor = {
    servicos, definirServicos,
    agendamentos, definirAgendamentos,
    clientes, definirClientes,
    marca, definirMarca,
    perfil, definirPerfil,
    configuracoes, definirConfiguracoes,
    aviso, mostrarAviso,
  }

  return <ContextoAplicacao.Provider value={valor}>{children}</ContextoAplicacao.Provider>
}
