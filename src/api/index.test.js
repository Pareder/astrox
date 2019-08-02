import API from '../api'

const httpMock = {
  get: jest.fn(async () => ({ body: {} }))
}
const configMock = {
  apiServer: 'api.com',
  spaceXApi: 'spacex.com'
}

function getAPI (http = httpMock, config = configMock) {
  return new API(http, config);
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
      const http = {
        get: jest.fn(async () => ({ body: { launches } }))
      }
      const api = getAPI(http)
      const result = await api.getLaunchesByDate()

      expect(result).toEqual(launches)
    })

    it('Should reject if error has been occurred', async () => {
      const http = {
        get: jest.fn(async () => Promise.reject({}))
      }
      const api = getAPI(http)

      expect(api.getLaunchesByDate()).rejects.toEqual({})
    })
  })

  describe('getHistory method', () => {
    it('Should call http.get correct number of times', async () => {
      const http = {
        get: jest.fn(async () => ({ body: {} }))
      }
      const api = getAPI(http)
      const numberOfCalls = new Date().getFullYear() - 2000 + 1
      await api.getHistory()

      expect(http.get).toHaveBeenCalledTimes(numberOfCalls)
    })

    it('Should call http.get for previous years with correct parameters', async () => {
      const http = {
        get: jest.fn(async () => ({ body: {} }))
      }
      const api = getAPI(http)
      await api.getHistory()

      for (let year = 2000, i = 0; year < new Date().getFullYear(); year++, i++) {
        expect(http.get.mock.calls[i][0]).toBe(`api.com/launch?startdate=${year}-01-01&enddate=${year}-12-31&limit=1`)
      }
    })

    it('Should call http.get for current year with today date', async () => {
      const http = {
        get: jest.fn(async () => ({ body: {}}))
      }
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

      const http = {
        get: jest.fn(async () => ({ body: { total } }))
      }
      const api = getAPI(http)
      const result = await api.getHistory()

      expect(result).toEqual(expectedResult)
    })
  })
})
