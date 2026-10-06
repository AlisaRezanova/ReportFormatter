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
