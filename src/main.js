import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueLazyload from 'vue-lazyload'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueProgressBar from 'vue-progressbar'
import config from './config'
import store from './store'
import App from './App'
import router from './router'

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMapsKey,
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
