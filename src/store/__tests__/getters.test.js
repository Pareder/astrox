import getters from '../getters'

describe('getters', () => {
  describe('agencyInfo method', () => {
    const state = {
      agencies: [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]
    }

    it('Should return correct result', () => {
      expect(getters.agencyInfo(state)(1)).toEqual({ id: 1 })
    })

    it('Should return undefined if no agency with provided id', () => {
      expect(getters.agencyInfo(state)(111)).toEqual(undefined)
    })
  })

  describe('agencyAllLaunches method', () => {
    const state = {
      agenciesLaunches: {
        1: { launches: [1] },
        2: { launches: [2] },
        3: { launches: [3] }
      }
    }

    it('Should return correct result', () => {
      expect(getters.agencyAllLaunches(state)(1)).toEqual([1])
    })

    it('Should return empty array if no agenciesLaunches with provided id', () => {
      expect(getters.agencyAllLaunches(state)(111)).toEqual([])
    })
  })

  describe('agencyPastLaunches method', () => {
    const pastLaunches = [
      { net: new Date().setDate(new Date().getDate() - 1) },
      { net: new Date().setDate(new Date().getDate() - 2) }
    ]
    const state = {
      agenciesLaunches: {
        1: {
          launches: [
            ...pastLaunches,
            { net: new Date().setDate(new Date().getDate() + 1) },
          ]
        }
      }
    }

    it('Should return correct result', () => {
      expect(getters.agencyPastLaunches(state)(1)).toEqual(pastLaunches)
    })

    it('Should return empty array if no agenciesLaunches with provided id', () => {
      expect(getters.agencyPastLaunches(state)(111)).toEqual([])
    })
  })

  describe('agencyUpcomingLaunches method', () => {
    const upcomingLaunches = [
      { net: new Date().setDate(new Date().getDate() + 1) },
      { net: new Date().setDate(new Date().getDate() + 2) }
    ]
    const state = {
      agenciesLaunches: {
        1: {
          launches: [
            ...upcomingLaunches,
            { net: new Date().setDate(new Date().getDate() - 1) }
          ]
        }
      }
    }

    it('Should return correct result', () => {
      expect(getters.agencyUpcomingLaunches(state)(1)).toEqual(upcomingLaunches)
    })


    it('Should return empty array if no agenciesLaunches with provided id', () => {
      expect(getters.agencyUpcomingLaunches(state)(111)).toEqual([])
    })
  })

  describe('getMissionTypeName method', () => {
    const state = {
      missionTypes: [
        { id: 1, name: 'type1' },
        { id: 2, name: 'type2' }
      ]
    }

    it('Should return correct result', () => {
      expect(getters.getMissionTypeName(state)(1)).toEqual('type1')
    })

    it('Should return default value if no missionType with provided id', () => {
      expect(getters.getMissionTypeName(state)(111)).toEqual('Unknown')
    })
  })

  describe('agencyTypeNames method', () => {
    const state = {
      agencies: [
        { type: 'type1' },
        { type: 'type2' },
        { type: 'type3' }
      ]
    }

    it('Should return correct result', () => {
      expect(getters.agencyTypeNames(state)).toEqual(['All', 'type1', 'type2', 'type3'])
    })
  })

  describe('agencyCountries, method', () => {
    const state = {
      agencies: [
        { countryCode: 'a' },
        { countryCode: 'b' },
        { countryCode: 'c' },
      ]
    }

    it('Should return correct result', () => {
      expect(getters.agencyCountries(state)).toEqual(['All', 'a', 'b', 'c'])
    })
  })

  describe('agencyObject method', () => {
    const state = {
      agencies: [
        {
          id: 1,
          name: 'name1',
          continent: 'continent1',
          countryName: 'countryName1',
          type: 'type1'
        },
        {
          id: 2,
          name: 'name2',
          continent: 'continent2',
          countryName: 'countryName2',
          type: 'type2'
        }
      ]
    }

    it('Should return correct result', () => {
      expect(getters.agencyObject(state)).toEqual({
        1: {
          name: 'name1',
          continent: 'continent1',
          countryName: 'countryName1',
          type: 'type1'
        },
        2: {
          name: 'name2',
          continent: 'continent2',
          countryName: 'countryName2',
          type: 'type2'
        }
      })
    })
  })

  describe('historyLaunchesByYear method', () => {
    const state = {
      historyLaunches: {
        [new Date().getFullYear()]: {
          launches: [1, 2, 3]
        },
        2000: {
          launches: [4, 5, 6]
        }
      }
    }

    it('Should return correct result', () => {
      expect(getters.historyLaunchesByYear(state)(2000)).toEqual([4, 5, 6])
    })

    it('Should return current year launches if no parameter provided', () => {
      expect(getters.historyLaunchesByYear(state)()).toEqual([1, 2, 3])
    })

    it('Should return undefined if no provided year launches', () => {
      expect(getters.historyLaunchesByYear(state)(1)).toEqual(undefined)
    })
  })
})
