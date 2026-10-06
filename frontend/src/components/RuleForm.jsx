import { useState } from 'react'

const DEFAULTS = {
  name: '',
  margin_left: 3,
  margin_right: 1.5,
  margin_top: 2,
  margin_bottom: 2,
  font_name: 'Times New Roman',
  font_size: 12,
  line_spacing: 1.5,
  first_line_indent: 1.25,
  heading_font_name: 'Times New Roman',
  heading_font_size: 12,
}

const NUMBER_FIELDS = [
  { key: 'margin_left', label: 'Левое поле, см', step: 0.1 },
  { key: 'margin_right', label: 'Правое поле, см', step: 0.1 },
  { key: 'margin_top', label: 'Верхнее поле, см', step: 0.1 },
  { key: 'margin_bottom', label: 'Нижнее поле, см', step: 0.1 },
  { key: 'font_size', label: 'Размер шрифта, pt', step: 1, integer: true },
  { key: 'line_spacing', label: 'Межстрочный интервал', step: 0.05 },
  { key: 'first_line_indent', label: 'Абзацный отступ, см', step: 0.05 },
  { key: 'heading_font_size', label: 'Размер заголовков, pt', step: 1, integer: true },
]

export default function RuleForm({ onSubmit, onCancel }) {
  const [values, setValues] = useState(DEFAULTS)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function change(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    if (!values.name.trim()) return 'Введите название правила'
    if (!values.font_name.trim() || !values.heading_font_name.trim()) {
      return 'Укажите название шрифта'
    }
    for (const field of NUMBER_FIELDS) {
      const value = Number(values[field.key])
      if (!Number.isFinite(value) || value <= 0) {
        return `Поле «${field.label}» должно быть числом больше нуля`
      }
    }
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
    setSaving(true)
    try {
      const data = { ...values, name: values.name.trim() }
      for (const field of NUMBER_FIELDS) data[field.key] = Number(values[field.key])
      await onSubmit(data)
    } catch {
      setError('Не удалось сохранить правило')
      setSaving(false)
    }
  }

  return (
    <form className="rule-form" onSubmit={handleSubmit} noValidate>
      <h2>Новое правило</h2>

      <label className="field rule-form-wide">
        <span>Название</span>
        <input
          type="text"
          value={values.name}
          onChange={(event) => change('name', event.target.value)}
          placeholder="Например, Методичка кафедры"
          required
        />
      </label>

      <label className="field">
        <span>Шрифт текста</span>
        <input
          type="text"
          value={values.font_name}
          onChange={(event) => change('font_name', event.target.value)}
        />
      </label>

      <label className="field">
        <span>Шрифт заголовков</span>
        <input
          type="text"
          value={values.heading_font_name}
          onChange={(event) => change('heading_font_name', event.target.value)}
        />
      </label>

      {NUMBER_FIELDS.map((field) => (
        <label key={field.key} className="field">
          <span>{field.label}</span>
          <input
            type="number"
            step={field.step}
            min="0"
            value={values[field.key]}
            onChange={(event) => change(field.key, event.target.value)}
          />
        </label>
      ))}

      {error && (
        <p className="status-error rule-form-wide" role="alert">
          {error}
        </p>
      )}

      <div className="rule-form-actions rule-form-wide">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Отмена
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Сохраняем…' : 'Сохранить'}
        </button>
      </div>
    </form>
  )
}
