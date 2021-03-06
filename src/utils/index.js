const SUCCESS_STATUS = 3
const FAILED_STATUS = 4

export const zeroTime = val => {
  if (Number.isInteger(val)) {
    return val >= 10 ? val.toString() : '0' + val
  }

  return '00'
}

export const getPendingLaunchesCount = launches => {
  return launches.filter(launch => launch?.status?.id !== SUCCESS_STATUS && launch?.status?.id !== FAILED_STATUS).length
}

export const getSuccessfulLaunchesCount = launches => {
  return launches.filter(launch => launch?.status?.id === SUCCESS_STATUS).length
}

export const getFailedLaunchesCount = launches => {
  return launches.filter(launch => launch?.status?.id === FAILED_STATUS || launch?.failreason).length
}

export const getContrastColors = (amount, bgColor) => {
  const colors = []

  for (let i = 0; i < amount; i++) {
    colors.push(getContrastColor(bgColor))
  }

  return colors
}

export const getContrastColor = (bgColor = []) => {
  const randomColor = [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)
  ]

  if (contrast(randomColor, bgColor) < 3) {
    return getContrastColor(bgColor)
  }

  return `rgb(${randomColor[0]},${randomColor[1]},${randomColor[2]})`
}

export const getAlphaColor = (color, opacity = 0.5) => {
  return `rgba(${color.match(/\((.*)\)/).pop()},${opacity})`
}

const luminance = rgb => {
  const a = rgb.map(color => {
    color /= 255

    return color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4)
  })

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

const contrast = (rgb1, rgb2) => {
  const luminanceFirst = luminance(rgb1) + 0.05
  const luminanceSecond = luminance(rgb2) + 0.05

  if (luminanceFirst > luminanceSecond) {
    return luminanceFirst / luminanceSecond
  }

  return luminanceSecond / luminanceFirst
}

export const getYouTubeLink = link => {
  const path = /\?v=/.test(link) ? link.match(/\?v=(.*)/)[1] : link.match(/.be\/(.*)/)[1]

  return `http://www.youtube.com/embed/${path}`
}

export const getVimeoLink = link => {
  return `https://player.vimeo.com/video/${link.match(/vimeo.com\/(.*)/)[1]}`
}
