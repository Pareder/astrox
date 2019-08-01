const getters = {
  agencyInfo: state => id => {
    return state.agencies.find(agency => agency.id === id)
  },

  agencyAllLaunches: state => id => {
    return state.agenciesLaunches[id] ? state.agenciesLaunches[id].launches : []
  },

  agencyPastLaunches: state => id => {
    return state.agenciesLaunches[id]
      ? state.agenciesLaunches[id].launches.filter(item => new Date(item.net) <= new Date())
      : []
  },

  agencyUpcomingLaunches: state => id => {
    return state.agenciesLaunches[id]
      ? state.agenciesLaunches[id].launches.filter(item => new Date(item.net) > new Date())
      : []
  },

  getMissionTypeName: state => id => state.missionTypes.find(item => item.id === id).name,

  agencyTypeNames: state => ['All', ...new Set(state.agencies.map(item => item.type))],

  agencyCountries: state => ['All', ...new Set(state.agencies.map(item => item.countryCode).sort())],

  agencyObject: state => state.agencies.reduce((obj, agency) => {
    obj[agency.id] = {
      name: agency.name,
      continent: agency.continent,
      countryName: agency.countryName,
      type: agency.type
    }

    return obj
  }, {}),

  historyLaunchesByYear: state => (year = new Date().getFullYear()) => state.historyLaunches &&
    state.historyLaunches[year] && state.historyLaunches[year].launches
}

export default getters
