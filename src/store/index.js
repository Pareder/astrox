import Vue from 'vue'
import Vuex from 'vuex'
import getMutations from './getMutations'
import getActions from './getActions'
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

  mutations: getMutations(),
  actions: getActions(),
  getters
})

export default store
