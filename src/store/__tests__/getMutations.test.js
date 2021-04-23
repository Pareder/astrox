import getMutations from '../getMutations'

function getLocalStorage (data = false) {
  return {
    getItem: jest.fn(() => data),
    setItem: jest.fn((name, data) => ([name, data]))
  }
}

describe('vuex mutations', () => {
  describe('SET_HISTORY method', () => {
    const state = {}
    const payload = [1, 2, 3]

    it('Should set correct state', () => {
      getMutations().SET_HISTORY(state, payload)

      expect(state.history).toEqual(payload)
    })

    it('Should set localStorage item', () => {
      const localStorage = getLocalStorage()
      getMutations(localStorage).SET_HISTORY(state, payload)

      expect(localStorage.getItem).toBeCalledWith('launchHistory')
      expect(localStorage.setItem).toBeCalledWith('launchHistory', JSON.stringify(payload))
    })

    it('Should not set localStorage item if it exists', () => {
      const localStorage = getLocalStorage(true)
      getMutations(localStorage).SET_HISTORY(state, payload)

      expect(localStorage.getItem).toBeCalledWith('launchHistory')
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('SET_HISTORY_LAUNCHES method', () => {
    const state = {}
    const payload = {
      year: 2000,
      data: [1, 2, 3]
    }

    it('Should set correct state', () => {
      getMutations().SET_HISTORY_LAUNCHES(state, payload)

      expect(state.historyLaunches).toEqual({
        [2000]: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString()
        }
      })
    })

    it('Should not set localStorage item if no update property provided', () => {
      const localStorage = getLocalStorage()
      getMutations(localStorage).SET_HISTORY_LAUNCHES(state, payload)

      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('Should set localStorage item if payload has update property', () => {
      const localStorage = getLocalStorage()
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_HISTORY_LAUNCHES(state, data)

      expect(localStorage.getItem).toBeCalledWith('historyLaunches')
      expect(localStorage.setItem).toBeCalledWith('historyLaunches', JSON.stringify({
        [2000]: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString()
        }
      }))
    })

    it('Should add new data to localStorage item if it exists', () => {
      const localStorage = getLocalStorage(JSON.stringify({
        [1000]: {
          launches: [1, 2],
          changed: 'qwe'
        }
      }))
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_HISTORY_LAUNCHES(state, data)

      expect(localStorage.setItem).toBeCalledWith('historyLaunches', JSON.stringify({
        [1000]: {
          launches: [1, 2],
          changed: 'qwe'
        },
        [2000]: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString()
        }
      }))
    })
  })

  describe('SET_ALL_UPCOMING_LAUNCHES method', () => {
    const state = {}
    const payload = { data: [1, 2, 3] }

    it('Should set correct state', () => {
      getMutations().SET_ALL_UPCOMING_LAUNCHES(state, payload)

      expect(state.allUpcomingLaunches).toEqual(payload.data)
    })

    it('Should not set localStorage item if no update property provided', () => {
      const localStorage = getLocalStorage()
      getMutations(localStorage).SET_ALL_UPCOMING_LAUNCHES(state, payload)

      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('Should set localStorage item if payload has update property', () => {
      const localStorage = getLocalStorage()
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_ALL_UPCOMING_LAUNCHES(state, data)

      expect(localStorage.setItem).toBeCalledWith('upcomingLaunches', JSON.stringify(data.data))
    })
  })

  describe('SET_AGENCIES method', () => {
    const state = {}
    const payload = [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' }
    ]

    it('Should set correct state', () => {
      getMutations().SET_AGENCIES(state, payload)

      expect(state.agencies).toEqual(payload)
    })
  })

  describe('SET_AGENCY_LAUNCHES method', () => {
    const state = {}
    const payload = {
      id: 1,
      data: [1, 2, 3]
    }

    it('Should set correct state', () => {
      getMutations().SET_AGENCY_LAUNCHES(state, payload)

      expect(state.agenciesLaunches).toEqual({
        1: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString()
        }
      })
    })

    it('Should set localStorage item if payload has update property', () => {
      const localStorage = getLocalStorage()
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_AGENCY_LAUNCHES(state, data)

      expect(localStorage.setItem).toBeCalledWith('agenciesLaunches', JSON.stringify({
        1: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString()
        }
      }))
    })

    it('Should add new data to localStorage item if it exists', () => {
      const localStorage = getLocalStorage(JSON.stringify({
        2: {
          launches: [1, 2],
          changed: 'qwe'
        }
      }))
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_AGENCY_LAUNCHES(state, data)

      expect(localStorage.setItem).toBeCalledWith('agenciesLaunches', JSON.stringify({
        2: {
          launches: [1, 2],
          changed: 'qwe'
        },
        1: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString()
        }
      }))
    })

    it('Should set official property', () => {
      const data = {
        ...payload,
        official: ['a']
      }
      getMutations().SET_AGENCY_LAUNCHES(state, data)

      expect(state.agenciesLaunches).toEqual({
        1: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString(),
          official: ['a']
        }
      })
    })

    it('Should set locations property', () => {
      const data = {
        ...payload,
        official: [
          {
            name: 'a',
            launch_site: {
              site_id: 1
            }
          }
        ],
        locations: [
          {
            id: 1,
            location: {
              latitude: 1,
              longitude: 2
            }
          }
        ]
      }
      getMutations().SET_AGENCY_LAUNCHES(state, data)

      expect(state.agenciesLaunches).toEqual({
        1: {
          launches: [1, 2, 3],
          changed: new Date().toUTCString(),
          official: [
            {
              name: 'a',
              launch_site: {
                site_id: 1
              },
              location: {
                lat: 1,
                lng: 2
              }
            }
          ]
        }
      })
    })

    it('Should throw error if official property is not an array and locations property exists', () => {
      const data = {
        ...payload,
        official: 'a',
        locations: [
          {
            id: 1,
            location: {
              latitude: 1,
              longitude: 2
            }
          }
        ]
      }

      expect(() => getMutations().SET_AGENCY_LAUNCHES(state, data)).toThrow(TypeError)
    })
  })

  describe('SET_LAUNCH_DETAILS method', () => {
    const state = {}
    const payload = {
      id: 1,
      data: [1, 2, 3]
    }

    it('Should set correct state', () => {
      getMutations().SET_LAUNCH_DETAILS(state, payload)

      expect(state.launchDetails).toEqual({
        1: [1, 2, 3]
      })
    })
  })

  describe('SET_PRESENT_YEAR_LAUNCHES method', () => {
    const state = {}
    const payload = {
      data: [1, 2, 3]
    }

    it('Should set correct state', () => {
      getMutations().SET_PRESENT_YEAR_LAUNCHES(state, payload)

      expect(state.presentYearLaunches).toEqual(payload.data)
    })

    it('Should not set localStorage item if no update property provided', () => {
      const localStorage = getLocalStorage()
      getMutations(localStorage).SET_PRESENT_YEAR_LAUNCHES(state, payload)

      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('Should set localStorage item if payload has update property', () => {
      const localStorage = getLocalStorage()
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_PRESENT_YEAR_LAUNCHES(state, data)

      expect(localStorage.setItem).toBeCalledWith('presentYearLaunches', JSON.stringify(data.data))
    })
  })

  describe('SET_ROCKET method', () => {
    const state = {}
    const payload = {
      name: 'rocket',
      data: [1, 2, 3]
    }

    it('Should set correct state', () => {
      getMutations().SET_ROCKET(state, payload)

      expect(state.rockets).toEqual({
        rocket: [1, 2, 3]
      })
    })

    it('Should not set localStorage item if no update property provided', () => {
      const localStorage = getLocalStorage()
      getMutations(localStorage).SET_ROCKET(state, payload)

      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('Should set localStorage item if payload has update property', () => {
      const localStorage = getLocalStorage()
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_ROCKET(state, data)

      expect(localStorage.setItem).toBeCalledWith('rockets', JSON.stringify({
        rocket: [1, 2, 3]
      }))
    })

    it('Should add new data to localStorage item if it exists', () => {
      const localStorage = getLocalStorage(JSON.stringify({
        rock: [1, 2]
      }))
      const data = {
        ...payload,
        update: true
      }
      getMutations(localStorage).SET_ROCKET(state, data)

      expect(localStorage.setItem).toBeCalledWith('rockets', JSON.stringify({
        rock: [1, 2],
        rocket: [1, 2, 3]
      }))
    })
  })

  describe('SET_COLOR_THEME method', () => {
    const state = {}
    const payload = 'light'

    it('Should set correct state', () => {
      getMutations().SET_COLOR_THEME(state, payload)

      expect(state.colorTheme).toEqual(payload)
    })

    it('Should set localStorage item', () => {
      const localStorage = getLocalStorage()
      getMutations(localStorage).SET_COLOR_THEME(state, payload)

      expect(localStorage.setItem).toBeCalledWith('colorTheme', payload)
    })
  })
})
