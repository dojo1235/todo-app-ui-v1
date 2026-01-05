import React, { createContext, useEffect, useState } from 'react'
import tokensService from '../services/tokens.service'
import authService from '../services/auth.service'
import usersService from '../services/users.service'
import { toast } from 'react-toastify'

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  login: async () => {},
  logout: async () => {},
  logoutAll: async () => {},
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const isAuthenticated = Boolean(user)

  // Load user if tokens exist
  useEffect(() => {
    const init = async () => {
      const access = tokensService.getAccessToken()
      const refresh = tokensService.getRefreshToken()
      if (access && refresh) {
        try {
          const res = await usersService.getUser()
          setUser(res.data.user)
        } catch (err) {
          // If profile fetch fails, try to clear tokens
          tokensService.clearTokens()
        }
      }
      setIsInitializing(false)
    }
    init()
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    tokensService.setTokens(res.data.tokens)
    // fetch user profile
    const profile = await usersService.getUser()
    setUser(profile.data.user)
    toast.success('Logged in successfully')
    return profile.data.user
  }

  const register = async (email, password) => {
    const res = await authService.register(email, password)
    tokensService.setTokens(res.data.tokens)
    const profile = await usersService.getUser()
    setUser(profile.data.user)
    toast.success('Account created')
    return profile.data.user
  }

  const logout = async () => {
    try {
      const refreshToken = tokensService.getRefreshToken()
      if (refreshToken) await authService.logout(refreshToken)
    } catch (err) {
      // ignore backend errors
    } finally {
      tokensService.clearTokens()
      setUser(null)
      toast.info('Logged out')
      // Force navigation to login
      window.location.href = '/login'
    }
  }

  const logoutAll = async () => {
    try {
      const refreshToken = tokensService.getRefreshToken()
      if (refreshToken) await authService.logoutAll(refreshToken)
    } catch (err) {
      // ignore
    } finally {
      tokensService.clearTokens()
      setUser(null)
      toast.info('Logged out from all devices')
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        login,
        register,
        logout,
        logoutAll,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}