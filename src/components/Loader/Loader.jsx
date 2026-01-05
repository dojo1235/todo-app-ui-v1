import React from 'react'
import styles from './Loader.module.css'

const Loader = ({ size = 36 }) => {
  return (
    <div className={styles.container} style={{ ['--size']: `${size}px` }}>
      <div className={styles.spinner} />
    </div>
  )
}

export default Loader