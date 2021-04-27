import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  getters: {
    isThemeLight: jest.fn()
  }
})

export {
  localVue,
  store
}
