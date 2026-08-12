import { useState } from 'react'
import { ModalBase } from '../interface/ModalBase'
import { Campo } from '../interface/Campo'

export function ModalCliente({ aoSalvar, aoFechar }) {
  const [formulario, definirFormulario] = useState({
    nome: '',
    telefone: '',
    nascimento: '',
    observacoes: '',
  })

  const atualizar = campo => evento =>
    definirFormulario(atual => ({ ...atual, [campo]: evento.target.value }))

  return (
    <ModalBase
      etiqueta="Cadastro"
      titulo="Nova cliente"
      aoFechar={aoFechar}
      aoEnviar={() => aoSalvar(formulario)}
      rotuloEnviar="Salvar cliente"
    >
      <Campo rotulo="Nome completo" largo>
        <input required value={formulario.nome} onChange={atualizar('nome')} placeholder="Nome da cliente" />
      </Campo>

      <Campo rotulo="WhatsApp">
        <input required value={formulario.telefone} onChange={atualizar('telefone')} placeholder="(48) 99999-9999" />
      </Campo>

      <Campo rotulo="Data de nascimento">
        <input type="date" value={formulario.nascimento} onChange={atualizar('nascimento')} />
      </Campo>

      <Campo rotulo="Observações" largo>
        <input
          value={formulario.observacoes}
          onChange={atualizar('observacoes')}
          placeholder="Preferências, alergias ou informações importantes"
        />
      </Campo>
    </ModalBase>
  )
}
