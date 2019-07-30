<template>
  <v-dialog v-model="localDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
    <v-card tile>
      <v-toolbar dark :color="colorTheme === 'light' ? 'primary' : ''">
        <v-btn icon dark @click.native="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Comparing</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="localDialog && years">
        <ComparingChart :chartData="getChartData" />
        <v-flex xs12 class="mt-3">
          <v-data-table :headers="launchHeaders" :items="launchStats" hide-actions class="elevation-1">
            <template slot="headers" slot-scope="props">
              <th :width="'20%'"></th>
              <th v-for="(header, id) in props.headers" :key="id" :style="`color: ${colors[id]}`" class="subheading">
                {{ header.text }}
              </th>
            </template>
            <template slot="items" slot-scope="props">
              <td v-for="(agency, id) in props.item" :key="id" :class="agency">
                {{ agency | capitalize }}
              </td>
            </template>
          </v-data-table>
        </v-flex>
        <v-layout wrap justify-space-around class="mt-3">
          <v-flex xs12 sm6 md4 v-for="(name, id) in agencyNameWithLaunches" :key="id" >
            <PieChart :chartData="getPieChartData(id)" :title="name" :noLegend="true" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getSuccessfulLaunchesCount, getPendingLaunchesCount, getFailedLaunchesCount } from '../../utils'
import ComparingChart from '../charts/ComparingChart'
import PieChart from '../charts/PieChart'

const CYAN_COLOR = '#00BCD4'
const GREEN_COLOR = '#41B883'
const RED_COLOR = '#FF5722'
const PURPLE_COLOR = '#BA68C8'
const YELLOW_COLOR = '#FBC02D'

export default {
  data () {
    return {
      colors: [CYAN_COLOR, GREEN_COLOR, RED_COLOR, PURPLE_COLOR, YELLOW_COLOR],
      years: null
    }
  },

  props: {
    dialog: {
      type: Boolean
    },
    closeDialog: {
      type: Function
    },
    comparingAgenciesLaunches: {
      type: Array
    },
    names: {
      type: Array
    }
  },

  computed: {
    ...mapState([
      'colorTheme'
    ]),

    localDialog: {
      get () {
        return this.dialog
      },
      set () {
        this.closeDialog()
      }
    },

    getChartData () {
      return {
        labels: this.years,
        datasets: this.names.map((item, id) => {
          return {
            label: item,
            backgroundColor: this.colors[id],
            borderWidth: 0,
            data: this.getYearData(id)
          }
        })
      }
    },

    launchHeaders () {
      return [
        ...this.names.map(item => ({
          text: item,
          sortable: false,
          width: `${80 / this.names.length}%`,
          align: 'center'
        }))
      ]
    },

    launchStats () {
      const total = {
        name: 'total'
      }
      const successful = {
        name: 'successful'
      }
      const failed = {
        name: 'failed'
      }
      const pending = {
        name: 'pending'
      }
      this.comparingAgenciesLaunches.map((item, id) => {
        const successfulLaunches = this.getSuccessfulLaunches(id)
        const failedLaunches = this.getFailedLaunches(id)
        const pendingLaunches = this.getPendingLaunches(id)

        total[`agency${id}`] = item.length
        successful[`agency${id}`] = item.length ?
          `${successfulLaunches} (${(successfulLaunches / total[`agency${id}`] * 100).toFixed(1)}%)` :
          0
        failed[`agency${id}`] = item.length ?
          `${failedLaunches} (${(failedLaunches / total[`agency${id}`] * 100).toFixed(1)}%)` :
          0
        pending[`agency${id}`] = item.length ?
          `${pendingLaunches} (${(pendingLaunches / total[`agency${id}`] * 100).toFixed(1)}%)` :
          0
      })

      return [
        total,
        successful,
        failed,
        pending
      ]
    },

    agencyNameWithLaunches () {
      return this.names.filter((name, id) => this.comparingAgenciesLaunches[id].length)
    }
  },

  filters: {
    capitalize (value) {
      if (typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1)
      }

      return value
    }
  },

  watch: {
    dialog (newVal) {
      if (newVal) {
        this.calculateYears()
      }
    }
  },

  methods: {
    calculateYears () {
      const yearsSet = [...new Set(this.comparingAgenciesLaunches.flat().map(item => new Date(item.net).getFullYear()))]
      this.years = yearsSet.sort((yearOne, yearTwo) => yearOne - yearTwo)
    },

    getYearData (id) {
      const launchesByYear = this.years.reduce((obj, year) => {
        obj[year] = 0

        return obj
      }, {})

      for (const launch of this.comparingAgenciesLaunches[id]) {
        const year = new Date(launch.net).getFullYear()

        if (launchesByYear.hasOwnProperty(year)) {
          ++launchesByYear[year]
        }
      }

      return Object.values(launchesByYear)
    },

    getPieChartData (id) {
      return {
        labels: ['Successful', 'Failed', 'Pending'],
        datasets: [
          {
            backgroundColor: ['#64DD17', '#EF5350', '#FFEB3B'],
            borderWidth: 0,
            data: [this.getSuccessfulLaunches(id), this.getFailedLaunches(id), this.getPendingLaunches(id)]
          }
        ]
      }
    },

    getSuccessfulLaunches (id) {
      return getSuccessfulLaunchesCount(this.comparingAgenciesLaunches[id])
    },

    getFailedLaunches (id) {
      return getFailedLaunchesCount(this.comparingAgenciesLaunches[id])
    },

    getPendingLaunches (id) {
      return getPendingLaunchesCount(this.comparingAgenciesLaunches[id])
    }
  },

  components: {
    ComparingChart,
    PieChart
  }
}
</script>

<style scoped>
  .text--blue {
    color: #00C3E6;
  }
  .text--green {
    color: #41B883;
  }
  .successful {
    color: #64DD17;
  }
  .failed {
    color: #EF5350;
  }
  .pending {
    color: #FFC107;
  }
</style>
