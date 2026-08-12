// Exportacao usada em Clientes e Financeiro.
export function baixarCsv(nomeDoArquivo, linhas) {
  const csv = linhas
    .map(linha => linha.map(valor => '"' + String(valor).replaceAll('"', '""') + '"').join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = nomeDoArquivo
  link.click()
  URL.revokeObjectURL(url)
}
