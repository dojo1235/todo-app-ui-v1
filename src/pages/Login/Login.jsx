import React, { useContext, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import styles from './Login.module.css'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Sign in</h2>

        <label className={styles.label}>
          Email
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        <div className={styles.row}>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader size={18} /> : 'Sign in'}
          </Button>
          <Link to="/register" className={styles.link}>
            Create account
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login