import * as types from './types'
import config from '../config'

const NUMBER_OF_DAYS_BEFORE = 3
const NUMBER_OF_DAYS_WEEK = 7

const getActions = (api, localStorage = window.localStorage) => {
  return {
    async getHistory ({ commit }) {
      if (localStorage.getItem('launchHistory')) {
        let isReturn = !localStorage.getItem('upcomingLaunches')

        if (!isReturn) {
          const nextLaunch = JSON.parse(localStorage.getItem('upcomingLaunches'))[0].nextLaunch

          if (new Date(nextLaunch) > Date.now()) {
            isReturn = true
          }
        }

        if (isReturn) {
          return commit(types.SET_HISTORY, JSON.parse(localStorage.getItem('launchHistory')))
        }
      }

      const values = await api.getHistory()
      commit(types.SET_HISTORY, values)
    },

    async getHistoryLaunches ({ commit }, year) {
      if (localStorage.getItem('historyLaunches')) {
        const yearLaunches = JSON.parse(localStorage.getItem('historyLaunches'))[year]
        const needUpdate = !yearLaunches ||
          year >= new Date().getFullYear() ||
          new Date(yearLaunches.changed) <= new Date().setDate(new Date().getDate() - NUMBER_OF_DAYS_BEFORE)

        if (!needUpdate) {
          return commit(types.SET_HISTORY_LAUNCHES, { data: yearLaunches.launches, year: year })
        }
      }

      const launches = await api.getHistoryLaunches(year)
      commit(types.SET_HISTORY_LAUNCHES, { data: launches, year: year, update: true })
    },

    async getAllUpcomingLaunches ({ commit }) {
      if (localStorage.getItem('upcomingLaunches')) {
        const nextLaunch = JSON.parse(localStorage.getItem('upcomingLaunches'))[0].nextLaunch

        if (new Date(nextLaunch) > Date.now()) {
          return commit(types.SET_ALL_UPCOMING_LAUNCHES, {
            data: JSON.parse(localStorage.getItem('upcomingLaunches'))
          })
        }
      }

      const launches = await api.getAllUpcomingLaunches()
      commit(types.SET_ALL_UPCOMING_LAUNCHES, { data: launches, update: true })
    },

    async getAgenciesInfo ({ commit }) {
      if (localStorage.getItem('launchAgencies')) {
        return commit('SET_AGENCIES', JSON.parse(localStorage.getItem('launchAgencies')))
      }

      const [agencies, agencyTypes, agencyContinents] = await api.getAgenciesInfo()
      commit(types.SET_AGENCIES, agencies)
      commit(types.SET_AGENCY_TYPES, agencyTypes)
      commit(types.SET_AGENCY_CONTINENT, agencyContinents)
    },

    async getAgencyAllLaunches ({ commit }, id) {
      const launches = JSON.parse(localStorage.getItem('agenciesLaunches'))

      if (launches && launches[id]) {
        const weekLaterDate = new Date().setDate(new Date().getDate() - NUMBER_OF_DAYS_WEEK)

        if (new Date(launches[id].changed) > weekLaterDate) {
          return commit(types.SET_AGENCY_LAUNCHES, { id, data: launches[id].launches })
        }
      }

      const launchesById = await api.getAgencyAllLaunches(id)
      commit(types.SET_AGENCY_LAUNCHES, { id, data: launchesById, update: true })
    },

    async getSpaceXLaunches ({ commit }) {
      const agenciesLaunches = JSON.parse(localStorage.getItem('agenciesLaunches'))

      if (agenciesLaunches && agenciesLaunches[config.SPACEX_ID] && agenciesLaunches[config.SPACEX_ID].official) {
        const weekLaterDate = new Date().setDate(new Date().getDate() - NUMBER_OF_DAYS_WEEK)

        if (new Date(agenciesLaunches[config.SPACEX_ID].changed) > weekLaterDate) {
          return commit(types.SET_AGENCY_LAUNCHES, {
            id: config.SPACEX_ID,
            data: agenciesLaunches[config.SPACEX_ID].launches,
            official: agenciesLaunches[config.SPACEX_ID].official
          })
        }
      }

      const [allLaunches, officialLaunches, locations] = await api.getSpaceXLaunches()
      commit(types.SET_AGENCY_LAUNCHES, {
        id: config.SPACEX_ID,
        data: allLaunches,
        official: officialLaunches,
        locations,
        update: true
      })
    },

    async getLaunchDetails ({ commit }, id) {
      const data = await api.getLaunchDetails(id)
      commit(types.SET_LAUNCH_DETAILS, { id, data })
    },

    async getMissionTypes ({ commit }) {
      if (localStorage.getItem('missionTypes')) {
        return commit(types.SET_MISSION_TYPES, JSON.parse(localStorage.getItem('missionTypes')))
      }

      const missionTypes = await api.getMissionTypes()
      commit(types.SET_MISSION_TYPES, missionTypes)
    },

    async getRocket ({ commit }, name) {
      const rockets = JSON.parse(localStorage.getItem('rockets'))

      if (rockets && rockets[name]) {
        return commit(types.SET_ROCKET, { name: name, data: rockets[name] })
      }

      const rocket = await api.getRocket(name)
      commit(types.SET_ROCKET, { name, data: rocket, update: true })
    },

    async getPresentYearLaunches ({ commit }) {
      const launches = JSON.parse(localStorage.getItem('presentYearLaunches'))

      if (launches && new Date(launches[0].net) > Date.now()) {
        return commit(types.SET_PRESENT_YEAR_LAUNCHES, { data: launches })
      }

      const presentYearLaunches = await api.getPresentYearLaunches()
      commit(types.SET_PRESENT_YEAR_LAUNCHES, { data: presentYearLaunches, update: true })
    }
  }
}

export default getActions
