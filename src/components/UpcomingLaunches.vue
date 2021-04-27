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
      @close="closeDialog"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LaunchModal from './modals/LaunchModal'
import Chart from './charts/Chart'

export default {
  data () {
    return {
      allUpcomingLaunches: null,
      launches: null,
      launchesByYears: null,
      launchesByYearClicked: null,
      year: null,
      dialog: false
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
      'agencyUpcomingLaunches'
    ])
  },

  created () {
    this.getAgencyLaunches()
  },

  methods: {
    getAgencyLaunches () {
      this.$Progress.start()
      if (this.$store.state.agenciesLaunches[this.agencyId]) {
        this.launches = this.agencyUpcomingLaunches(this.agencyId)
        this.getLaunchesByYears()
      } else {
        this.$store.dispatch('getAgencyAllLaunches', this.agencyId)
          .then(() => {
            this.launches = this.agencyUpcomingLaunches(this.agencyId)
            this.getLaunchesByYears()
          })
          .catch(() => {
            this.launches = []
            this.getLaunchesByYears()
          })
      }
    },

    getLaunchesByYears () {
      if (this.$store.state.allUpcomingLaunches) {
        this.allUpcomingLaunches = [...this.$store.state.allUpcomingLaunches]
        this.setLaunchesByYears()
        this.$Progress.finish()
      } else {
        this.$store.dispatch('getAllUpcomingLaunches')
          .then(() => {
            this.allUpcomingLaunches = [...this.$store.state.allUpcomingLaunches]
            this.setLaunchesByYears()
            this.$Progress.finish()
          })
          .catch((e) => {
            console.log(e)
            this.$Progress.fail()
          })
      }
    },

    setLaunchesByYears () {
      this.launchesByYears = this.allUpcomingLaunches.reduce((obj, byYear) => {
        obj[byYear.year] = {
          agency: 0,
          total: byYear.amount
        }

        return obj
      }, {})

      if (this.launches.length) {
        for (const launch of this.launches) {
          const year = new Date(launch.net).getFullYear()

          if (this.launchesByYears[year]) {
            ++this.launchesByYears[year].agency
          }
        }
      }
    },

    openDialog (year) {
      this.launchesByYearClicked = this.launches.filter(item => {
        if (new Date(item.net).getFullYear() === year) {
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
    LaunchModal,
    Chart
  }
}
</script>

<style scoped>
  .chart {
    min-height: 75vh;
  }
</style>
