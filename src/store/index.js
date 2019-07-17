import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    agenciesLaunches: {},
    rockets: {},
    history: null,
    historyLaunches: {},
    allUpcomingLaunches: null,
    agencies: null,
    launchDetails: null,
    missionTypes: null,
    presentYearLaunches: null,
    colorTheme: localStorage.getItem('colorTheme') ? localStorage.getItem('colorTheme') : 'light'
  },

  mutations,
  actions,
  getters
})

export default store
