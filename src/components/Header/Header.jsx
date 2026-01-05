import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { AuthContext } from '../../context/AuthContext'
import Button from '../Button/Button'

const Header = () => {
  const { user, logout, logoutAll } = useContext(AuthContext)

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src="/logo192.png" alt="Logo" className={styles.logo} />
        <Link to="/" className={styles.brand}>
          TodoPro
        </Link>
      </div>

      <div className={styles.right}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.email
                )}&background=0D8ABC&color=fff&size=48`}
                alt="user"
                className={styles.avatar}
              />
              <div className={styles.welcome}>
                <span className={styles.hello}>Welcome</span>
                <span className={styles.email}>{user.email}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
              <Button variant="danger" onClick={logoutAll}>
                Logout all
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
            <Link to="/register" className={styles.link}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header