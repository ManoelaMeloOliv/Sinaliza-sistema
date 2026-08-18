// Tudo do sistema vive no navegador desta maquina. Limpar os dados de navegacao
// apaga a agenda inteira. Estas funcoes salvam uma copia num arquivo e trazem
// de volta quando preciso.
//
// O arquivo usa a extensao .sinaliza em vez de .json: quem usa o sistema nao
// precisa saber o que e JSON, so que aquele e "o arquivo do Sinaliza".

export const EXTENSAO = '.sinaliza'

export const CHAVES = [
  'sinaliza-servicos',
  'sinaliza-agendamentos',
  'sinaliza-clientes',
  'sinaliza-marca',
  'sinaliza-perfil',
  'sinaliza-configuracoes',
  'sinaliza-tema',
  'sinaliza-barra-lateral',
]

// Fica fora das CHAVES de proposito: restaurar uma copia antiga nao pode
// fazer a data da ultima copia voltar no tempo.
const CHAVE_DA_ULTIMA_COPIA = 'sinaliza-ultima-copia'

const VERSAO = 1

export function montarBackup(momento = new Date()) {
  const dados = {}

  CHAVES.forEach(chave => {
    const guardado = localStorage.getItem(chave)
    if (guardado === null) return
    try { dados[chave] = JSON.parse(guardado) } catch { /* chave corrompida: fica de fora */ }
  })

  return { aplicacao: 'sinaliza', versao: VERSAO, geradoEm: momento.toISOString(), dados }
}

export function baixarBackup(nomeDoArquivo, momento = new Date()) {
  const conteudo = JSON.stringify(montarBackup(momento), null, 2)
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }))

  const ancora = document.createElement('a')
  ancora.href = url
  ancora.download = nomeDoArquivo
  ancora.click()
  URL.revokeObjectURL(url)

  localStorage.setItem(CHAVE_DA_ULTIMA_COPIA, momento.toISOString())
}

export function dataDaUltimaCopia() {
  return localStorage.getItem(CHAVE_DA_ULTIMA_COPIA)
}

// Quantos itens a copia guarda, para dizer em portugues o que ela contem.
function contar(dados) {
  const tamanho = chave => (Array.isArray(dados[chave]) ? dados[chave].length : 0)
  return {
    servicos: tamanho('sinaliza-servicos'),
    agendamentos: tamanho('sinaliza-agendamentos'),
    clientes: tamanho('sinaliza-clientes'),
  }
}

// Devolve { ok, mensagem } em vez de lancar erro: quem chama mostra o aviso.
export function validarBackup(texto) {
  let conteudo
  try {
    conteudo = JSON.parse(texto)
  } catch {
    return { ok: false, mensagem: 'Não consegui ler esse arquivo. Escolha o arquivo que você salvou aqui pelo Sinaliza.' }
  }

  if (conteudo?.aplicacao !== 'sinaliza' || !conteudo?.dados) {
    return { ok: false, mensagem: 'Esse arquivo não é uma cópia do Sinaliza.' }
  }

  const chaves = Object.keys(conteudo.dados).filter(chave => CHAVES.includes(chave))
  if (chaves.length === 0) {
    return { ok: false, mensagem: 'Essa cópia está vazia — não há nada para trazer de volta.' }
  }

  return { ok: true, conteudo, chaves, itens: contar(conteudo.dados), geradoEm: conteudo.geradoEm }
}

export function restaurarBackup(conteudo) {
  Object.entries(conteudo.dados).forEach(([chave, valor]) => {
    if (CHAVES.includes(chave)) localStorage.setItem(chave, JSON.stringify(valor))
  })
}

export function apagarTudo() {
  CHAVES.forEach(chave => localStorage.removeItem(chave))
}
