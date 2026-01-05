import React from 'react'
import styles from './TodoItem.module.css'
import Button from '../Button/Button'

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <div className={styles.item}>
      <label className={styles.left}>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onToggle(todo)}
          className={styles.checkbox}
        />
        <span className={todo.isCompleted ? styles.titleCompleted : styles.title}>
          {todo.title}
        </span>
      </label>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => onEdit(todo)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(todo)}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default TodoItem