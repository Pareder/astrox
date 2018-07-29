<template>
  <div>
    <Chart v-if="launchesByYears" style="min-height: 75vh" :openDialog="openDialog" :launches="launchesByYears" :agencyAbbrev="agencyAbbrev" />
    <LaunchModal :closeDialog="closeDialog" :dialog="dialog" :launches="launchesByYearClicked" :year="year" :agencyName="agencyName" :past="true" />
  </div>
</template>
<script>
import Chart from './Chart'
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
  created () {
    this.getLaunchesByYears()
  },
  methods: {
    getLaunchesByYears () {
      this.$Progress.start()
      const getAgencyLaunches = new Promise((resolve, reject) => {
        if (this.$store.getters.agencyPastLaunches(this.agencyId)) {
          this.launches = [...this.$store.getters.agencyPastLaunches(this.agencyId)]
          resolve()
        } else {
          this.$store.dispatch('getAgencyPastLaunches', this.agencyId)
            .then(() => {
              this.launches = [...this.$store.getters.agencyPastLaunches(this.agencyId)]
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
            this.launchesByYears[item.year] = { agency: this.calcCountByYear(item.year), total: item.amount }
          })
          this.$Progress.finish()
        })
        .catch(error => {
          console.log(error)
          this.$Progress.fail()
        })
    },
    calcCountByYear (year) {
      return this.launches.length > 0 ? this.launches.filter(item => {
        return new Date(item.net).getFullYear() === year && new Date(item.net).getTime() < Date.now()
      }).length : 0
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
