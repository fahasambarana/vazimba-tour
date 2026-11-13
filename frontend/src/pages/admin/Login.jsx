import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { authApi, getErrorMessage } from '../../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.login({ email, password })
      localStorage.setItem('vazimba-token', data.token)
      navigate('/admin', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <Link to="/" className="back-link">← Retour au site</Link>
      <form className="login-card" onSubmit={submit}>
        <span className="login-mark"><ShieldCheck size={24} /></span>
        <div className="eyebrow">ESPACE ÉQUIPE</div>
        <h1>Bon retour.</h1>
        <p>Connectez-vous pour gérer vos circuits et demandes.</p>
        {error && <div className="error-message">{error}</div>}
        <label className="field"><span>Adresse e-mail</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="field"><span>Mot de passe</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button className="button button-dark full-button" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'} <ArrowRight size={16} /></button>
      </form>
    </main>
  )
}
export default LoginPage
