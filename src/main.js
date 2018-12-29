import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import VueLazyload from 'vue-lazyload'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueProgressBar from 'vue-progressbar'
import store from './store'
import App from './App'
import router from './router'

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC9H_ZF0P-ghuts2MmTKxJDOaw7KTSM0AI',
    libraries: 'places'
  }
})
Vue.use(VueLazyload, {
  lazyComponent: true
})
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: '#F44336',
  thickness: '3px'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
