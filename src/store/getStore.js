import Vuex from 'vuex'
import getMutations from './getMutations'
import getActions from './getActions'
import getters from './getters'

function getStore(Vue) {
  Vue.use(Vuex)

  return new Vuex.Store({
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
    actions: getActions(Vue.API),
    getters
  })
}

export default getStore
