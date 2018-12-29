import Vue from 'vue'
import Vuex from 'vuex'
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

  mutations: {
    SET_HISTORY (state, payload) {
      state.history = [...payload]
      if (!localStorage.getItem('launchHistory')) {
        localStorage.setItem('launchHistory', JSON.stringify(payload))
      }
    },

    SET_HISTORY_LAUNCHES (state, payload) {
      state.historyLaunches[payload.year] = state.historyLaunches[payload.year] || {}
      state.historyLaunches[payload.year].launches = payload.data
      state.historyLaunches[payload.year].changed = state.historyLaunches[payload.year].changed || new Date().toUTCString()

      if (payload.update) {
        localStorage.setItem('historyLaunches', JSON.stringify(Object.assign({}, JSON.parse(localStorage.getItem('historyLaunches')), state.historyLaunches)))
      }
    },

    SET_ALL_UPCOMING_LAUNCHES (state, payload) {
      state.allUpcomingLaunches = [...payload.data]
      if (payload.update) {
        localStorage.setItem('upcomingLaunches', JSON.stringify(payload.data))
      }
    },

    SET_AGENCIES (state, payload) {
      state.agencies = [...payload]
      state.agencies.map((item, index) => {
        if (item.name.toLowerCase() === 'unknown') {
          state.agencies.splice(index, 1)
        }
      })
    },

    SET_AGENCYTYPES (state, payload) {
      state.agencies.map(item => {
        item.type = payload[item.type - 1].name
      })
    },

    SET_AGENCY_CONTINENT (state, payload) {
      state.agencies.map(item => {
        item.continent = payload[item.countryCode] ? payload[item.countryCode].continent : ''
        item.countryName = payload[item.countryCode] ? payload[item.countryCode].country : item.countryCode
      })
      if (!localStorage.getItem('launchAgencies')) {
        localStorage.setItem('launchAgencies', JSON.stringify(state.agencies))
      }
    },

    SET_AGENCY_LAUNCHES (state, payload) {
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
        localStorage.setItem('agenciesLaunches', JSON.stringify(Object.assign({}, JSON.parse(localStorage.getItem('agenciesLaunches')), state.agenciesLaunches)))
      }
    },

    SET_LAUNCH_DETAILS (state, payload) {
      state.launchDetails = state.launchDetails || {}
      state.launchDetails[payload.id] = payload.data
    },

    SET_MISSION_TYPES (state, payload) {
      state.missionTypes = [...payload]
      if (!localStorage.getItem('missionTypes')) {
        localStorage.setItem('missionTypes', JSON.stringify(payload))
      }
    },

    SET_PRESENT_YEAR_LAUNCHES (state, payload) {
      state.presentYearLaunches = [...payload.data]
      if (payload.update) {
        localStorage.setItem('presentYearLaunches', JSON.stringify(payload.data))
      }
    },

    SET_ROCKET (state, payload) {
      state.rockets[payload.name] = payload.data
      if (payload.update) {
        const rockets = JSON.parse(localStorage.getItem('rockets')) || {}
        rockets[payload.name] = payload.data
        localStorage.setItem('rockets', JSON.stringify(rockets))
      }
    },

    SET_COLOR_THEME (state, payload) {
      state.colorTheme = payload
      localStorage.setItem('colorTheme', payload)
    }
  },
  actions: {
    getHistory ({ commit }) {
      if (localStorage.getItem('launchHistory')) {
        if (localStorage.getItem('upcomingLaunches')) {
          const nextLaunch = JSON.parse(localStorage.getItem('upcomingLaunches'))[0].nextLaunch
          if (new Date(nextLaunch) > Date.now()) {
            return new Promise((resolve) => {
              commit('SET_HISTORY', JSON.parse(localStorage.getItem('launchHistory')))
              resolve()
            })
          }
        } else {
          return new Promise((resolve) => {
            commit('SET_HISTORY', JSON.parse(localStorage.getItem('launchHistory')))
            resolve()
          })
        }
      }
      const unique = []
      for (let i = 2000; i <= new Date().getFullYear(); i++) {
        unique.push(i)
      }
      const promises = unique.map(year => {
        return new Promise((resolve, reject) => {
          let finalYear = null
          if (year === new Date().getFullYear()) {
            finalYear = `${year}-${new Date().getMonth() > 8 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()}`
          }
          Vue.http.get(`https://launchlibrary.net/1.4/launch?startdate=${year}-01-01&enddate=${finalYear || (year + '-12-31')}&limit=1`)
            .then(response => {
              resolve({ year: year, amount: response.body.total })
            })
            .catch(error => {
              reject(error)
            })
        })
      })
      return new Promise((resolve, reject) => {
        Promise.all(promises)
          .then(values => {
            commit('SET_HISTORY', values)
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
    },

    getHistoryLaunches ({ commit }, year) {
      if (localStorage.getItem('historyLaunches')) {
        const yearLaunches = JSON.parse(localStorage.getItem('historyLaunches'))[year]
        if (!!yearLaunches && (year < new Date().getFullYear() || new Date(yearLaunches.changed) > new Date().setDate(new Date().getDate() - 3))) {
          return new Promise((resolve) => {
            commit('SET_HISTORY_LAUNCHES', { data: yearLaunches.launches, year: year })
            resolve()
          })
        }
      }
      return new Promise((resolve, reject) => {
        Vue.http.get(`https://launchlibrary.net/1.4/launch?startdate=${year}-01-01&enddate=${year}-12-31&limit=-1`)
          .then(response => {
            commit('SET_HISTORY_LAUNCHES', { data: response.body.launches, year: year, update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
    },

    getAllUpcomingLaunches ({ commit }) {
      if (localStorage.getItem('upcomingLaunches')) {
        const nextLaunch = JSON.parse(localStorage.getItem('upcomingLaunches'))[0].nextLaunch
        if (new Date(nextLaunch) > Date.now()) {
          return new Promise((resolve) => {
            commit('SET_ALL_UPCOMING_LAUNCHES', { data: JSON.parse(localStorage.getItem('upcomingLaunches')) })
            resolve()
          })
        }
      }
      const getLaunchesByYears = (lastYear) => {
        const promises = []
        for (let year = new Date().getFullYear(); year <= lastYear; year++) {
          promises.push(
            new Promise((resolve, reject) => {
              let presentYear = null
              if (year === new Date().getFullYear()) {
                presentYear = `${year}-${new Date().getMonth() > 8 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()}`
              }
              Vue.http.get(`https://launchlibrary.net/1.4/launch?startdate=${presentYear || year + '-01-01'}&enddate=${year}-12-31&limit=1`)
                .then(response => {
                  if (presentYear) {
                    resolve({ year: year, amount: response.body.total, nextLaunch: response.body.launches[0].net })
                  } else {
                    resolve({ year: year, amount: response.body.total })
                  }
                })
                .catch(() => {
                  resolve({ year: year, amount: 0 })
                })
            })
          )
        }
        return new Promise((resolve, reject) => {
          Promise.all(promises)
            .then(values => {
              commit('SET_ALL_UPCOMING_LAUNCHES', { data: values, update: true })
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        })
      }

      return new Promise((resolve, reject) => {
        Vue.http.get('https://launchlibrary.net/1.4/launch?next=1&sort=desc')
          .then(response => {
            getLaunchesByYears(new Date(response.body.launches[0].net).getFullYear())
              .then(() => {
                resolve()
              })
              .catch(error => {
                reject(error)
              })
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getAgenciesInfo ({ commit }) {
      if (localStorage.getItem('launchAgencies')) {
        return new Promise((resolve) => {
          commit('SET_AGENCIES', JSON.parse(localStorage.getItem('launchAgencies')))
          resolve()
        })
      } else {
        const getAgencyTypes = new Promise((resolve, reject) => {
          Vue.http.get('https://launchlibrary.net/1.4/agencytype/')
            .then(response => {
              resolve(response.body.types)
            })
            .catch(error => {
              reject(error)
            })
        })
        const getAgencies = new Promise((resolve, reject) => {
          Vue.http.get('https://launchlibrary.net/1.4/lsp?limit=-1')
            .then(response => {
              resolve(response.body.agencies)
            })
            .catch(error => {
              reject(error)
            })
        })
        const getContinents = new Promise((resolve, reject) => {
          Vue.http.get('./static/countries.json')
            .then(response => {
              resolve(response.body)
            })
            .catch(error => {
              reject(error)
            })
        })
        return new Promise((resolve, reject) => {
          Promise.all([getAgencies, getAgencyTypes, getContinents])
            .then(values => {
              commit('SET_AGENCIES', values[0])
              commit('SET_AGENCYTYPES', values[1])
              commit('SET_AGENCY_CONTINENT', values[2])
              resolve()
            })
            .catch(error => {
              reject(new Error(error))
            })
        })
      }
    },

    getAgencyAllLaunches ({ commit }, id) {
      if (localStorage.getItem('agenciesLaunches') && JSON.parse(localStorage.getItem('agenciesLaunches'))[id]) {
        const agencyLaunches = JSON.parse(localStorage.getItem('agenciesLaunches'))[id]
        if (new Date(agencyLaunches.changed) < new Date().setDate(new Date().getDate() - 7)) {
          return new Promise((resolve) => {
            commit('SET_AGENCY_LAUNCHES', { id: id, data: agencyLaunches.launches })
            resolve()
          })
        }
      }
      return new Promise((resolve, reject) => {
        Vue.http.get(`https://launchlibrary.net/1.4/launch?lsp=${id}&limit=-1`)
          .then(response => {
            commit('SET_AGENCY_LAUNCHES', { id: id, data: response.body.launches, update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error.body.msg))
          })
      })
    },

    getSpaceXLaunches ({ commit }) {
      const agenciesLaunches = JSON.parse(localStorage.getItem('agenciesLaunches'))
      if (agenciesLaunches && agenciesLaunches['121'] && agenciesLaunches['121'].official) {
        const agencyLaunches = { ...agenciesLaunches['121'] }
        if (new Date(agencyLaunches.changed) > new Date().setDate(new Date().getDate() - 7)) {
          return new Promise((resolve) => {
            commit('SET_AGENCY_LAUNCHES', { id: 121, data: agencyLaunches.launches, official: agencyLaunches.official })
            resolve()
          })
        }
      }
      const getAllLaunches = new Promise((resolve, reject) => {
        Vue.http.get('https://launchlibrary.net/1.4/launch?limit=-1&lsp=121')
          .then(response => {
            resolve(response.body.launches)
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
      const getOfficialLaunches = new Promise((resolve, reject) => {
        Vue.http.get('https://api.spacexdata.com/v2/launches')
          .then(response => {
            resolve(response.body)
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
      const getLocations = new Promise((resolve, reject) => {
        Vue.http.get('https://api.spacexdata.com/v2/launchpads')
          .then(response => {
            resolve(response.body)
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
      return new Promise((resolve, reject) => {
        Promise.all([getAllLaunches, getOfficialLaunches, getLocations])
          .then(values => {
            commit('SET_AGENCY_LAUNCHES', { id: 121, data: values[0], official: values[1], locations: values[2], update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
    },

    getLaunchDetails ({ commit }, id) {
      return new Promise((resolve, reject) => {
        Vue.http.get(`https://launchlibrary.net/1.4/launch/${id}`)
          .then(response => {
            commit('SET_LAUNCH_DETAILS', { id: id, data: response.body.launches[0] })
            resolve()
          })
          .catch(error => {
            reject(new Error(error.body.msg))
          })
      })
    },

    getMissionTypes ({ commit }) {
      if (localStorage.getItem('missionTypes')) {
        return new Promise((resolve) => {
          commit('SET_MISSION_TYPES', JSON.parse(localStorage.getItem('missionTypes')))
          resolve()
        })
      } else {
        return new Promise((resolve, reject) => {
          Vue.http.get('https://launchlibrary.net/1.4/missiontype')
            .then(response => {
              commit('SET_MISSION_TYPES', response.body.types)
              resolve()
            })
            .catch(error => {
              reject(new Error(error))
            })
        })
      }
    },

    getRocket ({ commit }, name) {
      if (localStorage.getItem('rockets') && JSON.parse(localStorage.getItem('rockets'))[name]) {
        return new Promise((resolve) => {
          commit('SET_ROCKET', { name: name, data: JSON.parse(localStorage.getItem('rockets'))[name] })
          resolve()
        })
      }
      return new Promise((resolve, reject) => {
        Vue.http.get(`https://api.spacexdata.com/v2/rockets/${name}`)
          .then(response => {
            commit('SET_ROCKET', { name: name, data: response.body, update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
    },

    getPresentYearLaunches ({ commit }) {
      if (localStorage.getItem('presentYearLaunches')) {
        const launches = JSON.parse(localStorage.getItem('presentYearLaunches'))
        if (new Date(launches[0].net) > Date.now()) {
          return new Promise((resolve) => {
            commit('SET_PRESENT_YEAR_LAUNCHES', { data: launches })
            resolve()
          })
        }
      }
      return new Promise((resolve, reject) => {
        const date = new Date(new Date().getFullYear(), 11, 31)
        const formattedDate = `${date.getFullYear()}-${date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
        const finalYear = `${new Date().getFullYear()}-${new Date().getMonth() > 8 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()}`
        Vue.http.get(`https://launchlibrary.net/1.4/launch/${formattedDate}/${finalYear}?limit=-1`)
          .then(response => {
            commit('SET_PRESENT_YEAR_LAUNCHES', { data: response.body.launches, update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
    }
  },
  getters: {
    agencyInfo: (state) => (id) => {
      return state.agencies.find(agency => agency.id === id)
    },

    agencyAllLaunches: (state) => (id) => {
      return state.agenciesLaunches[id] ? state.agenciesLaunches[id].launches : []
    },

    agencyPastLaunches: (state) => (id) => {
      return state.agenciesLaunches[id] ? state.agenciesLaunches[id].launches.filter(item => new Date(item.net) <= new Date()) : []
    },

    agencyUpcomingLaunches: (state) => (id) => state.agenciesLaunches[id] ? state.agenciesLaunches[id].launches.filter(item => new Date(item.net) > new Date()) : [],

    missionType: (state) => (id) => state.missionTypes.find(item => item.id === id).name,

    getColorTheme: (state) => state.colorTheme
  }
})
export default store
