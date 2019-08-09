import Vue from 'vue'
import url from 'url'
import config from '../config'
import {zeroTime} from '../utils'

class API {
  constructor (http, config) {
    this._http = http
    this._config = config
  }

  static create () {
    return new API(Vue.http, config)
  }

  async getLaunchesByDate (startDate, endDate) {
    const response = await this._http.get(url.format({
      pathname: `${this._config.apiServer}/launch/${startDate}/${endDate}`,
      query: {
        limit: -1
      }
    }))

    return response.body.launches
  }

  async getHistory () {
    const promises = []
    const currentYear = new Date().getFullYear()

    for (let year = 2000; year <= currentYear; year++) {
      const promise = async () => {
        let finalYear = year + '-12-31'

        if (year === currentYear) {
          finalYear = `${year}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
        }

        const response = await this._http.get(url.format({
          pathname: `${this._config.apiServer}/launch`,
          query: {
            startdate: `${year}-01-01`,
            enddate: `${finalYear || (year + '-12-31')}`,
            limit: 1
          }
        }))

        return {
          year,
          amount: response.body.total
        }
      }

      promises.push(promise)
    }

    return await Promise.all(promises.map(promise => promise()))
  }

  async getHistoryLaunches (year) {
    const response = await this._http.get(url.format({
      pathname: `${this._config.apiServer}/launch`,
      query: {
        startdate: `${year}-01-01`,
        enddate: `${year}-12-31`,
        limit: -1
      }
    }))

    return response.body.launches
  }

  async getAllUpcomingLaunches () {
    const lastLaunchYear = await this._getLastLaunch()
    const currentYear = new Date().getFullYear()

    const promises = []

    for (let year = currentYear; year <= lastLaunchYear; year++) {
      const promise = async () => {
        let presentYear = null

        if (year === currentYear) {
          presentYear = `${year}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
        }

        const response = await this._http.get(url.format({
          pathname: `${this._config.apiServer}/launch`,
          query: {
            startdate: `${presentYear || year + '-01-01'}`,
            enddate: `${year + '-12-31'}`,
            limit: 1
          }
        }))

        return {
          year,
          amount: response.body.total,
          ...(presentYear ? {nextLaunch: response.body.launches[0].net} : {})
        }
      }

      promises.push(promise)
    }

    return await Promise.all(promises.map(promise => promise()))
  }

  async getAgenciesInfo () {
    const getAgencies = async () => {
      const response = await this._http.get(url.format({
        pathname: `${this._config.apiServer}/lsp`,
        query: {
          limit: -1
        }
      }))

      return response.body.agencies
    }
    const getAgencyTypes = async () => {
      const response = await this._http.get(`${this._config.apiServer}/agencytype`)

      return response.body.types
    }
    const getContinents = async () => {
      const response = await this._http.get('/countries.json')

      return response.body
    }

    return await Promise.all([getAgencies(), getAgencyTypes(), getContinents()])
  }

  async getAgencyAllLaunches (id) {
    const response = await this._http.get(url.format({
      pathname: `${this._config.apiServer}/launch`,
      query: {
        lsp: id,
        limit: -1
      }
    }))

    return response.body.launches
  }

  async getSpaceXLaunches () {
    const getAllLaunches = async () => {
      const response = await this._http.get(url.format({
        pathname: `${this._config.apiServer}/launch`,
        query: {
          lsp: this._config.SPACEX_ID,
          limit: -1
        }
      }))

      return response.body.launches
    }
    const getOfficialLaunches = async () => {
      const response = await this._http.get(`${this._config.spaceXApi}/launches`)

      return response.body
    }
    const getLocations = async () => {
      const response = await this._http.get(`${this._config.spaceXApi}/launchpads`)

      return response.body
    }

    return await Promise.all([getAllLaunches(), getOfficialLaunches(), getLocations()])
  }

  async getLaunchDetails (id) {
    const response = await this._http.get(`${this._config.apiServer}/launch/${id}`)

    return response.body.launches[0]
  }

  async getMissionTypes () {
    const response = await this._http.get(`${this._config.apiServer}/missiontype`)

    return response.body.types
  }

  async getRocket (name) {
    const response = await this._http.get(`${this._config.spaceXApi}/rockets/${name}`)

    return response.body
  }

  async getPresentYearLaunches () {
    const currentYear = new Date().getFullYear()
    const startDate = `${currentYear}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
    const endDate = `${currentYear}-12-31`

    const response = await this._http.get(url.format({
      pathname: `${this._config.apiServer}/launch/${startDate}/${endDate}`,
      query: {
        limit: -1
      }
    }))

    return response.body.launches
  }

  async _getLastLaunch () {
    const lastLaunch = await this._http.get(url.format({
      pathname: `${this._config.apiServer}/launch`,
      query: {
        next: 1,
        sort: 'desc'
      }
    }))

   return new Date(lastLaunch.body.launches[0].net).getFullYear()
  }
}

export default API
