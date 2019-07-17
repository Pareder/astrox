import Vue from 'vue'
import url from 'url'
import * as types from './types'
import config from '../config'
import { zeroTime } from '../utils'

const NUMBER_OF_DAYS_BEFORE = 3
const SPACEX_ID = 121

const actions = {
  getHistory ({ commit }) {
    if (localStorage.getItem('launchHistory')) {
      let isReturn = !localStorage.getItem('upcomingLaunches')

      if (!isReturn) {
        const nextLaunch = JSON.parse(localStorage.getItem('upcomingLaunches'))[0].nextLaunch

        if (new Date(nextLaunch) > Date.now()) {
          isReturn = true
        }
      }

      if (isReturn) {
        return new Promise((resolve) => {
          commit(types.SET_HISTORY, JSON.parse(localStorage.getItem('launchHistory')))
          resolve()
        })
      }
    }

    const promises = []

    for (let year = 2000; year <= new Date().getFullYear(); year++) {
      const promise = new Promise((resolve, reject) => {
        let finalYear = null

        if (year === new Date().getFullYear()) {
          finalYear = `${year}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
        }

        Vue.http.get(url.format({
          pathname: `${config.apiServer}/launch`,
          query: {
            startdate: `${year}-01-01`,
            enddate: `${finalYear || (year + '-12-31')}`,
            limit: 1
          }
        }))
          .then(response => {
            resolve({ year: year, amount: response.body.total })
          })
          .catch(error => {
            reject(error)
          })
      })
      promises.push(promise)
    }

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(values => {
          commit(types.SET_HISTORY, values)
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
      const needUpdate = !yearLaunches ||
        year >= new Date().getFullYear() ||
        new Date(yearLaunches.changed) <= new Date().setDate(new Date().getDate() - NUMBER_OF_DAYS_BEFORE)

      if (!needUpdate) {
        return new Promise((resolve) => {
          commit(types.SET_HISTORY_LAUNCHES, { data: yearLaunches.launches, year: year })
          resolve()
        })
      }
    }

    return new Promise((resolve, reject) => {
      Vue.http.get(url.format({
        pathname: `${config.apiServer}/launch`,
        query: {
          startdate: `${year}-01-01`,
          enddate: `${year + '-12-31'}`,
          limit: -1
        }
      }))
        .then(response => {
          commit(types.SET_HISTORY_LAUNCHES, { data: response.body.launches, year: year, update: true })
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
          commit(types.SET_ALL_UPCOMING_LAUNCHES, { data: JSON.parse(localStorage.getItem('upcomingLaunches')) })
          resolve()
        })
      }
    }

    const getLaunchesByYears = (lastYear) => {
      const promises = []

      for (let year = new Date().getFullYear(); year <= lastYear; year++) {
        promises.push(
          new Promise(resolve => {
            let presentYear = null

            if (year === new Date().getFullYear()) {
              presentYear = `${year}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
            }

            Vue.http.get(url.format({
              pathname: `${config.apiServer}/launch`,
              query: {
                startdate: `${presentYear || year + '-01-01'}`,
                enddate: `${year + '-12-31'}`,
                limit: 1
              }
            }))
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
            commit(types.SET_ALL_UPCOMING_LAUNCHES, { data: values, update: true })
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }

    return new Promise((resolve, reject) => {
      Vue.http.get(url.format({
        pathname: `${config.apiServer}/launch`,
        query: {
          next: 1,
          sort: 'desc'
        }
      }))
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
    }

    const getAgencyTypes = new Promise((resolve, reject) => {
      Vue.http.get(`${config.apiServer}/agencytype/`)
        .then(response => {
          resolve(response.body.types)
        })
        .catch(error => {
          reject(error)
        })
    })
    const getAgencies = new Promise((resolve, reject) => {
      Vue.http.get(url.format({
        pathname: `${config.apiServer}/lsp`,
        query: {
          limit: -1
        }
      }))
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
          commit(types.SET_AGENCIES, values[0])
          commit(types.SET_AGENCY_TYPES, values[1])
          commit(types.SET_AGENCY_CONTINENT, values[2])
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
  },

  getAgencyAllLaunches ({ commit }, id) {
    const launches = JSON.parse(localStorage.getItem('agenciesLaunches'))

    if (launches && launches[id]) {
      if (new Date(launches[id].changed) < new Date().setDate(new Date().getDate() - 7)) {
        return new Promise((resolve) => {
          commit(types.SET_AGENCY_LAUNCHES, { id: id, data: launches[id].launches })
          resolve()
        })
      }
    }

    return new Promise((resolve, reject) => {
      Vue.http.get(url.format({
        pathname: `${config.apiServer}/launch`,
        query: {
          lsp: id,
          limit: -1
        }
      }))
        .then(response => {
          commit(types.SET_AGENCY_LAUNCHES, { id: id, data: response.body.launches, update: true })
          resolve()
        })
        .catch(error => {
          reject(new Error(error.body.msg))
        })
    })
  },

  getSpaceXLaunches ({ commit }) {
    const agenciesLaunches = JSON.parse(localStorage.getItem('agenciesLaunches'))

    if (agenciesLaunches && agenciesLaunches[SPACEX_ID] && agenciesLaunches[SPACEX_ID].official) {
      if (new Date(agenciesLaunches[SPACEX_ID].changed) > new Date().setDate(new Date().getDate() - 7)) {
        return new Promise((resolve) => {
          commit(types.SET_AGENCY_LAUNCHES, {
            id: 121,
            data: agenciesLaunches[SPACEX_ID].launches,
            official: agenciesLaunches[SPACEX_ID].official
          })
          resolve()
        })
      }
    }

    const getAllLaunches = new Promise((resolve, reject) => {
      Vue.http.get(url.format({
        pathname: `${config.apiServer}/launch`,
        query: {
          lsp: SPACEX_ID,
          limit: -1
        }
      }))
        .then(response => {
          resolve(response.body.launches)
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
    const getOfficialLaunches = new Promise((resolve, reject) => {
      Vue.http.get(`${config.spaceXApi}/launches`)
        .then(response => {
          resolve(response.body)
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
    const getLocations = new Promise((resolve, reject) => {
      Vue.http.get(`${config.spaceXApi}/launchpads`)
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
          commit(types.SET_AGENCY_LAUNCHES, {
            id: 121,
            data: values[0],
            official: values[1],
            locations: values[2],
            update: true
          })
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
  },

  getLaunchDetails ({ commit }, id) {
    return new Promise((resolve, reject) => {
      Vue.http.get(`${config.apiServer}/launch/${id}`)
        .then(response => {
          commit(types.SET_LAUNCH_DETAILS, { id: id, data: response.body.launches[0] })
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
        commit(types.SET_MISSION_TYPES, JSON.parse(localStorage.getItem('missionTypes')))
        resolve()
      })
    }

    return new Promise((resolve, reject) => {
      Vue.http.get(`${config.apiServer}/missiontype`)
        .then(response => {
          commit(types.SET_MISSION_TYPES, response.body.types)
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
  },

  getRocket ({ commit }, name) {
    const rockets = JSON.parse(localStorage.getItem('rockets'))

    if (rockets && rockets[name]) {
      return new Promise((resolve) => {
        commit(types.SET_ROCKET, { name: name, data: rockets[name] })
        resolve()
      })
    }

    return new Promise((resolve, reject) => {
      Vue.http.get(`${config.spaceXApi}/rockets/${name}`)
        .then(response => {
          commit(types.SET_ROCKET, { name: name, data: response.body, update: true })
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
  },

  getPresentYearLaunches ({ commit }) {
    const launches = JSON.parse(localStorage.getItem('presentYearLaunches'))

    if (launches && new Date(launches[0].net) > Date.now()) {
      return new Promise((resolve) => {
        commit(types.SET_PRESENT_YEAR_LAUNCHES, {data: launches})
        resolve()
      })
    }

    return new Promise((resolve, reject) => {
      const currentYear = new Date().getFullYear()
      const startDate = `${currentYear}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
      const endDate = `${currentYear}-12-31`

      Vue.http.get(url.format({
        pathname: `${config.apiServer}/launch/${startDate}/${endDate}`,
        query: {
          limit: -1
        }
      }))
        .then(response => {
          commit(types.SET_PRESENT_YEAR_LAUNCHES, { data: response.body.launches, update: true })
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
  }
}

export default actions
