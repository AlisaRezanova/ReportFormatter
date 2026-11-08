import { useState } from 'react'
import {
  palettes, fontSets, shapes, shadows, backgrounds, radii, effects, loadTheme, applyTheme,
} from '../theme.js'

function Choice({ legend, items, value, onPick }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="theme-shape">
        {items.map((i) => (
          <button
            key={i.id}
            type="button"
            className="theme-option"
            aria-pressed={value === i.id}
            onClick={() => onPick(i.id)}
          >
            {i.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

// Временный компонент: убрать из App.jsx, когда оформление определится.
export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(loadTheme)

  function change(patch) {
    const next = { ...theme, ...patch }
    setTheme(next)
    applyTheme(next)
  }

  return (
    <>
      {open && (
        <div className="theme-panel" role="dialog" aria-label="Оформление">
          <fieldset>
            <legend>Цвета</legend>
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                className="theme-option"
                aria-pressed={theme.palette === p.id}
                onClick={() => change({ palette: p.id })}
              >
                <span className="theme-swatches" aria-hidden="true">
                  {['primary', 'background', 'accent', 'primary-strong'].map((k) => (
                    <i key={k} style={{ background: p.vars[k] }} />
                  ))}
                </span>
                {p.name}
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>Шрифты</legend>
            {fontSets.map((f) => (
              <button
                key={f.id}
                type="button"
                className="theme-option"
                style={{ fontFamily: f.text }}
                aria-pressed={theme.font === f.id}
                onClick={() => change({ font: f.id })}
              >
                <b style={{ fontFamily: f.main }}>Аа</b>
                {f.name}
              </button>
            ))}
          </fieldset>
          <Choice legend="Рамки" items={shapes} value={theme.shape} onPick={(shape) => change({ shape })} />
          <Choice legend="Тени" items={shadows} value={theme.shadow} onPick={(shadow) => change({ shadow })} />
          <Choice legend="Скругления" items={radii} value={theme.radius} onPick={(radius) => change({ radius })} />
          <Choice legend="Фон" items={backgrounds} value={theme.bg} onPick={(bg) => change({ bg })} />
          <fieldset>
            <legend>Эффекты</legend>
            <div className="theme-shape">
              {effects.map((e) => {
                const on = theme.fx.includes(e.id)
                return (
                  <button
                    key={e.id}
                    type="button"
                    className="theme-option"
                    aria-pressed={on}
                    onClick={() =>
                      change({ fx: on ? theme.fx.filter((x) => x !== e.id) : [...theme.fx, e.id] })
                    }
                  >
                    {e.name}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <button
            type="button"
            className="theme-option"
            onClick={() => change({ shape: 'soft', shadow: 'soft', bg: 'plain', radius: 'normal', fx: [] })}
          >
            Сбросить эффекты
          </button>
        </div>
      )}
      <button
        type="button"
        className="theme-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        Оформление
      </button>
    </>
  )
}
