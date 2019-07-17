const getters = {
  agencyInfo: (state) => (id) => {
    return state.agencies.find(agency => agency.id === id)
  },

  agencyAllLaunches: (state) => (id) => {
    return state.agenciesLaunches[id] ? state.agenciesLaunches[id].launches : []
  },

  agencyPastLaunches: (state) => (id) => {
    return state.agenciesLaunches[id]
      ? state.agenciesLaunches[id].launches.filter(item => new Date(item.net) <= new Date())
      : []
  },

  agencyUpcomingLaunches: (state) => (id) => {
    return state.agenciesLaunches[id]
      ? state.agenciesLaunches[id].launches.filter(item => new Date(item.net) > new Date())
      : []
  },

  missionType: (state) => (id) => state.missionTypes.find(item => item.id === id).name,

  getColorTheme: (state) => state.colorTheme
}

export default getters
