import api from './api.service'

const usersService = {
  getUser() {
    // returns axios response
    return api.get('/users/me').then((r) => r.data)
  },
}

export default usersService