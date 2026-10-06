import './App.css'
import Header from './components/Header.jsx'
import { Routes, Route } from 'react-router-dom'
import FormatPage from './pages/FormatPage.jsx'
import RulesPage from './pages/RulesPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FormatPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}
