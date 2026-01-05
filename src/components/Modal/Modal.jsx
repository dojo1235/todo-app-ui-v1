import React from 'react'
import ReactModal from 'react-modal'
import styles from './Modal.module.css'

ReactModal.setAppElement('#root')

const Modal = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={styles.overlay}
      className={styles.content}
      shouldCloseOnOverlayClick={true}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.body}>{children}</div>
    </ReactModal>
  )
}

export default Modal