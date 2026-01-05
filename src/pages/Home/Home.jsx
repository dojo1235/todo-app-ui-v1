import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import Button from '../../components/Button/Button'

const Home = () => {
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>TodoPro</h1>
        <p className={styles.subtitle}>
          A minimal professional todo app built with React, optimized for small teams and
          personal productivity.
        </p>

        <div className={styles.actions}>
          <Link to="/register">
            <Button>Get started</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Home