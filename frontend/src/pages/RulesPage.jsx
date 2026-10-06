import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Modal from '../components/Modal.jsx'
import RuleForm from '../components/RuleForm.jsx'
import { createRule, getRules } from '../api.js'

const fmt = (n) => String(n).replace('.', ',')

export default function RulesPage() {
  const [params, setParams] = useSearchParams()
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const creating = params.get('new') === '1'

  useEffect(() => {
    getRules()
      .then(setRules)
      .catch(() => setError('Не удалось загрузить список ГОСТов'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(data) {
    const rule = await createRule(data)
    setRules((prev) => [...prev, rule])
    setParams({})
  }

  return (
    <main className="rules-page">
      <div className="rules-head">
        {!creating && (
          <button type="button" className="btn-primary" onClick={() => setParams({ new: '1' })}>
            + Новое правило
          </button>
        )}
      </div>

      <Modal open={creating} onClose={() => setParams({})}>
        <RuleForm onSubmit={handleCreate} onCancel={() => setParams({})} />
      </Modal>

      {error && (
        <p className="status-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="hint">Загружаем…</p>}

      <ul className="rule-cards">
        {rules.map((rule) => (
          <li key={rule.id} className="rule-card">
            <div className="rule-card-head">
              <h2>{rule.name}</h2>
              <span className={`badge${rule.owner_id === null ? '' : ' is-own'}`}>
                {rule.owner_id === null ? 'Встроенное' : 'Мое'}
              </span>
            </div>
            <p>
              Поля (л / п / в / н): {fmt(rule.margin_left)} / {fmt(rule.margin_right)} /{' '}
              {fmt(rule.margin_top)} / {fmt(rule.margin_bottom)} см
            </p>
            <p>
              {rule.font_name}, {rule.font_size} pt · интервал {fmt(rule.line_spacing)} · отступ{' '}
              {fmt(rule.first_line_indent)} см
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
