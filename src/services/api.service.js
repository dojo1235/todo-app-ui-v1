import axios from 'axios'
import tokensService from './tokens.service'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Core axios instance used across app (attaches access token)
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// A plain axios instance for auth calls (no interceptors) to avoid circular refresh loops.
const plainAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = tokensService.getAccessToken()
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If response status is 401 and request has not been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue request until refresh finishes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokensService.getRefreshToken()
      if (!refreshToken) {
        tokensService.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const resp = await plainAxios.post('/auth/refresh', { refreshToken })
        const newAccess = resp.data.data.tokens.accessToken
        const newRefresh = resp.data.data.tokens.refreshToken
        tokensService.setTokens({ accessToken: newAccess, refreshToken: newRefresh })
        processQueue(null, newAccess)
        originalRequest.headers.Authorization = 'Bearer ' + newAccess
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        tokensService.clearTokens()
        // redirect to login forced
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api



/*
// src/services/api.service.js
import axios from 'axios'
import tokensService from './tokens.service'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Core axios instance used across app (attaches access token)
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Plain axios instance for auth calls (no interceptors)
const plainAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Attach access token to all requests
api.interceptors.request.use(
  (config) => {
    const token = tokensService.getAccessToken()
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor handles 401s and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokensService.getRefreshToken()
      if (!refreshToken) {
        tokensService.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Send refresh token to backend
        const resp = await plainAxios.post('/auth/refresh', { refreshToken })
        const newAccess = resp.data.data.tokens.accessToken
        const newRefresh = resp.data.data.tokens.refreshToken

        // Update localStorage with new tokens
        tokensService.setTokens({ accessToken: newAccess, refreshToken: newRefresh })

        // Process queued requests
        processQueue(null, newAccess)

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        tokensService.clearTokens()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api*/