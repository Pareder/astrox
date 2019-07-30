import Vue from 'vue'
import url from 'url'
import config from '../config'

class API {
  constructor (http) {
    this._http = http
  }

  static create () {
    return new API(Vue.http)
  }

  getLaunchesByDate({ startDate, endDate }) {
    return new Promise((resolve, reject) => {
      this._http.get(url.format({
        pathname: `${config.apiServer}/launch/${startDate}/${endDate}`,
        query: {
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
  }
}

export default API
