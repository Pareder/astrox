import API from '../api'

export default {
  install (Vue) {
    Vue.API = API.create()
  }
}
