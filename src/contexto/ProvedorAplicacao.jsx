import { createContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../utilitarios/supabase'
import { ContextoAplicacao } from './contextoAplicacao'

export function ProvedorAplicacao({ children }) {
  const [usuario, definirUsuario] = useState(null)
  const [perfil, definirPerfil] = useState(null)
  const [servicos, definirServicos] = useState([])
  const [agendamentos, definirAgendamentos] = useState([])
  const [carregando, definirCarregando] = useState(true)

  // Aviso flutuante (toast)
  const [aviso, definirAviso] = useState('')
  const temporizador = useRef(0)
  const mostrarAviso = useCallback(mensagem => {
    definirAviso(mensagem)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => definirAviso(''), 2600)
  }, [])

  // 1. Monitorar sessão do Supabase (Login/Logout)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      definirUsuario(session?.user ?? null)
      if (session?.user) {
        carregarDadosDoBanco(session.user.id)
      } else {
        definirCarregando(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      definirUsuario(session?.user ?? null)
      if (session?.user) {
        carregarDadosDoBanco(session.user.id)
      } else {
        definirPerfil(null)
        definirServicos([])
        definirAgendamentos([])
        definirCarregando(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Função para buscar os dados do usuário logado nas tabelas do Supabase
  async function carregarDadosDoBanco(userId) {
    definirCarregando(true)
    try {
      // Pega o perfil
      const { data: dadosPerfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (dadosPerfil) definirPerfil(dadosPerfil)

      // Pega os serviços da loja
      const { data: dadosServicos } = await supabase
        .from('servicos')
        .select('*')
        .eq('perfil_id', userId)

      if (dadosServicos) definirServicos(dadosServicos)

      // Pega os agendamentos da loja
      const { data: dadosAgendamentos } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('perfil_id', userId)

      if (dadosAgendamentos) definirAgendamentos(dadosAgendamentos)

    } catch (erro) {
      console.error('Erro ao carregar dados do Supabase:', erro)
      mostrarAviso('Erro ao carregar dados.')
    } finally {
      definirCarregando(false)
    }
  }

  const valor = {
    usuario,
    perfil,
    definirPerfil,
    servicos,
    definirServicos,
    agendamentos,
    definirAgendamentos,
    carregando,
    aviso,
    mostrarAviso,
  }

  return (
    <ContextoAplicacao.Provider value={valor}>
      {children}
    </ContextoAplicacao.Provider>
  )
}