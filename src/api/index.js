import Vue from 'vue'
import url from 'url'
import config from '../config'

class API {
  constructor (http, config, limit) {
    this._http = http
    this._config = config
    this._limit = limit
  }

  static create () {
    return new API(Vue.http, config, 100)
  }

  async getPresentYearLaunches () {
    const startDate = new Date().toISOString()
    const endDate = new Date(new Date().getFullYear(), 11, 31).toISOString()

    return await this._getDataWithLimit(url.format({
      pathname: `${this._config.apiServer}/launch/`,
      query: {
        net__gte: startDate,
        net__lt: endDate
      }
    }))
  }

  async getLaunchesByDate (date) {
    const currentDate = new Date()
    const isGTCurrentDate = date > currentDate

    return await this._getDataWithLimit(url.format({
      pathname: `${this._config.apiServer}/launch/`,
      query: {
        net__gte: isGTCurrentDate ? currentDate.toISOString() : date.toISOString(),
        net__lt: isGTCurrentDate ? date.toISOString() : currentDate.toISOString()
      }
    }))
  }

  async getHistory () {
    const promises = []
    const currentYear = new Date().getFullYear()

    for (let year = 2000; year <= currentYear; year++) {
      const promise = async () => {
        const response = await this._http.get(url.format({
          pathname: `${this._config.apiServer}/launch/`,
          query: {
            net__gte: new Date(year, 0, 1).toISOString(),
            net__lte: year === currentYear ? new Date().toISOString() : new Date(year, 11, 31).toISOString(),
            limit: 0
          }
        }))

        return {
          year,
          amount: response.body.count
        }
      }

      promises.push(promise)
    }

    return await Promise.all(promises.map(promise => promise()))
  }

  async getHistoryLaunches (year) {
    return await this._getDataWithLimit(url.format({
      pathname: `${this._config.apiServer}/launch/`,
      query: {
        net__gte: new Date(year, 0, 1).toISOString(),
        net__lte: new Date(year, 11, 31).toISOString()
      }
    }))
  }

  async getAllUpcomingLaunches () {
    const lastLaunchYear = await this._getLastLaunch()
    const currentYear = new Date().getFullYear()

    const promises = []

    for (let year = currentYear; year <= lastLaunchYear; year++) {
      const promise = async () => {
        const presentYear = year === currentYear
        const response = await this._http.get(url.format({
          pathname: `${this._config.apiServer}/launch/`,
          query: {
            net__gte: presentYear ? new Date().toISOString() : new Date(year, 0, 1).toISOString(),
            net__lte: new Date(year, 11, 31).toISOString(),
            limit: 0
          }
        }))

        return {
          year,
          amount: response.body.count,
          ...(presentYear ? { nextLaunch: response.body.results[0].net } : {})
        }
      }

      promises.push(promise)
    }

    return await Promise.all(promises.map(promise => promise()))
  }

  async getAgenciesInfo () {
    const getAgencies = async () => await this._getDataWithLimit(`${this._config.apiServer}/agencies/`)
    const getContinents = async () => {
      const response = await this._http.get('/countries.json')

      return response.body
    }

    return Promise.all([getAgencies(), getContinents()])
      .then(([agencies, agencyContinents]) => {
        return agencies
          .filter(({ name }) => name.toLowerCase() !== 'unknown')
          .map(agency => ({
            ...agency,
            continent: (agencyContinents[agency.country_code] || {}).continent,
            country: (agencyContinents[agency.country_code] || {}).country
          }))
      })
  }

  async getAgencyAllLaunches (id) {
    return await this._getDataWithLimit(url.format({
      pathname: `${this._config.apiServer}/launch/`,
      query: {
        lsp__id: id
      }
    }))
  }

  async getSpaceXLaunches () {
    const getOfficialLaunches = async () => {
      const response = await this._http.get(`${this._config.spaceXApi}/launches`)

      return response.body
    }
    const getLocations = async () => {
      const response = await this._http.get(`${this._config.spaceXApi}/launchpads`)

      return response.body
    }

    return await Promise.all([
      this.getAgencyAllLaunches(this._config.SPACEX_ID),
      getOfficialLaunches(),
      getLocations()
    ])
  }

  async getLaunchDetails (id) {
    const response = await this._http.get(`${this._config.apiServer}/launch/${id}/`)

    return response.body
  }

  async getRocket (name) {
    const response = await this._http.get(`${this._config.spaceXApi}/rockets/${name}`)

    return response.body
  }

  async _getLastLaunch () {
    const response = await this._http.get(url.format({
      pathname: `${this._config.apiServer}/launch/`,
      query: {
        ordering: '-net',
        limit: 1
      }
    }))

   return new Date(response.body.results[0].net).getFullYear()
  }

  async _getDataWithLimit(path, data = []) {
    const { protocol, host, pathname, query } = url.parse(path, true)
    const response = await this._http.get(url.format({
      protocol,
      host,
      pathname,
      query: {
        ...query,
        limit: this._limit
      }
    }))
    const results = [...data, ...response.body.results]

    if(response.body.count > results.length) {
      return await this._getDataWithLimit(response.body.next, results)
    }

    return results
  }
}

export default API
