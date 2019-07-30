export const LIGHT_FONT_COLOR = '#ddd'
export const DARK_FONT_COLOR = '#666'
export const LIGHT_GRID_LINES_COLOR = 'rgba(255, 255, 255, 0.5)'
export const DARK_GRID_LINES_COLOR = 'rgba(0, 0, 0, 0.1)'
export const LIGHT_BACKDROP_COLOR = '#FAFAFA'
export const DARK_BACKDROP_COLOR = '#303030'

export default {
  apiServer: 'https://launchlibrary.net/1.4',
  spaceXApi: 'https://api.spacexdata.com/v2',
  SPACEX_ID: 121,
  menuItems: [
    {
      name: 'Home',
      path: '/',
      icon: 'home'
    },
    {
      name: 'Agencies',
      path: '/agencies',
      icon: 'business'
    },
    {
      name: 'Charts',
      path: '/charts',
      icon: 'pie_chart'
    }
  ],
  googleMapsKey: 'AIzaSyC9H_ZF0P-ghuts2MmTKxJDOaw7KTSM0AI',
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December'],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  timeRange: ['Night (8 PM - 6 AM)', 'Morning (6 AM - 12 AM)', 'Afternoon (12 AM - 5 PM)', 'Evening (5 PM - 8 PM)'],
  continents: ['Europe', 'Asia', 'North America', 'Africa', 'South America', 'Oceania']
}
