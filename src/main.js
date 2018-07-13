// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import VueLazyload from 'vue-lazyload'
import * as VueGoogleMaps from 'vue2-google-maps'
import store from './store'
import App from './App'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

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
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
