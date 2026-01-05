import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'

import './index.css' // global resets (you can create or keep empty)

const container = document.getElementById('root')
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toast /> {/* Toast container mounted once at app root */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)