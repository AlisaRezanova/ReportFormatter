import logoImg from '../assets/logo.jpg'
import { Link, NavLink } from 'react-router-dom'


export default function Header() {
  return (
    <header className="header">
        <Link to="/" className="brand">
          <img src={logoImg} className="brand-icon" alt="" />
          <span className="logo">ReportFormatter</span>
        </Link>
        <nav className="nav" aria-label="Основная навигация">
          <NavLink to="/" end className="nav-link">
            Форматировать
          </NavLink>
          <NavLink to="/reports" className="nav-link">
            Мои отчеты
          </NavLink>
          <NavLink to="/rules" className="nav-link">
            ГОСТы
          </NavLink>
        </nav>
        <div className="auth">
          <Link to="/login" className="auth-login">
            Войти
          </Link>
          <Link to="/login?mode=register" className="auth-signup">
            Регистрация
          </Link>
        </div>
    </header>
  )
}
