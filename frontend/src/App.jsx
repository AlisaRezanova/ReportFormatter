import './App.css'
import Header from './components/Header.jsx'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import FormatPage from './pages/FormatPage.jsx'
import EditorPage from './pages/EditorPage.jsx'
import RulesPage from './pages/RulesPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

export default function App() {
  const [file, setFile] = useState(null)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FormatPage onPick={setFile} />} />
        <Route path="/editor" element={<EditorPage file={file} />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}
