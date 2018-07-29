<template>
  <v-container fluid>
    <v-flex xs12 sm6 offset-sm3>
      <v-select outline auto :loading="loading" :items="getYears" label="Select a year to see companies' launches" v-model="chosenYear" @input="makeChart"></v-select>
    </v-flex>
    <div v-if="launchesByAgency && !error">
      <p class="text-xs-left headline">Total: {{ totalLaunches }}</p>
      <PieChart :chartData="getChartData" />
    </div>
    <h3 v-if="error">No information about launches in {{ chosenYear }}</h3>
  </v-container>
</template>
<script>
import PieChart from './PieChart'

export default {
  data () {
    return {
      chosenYear: new Date().getFullYear(),
      launches: null,
      agencies: null,
      launchesByAgency: null,
      loading: false,
      error: false
    }
  },
  computed: {
    getYears () {
      const years = []
      for (let i = 1980; i < new Date().getFullYear() + 12; i++) {
        years.push(i)
      }
      return years
    },
    totalLaunches () {
      return this.launches ? this.launches.length : 0
    },
    getChartData () {
      return {
        labels: Object.keys(this.launchesByAgency),
        datasets: [
          {
            backgroundColor: this.getColors(),
            data: Object.values(this.launchesByAgency)
          }
        ]
      }
    }
  },
  created () {
    this.makeChart()
  },
  methods: {
    makeChart () {
      this.$Progress.start()
      this.error = false
      this.$http.get(`https://launchlibrary.net/1.4/launch?startdate=${this.chosenYear}-01-01&enddate=${this.chosenYear}-12-31&limit=-1`)
        .then(response => {
          this.launches = response.body.launches
          if (this.$store.state.agencies) {
            this.getAgencies()
          } else {
            this.$store.dispatch('getAgenciesInfo')
              .then(() => {
                this.getAgencies()
              })
          }
        }, response => {
          this.launches = null
          this.error = true
          console.log(response.body.msg)
          this.$Progress.fail()
        })
    },
    getAgencies () {
      this.agencies = {}
      this.$store.state.agencies.map(item => {
        this.agencies[item.id] = item.name
      })
      this.getAgencyLaunches()
      this.loading = false
    },
    getAgencyLaunches () {
      const unique = [...new Set(this.launches.map(item => item.lsp))]
      this.launchesByAgency = {}
      let launchesForSort = []
      unique.map(item => {
        launchesForSort.push({ name: this.agencies[item] || 'unknown', amount: this.calcAgencyCount(item) })
      })
      launchesForSort.sort((a, b) => {
        return b.amount - a.amount
      })
      launchesForSort.map(item => {
        this.launchesByAgency[item.name] = item.amount
      })
      this.$Progress.finish()
    },
    calcAgencyCount (lsp) {
      return this.launches.length > 0 ? this.launches.filter(item => {
        return item.lsp === lsp
      }).length : 0
    },
    getColors () {
      const colors = []
      for (let i = 0; i < Object.keys(this.launchesByAgency).length; i++) {
        colors.push(this.randomColor())
      }
      return colors
    },
    randomColor () {
      return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
    }
  },
  components: {
    PieChart
  }
}
</script>
