import request from './request'

export const getTodos = (params) => {
  return request.get('/todos', { params })
}

export const createTodo = (data) => {
  return request.post('/todos', data)
}

export const updateTodo = (id, data) => {
  return request.put(`/todos/${id}`, data)
}

export const deleteTodo = (id) => {
  return request.delete(`/todos/${id}`)
}
