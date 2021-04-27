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
      :dialog="dialog"
      :launches="launchesByYearClicked"
      :year="year"
      :agencyName="agencyName"
      :isSpaceX="isSpaceX"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
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
    ]),

    ...mapState([
      'agenciesLaunches',
      'history'
    ]),

    isSpaceX () {
      return this.agencyId === config.SPACEX_ID
    }
  },

  created () {
    this.getLaunchesByYears()
  },

  methods: {
    getLaunchesByYears () {
      const getAgencyLaunches = () => new Promise(resolve => {
        if (this.agenciesLaunches[this.agencyId]) {
          resolve(this.agencyPastLaunches(this.agencyId))
        } else {
          this.$store.dispatch('getAgencyAllLaunches', this.agencyId)
            .then(() => {
              resolve(this.agencyPastLaunches(this.agencyId))
            })
            .catch(() => {
              resolve([])
            })
        }
      })
      const getSpaceXLaunches = () => new Promise(resolve => {
        if (this.agenciesLaunches[config.SPACEX_ID]?.official) {
          this.launches = this.agenciesLaunches[config.SPACEX_ID].official
          resolve()
        } else {
          this.$store.dispatch('getSpaceXLaunches')
            .then(() => {
              resolve(this.agenciesLaunches[config.SPACEX_ID].official)
            })
            .catch(() => {
              resolve([])
            })
        }
      })
      const getHistory = new Promise((resolve, reject) => {
        if (this.history) {
          resolve(this.history)
        } else {
          this.$store.dispatch('getHistory')
            .then(() => {
              resolve(this.history)
            })
            .catch(error => {
              reject(error.msg)
            })
        }
      })

      this.$Progress.start()
      Promise.all([this.isSpaceX ? getSpaceXLaunches() : getAgencyLaunches(), getHistory])
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

      for (const launch of this.launches) {
        const year = new Date(launch.net || launch.launch_date_utc).getFullYear()
        if (this.launchesByYears[year] && new Date(launch.net || launch.launch_date_utc).getTime() < Date.now()) {
          this.launchesByYears[year].agency++
        }
      }
    },

    openDialog (year) {
      this.launchesByYearClicked = this.launches.filter(launch => {
        const date = new Date(launch.net || launch.launch_date_utc)
        return date.getFullYear() === year && date.getTime() < Date.now()
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
