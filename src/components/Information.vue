<template>
  <div>
    <div class="mb-5">
      <h1 dark class="display-2 pa-4 ma-3">AstroX</h1>
      <p class="headline">Now you see all launches from now till the end of this year, change it to see the desired period</p>
      <p class="subheading grey--text">Select date to see all rocket launches between selected date and today</p>
    </div>
    <v-flex xs12 sm4 md2 offset-sm4 offset-md5>
      <v-dialog ref="dialog" v-model="dateModal" persistent lazy full-width width="290px">
        <v-text-field slot="activator" v-model="datepicker" label="Pick date" prepend-icon="event"></v-text-field>
        <v-date-picker v-model="datepicker" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dateModal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="changeDate">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>
    <h3 v-if="error">
      <v-chip>
        <v-avatar class="red">
          <v-icon>close</v-icon>
        </v-avatar>
        No launches in selected period
      </v-chip>
    </h3>
    <LaunchLayout v-if="launches" :launches="launches" />
  </div>
</template>
<script>
import LaunchLayout from './LaunchLayout'

export default {
  data () {
    return {
      launches: null,
      datepicker: null,
      progressDialog: false,
      dateModal: false,
      error: false
    }
  },
  created () {
    this.$Progress.start()
    if (this.$store.state.presentYearLaunches) {
      this.launches = this.$store.state.presentYearLaunches
      this.$Progress.finish()
    } else {
      this.$store.dispatch('getPresentYearLaunches')
        .then(() => {
          this.launches = this.$store.state.presentYearLaunches
          this.$Progress.finish()
        })
        .catch(error => {
          console.log(error)
          this.$Progress.fail()
        })
    }
  },
  methods: {
    changeDate (e) {
      this.$Progress.start()
      this.error = false
      this.dateModal = false
      this.progressDialog = true
      const date = isNaN(e) ? new Date(this.datepicker) : e
      const formattedDate = `${date.getFullYear()}-${date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
      const finalYear = `${new Date().getFullYear()}-${new Date().getMonth() > 8 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()}`
      this.$http.get(`https://launchlibrary.net/1.4/launch/${formattedDate}/${finalYear}?limit=-1`)
        .then(response => {
          this.launches = response.body.launches
          this.$Progress.finish()
        }, response => {
          this.error = true
          this.launches = null
          console.log(response)
          this.$Progress.fail()
        })
    }
  },
  components: {
    LaunchLayout
  }
}
</script>
