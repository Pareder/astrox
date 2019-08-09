import API from '../api'

const httpMock = {
  get: jest.fn(async () => ({ body: {} }))
}
const configMock = {
  apiServer: 'api.com',
  spaceXApi: 'spacex.com',
  SPACEX_ID: 11111
}

function getAPI (http = httpMock, config = configMock) {
  return new API(http, config);
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

  describe('getLaunchesByDate method', () => {
    it('Should call http.get with correct parameters', async () => {
      const api = getAPI()
      await api.getLaunchesByDate('2000-00-00', '2001-00-00')

      expect(httpMock.get).toBeCalledWith('api.com/launch/2000-00-00/2001-00-00?limit=-1')
    })

    it('Should return correct values', async () => {
      const launches = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { launches } })
      const api = getAPI(http)
      const result = await api.getLaunchesByDate()

      expect(result).toEqual(launches)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getLaunchesByDate()).rejects.toEqual({})
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
        expect(http.get.mock.calls[i][0]).toBe(`api.com/launch?startdate=${year}-01-01&enddate=${year}-12-31&limit=1`)
      }
    })

    it('Should call http.get for current year with today date', async () => {
      const http = getHttpMock({ body: {} })
      const api = getAPI(http)
      const currentYear = new Date().getFullYear()
      let currentMonth = new Date().getMonth() + 1

      if (currentMonth < 10) {
        currentMonth = '0' + currentMonth
      }

      let currentDay = new Date().getDate()

      if (currentDay < 10) {
        currentDay = '0' + currentDay
      }

      await api.getHistory()

      expect(http.get).toHaveBeenLastCalledWith(
        `api.com/launch?startdate=${currentYear}-01-01&enddate=${currentYear}-${currentMonth}-${currentDay}&limit=1`
      )
    })

    it('Should return correct values', async () => {
      const total = 10
      const expectedResult = []

      for (let year = 2000; year <= new Date().getFullYear(); year++) {
        expectedResult.push({ amount: total, year })
      }

      const http = getHttpMock({ body: { total } })
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

      expect(httpMock.get).toBeCalledWith(`api.com/launch?startdate=${year}-01-01&enddate=${year}-12-31&limit=-1`)
    })

    it('Should return correct values', async () => {
      const launches = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { launches } })
      const api = getAPI(http)
      const result = await api.getHistoryLaunches()

      expect(result).toEqual(launches)
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
          launches: [{
            net: new Date().setFullYear(currentYear + 10)
          }]
        }
      })
      const api = getAPI(http)
      await api.getAllUpcomingLaunches()

      for (let year = new Date().getFullYear(), i = 1; year <= currentYear + 10; year++, i++) {
        const currentMonth = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`
        const currentDate = new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()
        const startDate = year === currentYear ? `${currentYear}-${currentMonth}-${currentDate}` : `${year}-01-01`

        expect(http.get.mock.calls[i][0]).toEqual(`api.com/launch?startdate=${startDate}&enddate=${year}-12-31&limit=1`)
      }
    })

    it('Should return correct values', async () => {
      const currentYear = new Date().getFullYear()
      const launchNet = new Date().setFullYear(currentYear + 10)
      const launches = [{ net: launchNet, }]
      const expectedResult = []

      for (let year = currentYear; year <= currentYear + 10; year++) {
        expectedResult.push({
          year,
          amount: 1,
          ...(year == currentYear ? {nextLaunch: launchNet} : {})
        })

      }

      const http = getHttpMock({ body: { launches, total: 1 } })
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
      const http = getHttpMock({ body: {} })
      const api = getAPI(http)
      await api.getAgenciesInfo()

      expect(http.get.mock.calls[0][0]).toEqual('api.com/lsp?limit=-1')
      expect(http.get.mock.calls[1][0]).toEqual('api.com/agencytype')
      expect(http.get.mock.calls[2][0]).toEqual('/countries.json')
    })

    it('Should return correct values', async () => {
      const agencies = [1, 2, 3, 4, 5]
      const types = [1, 2, 3]
      const http = getHttpMock({ body: { agencies, types } })
      const api = getAPI(http)
      const result = await api.getAgenciesInfo()

      expect(result).toEqual([agencies, types, { agencies, types }])
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

      expect(httpMock.get).toBeCalledWith(`api.com/launch?lsp=${id}&limit=-1`)
    })

    it('Should return correct values', async () => {
      const launches = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { launches } })
      const api = getAPI(http)
      const result = await api.getAgencyAllLaunches()

      expect(result).toEqual(launches)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getAgencyAllLaunches()).rejects.toEqual({})
    })
  })

  describe('getSpaceXLaunches method', () => {
    it('Should call http.get with correct parameters', async () => {
      const http = getHttpMock({ body: {} })
      const api = getAPI(http)
      await api.getSpaceXLaunches()

      expect(http.get.mock.calls[0][0]).toEqual('api.com/launch?lsp=11111&limit=-1')
      expect(http.get.mock.calls[1][0]).toEqual('spacex.com/launches')
      expect(http.get.mock.calls[2][0]).toEqual('spacex.com/launchpads')
    })

    it('Should return correct values', async () => {
      const launches = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { launches } })
      const api = getAPI(http)
      const result = await api.getSpaceXLaunches()

      expect(result).toEqual([launches, { launches }, { launches }])
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
      const http = getHttpMock({ body: { launches: [] } })
      const api = getAPI(http)
      await api.getLaunchDetails(id)

      expect(http.get).toBeCalledWith(`api.com/launch/${id}`)
    })

    it('Should return correct values', async () => {
      const launches = [1]
      const http = getHttpMock({ body: { launches } })
      const api = getAPI(http)
      const result = await api.getLaunchDetails()

      expect(result).toEqual(launches[0])
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getLaunchDetails()).rejects.toEqual({})
    })
  })

  describe('getMissionTypes method', () => {
    it('Should call http.get with correct parameters', async () => {
      const api = getAPI()
      await api.getMissionTypes()

      expect(httpMock.get).toBeCalledWith('api.com/missiontype')
    })

    it('Should return correct values', async () => {
      const types = [1, 2, 3]
      const http = getHttpMock({ body: { types } })
      const api = getAPI(http)
      const result = await api.getMissionTypes()

      expect(result).toEqual(types)
    })

    it('Should reject if error has been occurred', () => {
      const http = getHttpMock(Promise.reject({}))
      const api = getAPI(http)

      expect(api.getMissionTypes()).rejects.toEqual({})
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

  describe('getPresentYearLaunches method', () => {
    it('Should call http.get with correct parameters', async () => {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`
      const currentDay = new Date().getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`
      const api = getAPI()
      await api.getPresentYearLaunches()

      expect(httpMock.get).toBeCalledWith(
        `api.com/launch/${currentYear}-${currentMonth}-${currentDay}/${currentYear}-12-31?limit=-1`
      )
    })

    it('Should return correct values', async () => {
      const launches = [1, 2, 3, 4, 5]
      const http = getHttpMock({ body: { launches } })
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
})
