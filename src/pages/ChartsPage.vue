<template>
  <v-container fluid>
    <v-flex xs12 sm6 offset-sm3>
      <v-select
        outline
        menu-props="auto"
        :loading="loading"
        :items="years"
        label="Select a year to see companies' launches"
        v-model="chosenYear"
        @input="makeCharts"
      />
    </v-flex>
    <Chip v-if="error" className="red" icon="close">
      <b>No information about launches in {{ chosenYear }}</b>
    </Chip>
    <div v-if="launches">
      <p class="text-xs-left headline">Total Launches: {{ totalLaunches }}</p>
      <LaunchChip v-if="failedLaunches" :count="failedLaunches" status="fail"/>
      <LaunchChip v-if="successfulLaunches" :count="successfulLaunches" status="success"/>
      <LaunchChip v-if="pendingLaunches" :count="pendingLaunches" status="pending"/>
    </div>
    <div v-if="agenciesReady && !error">
      <LaunchChip
        v-for="(val, id) in launchesByAgencyType"
        :key="id"
        :count="val"
        :status="id.toLowerCase()"
      />
      <HorizontalBarChart :chartData="countriesChartData" title="Launches by countries"/>
      <PieChart :chartData="companiesChartData" title="Launches by companies" />
      <LineChart :chartData="monthsChartData" title="Launches by months" />
      <LineChart :chartData="daysChartData" title="Launches by days" />
      <PieChart :chartData="timeChartData" title="Launches by day time" position="top" />
      <RadarChart :chartData="continentsChartData" title="Launches by continents" />
    </div>
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
import HorizontalBarChart from '../components/charts/HorizontalBarChart'
import PieChart from '../components/charts/PieChart'
import LineChart from '../components/charts/LineChart'
import RadarChart from '../components/charts/RadarChart'
import LaunchChip from '../components/LaunchChip'
import Chip from '../components/Chip'

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

    launchesByAgencyType () {
      const launchesByAgencyType = {}

      for (const launch of this.launches) {
        if (this.agencies[launch.lsp] && this.agencies[launch.lsp].type) {
          launchesByAgencyType[this.agencies[launch.lsp].type] =
            (launchesByAgencyType[this.agencies[launch.lsp].type] || 0) + 1
        }
      }

      return launchesByAgencyType
    },

    years () {
      const years = []
      for (let i = MINIMUM_YEAR; i < MAXIMUM_YEAR; i++) {
        years.push(i)
      }

      return years
    },

    totalLaunches () {
      return this.launches ? this.launches.length : 0
    },

    companiesChartData () {
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

    monthsChartData () {
      const color = getContrastColor(this.bgColor)

      return {
        labels: config.months,
        datasets: [
          {
            label: 'Launches',
            data: config.months.map((month, index) => (
              this.launches.filter(item => new Date(item.net).getMonth() === index).length
            )),
            borderColor: color,
            fill: true,
            fillOpacity: 0.5,
            backgroundColor: getAlphaColor(color),
            pointBorderWidth: 5
          }
        ]
      }
    },

    continentsChartData () {
      const color = getContrastColor(this.bgColor)

      return {
        labels: config.continents,
        datasets: [
          {
            label: 'Launches',
            fill: true,
            backgroundColor: getAlphaColor(color),
            borderColor: color,
            data: config.continents.map(continent => {
              return this.launches.filter(item => {
                return this.agencies[item.launch_service_provider] &&
                  this.agencies[item.launch_service_provider].continent === continent
              }).length
            }),
            pointRadius: 5,
            pointBackgroundColor: color
          }
        ]
      }
    },

    countriesChartData () {
      const launchesCount = this.getLaunchesCountBy('country')

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

    daysChartData () {
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

    timeChartData () {
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
        if (this.agencies[launch.launch_service_provider.id] && this.agencies[launch.launch_service_provider.id][arg]) {
          if (!uniqueData[this.agencies[launch.launch_service_provider.id][arg]]) {
            uniqueData[this.agencies[launch.launch_service_provider.id][arg]] = 0
          }

          ++uniqueData[this.agencies[launch.launch_service_provider.id][arg]]
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
    RadarChart,
    LaunchChip,
    Chip
  }
}
</script>
