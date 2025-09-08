import { api } from './api'

const TOKEN_KEY = 'qrmenu_token'

export function getToken() {
	return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
	localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
	localStorage.removeItem(TOKEN_KEY)
}

export async function login(email, password) {
	const { data } = await api.post('/auth/login', { email, password })
	setToken(data.token)
	return data
}

// Attach token to requests
api.interceptors.request.use((config) => {
	const token = getToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})


