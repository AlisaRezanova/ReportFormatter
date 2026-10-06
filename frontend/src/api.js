// Единственное место, где фронтенд "общается с сервером".
// Пока бэкенда нет, USE_MOCK = true: функции возвращают заготовленные ответы.
// Когда появятся эндпоинты, поставьте false и допишите реальные запросы.
const USE_MOCK = true

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function login({ email, password }) {
  if (USE_MOCK) {
    await delay(700)
    if (password === 'wrong') {
      throw new Error('Неверная почта или пароль')
    }
    return { id: 1, email }
  }
  // TODO: POST /api/auth/login
}

export async function register({ email, password }) {
  if (USE_MOCK) {
    await delay(700)
    if (email === 'taken@example.com') {
      throw new Error('Пользователь с такой почтой уже существует')
    }
    return { id: 1, email }
  }
  // TODO: POST /api/auth/register
}

// Формат совпадает с RuleRead из backend/app/schemas.py
const MOCK_RULES = [
  {
    id: 1,
    owner_id: null,
    name: 'ГОСТ 7.32-2017 (отчет о НИР)',
    margin_left: 30,
    margin_right: 10,
    margin_top: 20,
    margin_bottom: 20,
    font_name: 'Times New Roman',
    font_size: 14,
    line_spacing: 1.5,
    first_line_indent: 12.5,
  },
  {
    id: 2,
    owner_id: null,
    name: 'ГОСТ 2.105-2019 (текстовые документы)',
    margin_left: 20,
    margin_right: 10,
    margin_top: 20,
    margin_bottom: 20,
    font_name: 'Times New Roman',
    font_size: 14,
    line_spacing: 1.5,
    first_line_indent: 12.5,
  },
]

export async function getRules() {
  if (USE_MOCK) {
    await delay(300)
    return MOCK_RULES
  }
  // TODO: GET /api/rules
}

// Формат совпадает с IssueRead: { id, parameter, expected, actual }
export async function checkReport(file, ruleId) {
  if (USE_MOCK) {
    await delay(1000)
    return [
      { id: 1, parameter: 'margin_left', expected: '30 мм', actual: '20 мм' },
      { id: 2, parameter: 'font_name', expected: 'Times New Roman', actual: 'Arial' },
      { id: 3, parameter: 'font_size', expected: '14 pt', actual: '12 pt' },
      { id: 4, parameter: 'line_spacing', expected: '1,5', actual: '1,0' },
    ]
  }
  // TODO: POST /api/reports (multipart: file, rule_id)
}

// Возвращает Blob с отформатированным документом.
// Пока мок отдает исходный файл без изменений.
export async function formatReport(file, ruleId) {
  if (USE_MOCK) {
    await delay(1200)
    return file
  }
  // TODO: POST /api/reports/{id}/format
}
