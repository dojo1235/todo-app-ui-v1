import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header/Header'
import { AuthContext } from './context/AuthContext'

const App = () => {
  const { isInitializing } = useContext(AuthContext)

  // While AuthContext determines if user is logged in (initial load), you may show nothing / loader.
  if (isInitializing) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fb' }}>
      <Header />
      <main style={{ padding: '24px', maxWidth: 980, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App