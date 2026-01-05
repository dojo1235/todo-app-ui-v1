import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Register.module.css'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(email, password)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create account</h2>

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
            {loading ? <Loader size={18} /> : 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Register