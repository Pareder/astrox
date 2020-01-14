import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueProgressBar from 'vue-progressbar'
import App from './App'
import plugins from './plugins'
import router from './router'
import getStore from './store/getStore'

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_KEY,
    libraries: 'places'
  }
})
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: '#F44336',
  thickness: '3px'
})
Vue.use(plugins)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: getStore(Vue),
  components: { App },
  template: '<App/>'
})
