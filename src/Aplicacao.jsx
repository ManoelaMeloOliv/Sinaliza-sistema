import { Navigate, Route, Routes } from 'react-router-dom'
import { EstruturaPainel } from './componentes/estrutura/EstruturaPainel'
import { PaginaInicial } from './paginas/painel/PaginaInicial'
import { PaginaAgenda } from './paginas/painel/PaginaAgenda'
import { PaginaServicos } from './paginas/painel/PaginaServicos'
import { PaginaClientes } from './paginas/painel/PaginaClientes'
import { PaginaFinanceiro } from './paginas/painel/PaginaFinanceiro'
import { PaginaConfiguracoes } from './paginas/painel/PaginaConfiguracoes'
import { PaginaAgendamento } from './paginas/agendamento/PaginaAgendamento'

export function Aplicacao() {
  return <Routes>
    <Route path="/" element={<Navigate to="/painel" replace />} />
    <Route path="/painel" element={<EstruturaPainel />}>
      <Route index element={<PaginaInicial />} />
      <Route path="agenda" element={<PaginaAgenda />} />
      <Route path="servicos" element={<PaginaServicos />} />
      <Route path="clientes" element={<PaginaClientes />} />
      <Route path="financeiro" element={<PaginaFinanceiro />} />
      <Route path="configuracoes" element={<PaginaConfiguracoes />} />
    </Route>
    <Route path="/agendamento" element={<PaginaAgendamento />} />
    <Route path="*" element={<Navigate to="/painel" replace />} />
  </Routes>
}
