<template>
  <div>
    <Chart v-if="launchesByYears" style="min-height: 75vh" :openDialog="openDialog" :launches="launchesByYears" :agencyAbbrev="agencyAbbrev" />
    <LaunchModal :closeDialog="closeDialog" :dialog="dialog" :launches="launchesByYearClicked" :year="year" :agencyName="agencyName" />
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
          .catch(error => {
            console.log(error)
            this.launches = []
            this.getLaunchesByYears()
          })
      }
    },
    getLaunchesByYears (lastYear) {
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
          .catch(error => {
            console.log(error)
            this.$Progress.fail()
          })
      }
    },
    setLaunchesByYears () {
      this.launchesByYears = {}
      this.allUpcomingLaunches.map(item => {
        this.launchesByYears[item.year] = { agency: this.calcCountByYear(item.year), total: item.amount }
      })
    },
    calcCountByYear (year) {
      return this.launches.length > 0 ? this.launches.filter(item => {
        return new Date(item.net).getFullYear() === year
      }).length : 0
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
