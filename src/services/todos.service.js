import api from './api.service'

const todosService = {
  getTodos() {
    return api.get('/todos').then((r) => r.data)
  },

  getTodo(todoId) {
    return api.get(`/todos/${todoId}`).then((r) => r.data)
  },

  addTodo(payload) {
    return api.post('/todos', payload).then((r) => r.data)
  },

  updateTodo(todoId, payload) {
    return api.patch(`/todos/${todoId}`, payload).then((r) => r.data)
  },

  deleteTodo(todoId) {
    return api.delete(`/todos/${todoId}`).then((r) => r.data)
  },
}

export default todosService