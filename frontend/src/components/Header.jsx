import logoImg from '../assets/logo.jpg'
import { Link } from 'react-router-dom'


export default function Header() {
  return (
    <header className="header">
        <Link href="#" className="brand">
          <img src={logoImg} className="brand-icon" alt="" />
          <span className="logo">ReportFormatter</span>
        </Link>
        <nav className="nav" aria-label="Основная навигация">
          <Link href="#" className="nav-link" aria-current="page">
            Форматировать
          </Link>
          <Link href="#" className="nav-link">
            ГОСТы
          </Link>
        </nav>
        <div className="auth">
          <Link href="#" className="auth-login">
            Войти
          </Link>
          <Link href="#" className="auth-signup">
            Регистрация
          </Link>
        </div>
    </header>
  )
}
