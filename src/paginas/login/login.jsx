import { useState } from 'react'
import { supabase } from '../../utilitarios/supabase'

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function mapearErroSupabase(error) {
  const msg = error?.message || ''
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (msg.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada (e o spam).'
  if (msg.includes('User already registered')) return 'Este e-mail já está cadastrado. Tente entrar ou recuperar sua senha.'
  if (msg.toLowerCase().includes('password') && msg.toLowerCase().includes('least')) return 'A senha é muito curta.'
  if (msg.toLowerCase().includes('rate limit') || msg.includes('Too many requests')) return 'Muitas tentativas seguidas. Aguarde um instante e tente novamente.'
  if (msg.includes('Unable to validate email address')) return 'Digite um e-mail válido.'
  return 'Não foi possível concluir. Tente novamente em instantes.'
}

export function Login() {
  const [modo, setModo] = useState('entrar') // 'entrar' | 'cadastro'

  // login
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  // cadastro
  const [nome, setNome] = useState('')
  const [emailCadastro, setEmailCadastro] = useState('')
  const [senhaCadastro, setSenhaCadastro] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenhaCadastro, setMostrarSenhaCadastro] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  function trocarModo(novoModo) {
    setModo(novoModo)
    setErro('')
    setSucesso('')
  }

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) setErro(mapearErroSupabase(error))
    setCarregando(false)
  }

  async function handleCadastro(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!nome.trim()) return setErro('Informe seu nome.')
    if (!REGEX_EMAIL.test(emailCadastro)) return setErro('Digite um e-mail válido.')
    if (senhaCadastro.length < 8) return setErro('A senha deve ter pelo menos 8 caracteres.')
    if (senhaCadastro !== confirmarSenha) return setErro('As senhas não coincidem.')

    setCarregando(true)

    const { data, error } = await supabase.auth.signUp({
      email: emailCadastro,
      password: senhaCadastro,
      options: {
        data: { nome_completo: nome.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    setCarregando(false)

    if (error) {
      setErro(mapearErroSupabase(error))
      return
    }

    // O Supabase não retorna erro quando o e-mail já existe e já está confirmado
    // (é proteção contra enumeração de contas). Nesse caso "identities" vem vazio.
    if (data?.user && data.user.identities?.length === 0) {
      setErro('Este e-mail já está cadastrado. Tente entrar ou recuperar sua senha.')
      return
    }

    setSucesso('Quase lá! Enviamos um link de confirmação para o seu e-mail. Confirme para ativar sua conta.')
    setNome('')
    setEmailCadastro('')
    setSenhaCadastro('')
    setConfirmarSenha('')
  }

  async function handleLoginGoogle() {
    setErro('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/painel' },
    })
    if (error) setErro('Erro ao entrar com o Google: ' + error.message)
  }

  return (
    <div className="wrap">
      {/* Painel de marca (esquerda) — sem alteração */}
      <aside className="brand-panel">
        <div className="brand-mark">
          <img 
            src="/logo-branca.png" 
            alt="Sinaliza" 
            style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
          />
          Sinaliza
        </div>

        <div className="brand-copy">
          <h1>Menos furos na agenda,<br />mais horários confirmados.</h1>
          <p>Entre no seu painel para acompanhar reservas, sinais recebidos via Pix e a agenda dos seus clientes em tempo real.</p>

          <div className="brand-points">
            <div className="brand-point">
              <i><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 9.2 17 19 7"/></svg></i>
              Sinal via Pix confirma o horário automaticamente
            </div>
            <div className="brand-point">
              <i><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 9.2 17 19 7"/></svg></i>
              Página de agendamento com a sua identidade visual
            </div>
            <div className="brand-point">
              <i><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 9.2 17 19 7"/></svg></i>
              Lembretes automáticos reduzem faltas
            </div>
          </div>
        </div>

        <div className="brand-quote">
          "Antes era tudo por WhatsApp e eu perdia horário todo santo dia. Com o sinal pelo Pix, o furo praticamente sumiu."
          <b>— Studio da Ju, Florianópolis · SC</b>
        </div>
      </aside>

      {/* Painel de formulário (direita) */}
      <main className="form-panel">
        <div className="form-box">
          <div className="mobile-mark">
            <i>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-2.5 3.2-4.5 5.6-4.5 9a4.5 4.5 0 0 0 9 0c0-3.4-2-5.8-4.5-9"/></svg>
            </i>
            Sinaliza
          </div>

          <div className="form-head">
            <span className="eyebrow">Painel do administrador</span>
            <h2>{modo === 'entrar' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
            <p>{modo === 'entrar' ? 'Entre com seus dados para acessar sua agenda.' : 'Leva menos de um minuto para começar.'}</p>
          </div>

          <div className="tabs" role="tablist">
            <button type="button" role="tab" aria-selected={modo === 'entrar'} className={`tab ${modo === 'entrar' ? 'active' : ''}`} onClick={() => trocarModo('entrar')}>
              Entrar
            </button>
            <button type="button" role="tab" aria-selected={modo === 'cadastro'} className={`tab ${modo === 'cadastro' ? 'active' : ''}`} onClick={() => trocarModo('cadastro')}>
              Criar conta
            </button>
          </div>

          {erro && <div className="msg msg-erro">{erro}</div>}
          {sucesso && <div className="msg msg-sucesso">{sucesso}</div>}

          {modo === 'entrar' ? (
            <form onSubmit={handleLogin} noValidate>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <div className="input-shell">
                  <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM4 6l8 7 8-7"/></svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Senha</label>
                <div className="input-shell">
                  <svg viewBox="0 0 24 24"><path d="M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z"/></svg>
                  <input
                    id="password"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} aria-label="Mostrar senha">
                    <svg viewBox="0 0 24 24" width="17" height="17"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>

              <div className="row-between">
                <label className="checkbox-line">
                  <input type="checkbox" defaultChecked />
                  Manter conectado
                </label>
                <a href="#esqueci" className="link" onClick={(e) => { e.preventDefault(); alert('Função em breve!') }}>Esqueci minha senha</a>
              </div>

              <button className={`btn ${carregando ? 'loading' : ''}`} type="submit" disabled={carregando}>
                <span className="spinner"></span>
                <span className="btn-label">Entrar</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} noValidate>
              <div className="field">
                <label htmlFor="nome">Nome completo</label>
                <div className="input-shell">
                  <svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6"/></svg>
                  <input id="nome" type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email-cadastro">E-mail</label>
                <div className="input-shell">
                  <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM4 6l8 7 8-7"/></svg>
                  <input id="email-cadastro" type="email" placeholder="voce@studio.com" value={emailCadastro} onChange={(e) => setEmailCadastro(e.target.value)} required />
                </div>
              </div>

              <div className="field">
                <label htmlFor="senha-cadastro">Senha</label>
                <div className="input-shell">
                  <svg viewBox="0 0 24 24"><path d="M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z"/></svg>
                  <input
                    id="senha-cadastro"
                    type={mostrarSenhaCadastro ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senhaCadastro}
                    onChange={(e) => setSenhaCadastro(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setMostrarSenhaCadastro(!mostrarSenhaCadastro)} aria-label="Mostrar senha">
                    <svg viewBox="0 0 24 24" width="17" height="17"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
                <span className="field-hint">Mínimo 8 caracteres.</span>
              </div>

              <div className="field">
                <label htmlFor="confirmar-senha">Confirmar senha</label>
                <div className="input-shell">
                  <svg viewBox="0 0 24 24"><path d="M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z"/></svg>
                  <input
                    id="confirmar-senha"
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} aria-label="Mostrar senha">
                    <svg viewBox="0 0 24 24" width="17" height="17"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>

              <button className={`btn ${carregando ? 'loading' : ''}`} type="submit" disabled={carregando}>
                <span className="spinner"></span>
                <span className="btn-label">Criar conta</span>
              </button>
            </form>
          )}

          <div className="divider">ou continue com</div>

          <button className="alt-btn" type="button" onClick={handleLoginGoogle}>
            <svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.4 26.8 36 24 36c-5.4 0-9.9-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.6-2.4 4.8-4.4 6.4l6.3 5.3C40.6 36.8 44 31 44 24c0-1.3-.1-2.5-.4-3.5z"/></svg>
            Entrar com Google
          </button>
        </div>
      </main>
    </div>
  )
}