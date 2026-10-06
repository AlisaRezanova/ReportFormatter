import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const isDocx = (file) => file.name.toLowerCase().endsWith('.docx')

export default function FormatPage({ onPick }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  function pick(picked) {
    if (!picked) return
    if (!isDocx(picked)) {
      setError('Нужен файл в формате .docx')
      return
    }
    setError('')
    setFile(picked)
    onPick(picked)
    navigate('/editor')
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    pick(event.dataTransfer.files[0])
  }

  return (
      <main className="upload">
        <h1>{file ? 'Загрузите другой отчет .docx' : 'Загрузите отчет .docx'}</h1>
        <p className="lede">
          Проверим оформление по ГОСТ и приведем отчет в порядок.
        </p>

        <div
          className={`dropzone${dragging ? ' is-dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {file ? (
            <p className="file-name">{file.name}</p>
          ) : (
            <p className="dropzone-text">Перетащите файл сюда или</p>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".docx"
            hidden
            onChange={(event) => {
              pick(event.target.files[0])
              event.target.value = ''
            }}
          />
          <button
            type="button"
            className="btn-primary"
            onClick={() => inputRef.current.click()}
          >
            {file ? 'Выбрать другой файл' : 'Загрузить файл'}
          </button>

          {error ? (
            <p className="status-error" role="alert">
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path
                  d="M10 2 1.5 17h17L10 2Zm0 5.5v4.5m0 2v.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {error}
            </p>
          ) : (
            <p className="hint">Подходит только формат .docx</p>
          )}
        </div>
      </main>
  )
}