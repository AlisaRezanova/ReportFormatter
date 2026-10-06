import logoImg from '../assets/logo.jpg'

export default function Header() {
  return (
    <header className="header">
        <a href="#" className="brand">
          <img src={logoImg} className="brand-icon" alt="" />
          <span className="logo">ReportFormatter</span>
        </a>
        <nav className="nav" aria-label="Основная навигация">
          <a href="#" className="nav-link" aria-current="page">
            Форматировать
          </a>
          <a href="#" className="nav-link">
            ГОСТы
          </a>
        </nav>
        <div className="auth">
          <a href="#" className="auth-login">
            Войти
          </a>
          <a href="#" className="auth-signup">
            Регистрация
          </a>
        </div>
    </header>
  )
}
