import React from 'react'
import styles from './Button.module.css'
import clsx from 'clsx'

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant])}
    >
      {children}
    </button>
  )
}

export default Button