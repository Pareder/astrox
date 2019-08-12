import getActions from './getActions'

const localStorageMock = getLocalStorage()
const commitMock = jest.fn((type, payload) => ({ type, payload }))

function getLocalStorage (data = false) {
  return {
    getItem: jest.fn(() => data && JSON.stringify(data)),
    setItem: jest.fn((name, data) => ([name, data]))
  }
}

function getAPI (method, data) {
  return {
    [method]: jest.fn(async () => data)
  }
}

function getMethod ({ method, data, localStorage = localStorageMock, commit = commitMock }) {
  const api = getAPI(method, data)

  return getActions(api, localStorage)[method].bind(null, { commit })
}

describe('vuex actions', () => {
  describe('getHistory method', () => {
    const method = 'getHistory'

    it('Should call localStorage getItem method', async () => {
      const fn = getMethod({ method })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('launchHistory')
    })

    it('Should call commit with api data', async () => {
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn()

      expect(commitMock).toBeCalledWith('SET_HISTORY', data)
    })

    it('Should call commit with localStorage data', async () => {
      const data = [1, 2, 3]
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn()

      expect(commitMock).toBeCalledWith('SET_HISTORY', data)
    })
  })

  describe('getHistoryLaunches method', () => {
    const method = 'getHistoryLaunches'

    it('Should call localStorage getItem method', async () => {
      const fn = getMethod({ method })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('historyLaunches')
    })

    it('Should call commit with localStorage data', async () => {
      const data = {
        2000: {
          launches: [1, 2, 3]
        }
      }
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn(2000)

      expect(commitMock).toBeCalledWith('SET_HISTORY_LAUNCHES', { data: data[2000].launches, year: 2000 })
    })

    it('Should call commit with api data', async () => {
      const data = [1, 2, 3]
      const year = 2000
      const fn = getMethod({ method, data })
      await fn(year)

      expect(commitMock).toBeCalledWith('SET_HISTORY_LAUNCHES', { data, year, update: true })
    })
  })

  describe('getAllUpcomingLaunches method', () => {
    const method = 'getAllUpcomingLaunches'

    it('Should call localStorage getItem method', async () => {
      const fn = getMethod({ method })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('upcomingLaunches')
    })

    it('Should call commit with localStorage data', async () => {
      const data = [
        { nextLaunch: new Date().setDate(new Date().getDate() + 1)},
        1,
        2
      ]
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn()

      expect(commitMock).toBeCalledWith('SET_ALL_UPCOMING_LAUNCHES', { data })
    })

    it('Should call commit with api data', async () => {
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn()

      expect(commitMock).toBeCalledWith('SET_ALL_UPCOMING_LAUNCHES', { data, update: true })
    })
  })

  describe('getAgenciesInfo method', () => {
    const method = 'getAgenciesInfo'

    it('Should call localStorage getItem method', async () => {
      const data = []
      const fn = getMethod({ method, data })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('launchAgencies')
    })

    it('Should call commit with localStorage data', async () => {
      const data = [1, 2, 3]
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage})
      await fn()

      expect(commitMock).toBeCalledWith('SET_AGENCIES', data)
    })

    it('Should call commit with api data', async () => {
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn()

      expect(commitMock).toBeCalledWith('SET_AGENCIES', data[0])
      expect(commitMock).toBeCalledWith('SET_AGENCY_TYPES', data[1])
      expect(commitMock).toBeCalledWith('SET_AGENCY_CONTINENT', data[2])
    })
  })

  describe('getAgencyAllLaunches method', () => {
    const method = 'getAgencyAllLaunches'

    it('Should call localStorage getItem method', async () => {
      const fn = getMethod({ method })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('agenciesLaunches')
    })

    it('Should call commit with localStorage data', async () => {
      const id = 1
      const data = {
        1: {
          changed: new Date(),
          launches: [1, 2, 3]
        }
      }
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn(id)

      expect(commitMock).toBeCalledWith('SET_AGENCY_LAUNCHES', { id, data: data[1].launches })
    })

    it('Should call commit with api data', async () => {
      const id = 1
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn(id)

      expect(commitMock).toBeCalledWith('SET_AGENCY_LAUNCHES', { id, data, update: true })
    })

    it('Should call commit with api data if localStorage item data has been expired', async () => {
      const id = 1
      const localStorageData = {
        1: {
          changed: new Date().setDate(new Date().getDate() - 8),
          launches: [1, 2]
        }
      }
      const apiData = [1, 2, 3]
      const localStorage = getLocalStorage(localStorageData)
      const fn = getMethod({ method, localStorage, data: apiData })
      await fn(id)

      expect(commitMock).toBeCalledWith('SET_AGENCY_LAUNCHES', { id, data: apiData, update: true })
    })
  })

  describe('getSpaceXLaunches method', () => {
    const method = 'getSpaceXLaunches'

    it('Should call localStorage getItem method', async () => {
      const data = []
      const fn = getMethod({ method, data })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('agenciesLaunches')
    })

    it('Should call commit with localStorage data', async () => {
      const id = 121
      const data = {
        [id]: {
          official: [1, 2, 3],
          launches: [1, 2],
          changed: new Date()
        }
      }
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn()

      expect(commitMock).toBeCalledWith('SET_AGENCY_LAUNCHES', {
        id,
        data: data[id].launches,
        official: data[id].official
      })
    })

    it('Should call commit with api data', async () => {
      const id = 121
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn()

      expect(commitMock).toBeCalledWith('SET_AGENCY_LAUNCHES', {
        id,
        data: data[0],
        official: data[1],
        locations: data[2],
        update: true
      })
    })

    it('Should call commit with api data if localStorage item data has been expired', async () => {
      const id = 121
      const localStorageData = {
        [id]: {
          official: [1],
          launches: [2],
          changed: new Date().setDate(new Date().getDate() - 8)
        }
      }
      const apiData = [1, 2, 3]
      const localStorage = getLocalStorage(localStorageData)
      const commit = jest.fn((type, payload) => ({ type, payload }))
      const fn = getMethod({ method, localStorage, data: apiData, commit })
      await fn()

      expect(commit).toBeCalledWith('SET_AGENCY_LAUNCHES', {
        id,
        data: apiData[0],
        official: apiData[1],
        locations: apiData[2],
        update: true
      })
    })
  })

  describe('getLaunchDetails method', () => {
    const method = 'getLaunchDetails'

    it('Should call commit with api data', async () => {
      const id = 1
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn(id)

      expect(commitMock).toBeCalledWith('SET_LAUNCH_DETAILS', { id, data })
    })
  })

  describe('getMissionTypes method', () => {
    const method = 'getMissionTypes'

    it('Should call localStorage getItem method', async () => {
      const fn = getMethod({ method })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('missionTypes')
    })

    it('Should call commit with localStorage data', async () => {
      const data = [1, 2, 3]
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn()

      expect(commitMock).toBeCalledWith('SET_MISSION_TYPES', data)
    })

    it('Should call commit with api data', async () => {
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn()

      expect(commitMock).toBeCalledWith('SET_MISSION_TYPES', data)
    })
  })

  describe('getRocket method', () => {
    const method = 'getRocket'

    it('Should call localStorage getItem method', async () => {
      const fn = getMethod({ method })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('rockets')
    })

    it('Should call commit with localStorage data', async () => {
      const name = 'rocket'
      const data = {
        [name]: [1, 2, 3]
      }
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn(name)

      expect(commitMock).toBeCalledWith('SET_ROCKET', { name, data: data[name] })
    })

    it('Should call commit with api data', async () => {
      const name = 'rocket'
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn(name)

      expect(commitMock).toBeCalledWith('SET_ROCKET', { name, data, update: true })
    })
  })

  describe('getPresentYearLaunches method', () => {
    const method = 'getPresentYearLaunches'

    it('Should call localStorage getItem method', async () => {
      const fn = getMethod({ method })
      await fn()

      expect(localStorageMock.getItem).toBeCalledWith('presentYearLaunches')
    })

    it('Should call commit with localStorage data', async () => {
      const data = [
        { net: new Date().setDate(new Date().getDate() + 1) },
        1,
        2
      ]
      const localStorage = getLocalStorage(data)
      const fn = getMethod({ method, localStorage })
      await fn()

      expect(commitMock).toBeCalledWith('SET_PRESENT_YEAR_LAUNCHES', { data })
    })

    it('Should call commit with api data', async () => {
      const data = [1, 2, 3]
      const fn = getMethod({ method, data })
      await fn()

      expect(commitMock).toBeCalledWith('SET_PRESENT_YEAR_LAUNCHES', { data, update: true })
    })

    it('Should call commit with api data if localStorage item data has been expired', async () => {
      const localStorageData = [
        { net: new Date().setDate(new Date().getDate() - 1) },
        1,
        2
      ]
      const apiData = [1, 2, 3]
      const localStorage = getLocalStorage(localStorageData)
      const commit = jest.fn((type, payload) => ({ type, payload }))
      const fn = getMethod({ method, localStorage, data: apiData, commit })
      await fn()

      expect(commit).toBeCalledWith('SET_PRESENT_YEAR_LAUNCHES', { data: apiData, update: true })
    })
  })
})
