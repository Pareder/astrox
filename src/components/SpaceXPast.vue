<template>
  <div>
    <Chart
      v-if="launchesByYears"
      class="chart"
      :openDialog="openDialog"
      :launches="launchesByYears"
      agencyAbbrev="SpX"
    />
    <LaunchModal
      @closeDialog="closeDialog"
      :dialog="dialog"
      :launches="launchesByYearClicked"
      :year="year"
      :isSpaceX="true"
    />
  </div>
</template>

<script>
import config from '../config'
import Chart from './charts/Chart'
import LaunchModal from './modals/LaunchModal'

export default {
  data () {
    return {
      launches: [],
      launchesByYears: null,
      year: null,
      dialog: false,
      launchesByYearClicked: null
    }
  },

  created () {
    this.getLaunchesByYears()
  },

  methods: {
    getLaunchesByYears () {
      const getAgencyLaunches = new Promise(resolve => {
        if (this.$store.state.agenciesLaunches[config.SPACEX_ID] &&
          this.$store.state.agenciesLaunches[config.SPACEX_ID].official) {
          this.launches = this.$store.state.agenciesLaunches[config.SPACEX_ID].official
          resolve()
        } else {
          this.$store.dispatch('getSpaceXLaunches')
            .then(() => {
              this.launches = this.$store.state.agenciesLaunches[config.SPACEX_ID].official
              resolve()
            })
            .catch(() => {
              resolve()
            })
        }
      })
      const getHistory = new Promise(resolve => {
        if (this.$store.state.history) {
          resolve(this.$store.state.history)
        } else {
          this.$store.dispatch('getHistory')
            .then(() => {
              resolve(this.$store.state.history)
            })
        }
      })

      this.$Progress.start()
      Promise.all([getAgencyLaunches, getHistory])
        .then(values => {
          this.launchesByYears = {}
          values[1].map(item => {
            const countByYears = this.calcCountByYear(item.year)
            this.launchesByYears[item.year] = { agency: countByYears, total: item.amount }
          })
          this.$Progress.finish()
        })
        .catch(() => {
          this.$Progress.fail()
        })
    },

    calcCountByYear (year) {
      return this.launches.filter(item => new Date(item.launch_date_utc).getFullYear() === year).length
    },

    openDialog (year) {
      this.launchesByYearClicked = this.launches.filter(item => {
        if (new Date(item.launch_date_utc).getFullYear() === year) {
          return item
        }
      })
      this.year = year
      this.dialog = true
    },

    closeDialog () {
      this.dialog = false
    }
  },
  components: {
    Chart,
    LaunchModal
  }
}
</script>

<style scoped>
  .chart {
    min-height: 70vh;
  }
</style>
