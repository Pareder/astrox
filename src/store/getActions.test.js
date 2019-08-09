import getActions from './getActions'

const localStorageMock = getLocalStorage()
const commitMock = jest.fn((type, payload) => ({type, payload}))

function getLocalStorage (data = false) {
  return {
    getItem: jest.fn(() => data),
    setItem: jest.fn((name, data) => ([name, data]))
  }
}

function getAPI (method, data) {
  return {
    [method]: jest.fn(async () => data)
  }
}

function getMethod (method, data, localStorage = localStorageMock) {
  const api = getAPI(method, data)

  return getActions(api, localStorage)[method].bind(null, { commit: commitMock })
}

describe('vuex actions', () => {
  describe('getHistory method', () => {
    it('Should call localStorage.getItem method', async () => {
      const method = getMethod('getHistory')
      await method()

      expect(localStorageMock.getItem).toBeCalledWith('launchHistory')
    })
  })
})
