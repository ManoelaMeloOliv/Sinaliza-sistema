import { Etiqueta } from '../interface/Etiqueta'
import { dataCurta } from '../../utilitarios/datas'

export function VisaoLista({ agendamentos, aoSelecionar }) {
  // Da lista sim faz sentido ver tudo em ordem cronologica.
  const ordenados = [...agendamentos].sort(
    (a, b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario),
  )

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
          {ordenados.length === 0 && (
            <tr><td colSpan="6" className="empty">Nenhum agendamento neste filtro.</td></tr>
          )}
          {ordenados.map(agendamento => (
            <tr key={agendamento.id}>
              <td>{dataCurta(agendamento.data)}</td>
              <td><b>{agendamento.horario}</b></td>
              <td>{agendamento.cliente}</td>
              <td>{agendamento.servico}</td>
              <td><Etiqueta situacao={agendamento.situacao} /></td>
              <td>
                <button className="table-action" onClick={() => aoSelecionar(agendamento)}>Abrir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
