import Vue from 'vue'
import url from 'url'
import config from '../config'
import {zeroTime} from '../utils'

class API {
  constructor (http) {
    this._http = http
  }

  static create () {
    return new API(Vue.http)
  }

  async getLaunchesByDate ({startDate, endDate}) {
    const response = await this._http.get(url.format({
      pathname: `${config.apiServer}/launch/${startDate}/${endDate}`,
      query: {
        limit: -1
      }
    }))

    return response.body.launches
  }

  async getHistory () {
    const promises = []

    for (let year = 2000; year <= new Date().getFullYear(); year++) {
      const promise = async () => {
        let finalYear = year + '-12-31'

        if (year === new Date().getFullYear()) {
          finalYear = `${year}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
        }

        const response = await this._http.get(url.format({
          pathname: `${config.apiServer}/launch`,
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
      pathname: `${config.apiServer}/launch`,
      query: {
        startdate: `${year}-01-01`,
        enddate: `${year + '-12-31'}`,
        limit: -1
      }
    }))

    return response.body.launches
  }

  async getAllUpcomingLaunches () {
    const lastLaunch = await this._http.get(url.format({
      pathname: `${config.apiServer}/launch`,
      query: {
        next: 1,
        sort: 'desc'
      }
    }))
    const lastLaunchYear = new Date(lastLaunch.body.launches[0].net).getFullYear()

    const promises = []

    for (let year = new Date().getFullYear(); year <= lastLaunchYear; year++) {
      const promise = async () => {
        let presentYear = null

        if (year === new Date().getFullYear()) {
          presentYear = `${year}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
        }

        const response = await this._http.get(url.format({
          pathname: `${config.apiServer}/launch`,
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
    const getAgencyTypes = async () => {
      const response = await this._http.get(`${config.apiServer}/agencytype/`)

      return response.body.types
    }
    const getAgencies = async () => {
      const response = await this._http.get(url.format({
        pathname: `${config.apiServer}/lsp`,
        query: {
          limit: -1
        }
      }))

      return response.body.agencies
    }
    const getContinents = async () => {
      const response = await this._http.get('/countries.json')

      return response.body
    }

    return await Promise.all([getAgencies(), getAgencyTypes(), getContinents()])
  }

  async getAgencyAllLaunches (id) {
    const response = await this._http.get(url.format({
      pathname: `${config.apiServer}/launch`,
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
        pathname: `${config.apiServer}/launch`,
        query: {
          lsp: config.SPACEX_ID,
          limit: -1
        }
      }))

      return response.body.launches
    }
    const getOfficialLaunches = async () => {
      const response = await this._http.get(`${config.spaceXApi}/launches`)

      return response.body
    }
    const getLocations = async () => {
      const response = await this._http.get(`${config.spaceXApi}/launchpads`)

      return response.body
    }

    return await Promise.all([getAllLaunches(), getOfficialLaunches(), getLocations()])
  }

  async getLaunchDetails (id) {
    const response = await this._http.get(`${config.apiServer}/launch/${id}`)

    return response.body.launches[0]
  }

  async getMissionTypes () {
    const response = this._http.get(`${config.apiServer}/missiontype`)

    return response.body.types
  }

  async getRocket (name) {
    const response = await this._http.get(`${config.spaceXApi}/rockets/${name}`)

    return response.body
  }

  async getPresentYearLaunches () {
    const currentYear = new Date().getFullYear()
    const startDate = `${currentYear}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`
    const endDate = `${currentYear}-12-31`

    const response = await this._http.get(url.format({
      pathname: `${config.apiServer}/launch/${startDate}/${endDate}`,
      query: {
        limit: -1
      }
    }))

    return response.body.launches
  }
}

export default API
