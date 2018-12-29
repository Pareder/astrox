<template>
  <div class="px-3">
    <div class="mb-5">
      <img class="pa-2 ma-1" src="../../static/astrox.png" alt="AstroX" title="AstroX">
      <!--<h1 dark class="display-1 pa-2 ma-1">AstroX</h1>-->
      <p class="headline">We provide you the information about all rocket launches</p>
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
    <div v-if="launches">
      <v-chip v-if="new Date(datepicker) < new Date() && datepicker">
        <v-avatar class="red lighten-1">
          <v-icon>close</v-icon>
        </v-avatar>
        <strong>{{ failedLaunches }}</strong> &nbsp;failed {{ failedLaunches === 1 ? 'launch' : 'launches' }}
      </v-chip>
      <v-chip v-if="new Date(datepicker) < new Date() && datepicker">
        <v-avatar class="light-green accent-4">
          <v-icon>done</v-icon>
        </v-avatar>
        <strong>{{ successfulLaunches }}</strong> &nbsp;successful {{ successfulLaunches === 1 ? 'launch' : 'launches' }}
      </v-chip>
      <v-chip v-if="new Date(datepicker) > new Date() || !datepicker">
        <v-avatar class="yellow">
          <v-icon>timeline</v-icon>
        </v-avatar>
        <strong>{{ pendingLaunches }}</strong> &nbsp;pending {{ pendingLaunches === 1 ? 'launch' : 'launches' }}
      </v-chip>
    </div>
    <h3 v-if="error">
      <v-chip>
        <v-avatar class="red">
          <v-icon>close</v-icon>
        </v-avatar>
        No launches in selected period
      </v-chip>
    </h3>
    <LaunchLayout v-if="launches" :launches="launches" :past="past" />
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
      error: false,
      past: false
    }
  },
  computed: {
    failedLaunches () {
      return this.launches.filter(item => item.status === 4 || item.failreason).length
    },
    successfulLaunches () {
      return this.launches.filter(item => item.status === 3).length
    },
    pendingLaunches () {
      return this.launches.filter(item => item.status === 1 || item.status === 2).length
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
      if (formattedDate < finalYear) {
        this.past = true
      } else {
        this.past = false
      }
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
