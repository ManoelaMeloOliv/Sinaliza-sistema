import { Etiqueta } from '../interface/Etiqueta'

export function VisaoLista({ agendamentos, aoVerDetalhes }) {
  return (
    <div className="agenda-list-view">
      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Horário</th>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Sinal</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 && (
            <tr><td colSpan="6" className="empty">Nenhum agendamento neste filtro.</td></tr>
          )}
          {agendamentos.map(agendamento => (
            <tr key={agendamento.id}>
              <td>{19 + agendamento.dia} ago, 2026</td>
              <td><b>{agendamento.horario}</b></td>
              <td>{agendamento.cliente}</td>
              <td>{agendamento.servico}</td>
              <td><Etiqueta situacao={agendamento.situacao} /></td>
              <td>
                <button className="table-action" onClick={() => aoVerDetalhes(agendamento)}>Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
