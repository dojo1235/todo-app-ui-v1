const ACCESS_KEY = 'todo_app_access_token'
const REFRESH_KEY = 'todo_app_refresh_token'

const tokensService = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_KEY)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY)
  },

  setTokens({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

export default tokensService