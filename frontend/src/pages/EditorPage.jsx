import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { renderAsync } from 'docx-preview'
import Modal from '../components/Modal.jsx'
import RuleForm from '../components/RuleForm.jsx'
import { checkReport, createRule, formatReport, getRules } from '../api.js'

const PARAM_LABELS = {
  margin_left: 'Левое поле',
  margin_right: 'Правое поле',
  margin_top: 'Верхнее поле',
  margin_bottom: 'Нижнее поле',
  font_name: 'Шрифт',
  font_size: 'Размер шрифта',
  line_spacing: 'Межстрочный интервал',
  first_line_indent: 'Абзацный отступ',
}

const MIN_ZOOM = 0.3
const MAX_ZOOM = 3
const ZOOM_STEP = 1.15
const PX_PER_CM = 96 / 2.54

function buildRuler(page) {
  const width = page.offsetWidth
  const style = getComputedStyle(page)
  const left = parseFloat(style.paddingLeft) || 0
  const right = parseFloat(style.paddingRight) || 0

  let html =
    `<span class="ruler-zone" style="left:0;width:${left}px"></span>` +
    `<span class="ruler-zone" style="right:0;width:${right}px"></span>`
  for (let k = -Math.ceil(left / PX_PER_CM) - 1; ; k++) {
    const x = left + k * PX_PER_CM
    if (x > width) break
    if (x >= 0) {
      html += `<span class="ruler-tick" style="left:${x}px"></span>`
      html += `<span class="ruler-num" style="left:${x}px">${Math.abs(k)}</span>`
    }
    const half = x + PX_PER_CM / 2
    if (half >= 0 && half <= width) {
      html += `<span class="ruler-tick is-half" style="left:${half}px"></span>`
    }
  }

  const ruler = document.createElement('div')
  ruler.className = 'doc-ruler'
  ruler.style.width = `${width}px`
  ruler.innerHTML = html
  return ruler
}

function download(blob, name) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

export default function EditorPage({ file }) {
  const previewRef = useRef(null)
  const zoomRef = useRef(1)
  const fitRef = useRef(1)
  const [zoom, setZoom] = useState(1)
  const [previewError, setPreviewError] = useState('')

  const [rules, setRules] = useState([])
  const [ruleId, setRuleId] = useState(null)
  const [issues, setIssues] = useState(null)
  const [busy, setBusy] = useState(null)
  const [formatted, setFormatted] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  function applyZoom(next) {
    const value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next))
    zoomRef.current = value
    setZoom(value)
    const wrapper = previewRef.current?.querySelector('.docx-wrapper')
    if (wrapper) wrapper.style.zoom = value
  }

  useEffect(() => {
    if (!file) return
    const container = previewRef.current
    let cancelled = false
    setPreviewError('')
    container.innerHTML = ''


    const holder = document.createElement('div')
    renderAsync(file, holder)
      .then(() => {
        if (cancelled) return
        container.replaceChildren(...holder.childNodes)
        const wrapper = container.querySelector('.docx-wrapper')
        const page = wrapper?.querySelector('section.docx')
        if (!page) return
        wrapper.prepend(buildRuler(page))
        const fit = Math.min(1, (container.clientWidth - 32) / page.offsetWidth)
        fitRef.current = Math.max(MIN_ZOOM, fit)
        applyZoom(fitRef.current)
      })
      .catch(() => {
        if (!cancelled) setPreviewError('Не удалось показать документ')
      })
    return () => {
      cancelled = true
      container.innerHTML = ''
    }
  }, [file])


  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    function onWheel(event) {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      applyZoom(zoomRef.current * Math.exp(-event.deltaY * 0.002))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [file])

  useEffect(() => {
    getRules()
      .then((list) => {
        setRules(list)
        setRuleId(list[0]?.id ?? null)
      })
      .catch(() => setError('Не удалось загрузить список ГОСТов'))
  }, [])

  if (!file) {
    return (
      <main className="upload">
        <h1>Файл не выбран</h1>
        <p className="lede">
          Сначала <Link to="/">загрузите отчет</Link>.
        </p>
      </main>
    )
  }

  function selectRule(id) {
    setRuleId(id)
    setIssues(null)
    setFormatted(false)
    setError('')
  }

  async function handleCreateRule(data) {
    const rule = await createRule(data)
    setRules((prev) => [...prev, rule])
    selectRule(rule.id)
    setCreating(false)
  }

  async function handleCheck() {
    setBusy('check')
    setError('')
    setFormatted(false)
    try {
      setIssues(await checkReport(file, ruleId))
    } catch {
      setError('Не удалось проверить документ')
    } finally {
      setBusy(null)
    }
  }

  async function handleFormat() {
    setBusy('format')
    setError('')
    try {
      const result = await formatReport(file, ruleId)
      download(result, `formatted_${file.name}`)
      setFormatted(true)
    } catch {
      setError('Не удалось отформатировать документ')
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="editor">
      <section className="editor-preview" aria-label="Предпросмотр документа">
        <div className="editor-toolbar">
          <p className="editor-filename">{file.name}</p>
          <div
            className="zoom"
            role="group"
            aria-label="Масштаб"
            title="Ctrl + колесико мыши"
          >
            <button
              type="button"
              className="zoom-btn"
              onClick={() => applyZoom(zoom / ZOOM_STEP)}
              aria-label="Уменьшить"
            >
              −
            </button>
            <button
              type="button"
              className="zoom-value"
              onClick={() => applyZoom(fitRef.current)}
              title="Подогнать по ширине"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="zoom-btn"
              onClick={() => applyZoom(zoom * ZOOM_STEP)}
              aria-label="Увеличить"
            >
              +
            </button>
          </div>
        </div>
        {previewError && (
          <p className="status-error" role="alert">
            {previewError}
          </p>
        )}
        <div ref={previewRef} className="doc-preview" />
      </section>

      <aside className="editor-panel">
        <fieldset className="rule-list">
          <legend>Выберите ГОСТ</legend>
          {rules.map((rule) => (
            <label
              key={rule.id}
              className={`rule-option${rule.id === ruleId ? ' is-selected' : ''}`}
            >
              <input
                type="radio"
                name="rule"
                checked={rule.id === ruleId}
                onChange={() => selectRule(rule.id)}
              />
              <span>{rule.name}</span>
            </label>
          ))}
          <button type="button" className="rule-add" onClick={() => setCreating(true)}>
            + Добавить правило
          </button>
        </fieldset>

        <div className="result" aria-live="polite">
          {issues === null && (
            <p className="hint">Нажмите «Проверить», чтобы увидеть замечания.</p>
          )}
          {issues && issues.length === 0 && (
            <p className="status-ok">Оформление соответствует ГОСТ</p>
          )}
          {issues && issues.length > 0 && (
            <>
              <p className="result-title">Найдено замечаний: {issues.length}</p>
              <ul className="issue-list">
                {issues.map((issue) => (
                  <li key={issue.id} className="issue">
                    <strong>{PARAM_LABELS[issue.parameter] ?? issue.parameter}</strong>
                    <span>
                      сейчас {issue.actual}, нужно {issue.expected}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {formatted && (
            <p className="status-ok">Готово: отформатированный файл скачан</p>
          )}
          {error && (
            <p className="status-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="panel-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCheck}
            disabled={busy !== null || ruleId === null}
          >
            {busy === 'check' ? 'Проверяем…' : 'Проверить'}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleFormat}
            disabled={busy !== null || ruleId === null}
          >
            {busy === 'format' ? 'Форматируем…' : 'Исправить'}
          </button>
        </div>
      </aside>

      <Modal open={creating} onClose={() => setCreating(false)}>
        <RuleForm onSubmit={handleCreateRule} onCancel={() => setCreating(false)} />
      </Modal>
    </main>
  )
}
