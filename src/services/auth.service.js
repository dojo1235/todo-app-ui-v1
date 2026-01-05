// src/services/authService.js
import api from './api.service'

const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  async register(email, password) {
    const res = await api.post('/auth/register', { email, password })
    return res.data
  },

  async refresh(refreshToken) {
    const res = await api.post('/auth/refresh', { refreshToken })
    return res.data
  },

  async logout(refreshToken) {
    const res = await api.post('/auth/logout', { refreshToken })
    return res.data
  },

  async logoutAll(refreshToken) {
    const res = await api.post('/auth/logout-all', { refreshToken })
    return res.data
  },
}

export default authService