import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    info: null,
    agencyLaunches: {},
    rockets: {},
    history: null,
    historyLaunches: null,
    allUpcomingLaunches: null,
    agencies: null,
    launchDetails: null,
    missionTypes: null
  },

  mutations: {
    SET_INFO (state, payload) {
      state.info = payload
    },

    SET_ROCKET (state, payload) {
      state.rockets[payload.name] = payload.data
      if (payload.update) {
        const rockets = JSON.parse(localStorage.getItem('rockets')) || {}
        rockets[payload.name] = payload.data
        localStorage.setItem('rockets', JSON.stringify(rockets))
      }
    },

    SET_HISTORY (state, payload) {
      state.history = [...payload]
      if (!localStorage.getItem('launchHistorry')) {
        localStorage.setItem('launchHistorry', JSON.stringify(payload))
      }
    },

    SET_HISTORY_LAUNCHES (state, payload) {
      state.historyLaunches = [...payload]
    },

    SET_ALL_UPCOMING_LAUNCHES (state, payload) {
      state.allUpcomingLaunches = [...payload.data]
      if (payload.update) {
        localStorage.setItem('upcomingLaunches', JSON.stringify(payload.data))
      }
    },

    SET_AGENCIES (state, payload) {
      state.agencies = [...payload]
    },

    SET_AGENCYTYPES (state, payload) {
      state.agencies.map(item => {
        item.type = payload[item.type - 1].name
      })
      if (!localStorage.getItem('launchAgencies')) {
        localStorage.setItem('launchAgencies', JSON.stringify(state.agencies))
      }
    },

    SET_AGENCY_PAST_LAUNCHES (state, payload) {
      state.agencyLaunches[payload.id] = state.agencyLaunches[payload.id] || {}
      state.agencyLaunches[payload.id].past = payload.data
      if (payload.locations) {
        const locs = {}
        payload.locations.map(item => {
          locs[item.id] = {
            lat: item.location.latitude,
            lng: item.location.longitude
          }
        })
        state.agencyLaunches[payload.id].past.map(item => {
          item.location = locs[item.launch_site.site_id]
        })
      }
      if (payload.update) {
        const savedLaunches = JSON.parse(localStorage.getItem('agencyLaunches')) || {}
        savedLaunches[payload.id] = savedLaunches[payload.id] || {}
        savedLaunches[payload.id].past = payload.data
        localStorage.setItem('agencyLaunches', JSON.stringify(savedLaunches))
      }
    },

    SET_AGENCY_UPCOMING_LAUNCHES (state, payload) {
      state.agencyLaunches[payload.id] = state.agencyLaunches[payload.id] || {}
      state.agencyLaunches[payload.id].upcoming = payload.data
      if (payload.update) {
        const savedLaunches = JSON.parse(localStorage.getItem('agencyLaunches')) || {}
        savedLaunches[payload.id] = savedLaunches[payload.id] || {}
        savedLaunches[payload.id].upcoming = payload.data
        localStorage.setItem('agencyLaunches', JSON.stringify(savedLaunches))
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
    }
  },
  actions: {
    getInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.http.get('https://api.spacexdata.com/v2/info')
          .then(response => {
            commit('SET_INFO', response.body)
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
    },

    getPastLaunches ({ commit }, id) {
      if (localStorage.getItem('agencyLaunches') && JSON.parse(localStorage.getItem('agencyLaunches'))[id] && JSON.parse(localStorage.getItem('agencyLaunches'))[id].past) {
        const launches = JSON.parse(localStorage.getItem('agencyLaunches'))[id]
        if (launches.upcoming && new Date(launches.upcoming[0].launch_date_utc).getTime() > Date.now()) {
          return new Promise((resolve) => {
            commit('SET_AGENCY_PAST_LAUNCHES', { id: id, data: launches.past })
            resolve()
          })
        }
      }
      const getLaunches = new Promise((resolve, reject) => {
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
        Promise.all([getLaunches, getLocations])
          .then(values => {
            commit('SET_AGENCY_PAST_LAUNCHES', { data: values[0], id: id, locations: values[1], update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
    },

    getUpcomingLaunches ({ commit }, id) {
      if (localStorage.getItem('agencyLaunches') && JSON.parse(localStorage.getItem('agencyLaunches'))[id] && JSON.parse(localStorage.getItem('agencyLaunches'))[id].upcoming) {
        const upcoming = JSON.parse(localStorage.getItem('agencyLaunches'))[id].upcoming
        if (new Date(upcoming[0].launch_date_utc).getTime() > Date.now()) {
          return new Promise((resolve) => {
            commit('SET_AGENCY_UPCOMING_LAUNCHES', { id: id, data: upcoming })
            resolve()
          })
        }
      }
      return new Promise((resolve, reject) => {
        Vue.http.get('https://api.spacexdata.com/v2/launches/upcoming')
          .then(response => {
            commit('SET_AGENCY_UPCOMING_LAUNCHES', { id: id, data: response.body, update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error))
          })
      })
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

    getHistory ({ commit }) {
      if (localStorage.getItem('launchHistorry')) {
        if (localStorage.getItem('upcomingLaunches')) {
          const nextLaunch = JSON.parse(localStorage.getItem('upcomingLaunches'))[0].nextLaunch
          if (new Date(nextLaunch) > Date.now()) {
            return new Promise((resolve) => {
              commit('SET_HISTORY', JSON.parse(localStorage.getItem('launchHistorry')))
              resolve()
            })
          }
        } else {
          return new Promise((resolve) => {
            commit('SET_HISTORY', JSON.parse(localStorage.getItem('launchHistorry')))
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
          Vue.http.get(`https://launchlibrary.net/1.4/launch/${year}-01-01/${finalYear || (year + '-12-31')}`)
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
              Vue.http.get(`https://launchlibrary.net/1.4/launch/${presentYear || year + '-01-01'}/${year}-12-31`)
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
        return new Promise((resolve, reject) => {
          Promise.all([getAgencies, getAgencyTypes])
            .then(values => {
              commit('SET_AGENCIES', values[0])
              commit('SET_AGENCYTYPES', values[1])
              resolve()
            })
            .catch(error => {
              reject(new Error(error.body.msg))
            })
        })
      }
    },

    getAgencyPastLaunches ({ commit }, id) {
      if (localStorage.getItem('agencyLaunches') && JSON.parse(localStorage.getItem('agencyLaunches'))[id] && JSON.parse(localStorage.getItem('agencyLaunches'))[id].past) {
        const past = JSON.parse(localStorage.getItem('agencyLaunches'))[id].past
        if (new Date(past[past.length - 1].net).getTime() > Date.now()) {
          return new Promise((resolve) => {
            commit('SET_AGENCY_PAST_LAUNCHES', { id: id, data: past })
            resolve()
          })
        }
      }
      return new Promise((resolve, reject) => {
        Vue.http.get(`https://launchlibrary.net/1.4/launch?lsp=${id}&limit=-1`)
          .then(response => {
            commit('SET_AGENCY_PAST_LAUNCHES', { id: id, data: response.body.launches, update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error.body.msg))
          })
      })
    },

    getAgencyUpcomingLaunches ({ commit }, id) {
      if (localStorage.getItem('agencyLaunches') && JSON.parse(localStorage.getItem('agencyLaunches'))[id] && JSON.parse(localStorage.getItem('agencyLaunches'))[id].upcoming) {
        const upcoming = JSON.parse(localStorage.getItem('agencyLaunches'))[id].upcoming
        if (new Date(upcoming[0].net).getTime() > Date.now()) {
          return new Promise((resolve) => {
            commit('SET_AGENCY_UPCOMING_LAUNCHES', { id: id, data: upcoming })
            resolve()
          })
        }
      }
      return new Promise((resolve, reject) => {
        Vue.http.get(`https://launchlibrary.net/1.4/launch?next=-1&lsp=${id}`)
          .then(response => {
            commit('SET_AGENCY_UPCOMING_LAUNCHES', { id: id, data: response.body.launches, update: true })
            resolve()
          })
          .catch(error => {
            reject(new Error(error.body.msg))
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
    }
  },
  getters: {
    agencyInfo: (state) => (id) => {
      return state.agencies.find(agency => agency.id === id)
    },

    agencyPastLaunches: (state) => (id) => state.agencyLaunches[id] ? state.agencyLaunches[id].past : null,

    agencyUpcomingLaunches: (state) => (id) => state.agencyLaunches[id] ? state.agencyLaunches[id].upcoming : null,

    missionType: (state) => (id) => state.missionTypes.find(item => item.id === id).name
  }
})
export default store
