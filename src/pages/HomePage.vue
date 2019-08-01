<template>
  <div class="px-3">
    <div class="mb-5">
      <img class="pa-2 ma-1" src="/astrox.png" alt="AstroX" title="AstroX">
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
      <div v-if="datepicker && new Date(datepicker) < new Date()">
        <v-chip>
          <v-avatar class="red lighten-1">
            <v-icon>close</v-icon>
          </v-avatar>
          <strong>{{ failedLaunches }}</strong> &nbsp;failed {{ failedLaunches === 1 ? 'launch' : 'launches' }}
        </v-chip>
        <v-chip>
          <v-avatar class="light-green accent-4">
            <v-icon>done</v-icon>
          </v-avatar>
          <strong>{{ successfulLaunches }}</strong> &nbsp;successful {{ successfulLaunches === 1 ? 'launch' : 'launches' }}
        </v-chip>
      </div>
      <v-chip v-if="!datepicker || new Date(datepicker) > new Date()">
        <v-avatar class="yellow">
          <v-icon>timeline</v-icon>
        </v-avatar>
        <strong>{{ pendingLaunches }}</strong> &nbsp;pending {{ pendingLaunches === 1 ? 'launch' : 'launches' }}
      </v-chip>
      <LaunchLayout :launches="launches" :past="past" />
    </div>
    <h3 v-if="error">
      <v-chip>
        <v-avatar class="red">
          <v-icon>close</v-icon>
        </v-avatar>
        No launches in selected period
      </v-chip>
    </h3>
  </div>
</template>

<script>
import API from '../api'
import { zeroTime, getPendingLaunchesCount, getSuccessfulLaunchesCount, getFailedLaunchesCount } from '../utils'
import LaunchLayout from '../components/LaunchLayout'

export default {
  data () {
    return {
      launches: null,
      datepicker: null,
      dateModal: false,
      error: false,
      past: false
    }
  },

  computed: {
    failedLaunches () {
      return getFailedLaunchesCount(this.launches)
    },

    successfulLaunches () {
      return getSuccessfulLaunchesCount(this.launches)
    },

    pendingLaunches () {
      return getPendingLaunchesCount(this.launches)
    }
  },

  created () {
    this._api = API.create()
    this.launches = this.$store.state.presentYearLaunches

    if (!this.launches) {
      this.$Progress.start()
      this.$store.dispatch('getPresentYearLaunches')
        .then(() => {
          this.launches = this.$store.state.presentYearLaunches
          this.$Progress.finish()
        })
        .catch(() => {
          this.error = true
          this.$Progress.fail()
        })
    }
  },

  methods: {
    changeDate (e) {
      this.error = false
      this.dateModal = false
      const date = isNaN(e) ? new Date(this.datepicker) : e
      const startDate = `${date.getFullYear()}-${zeroTime(date.getMonth() + 1)}-${zeroTime(date.getDate())}`
      const endDate = `${new Date().getFullYear()}-${zeroTime(new Date().getMonth() + 1)}-${zeroTime(new Date().getDate())}`

      if (startDate < endDate) {
        this.past = true
      } else {
        this.past = false
      }

      this.$Progress.start()
      this._api.getLaunchesByDate({ startDate, endDate })
        .then(launches => {
          this.launches = launches
          this.$Progress.finish()
        })
        .catch(() => {
          this.error = true
          this.launches = null
          this.$Progress.fail()
        })
    }
  },

  components: {
    LaunchLayout
  }
}
</script>
