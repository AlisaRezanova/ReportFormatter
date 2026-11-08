// Временная система тем для экспериментов с оформлением.
const base = {
  surface: '#ffffff',
  'on-strong': '#ffffff',
  'on-accent': '#4A4A4A',
}

export const palettes = [
  {
    id: 'powder',
    name: 'Пудра (текущая)',
    vars: { ...base, primary: '#E6C7C2', background: '#FFFBF0', error: '#F5C8BF', correct: '#B9E4C9', accent: '#F7E8A1', text: '#4A4A4A', 'primary-strong': '#A65F5A', border: '#C79A94', 'error-text': '#A3382B' },
  },
  {
    id: 'mint',
    name: 'Мята',
    vars: { ...base, 'on-accent': '#2F3B36', primary: '#BFE0D2', background: '#F5FBF7', error: '#F7C9C0', correct: '#CBEBC8', accent: '#FFE08A', text: '#2F3B36', 'primary-strong': '#2F7A5E', border: '#7FB59C', 'error-text': '#A3382B' },
  },
  {
    id: 'lavender',
    name: 'Лаванда',
    vars: { ...base, 'on-accent': '#3B3550', primary: '#D9D0F0', background: '#FAF8FF', error: '#F8CFD0', correct: '#C6EBD6', accent: '#FFE9A8', text: '#3B3550', 'primary-strong': '#6A55B8', border: '#A99BDB', 'error-text': '#A3304B' },
  },
  {
    id: 'ocean',
    name: 'Океан',
    vars: { ...base, 'on-accent': '#2B3A4A', primary: '#CFE3F2', background: '#F7FAFD', error: '#F9CDC4', correct: '#BFE6D0', accent: '#FFE08A', text: '#2B3A4A', 'primary-strong': '#2B6CA3', border: '#8FB5D6', 'error-text': '#A3382B' },
  },
  {
    id: 'mono',
    name: 'Чёрно-белая + жёлтый',
    vars: { ...base, 'on-accent': '#111111', primary: '#EDEDED', background: '#FFFFFF', error: '#FFD2CC', correct: '#C8EFD4', accent: '#FFD84D', text: '#111111', 'primary-strong': '#111111', border: '#111111', 'error-text': '#B3261E' },
  },
  {
    id: 'dark',
    name: 'Тёмная',
    vars: { surface: '#2A2C33', 'on-strong': '#2A1514', 'on-accent': '#2A2410', primary: '#3A3D47', background: '#1E1F24', error: '#5A2F2B', correct: '#24493A', accent: '#F2D675', text: '#E8E6E1', 'primary-strong': '#E3A09A', border: '#5A5E6B', 'error-text': '#FFB4A8' },
  },
]

export const fontSets = [
  { id: 'quicksand', name: 'Quicksand + Inter (текущие)', main: '"Quicksand"', text: '"Inter"' },
  { id: 'nunito', name: 'Nunito + Inter', main: '"Nunito"', text: '"Inter"' },
  { id: 'manrope', name: 'Manrope', main: '"Manrope"', text: '"Manrope"' },
  { id: 'unbounded', name: 'Unbounded + Onest', main: '"Unbounded"', text: '"Onest"' },
  { id: 'playfair', name: 'Playfair Display + Source Sans', main: '"Playfair Display"', text: '"Source Sans 3"' },
  { id: 'montserrat', name: 'Montserrat + IBM Plex Sans', main: '"Montserrat"', text: '"IBM Plex Sans"' },
]

export const shapes = [
  { id: 'soft', name: 'Мягкая', border: '1.5px' },
  { id: 'bold', name: 'Контурная', border: '2.5px' },
]

export const shadows = [
  { id: 'soft', name: 'Мягкая' },
  { id: 'deep', name: 'Глубокая' },
  { id: 'glow', name: 'Свечение' },
  { id: 'hard', name: 'Жёсткая' },
  { id: 'none', name: 'Без теней' },
]

export const backgrounds = [
  { id: 'plain', name: 'Ровный' },
  { id: 'blobs', name: 'Пятна света' },
  { id: 'dots', name: 'Точки' },
  { id: 'grid', name: 'Сетка' },
  { id: 'grain', name: 'Зерно' },
]

export const radii = [
  { id: 'sharp', name: 'Острые' },
  { id: 'normal', name: 'Обычные' },
  { id: 'round', name: 'Круглые' },
]

export const effects = [
  { id: 'glass', name: 'Стеклянная шапка' },
  { id: 'lift', name: 'Карточки приподнимаются' },
  { id: 'gradient', name: 'Градиент на кнопках' },
  { id: 'shine', name: 'Блик на кнопках' },
  { id: 'float', name: 'Парящая зона загрузки' },
]

const KEY = 'rf-theme'
export const defaults = { palette: 'powder', font: 'quicksand', shape: 'soft', shadow: 'soft', bg: 'plain', radius: 'normal', fx: [] }

export function loadTheme() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return defaults
  }
}

export function applyTheme(theme) {
  const root = document.documentElement.style
  const palette = palettes.find((p) => p.id === theme.palette) ?? palettes[0]
  for (const [k, v] of Object.entries(palette.vars)) root.setProperty(`--color-${k}`, v)
  const font = fontSets.find((f) => f.id === theme.font) ?? fontSets[0]
  root.setProperty('--font-main', font.main)
  root.setProperty('--font-text', font.text)
  const el = document.documentElement
  el.dataset.shadow = theme.shadow
  el.dataset.bg = theme.bg
  el.dataset.radius = theme.radius
  el.dataset.fx = (theme.fx ?? []).join(' ')
  const shape = shapes.find((s) => s.id === theme.shape) ?? shapes[0]
  root.setProperty('--border-w', shape.border)
  try {
    localStorage.setItem(KEY, JSON.stringify(theme))
  } catch {
    // без localStorage тема просто не запомнится
  }
}
