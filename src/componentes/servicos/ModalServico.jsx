import { useState } from 'react'
import { ModalBase } from '../interface/ModalBase'
import { Campo } from '../interface/Campo'
import { SINAL_FIXO, SINAL_PERCENTUAL, TIPOS_DE_SINAL } from '../../utilitarios/valores'

const DURACOES = ['30min', '40min', '1h', '1h30', '1h45', '2h']

export function ModalServico({ servico, sinalPadrao, aoSalvar, aoFechar }) {
  const editando = Boolean(servico)
  const [formulario, definirFormulario] = useState({
    nome: servico?.nome ?? '',
    duracao: servico?.duracao ?? '1h',
    preco: servico?.preco ?? '',
    tipoDeSinal: servico?.tipoDeSinal ?? sinalPadrao ?? SINAL_PERCENTUAL,
    valorDoSinal: servico?.valorDoSinal ?? '',
    publicado: servico ? servico.publicado : true,
    descricao: servico?.descricao ?? '',
  })

  const atualizar = campo => evento =>
    definirFormulario(atual => ({ ...atual, [campo]: evento.target.value }))

  const sinalFixo = formulario.tipoDeSinal === SINAL_FIXO

  const enviar = () =>
    aoSalvar({
      ...formulario,
      preco: Number(formulario.preco),
      valorDoSinal: sinalFixo ? Number(formulario.valorDoSinal) || 0 : null,
    })

  return (
    <ModalBase
      etiqueta="Catálogo"
      titulo={editando ? 'Editar serviço' : 'Novo serviço'}
      largo
      aoFechar={aoFechar}
      aoEnviar={enviar}
      rotuloEnviar={editando ? 'Salvar serviço' : 'Adicionar serviço'}
    >
      <Campo rotulo="Nome do serviço" largo>
        <input required value={formulario.nome} onChange={atualizar('nome')} placeholder="Ex.: Lash lifting" />
      </Campo>

      <Campo rotulo="Duração">
        <select value={formulario.duracao} onChange={atualizar('duracao')}>
          {DURACOES.map(duracao => <option key={duracao}>{duracao}</option>)}
        </select>
      </Campo>

      <Campo rotulo="Preço">
        <input required type="number" min="0" value={formulario.preco} onChange={atualizar('preco')} placeholder="120" />
      </Campo>

      <Campo rotulo="Tipo de sinal">
        <select value={formulario.tipoDeSinal} onChange={atualizar('tipoDeSinal')}>
          {TIPOS_DE_SINAL.map(tipo => <option key={tipo}>{tipo}</option>)}
        </select>
      </Campo>

      {/* So faz sentido pedir o valor quando o sinal e fixo. */}
      {sinalFixo && (
        <Campo rotulo="Valor do sinal (R$)">
          <input
            required
            type="number"
            min="0"
            max={formulario.preco || undefined}
            value={formulario.valorDoSinal}
            onChange={atualizar('valorDoSinal')}
            placeholder="50"
          />
        </Campo>
      )}

      <Campo rotulo="Disponibilidade">
        <select
          value={formulario.publicado ? 'Publicar imediatamente' : 'Manter oculto'}
          onChange={evento =>
            definirFormulario(atual => ({ ...atual, publicado: evento.target.value === 'Publicar imediatamente' }))
          }
        >
          <option>Publicar imediatamente</option>
          <option>Manter oculto</option>
        </select>
      </Campo>

      <Campo rotulo="Descrição para a cliente" largo>
        <input value={formulario.descricao} onChange={atualizar('descricao')} placeholder="Explique brevemente o que está incluído." />
      </Campo>
    </ModalBase>
  )
}
