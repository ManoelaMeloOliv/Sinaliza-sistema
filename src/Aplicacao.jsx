import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ContextoAplicacao } from './contexto/contextoAplicacao'

import { EstruturaPainel } from './componentes/estrutura/EstruturaPainel'
import { PaginaInicial } from './paginas/painel/PaginaInicial'
import { PaginaAgenda } from './paginas/painel/PaginaAgenda'
import { PaginaListaDeEspera } from './paginas/painel/PaginaListaDeEspera'
import { PaginaServicos } from './paginas/painel/PaginaServicos'
import { PaginaClientes } from './paginas/painel/PaginaClientes'
import { PaginaFinanceiro } from './paginas/painel/PaginaFinanceiro'
import { PaginaConfiguracoes } from './paginas/painel/PaginaConfiguracoes'
import { PaginaAgendamento } from './paginas/agendamento/PaginaAgendamento'
import { Login } from './paginas/login/Login' // Ajuste conforme o caminho da sua pasta

export function Aplicacao() {
  const { usuario } = useContext(ContextoAplicacao)

  return (
    <Routes>
      {/* Rota de Login */}
      <Route path="/login" element={usuario ? <Navigate to="/painel" replace /> : <Login />} />

      {/* Rotas protegidas */}
      <Route 
        path="/painel" 
        element={usuario ? <EstruturaPainel /> : <Navigate to="/login" replace />}
      >
        <Route index element={<PaginaInicial />} />
        <Route path="agenda" element={<PaginaAgenda />} />
        <Route path="espera" element={<PaginaListaDeEspera />} />
        <Route path="servicos" element={<PaginaServicos />} />
        <Route path="clientes" element={<PaginaClientes />} />
        <Route path="financeiro" element={<PaginaFinanceiro />} />
        <Route path="configuracoes" element={<PaginaConfiguracoes />} />
      </Route>

      {/* Rota pública de agendamento */}
      <Route path="/agendamento" element={<PaginaAgendamento />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={usuario ? "/painel" : "/login"} replace />} />
    </Routes>
  )
}