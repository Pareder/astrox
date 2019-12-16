import {
  zeroTime,
  getPendingLaunchesCount,
  getSuccessfulLaunchesCount,
  getFailedLaunchesCount,
  getContrastColor,
  getContrastColors,
  getAlphaColor,
  getYouTubeLink,
  getVimeoLink
} from '../index'

const launches = [
  { status: 1 },
  { status: 2 },
  { status: 3 },
  { status: 4 },
]

describe('utils functionality', () => {
  describe('zeroTime method', () => {
    it('Should return correct values', () => {
      expect(zeroTime(5)).toEqual('05')
      expect(zeroTime(9)).toEqual('09')
      expect(zeroTime(10)).toEqual('10')
    })

    it('Should return default value if given parameter is not a number', () => {
      const values = [true, false, undefined, null, '', NaN]

      for (const value of values) {
        expect(zeroTime(value)).toEqual('00')
      }
    })
  })

  describe('getPendingLaunchesCount method', () => {
    it('Should return correct values', () => {
      expect(getPendingLaunchesCount(launches)).toEqual(2)
      expect(getPendingLaunchesCount([])).toEqual(0)
    })
  })

  describe('getSuccessfulLaunchesCount method', () => {
    it('Should return correct values', () => {
      expect(getSuccessfulLaunchesCount(launches)).toEqual(1)
      expect(getSuccessfulLaunchesCount([])).toEqual(0)
    })
  })

  describe('getFailedLaunchesCount method', () => {
    it('Should return correct values', () => {
      expect(getFailedLaunchesCount(launches)).toEqual(1)
      expect(getFailedLaunchesCount([])).toEqual(0)
    })
  })

  describe('getContrastColor method', () => {
    it('Should return correct values', () => {
      expect(getContrastColor([0, 0, 0])).toMatch(/rgb/)
      expect(getContrastColor()).toMatch(/rgb/)
    })
  })

  describe('getContrastColors method', () => {
    it('Should return correct values', () => {
      const amount = 10

      expect(getContrastColors(amount, [])).toHaveLength(amount)
    })
  })

  describe('getAlphaColor method', () => {
    it('Should return correct values', () => {
      expect(getAlphaColor('rgb(0,0,0)', 0.1)).toEqual('rgba(0,0,0,0.1)')
    })

    it('Should return alpha color with default opacity if it was not provided', () => {
      expect(getAlphaColor('rgb(0,0,0)')).toEqual('rgba(0,0,0,0.5)')
    })
  })

  describe('getYouTubeLink method', () => {
    it('Should return correct values', () => {
      const link1 = 'https://www.youtube.com/watch?v=qqqqq'
      const link2 = 'https://youtu.be/qqqqq'

      expect(getYouTubeLink(link1)).toEqual('http://www.youtube.com/embed/qqqqq')
      expect(getYouTubeLink(link2)).toEqual('http://www.youtube.com/embed/qqqqq')
    })
  })

  describe('getVimeoLink method', () => {
    it('Should return correct values', () => {
      const link = 'https://www.vimeo.com/qqqqqq'

      expect(getVimeoLink(link)).toEqual('https://player.vimeo.com/video/qqqqqq')
    })
  })
})
