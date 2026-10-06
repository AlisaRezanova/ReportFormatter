import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login, register } from '../api.js'

const MIN_PASSWORD = 8

export default function LoginPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const isRegister = params.get('mode') === 'register'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    if (!email.includes('@')) return 'Введите корректную почту'
    if (isRegister && password.length < MIN_PASSWORD) {
      return `Пароль должен быть не короче ${MIN_PASSWORD} символов`
    }
    if (!password) return 'Введите пароль'
    if (isRegister && password !== confirm) return 'Пароли не совпадают'
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setLoading(true)
    try {
      await (isRegister ? register : login)({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
        <p className="lede">
          {isRegister
            ? 'Создайте аккаунт, чтобы сохранять отчеты и свои правила.'
            : 'Войдите, чтобы увидеть свои отчеты.'}
        </p>

        <label className="field">
          <span>Почта</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Пароль</span>
          <input
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {isRegister && (
          <label className="field">
            <span>Повторите пароль</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </label>
        )}

        {error && (
          <p className="status-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Подождите…' : isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>

        <p className="auth-switch">
          {isRegister ? (
            <>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </>
          ) : (
            <>
              Нет аккаунта? <Link to="/login?mode=register">Зарегистрироваться</Link>
            </>
          )}
        </p>
      </form>
    </main>
  )
}
