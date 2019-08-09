import * as types from './types'

const getMutations = (localStorage = window.localStorage) => {
  return {
    [types.SET_HISTORY] (state, payload) {
      state.history = [...payload]

      if (!localStorage.getItem('launchHistory')) {
        localStorage.setItem('launchHistory', JSON.stringify(payload))
      }
    },

    [types.SET_HISTORY_LAUNCHES] (state, payload) {
      state.historyLaunches = state.historyLaunches || {}
      state.historyLaunches[payload.year] = state.historyLaunches[payload.year] || {}
      state.historyLaunches[payload.year].launches = payload.data
      state.historyLaunches[payload.year].changed = state.historyLaunches[payload.year].changed ||
        new Date().toUTCString()

      if (payload.update) {
        localStorage.setItem('historyLaunches', JSON.stringify({
          ...JSON.parse(localStorage.getItem('historyLaunches')),
          ...state.historyLaunches
        }))
      }
    },

    [types.SET_ALL_UPCOMING_LAUNCHES] (state, payload) {
      state.allUpcomingLaunches = [...payload.data]

      if (payload.update) {
        localStorage.setItem('upcomingLaunches', JSON.stringify(payload.data))
      }
    },

    [types.SET_AGENCIES] (state, payload) {
      state.agencies = payload.filter(item => item.name.toLowerCase() !== 'unknown')
    },

    [types.SET_AGENCY_TYPES] (state, payload) {
      state.agencies.map(item => {
        item.type = payload[item.type - 1].name
      })
    },

    [types.SET_AGENCY_CONTINENT] (state, payload) {
      state.agencies.map(item => {
        item.continent = payload[item.countryCode] ? payload[item.countryCode].continent : ''
        item.countryName = payload[item.countryCode] ? payload[item.countryCode].country : item.countryCode
      })

      if (!localStorage.getItem('launchAgencies')) {
        localStorage.setItem('launchAgencies', JSON.stringify(state.agencies))
      }
    },

    [types.SET_AGENCY_LAUNCHES] (state, payload) {
      state.agenciesLaunches = state.agenciesLaunches || {}
      state.agenciesLaunches[payload.id] = state.agenciesLaunches[payload.id] || {}
      state.agenciesLaunches[payload.id].launches = payload.data
      state.agenciesLaunches[payload.id].changed = state.agenciesLaunches[payload.id].changed || new Date().toUTCString()

      if (payload.official) {
        state.agenciesLaunches[payload.id].official = payload.official
      }

      if (payload.locations) {
        const locs = {}
        payload.locations.map(item => {
          locs[item.id] = {
            lat: item.location.latitude,
            lng: item.location.longitude
          }
        })
        state.agenciesLaunches[payload.id].official.map(item => {
          item.location = locs[item.launch_site.site_id]
        })
      }

      if (payload.update) {
        localStorage.setItem('agenciesLaunches', JSON.stringify({
          ...JSON.parse(localStorage.getItem('agenciesLaunches')),
          ...state.agenciesLaunches
        }))
      }
    },

    [types.SET_LAUNCH_DETAILS] (state, payload) {
      state.launchDetails = state.launchDetails || {}
      state.launchDetails[payload.id] = payload.data
    },

    [types.SET_MISSION_TYPES] (state, payload) {
      state.missionTypes = [...payload]

      if (!localStorage.getItem('missionTypes')) {
        localStorage.setItem('missionTypes', JSON.stringify(payload))
      }
    },

    [types.SET_PRESENT_YEAR_LAUNCHES] (state, payload) {
      state.presentYearLaunches = [...payload.data]

      if (payload.update) {
        localStorage.setItem('presentYearLaunches', JSON.stringify(payload.data))
      }
    },

    [types.SET_ROCKET] (state, payload) {
      state.rockets = state.rockets || {}
      state.rockets[payload.name] = payload.data

      if (payload.update) {
        localStorage.setItem('rockets', JSON.stringify({
          ...JSON.parse(localStorage.getItem('rockets')),
          ...state.rockets
        }))
      }
    },

    [types.SET_COLOR_THEME] (state, payload) {
      state.colorTheme = payload
      localStorage.setItem('colorTheme', payload)
    }
  }
}

export default getMutations
