<template>
  <v-container fluid>
    <v-flex xs12 sm6 offset-sm3>
      <v-select outline menu-props="auto" :loading="loading" :items="getYears" label="Select a year to see companies' launches" v-model="chosenYear" @input="makeCharts"></v-select>
    </v-flex>
    <div v-if="launches">
      <p class="text-xs-left headline">Total Launches: {{ totalLaunches }}</p>
      <v-chip>
        <v-avatar class="red">
          <v-icon>close</v-icon>
        </v-avatar>
        <strong>{{ failedLaunches }}</strong> &nbsp;failed {{ failedLaunches === 1 ? 'launch' : 'launches' }}
      </v-chip>
      <v-chip>
        <v-avatar class="light-green">
          <v-icon>done</v-icon>
        </v-avatar>
        <strong>{{ successfulLaunches }}</strong> &nbsp;successful {{ successfulLaunches === 1 ? 'launch' : 'launches' }}
      </v-chip>
      <v-chip v-if="chosenYear >= new Date().getFullYear()">
        <v-avatar class="yellow">
          <v-icon>timeline</v-icon>
        </v-avatar>
        <strong>{{ pendingLaunches }}</strong> &nbsp;pending {{ pendingLaunches === 1 ? 'launch' : 'launches' }}
      </v-chip>
    </div>
    <div v-if="agenciesReady && !error">
      <v-chip v-for="(item, id) in getLaunchesByAgencyType" :key="id">
        <v-avatar class="cyan">
          <v-icon>business</v-icon>
        </v-avatar>
        <strong>{{ item }}</strong> &nbsp;{{ id }}
      </v-chip>
      <HorizontalBarChart :chartData="getHorizontalBarChartData" />
      <PieChart :chartData="getPieChartData" />
      <LineChart :chartData="getLineChartData" title="Launches by months" />
      <LineChart :chartData="getDaysChartData" title="Launches by days" />
      <PieChart :chartData="getTimeChartData" title="Launches by day time" position="top" />
      <RadarChart :chartData="getRadarChartData" />
    </div>
    <h3 v-if="error">
      <v-chip>
        <v-avatar class="red">
          <v-icon>close</v-icon>
        </v-avatar>
        No information about launches in {{ chosenYear }}
      </v-chip>
    </h3>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import HorizontalBarChart from './charts/HorizontalBarChart'
import PieChart from './charts/PieChart'
import LineChart from './charts/LineChart'
import RadarChart from './charts/RadarChart'

export default {
  data () {
    return {
      chosenYear: new Date().getFullYear(),
      launches: null,
      agencies: null,
      loading: false,
      error: false,
      agenciesReady: false
    }
  },
  computed: {
    ...mapGetters({
      yearLaunches: 'yearLaunches',
      colorTheme: 'getColorTheme'
    }),
    failedLaunches () {
      return this.launches.filter(item => item.status === 4 || item.failreason).length
    },
    successfulLaunches () {
      return this.launches.filter(item => item.status === 3).length
    },
    pendingLaunches () {
      return this.launches.filter(item => item.status === 1 || item.status === 2).length
    },
    getLaunchesByAgencyType () {
      const launchesByAgencyType = {}
      const unique = [...new Set(this.launches.map(item => this.agencies[item.lsp] && this.agencies[item.lsp].type).filter(item => item))]
      unique.map(type => {
        launchesByAgencyType[type] = this.launches.filter(item => this.agencies[item.lsp] && this.agencies[item.lsp].type === type).length
      })
      return launchesByAgencyType
    },
    getYears () {
      const years = []
      for (let i = 1980; i < new Date().getFullYear() + 12; i++) {
        years.push(i)
      }
      return years
    },
    totalLaunches () {
      return this.launches ? this.launches.length : 0
    },
    getPieChartData () {
      const launchesCount = this.getLaunchesCountBy('lsp')
      return {
        labels: launchesCount.labels,
        datasets: [
          {
            backgroundColor: this.getColors(launchesCount.data.length),
            borderWidth: 0,
            data: launchesCount.data
          }
        ]
      }
    },
    getLineChartData () {
      const color = this.randomColor()
      const alphaColor = color.slice(0, 3) + 'a' + color.slice(3, -1) + ',0.5)'
      return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Launches',
            data: this.createLineData,
            borderColor: color,
            fill: true,
            fillOpacity: 0.5,
            backgroundColor: alphaColor,
            pointBorderWidth: 5
          }
        ]
      }
    },
    getRadarChartData () {
      const color = this.randomColor()
      const alphaColor = color.slice(0, 3) + 'a' + color.slice(3, -1) + ',0.5)'
      return {
        labels: ['Europe', 'Asia', 'North America', 'Africa', 'South America', 'Oceania'],
        datasets: [
          {
            label: 'Launches',
            fill: true,
            backgroundColor: alphaColor,
            borderColor: color,
            data: this.createRadarData,
            pointRadius: 5,
            pointBackgroundColor: color
          }
        ]
      }
    },
    getHorizontalBarChartData () {
      const launchesCount = this.getLaunchesCountBy('countryName')
      return {
        labels: launchesCount.labels,
        datasets: [
          {
            label: 'Launches',
            backgroundColor: this.getColors(launchesCount.data.length),
            data: launchesCount.data
          }
        ]
      }
    },
    createLineData () {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return months.map(month => {
        return this.launches.filter(item => item.net.includes(month)).length
      })
    },
    createRadarData () {
      const continents = ['Europe', 'Asia', 'North America', 'Africa', 'South America', 'Oceania']
      return continents.map(continent => {
        return this.launches.filter(item => {
          return this.agencies[item.lsp] && this.agencies[item.lsp].continent === continent
        }).length
      })
    },
    getDaysChartData () {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      const daysData = days.map((day, id) => {
        return this.launches.filter(item => {
          return (new Date(item.net).getDay() || 7) === id + 1
        }).length
      })
      const color = this.randomColor()
      const alphaColor = color.slice(0, 3) + 'a' + color.slice(3, -1) + ',0.5)'
      return {
        labels: days,
        datasets: [
          {
            label: 'Launches',
            data: daysData,
            borderColor: color,
            fill: true,
            fillOpacity: 0.5,
            backgroundColor: alphaColor,
            pointBorderWidth: 5
          }
        ]
      }
    },
    getTimeChartData () {
      const time = ['Night (8 PM - 6 AM)', 'Morning (6 AM - 12 AM)', 'Afternoon (12 AM - 5 PM)', 'Evening (5 PM - 8 PM)']
      const timeData = time.map((timeName, id) => {
        return this.launches.filter(item => {
          const launchTime = new Date(item.net).getUTCHours()
          let launchTimeID = null
          if (launchTime >= 20 || launchTime < 6) {
            launchTimeID = 0
          } else if (launchTime >= 6 && launchTime < 12) {
            launchTimeID = 1
          } else if (launchTime >= 12 && launchTime < 17) {
            launchTimeID = 2
          } else if (launchTime >= 17 && launchTime < 20) {
            launchTimeID = 3
          }
          return launchTimeID === id
        }).length
      })
      return {
        labels: time,
        datasets: [
          {
            backgroundColor: this.getColors(time.length),
            borderWidth: 0,
            data: timeData
          }
        ]
      }
    }
  },
  created () {
    this.makeCharts()
  },
  methods: {
    makeCharts () {
      this.$Progress.start()
      this.error = false

      const getYearLaunches = new Promise((resolve, reject) => {
        if (this.$store.state.historyLaunches[this.chosenYear]) {
          resolve()
        } else {
          this.$store.dispatch('getHistoryLaunches', this.chosenYear)
            .then(() => {
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        }
      })

      const getAgenciesInfo = new Promise((resolve, reject) => {
        if (this.$store.state.agencies) {
          resolve()
        } else {
          this.$store.dispatch('getAgenciesInfo')
            .then(() => {
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        }
      })

      Promise.all([getYearLaunches, getAgenciesInfo])
        .then(() => {
          this.launches = this.$store.state.historyLaunches[this.chosenYear].launches
          this.getAgencies()
        })
        .catch(error => {
          this.launches = null
          this.error = true
          console.log(error)
          this.$Progress.fail()
        })
    },
    getAgencies () {
      this.agencies = {}
      this.$store.state.agencies.map(item => {
        this.agencies[item.id] = {
          name: item.name,
          continent: item.continent,
          countryName: item.countryName,
          type: item.type
        }
      })
      this.agenciesReady = true
      this.loading = false
    },
    getLaunchesCountBy (arg) {
      let unique = []
      let uniqueData = {}
      if (arg === 'countryName') {
        unique = [...new Set(this.launches.map(item => this.agencies[item.lsp] && this.agencies[item.lsp].countryName).filter(item => item))]
        for (let i = 0; i < unique.length; i++) {
          uniqueData[unique[i]] = this.launches.filter(item => this.agencies[item.lsp] && this.agencies[item.lsp].countryName === unique[i]).length
        }
      } else if (arg === 'lsp') {
        unique = [...new Set(this.launches.map(item => item[arg]))]
        for (let i = 0; i < unique.length; i++) {
          uniqueData[this.agencies[unique[i]] ? this.agencies[unique[i]].name : 'unknown'] = this.launches.filter(item => item[arg] === unique[i]).length
        }
      }
      this.$Progress.finish()
      return {
        labels: Object.keys(uniqueData).sort((a, b) => uniqueData[b] - uniqueData[a]),
        data: Object.values(uniqueData).sort((a, b) => b - a)
      }
    },
    getColors (argLength) {
      const colors = []
      for (let i = 0; i < argLength; i++) {
        colors.push(this.randomColor())
      }
      return colors
    },
    randomColor () {
      const bgColor = this.colorTheme === 'dark' ? [48, 48, 48] : [250, 250, 250]
      const randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
      if (this.contrast(randomColor, bgColor) < 3) {
        return this.randomColor()
      }
      return `rgb(${randomColor[0]},${randomColor[1]},${randomColor[2]})`
    },
    luminanace (rgb) {
      const a = rgb.map(color => {
        color /= 255
        return color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4)
      })
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
    },
    contrast (rgb1, rgb2) {
      const luminanceFirst = this.luminanace(rgb1) + 0.05
      const luminanceSecond = this.luminanace(rgb2) + 0.05

      if (luminanceFirst > luminanceSecond) {
        return luminanceFirst / luminanceSecond
      }
      return luminanceSecond / luminanceFirst
    }
  },
  components: {
    HorizontalBarChart,
    PieChart,
    LineChart,
    RadarChart
  }
}
</script>
