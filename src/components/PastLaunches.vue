<template>
  <div>
    <Chart
      v-if="launchesByYears"
      class="chart"
      :openDialog="openDialog"
      :launches="launchesByYears"
      :agencyAbbrev="agencyAbbrev"
    />
    <LaunchModal
      :closeDialog="closeDialog"
      :dialog="dialog"
      :launches="launchesByYearClicked"
      :year="year"
      :agencyName="agencyName"
      :past="true"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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

  props: {
    agencyId: {
      type: Number
    },
    agencyAbbrev: {
      type: String
    },
    agencyName: {
      type: String
    }
  },

  computed: {
    ...mapGetters([
      'agencyPastLaunches'
    ])
  },

  created () {
    this.getLaunchesByYears()
  },

  methods: {
    getLaunchesByYears () {
      const getAgencyLaunches = new Promise(resolve => {
        if (this.$store.state.agenciesLaunches[this.agencyId]) {
          resolve(this.agencyPastLaunches(this.agencyId))
        } else {
          this.$store.dispatch('getAgencyAllLaunches', this.agencyId)
            .then(() => {
              resolve(this.agencyPastLaunches(this.agencyId))
            })
            .catch(() => {
              resolve(null)
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
              reject(error.msg)
            })
        }
      })

      this.$Progress.start()
      Promise.all([getAgencyLaunches, getHistory])
        .then(([agencyLaunches, history]) => {
          this.launches = agencyLaunches
          this.setLaunchesByYear(history)
          this.$Progress.finish()
        })
        .catch(() => {
          this.$Progress.fail()
        })
    },

    setLaunchesByYear (history) {
      this.launchesByYears = history.reduce((obj, byYear) => {
        obj[byYear.year] = {
          agency: 0,
          total: byYear.amount
        }

        return obj
      }, {})

      if (this.launches.length) {
        for (const launch of this.launches) {
          const year = new Date(launch.net).getFullYear()

          if (this.launchesByYears[year] && new Date(launch.net).getTime() < Date.now()) {
            ++this.launchesByYears[year].agency
          }
        }
      }
    },

    openDialog (year) {
      this.launchesByYearClicked = this.launches.filter(item => {
        if (new Date(item.net).getFullYear() === year && new Date(item.net).getTime() < Date.now()) {
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
    min-height: 75vh;
  }
</style>
