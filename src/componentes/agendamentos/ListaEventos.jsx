import { Etiqueta } from '../interface/Etiqueta'
import { dataCurta } from '../../utilitarios/datas'

// Lista compacta de horarios usada na Visao geral e na lateral da Agenda.
export function ListaEventos({ agendamentos, mostrarData = false, mensagemVazia = 'Nenhum horário neste filtro.' }) {
  if (!agendamentos.length) return <p className="empty">{mensagemVazia}</p>

  return (
    <div className="agenda-mini">
      {agendamentos.map(agendamento => (
        <div className="event" key={agendamento.id}>
          <time>{agendamento.horario}</time>
          <i />
          <p>
            {agendamento.cliente}
            <small>
              {agendamento.servico}
              {mostrarData && ` · ${dataCurta(agendamento.data)}`}
            </small>
          </p>
          <Etiqueta situacao={agendamento.situacao} />
        </div>
      ))}
    </div>
  )
}
