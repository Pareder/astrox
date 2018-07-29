<template>
  <div>
    <Chart v-if="launchesByYears" style="min-height: 70vh" :openDialog="openDialog" :launches="launchesByYears" :agencyAbbrev="'SpX'" />
    <LaunchModal :closeDialog="closeDialog" :dialog="dialog" :launches="launchesByYearClicked" :year="year" :isSpaceX="true" />
  </div>
</template>
<script>
import Chart from './Chart'
import PieChart from './PieChart'
import LaunchModal from './LaunchModal'

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
      const getAgencyLaunches = new Promise((resolve, reject) => {
        if (this.$store.getters.agencyPastLaunches('spacex')) {
          this.launches = [...this.$store.getters.agencyPastLaunches('spacex')]
          resolve()
        } else {
          this.$store.dispatch('getPastLaunches', 'spacex')
            .then(() => {
              this.launches = [...this.$store.getters.agencyPastLaunches('spacex')]
              resolve()
            })
            .catch(error => {
              resolve()
              console.log(error)
            })
        }
      })
      const getHistory = new Promise((resolve, reject) => {
        if (this.$store.state.history) {
          resolve(this.$store.state.history)
        } else {
          this.$store.dispatch('getHistory')
            .then(() => {
              resolve(this.$store.state.history)
            })
            .catch(error => {
              console.log(error.msg)
            })
        }
      })
      Promise.all([getAgencyLaunches, getHistory])
        .then(values => {
          this.launchesByYears = {}
          values[1].map(item => {
            const countByYears = this.calcCountByYear(item.year)
            this.launchesByYears[item.year] = { agency: countByYears, total: item.amount }
          })
        })
        .catch(error => {
          console.log(error)
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
    PieChart,
    LaunchModal
  }
}
</script>
