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

  agencyTypeNames: state => ['All', ...new Set(state.agencies.map(item => item.type))].filter(Boolean),

  agencyCountries: state => ['All', ...new Set(state.agencies.map(item => item.country).sort())].filter(Boolean),

  agencyObject: state => state.agencies.reduce((obj, agency) => {
    obj[agency.id] = {
      name: agency.name,
      continent: agency.continent,
      country: agency.country,
      type: agency.type
    }

    return obj
  }, {}),

  historyLaunchesByYear: state => (year = new Date().getFullYear()) => state.historyLaunches &&
    state.historyLaunches[year] && state.historyLaunches[year].launches,

  isThemeLight: state => state?.colorTheme === 'light'
}

export default getters
