import API from '../api'

export default {
  install (Vue) {
    const api = API.create()
    Vue.API = api
    Vue.prototype.API = api
  }
}
