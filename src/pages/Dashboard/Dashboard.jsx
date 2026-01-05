import React, { useContext, useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import todosService from '../../services/todos.service'
import Loader from '../../components/Loader/Loader'
import TodoItem from '../../components/TodoItem/TodoItem'
import Button from '../../components/Button/Button'
import Modal from '../../components/Modal/Modal'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [editingTodo, setEditingTodo] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const res = await todosService.getTodos()
      setTodos(res.data.todos)
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      const res = await todosService.addTodo({ title: newTitle.trim(), isCompleted: false })
      setTodos((s) => [res.data.todo, ...s])
      setNewTitle('')
      toast.success('Todo added')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to add todo')
    } finally {
      setAdding(false)
    }
  }

  const handleToggle = async (todo) => {
    try {
      const res = await todosService.updateTodo(todo.id, {
        title: todo.title,
        isCompleted: !todo.isCompleted,
      })
      setTodos((s) => s.map((t) => (t.id === todo.id ? res.data.todo : t)))
      toast.success('Todo updated')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to update todo')
    }
  }

  const confirmDelete = (todo) => {
    setDeleteCandidate(todo)
  }

  const doDelete = async () => {
    if (!deleteCandidate) return
    try {
      await todosService.deleteTodo(deleteCandidate.id)
      setTodos((s) => s.filter((t) => t.id !== deleteCandidate.id))
      toast.success('Todo deleted')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to delete todo')
    } finally {
      setDeleteCandidate(null)
    }
  }

  const startEdit = (todo) => {
    setEditingTodo(todo)
    setEditingTitle(todo.title)
  }

  const saveEdit = async () => {
    if (!editingTodo) return
    try {
      const res = await todosService.updateTodo(editingTodo.id, {
        title: editingTitle.trim(),
        isCompleted: editingTodo.isCompleted,
      })
      setTodos((s) => s.map((t) => (t.id === editingTodo.id ? res.data.todo : t)))
      setEditingTodo(null)
      setEditingTitle('')
      toast.success('Todo updated')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to update todo')
    }
  }

  return (
    <section>
      <header className={styles.header}>
        <h2 className={styles.title}>Your Todos</h2>
        <div className={styles.sub}>Welcome {user?.email}</div>
      </header>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          className={styles.input}
          placeholder="Add new todo"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button type="submit" disabled={adding}>
          {adding ? <Loader size={18} /> : 'Add'}
        </Button>
      </form>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.center}>
            <Loader size={48} />
          </div>
        ) : todos.length === 0 ? (
          <div className={styles.empty}>No todos yet. Add your first todo.</div>
        ) : (
          <div className={styles.grid}>
            {todos.map((todo) =>
              editingTodo && editingTodo.id === todo.id ? (
                <div key={todo.id} className={styles.editCard}>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className={styles.editInput}
                  />
                  <div className={styles.editActions}>
                    <Button variant="ghost" onClick={() => setEditingTodo(null)}>
                      Cancel
                    </Button>
                    <Button onClick={saveEdit}>Save</Button>
                  </div>
                </div>
              ) : (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={confirmDelete}
                  onEdit={startEdit}
                />
              )
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(deleteCandidate)}
        onRequestClose={() => setDeleteCandidate(null)}
        title="Confirm delete"
      >
        <p>Are you sure you want to delete this todo?</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteCandidate(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={doDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </section>
  )
}

export default Dashboard