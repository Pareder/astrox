import url from 'url'
import API from '../index'

const httpMock = {
  get: jest.fn(async () => ({
    body: {
      results: []
    }
  }))
}
const configMock = {
  apiServer: 'api.com',
  spaceXApi: 'spacex.com',
  SPACEX_ID: 11111
}
const limitMock = 100

function getAPI (http = httpMock, config = configMock, limit = limitMock) {
  return new API(http, config, limit)
}

function getHttpMock (result) {
  return {
    get: jest.fn(async () => result)
  }
}

describe('API class', () => {
  describe('create method', () => {
    it('Should create new instance of API class', () => {
      expect(API.create()).toBeInstanceOf(API)
    })
  })

  describe('getPresentYearLaunches method', () => {
    it('Should call http.get with correct parameters', async () => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2021-01-01T00:00:00.000Z')
      const currentYear = new Date().getFullYear()
      const api = getAPI()

      await api.getPresentYearLaunches()

      expect(httpMock.get).toBeCalledWith(url.format({
        hostname: configMock.apiServer,
        pathname: '/launch/',
        query: {
          net__gte: '2021-01-01T00:00:00.000Z',
          net__lt: new Date(currentYear, 11, 31).toISOString(),
          limit: limitMock
        }
      }))
    })

    it('Should return correct values', async () => {
      const results = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { results } })
      const api = getAPI(http)

      const result = await api.getPresentYearLaunches()

      expect(result).toEqual(result)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getPresentYearLaunches()).rejects.toEqual({})
    })
  })

  describe('getLaunchesByDate method', () => {
    const date = new Date()

    it('Should call http.get with correct parameters', async () => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2000-01-01T00:00:00.000Z')
      const api = getAPI()

      await api.getLaunchesByDate(date)

      expect(httpMock.get).toBeCalledWith(url.format({
        hostname: configMock.apiServer,
        pathname: '/launch/',
        query: {
          net__gte: date.toISOString(),
          net__lt: '2000-01-01T00:00:00.000Z',
          limit: limitMock
        }
      }))
    })

    it('Should return correct values', async () => {
      const results = [1, 2, 3, 4, 5]
      const http = getHttpMock({
        body: {
          results
        }
      })
      const api = getAPI(http)

      const result = await api.getLaunchesByDate(date)

      expect(result).toEqual(results)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getLaunchesByDate(date)).rejects.toEqual({})
    })
  })

  describe('getHistory method', () => {
    it('Should call http.get correct number of times', async () => {
      const http = getHttpMock({ body: {} })
      const api = getAPI(http)
      const numberOfCalls = new Date().getFullYear() - 2000 + 1

      await api.getHistory()

      expect(http.get).toHaveBeenCalledTimes(numberOfCalls)
    })

    it('Should call http.get for previous years with correct parameters', async () => {
      const http = getHttpMock({ body: {} })
      const api = getAPI(http)

      await api.getHistory()

      for (let year = 2000, i = 0; year < new Date().getFullYear(); year++, i++) {
        expect(http.get.mock.calls[i][0]).toBe(url.format({
          hostname: configMock.apiServer,
          pathname: '/launch/',
          query: {
            net__gte: new Date(year, 0, 1).toISOString(),
            net__lte: new Date(year, 11, 31).toISOString(),
            limit: 0
          }
        }))
      }
    })

    it('Should call http.get for current year with today date', async () => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2021-01-01T00:00:00.000Z')
      const http = getHttpMock({ body: {} })
      const api = getAPI(http)

      await api.getHistory()

      expect(http.get).toHaveBeenLastCalledWith(url.format({
        hostname: configMock.apiServer,
        pathname: '/launch/',
        query: {
          net__gte: new Date(new Date().getFullYear(), 0, 1).toISOString(),
          net__lte: '2021-01-01T00:00:00.000Z',
          limit: 0
        }
      }))
    })

    it('Should return correct values', async () => {
      const count = 10
      const expectedResult = []

      for (let year = 2000; year <= new Date().getFullYear(); year++) {
        expectedResult.push({ amount: count, year })
      }

      const http = getHttpMock({ body: { count } })
      const api = getAPI(http)

      const result = await api.getHistory()

      expect(result).toEqual(expectedResult)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getHistory()).rejects.toEqual({})
    })
  })

  describe('getHistoryLaunches method', () => {
    it('Should call http.get with correct parameters', async () => {
      const year = 2000
      const api = getAPI()

      await api.getHistoryLaunches(year)

      expect(httpMock.get).toBeCalledWith(url.format({
        hostname: configMock.apiServer,
        pathname: '/launch/',
        query: {
          net__gte: new Date(year, 0, 1).toISOString(),
          net__lte: new Date(year, 11, 31).toISOString(),
          limit: limitMock
        }
      }))
    })

    it('Should return correct values', async () => {
      const results = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { results } })
      const api = getAPI(http)

      const result = await api.getHistoryLaunches()

      expect(result).toEqual(results)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getHistoryLaunches()).rejects.toEqual({})
    })
  })

  describe('getAllUpcomingLaunches method', () => {
    it('Should call http.get with correct parameters', async () => {
      const currentYear = new Date().getFullYear()
      const http = getHttpMock({
        body: {
          results: [{
            net: new Date().setFullYear(currentYear + 10)
          }]
        }
      })
      const api = getAPI(http)

      await api.getAllUpcomingLaunches()

      for (let year = new Date().getFullYear(), i = 1; year <= currentYear + 10; year++, i++) {
        expect(http.get.mock.calls[i][0]).toEqual(url.format({
          hostname: configMock.apiServer,
          pathname: '/launch/',
          query: {
            net__gte: new Date(year, 0, 1).toISOString(),
            net__lte: new Date(year, 11, 31).toISOString(),
            limit: 0
          }
        }))
      }
    })

    it('Should return correct values', async () => {
      const currentYear = new Date().getFullYear()
      const launchNet = new Date().setFullYear(currentYear + 10)
      const results = [{ net: launchNet, }]
      const expectedResult = []

      for (let year = currentYear; year <= currentYear + 10; year++) {
        expectedResult.push({
          year,
          amount: 1,
          ...(year === currentYear ? { nextLaunch: launchNet } : {})
        })

      }

      const http = getHttpMock({ body: { results, count: 1 } })
      const api = getAPI(http)

      const result = await api.getAllUpcomingLaunches()

      expect(result).toEqual(expectedResult)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getAllUpcomingLaunches()).rejects.toEqual({})
    })
  })

  describe('getAgenciesInfo method', () => {
    it('Should call http.get with correct parameters', async () => {
      const http = getHttpMock({ body: { results: [] } })
      const api = getAPI(http)

      await api.getAgenciesInfo()

      expect(http.get.mock.calls[0][0]).toEqual(url.format({
        hostname: configMock.apiServer,
        pathname: '/agencies/',
        query: {
          limit: limitMock
        }
      }))
      expect(http.get.mock.calls[1][0]).toEqual('/countries.json')
    })

    it('Should return correct values', async () => {
      const results = [
        { name: 'a' },
        { name: 'b' },
        { name: 'c' }
      ]
      const http = getHttpMock({ body: { results } })
      const api = getAPI(http)

      const result = await api.getAgenciesInfo()

      expect(result).toEqual(results)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getAgenciesInfo()).rejects.toEqual({})
    })
  })

  describe('getAgencyAllLaunches method', () => {
    it('Should call http.get with correct parameters', async () => {
      const id = 1
      const api = getAPI()

      await api.getAgencyAllLaunches(id)

      expect(httpMock.get).toBeCalledWith(url.format({
        hostname: configMock.apiServer,
        pathname: '/launch/',
        query: {
          lsp__id: id,
          limit: limitMock
        }
      }))
    })

    it('Should return correct values', async () => {
      const results = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { results } })
      const api = getAPI(http)

      const result = await api.getAgencyAllLaunches()

      expect(result).toEqual(results)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getAgencyAllLaunches()).rejects.toEqual({})
    })
  })

  describe('getSpaceXLaunches method', () => {
    it('Should call http.get with correct parameters', async () => {
      const http = getHttpMock({ body: { results: [] } })
      const api = getAPI(http)

      await api.getSpaceXLaunches()

      expect(http.get.mock.calls[0][0]).toEqual(url.format({
        hostname: configMock.apiServer,
        pathname: '/launch/',
        query: {
          lsp__id: configMock.SPACEX_ID,
          limit: limitMock
        }
      }))
      expect(http.get.mock.calls[1][0]).toEqual('spacex.com/launches')
      expect(http.get.mock.calls[2][0]).toEqual('spacex.com/launchpads')
    })

    it('Should return correct values', async () => {
      const results = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { results } })
      const api = getAPI(http)

      const result = await api.getSpaceXLaunches()

      expect(result).toEqual([results, { results }, { results }])
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getSpaceXLaunches()).rejects.toEqual({})
    })
  })

  describe('getLaunchDetails method', () => {
    it('Should call http.get with correct parameters', async () => {
      const id = 1
      const http = getHttpMock({ body: { results: [] } })
      const api = getAPI(http)

      await api.getLaunchDetails(id)

      expect(http.get).toBeCalledWith(`api.com/launch/${id}/`)
    })

    it('Should return correct values', async () => {
      const body = { name: 'a' }
      const http = getHttpMock({ body })
      const api = getAPI(http)

      const result = await api.getLaunchDetails()

      expect(result).toEqual(body)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getLaunchDetails()).rejects.toEqual({})
    })
  })

  describe('getRocket method', () => {
    it('Should call http.get with correct parameters', async () => {
      const name = 'rocket'
      const api = getAPI()
      await api.getRocket(name)

      expect(httpMock.get).toBeCalledWith(`spacex.com/rockets/${name}`)
    })

    it('Should return correct values', async () => {
      const body = [1, 2, 3]
      const http = getHttpMock({ body })
      const api = getAPI(http)
      const result = await api.getRocket()

      expect(result).toEqual(body)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getRocket()).rejects.toEqual({})
    })
  })
})
