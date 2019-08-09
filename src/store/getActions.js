import Vue from 'vue'
import * as types from './types'
import config from '../config'

const NUMBER_OF_DAYS_BEFORE = 3

const getActions = (api = Vue.API, localStorage = window.localStorage) => {
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
          commit(types.SET_HISTORY, JSON.parse(localStorage.getItem('launchHistory')))

          return
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
          commit(types.SET_HISTORY_LAUNCHES, { data: yearLaunches.launches, year: year })

          return
        }
      }

      const launches = await api.getHistoryLaunches(year)
      commit(types.SET_HISTORY_LAUNCHES, { data: launches, year: year, update: true })
    },

    async getAllUpcomingLaunches ({ commit }) {
      if (localStorage.getItem('upcomingLaunches')) {
        const nextLaunch = JSON.parse(localStorage.getItem('upcomingLaunches'))[0].nextLaunch

        if (new Date(nextLaunch) > Date.now()) {
          commit(types.SET_ALL_UPCOMING_LAUNCHES, { data: JSON.parse(localStorage.getItem('upcomingLaunches')) })

          return
        }
      }

      const launches = await api.getAllUpcomingLaunches()
      commit(types.SET_ALL_UPCOMING_LAUNCHES, { data: launches, update: true })
    },

    async getAgenciesInfo ({ commit }) {
      if (localStorage.getItem('launchAgencies')) {
        commit('SET_AGENCIES', JSON.parse(localStorage.getItem('launchAgencies')))

        return
      }

      const [agencies, agencyTypes, agencyContinents] = await api.getAgenciesInfo()
      commit(types.SET_AGENCIES, agencies)
      commit(types.SET_AGENCY_TYPES, agencyTypes)
      commit(types.SET_AGENCY_CONTINENT, agencyContinents)
    },

    async getAgencyAllLaunches ({ commit }, id) {
      const launches = JSON.parse(localStorage.getItem('agenciesLaunches'))

      if (launches && launches[id]) {
        if (new Date(launches[id].changed) < new Date().setDate(new Date().getDate() - 7)) {
          commit(types.SET_AGENCY_LAUNCHES, { id: id, data: launches[id].launches })

          return
        }
      }

      const launchesById = await api.getAgencyAllLaunches(id)
      commit(types.SET_AGENCY_LAUNCHES, { id, data: launchesById, update: true })
    },

    async getSpaceXLaunches ({ commit }) {
      const agenciesLaunches = JSON.parse(localStorage.getItem('agenciesLaunches'))

      if (agenciesLaunches && agenciesLaunches[config.SPACEX_ID] && agenciesLaunches[config.SPACEX_ID].official) {
        if (new Date(agenciesLaunches[config.SPACEX_ID].changed) > new Date().setDate(new Date().getDate() - 7)) {
          commit(types.SET_AGENCY_LAUNCHES, {
            id: config.SPACEX_ID,
            data: agenciesLaunches[config.SPACEX_ID].launches,
            official: agenciesLaunches[config.SPACEX_ID].official
          })

          return
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
        commit(types.SET_MISSION_TYPES, JSON.parse(localStorage.getItem('missionTypes')))

        return
      }

      const missionTypes = await api.getMissionTypes()
      commit(types.SET_MISSION_TYPES, missionTypes)
    },

    async getRocket ({ commit }, name) {
      const rockets = JSON.parse(localStorage.getItem('rockets'))

      if (rockets && rockets[name]) {
        commit(types.SET_ROCKET, { name: name, data: rockets[name] })

        return
      }

      const rocket = await api.getRocket(name)
      commit(types.SET_ROCKET, { name, data: rocket, update: true })
    },

    async getPresentYearLaunches ({ commit }) {
      const launches = JSON.parse(localStorage.getItem('presentYearLaunches'))

      if (launches && new Date(launches[0].net) > Date.now()) {
        commit(types.SET_PRESENT_YEAR_LAUNCHES, { data: launches })

        return
      }

      const presentYearLaunches = await api.getPresentYearLaunches()
      commit(types.SET_PRESENT_YEAR_LAUNCHES, { data: presentYearLaunches, update: true })
    }
  }
}

export default getActions
