import { useState } from 'react'
import { supabase } from '../../utilitarios/supabase'

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('E-mail ou senha incorretos.')
      setCarregando(false)
    }
  }

  async function handleLoginGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/painel'
      }
    })

    if (error) {
      setErro('Erro ao entrar com o Google: ' + error.message)
    }
  }

  return (
    <div className="wrap">
      {/* Painel de marca (esquerda) */}
      <aside className="brand-panel">
        <div className="brand-mark">
          <i>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#6938ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-2.5 3.2-4.5 5.6-4.5 9a4.5 4.5 0 0 0 9 0c0-3.4-2-5.8-4.5-9"/></svg>
          </i>
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
            <span className="eyebrow">Painel do prestador</span>
            <h2>Bem-vindo de volta</h2>
            <p>Entre com seus dados para acessar sua agenda.</p>
          </div>

          {erro && <div style={{ color: '#ef6254', marginBottom: '16px', fontSize: '13px', fontWeight: '600' }}>{erro}</div>}

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
                  type={mostrarSenha ? "text" : "password"} 
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
              <a href="#esqueci" className="link" onClick={(e) => { e.preventDefault(); alert('Função em breve!'); }}>Esqueci minha senha</a>
            </div>

            <button className={`btn ${carregando ? 'loading' : ''}`} type="submit" disabled={carregando}>
              <span className="spinner"></span>
              <span className="btn-label">Entrar</span>
            </button>
          </form>

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