<template>
  <div>
    <Chart :openDialog="openDialog" />
    <LaunchModal :dialog="dialog" :closeDialog="closeDialog" :launches="launchesByYear" />
  </div>
</template>
<script>
import Chart from './Chart'
import LaunchModal from './LaunchModal'

export default {
  data () {
    return {
      launchesByYear: null,
      year: null,
      dialog: false
    }
  },
  methods: {
    closeDialog () {
      this.dialog = false
    },
    openDialog (launchesByYear, year) {
      this.launchesByYear = launchesByYear
      this.year = year
      this.dialog = true
    }
  },
  components: {
    Chart,
    LaunchModal
  }
}
</script>
