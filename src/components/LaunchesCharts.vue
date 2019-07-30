<template>
  <v-container fluid>
    <v-flex xs12 sm6 offset-sm3>
      <v-select
        outline
        menu-props="auto"
        :loading="loading"
        :items="getYears"
        label="Select a year to see companies' launches"
        v-model="chosenYear"
        @input="makeCharts"
      />
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
import { mapState, mapGetters } from 'vuex'
import config from '../config'
import {
  getPendingLaunchesCount,
  getSuccessfulLaunchesCount,
  getFailedLaunchesCount,
  getContrastColors,
  getContrastColor,
  getAlphaColor
} from '../utils'
import HorizontalBarChart from './charts/HorizontalBarChart'
import PieChart from './charts/PieChart'
import LineChart from './charts/LineChart'
import RadarChart from './charts/RadarChart'

const MINIMUM_YEAR = 1980
const MAXIMUM_YEAR = new Date().getFullYear() + 12

export default {
  data () {
    return {
      launches: null,
      chosenYear: new Date().getFullYear(),
      loading: false,
      error: false,
      agenciesReady: false
    }
  },

  computed: {
    ...mapState([
      'colorTheme'
    ]),

    ...mapGetters({
      agencies: 'agencyObject',
      historyLaunchesByYear: 'historyLaunchesByYear'
    }),

    failedLaunches () {
      return getFailedLaunchesCount(this.launches)
    },

    successfulLaunches () {
      return getSuccessfulLaunchesCount(this.launches)
    },

    pendingLaunches () {
      return getPendingLaunchesCount(this.launches)
    },

    getLaunchesByAgencyType () {
      const launchesByAgencyType = {}

      for (const launch of this.launches) {
        if (this.agencies[launch.lsp] && this.agencies[launch.lsp].type) {
          if (!launchesByAgencyType[this.agencies[launch.lsp].type]) {
            launchesByAgencyType[this.agencies[launch.lsp].type] = 0
          }

          ++launchesByAgencyType[this.agencies[launch.lsp].type]
        }
      }

      return launchesByAgencyType
    },

    getYears () {
      const years = []

      for (let i = MINIMUM_YEAR; i < MAXIMUM_YEAR; i++) {
        years.push(i)
      }

      return years
    },

    totalLaunches () {
      return this.launches ? this.launches.length : 0
    },

    getPieChartData () {
      const launchesCount = this.getLaunchesCountBy('name')

      return {
        labels: launchesCount.labels,
        datasets: [
          {
            backgroundColor: getContrastColors(launchesCount.data.length, this.bgColor),
            borderWidth: 0,
            data: launchesCount.data
          }
        ]
      }
    },

    getLineChartData () {
      const color = getContrastColor(this.bgColor)

      return {
        labels: config.months,
        datasets: [
          {
            label: 'Launches',
            data: this.createLineData,
            borderColor: color,
            fill: true,
            fillOpacity: 0.5,
            backgroundColor: getAlphaColor(color),
            pointBorderWidth: 5
          }
        ]
      }
    },

    getRadarChartData () {
      const color = getContrastColor(this.bgColor)

      return {
        labels: config.continents,
        datasets: [
          {
            label: 'Launches',
            fill: true,
            backgroundColor: getAlphaColor(color),
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
            backgroundColor: getContrastColors(launchesCount.data.length, this.bgColor),
            data: launchesCount.data
          }
        ]
      }
    },

    createLineData () {
      return config.months.map(month => {
        return this.launches.filter(item => item.net.includes(month)).length
      })
    },

    createRadarData () {
      return config.continents.map(continent => {
        return this.launches.filter(item => {
          return this.agencies[item.lsp] && this.agencies[item.lsp].continent === continent
        }).length
      })
    },

    getDaysChartData () {
      const daysData = {}
      const color = getContrastColor(this.bgColor)

      for (const launch of this.launches) {
        const day = new Date(launch.net).getDay()

        if (!daysData[day]) {
          daysData[day] = 0
        }

        ++daysData[day]
      }

      return {
        labels: config.days,
        datasets: [
          {
            label: 'Launches',
            data: Object.values(daysData),
            borderColor: color,
            fill: true,
            fillOpacity: 0.5,
            backgroundColor: getAlphaColor(color),
            pointBorderWidth: 5
          }
        ]
      }
    },

    getTimeChartData () {
      const timeData = {}

      for (const launch of this.launches) {
        const launchTime = new Date(launch.net).getUTCHours()
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

        if (!timeData[launchTimeID]) {
          timeData[launchTimeID] = 0
        }

        ++timeData[launchTimeID]
      }

      return {
        labels: config.timeRange,
        datasets: [
          {
            backgroundColor: getContrastColors(config.timeRange.length, this.bgColor),
            borderWidth: 0,
            data: Object.values(timeData)
          }
        ]
      }
    },

    bgColor () {
      return this.colorTheme === 'dark' ? [48, 48, 48] : [250, 250, 250]
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
          this.launches = this.historyLaunchesByYear(this.chosenYear)
          this.agenciesReady = true
          this.loading = false
          this.$Progress.finish()
        })
        .catch(() => {
          this.launches = null
          this.error = true
          this.$Progress.fail()
        })
    },

    getLaunchesCountBy (arg) {
      const uniqueData = {}

      for (const launch of this.launches) {
        if (this.agencies[launch.lsp] && this.agencies[launch.lsp][arg]) {
          if (!uniqueData[this.agencies[launch.lsp][arg]]) {
            uniqueData[this.agencies[launch.lsp][arg]] = 0
          }

          ++uniqueData[this.agencies[launch.lsp][arg]]
        }
      }

      return {
        labels: Object.keys(uniqueData).sort((a, b) => uniqueData[b] - uniqueData[a]),
        data: Object.values(uniqueData).sort((a, b) => b - a)
      }
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
