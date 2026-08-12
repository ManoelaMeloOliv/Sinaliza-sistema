import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Aplicacao } from './Aplicacao'
import { ProvedorAplicacao } from './contexto/ProvedorAplicacao'
import './estilos/principal.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProvedorAplicacao><Aplicacao /></ProvedorAplicacao>
    </BrowserRouter>
  </StrictMode>,
)
