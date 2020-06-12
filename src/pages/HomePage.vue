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
      <LaunchChip v-if="failedLaunches" :count="failedLaunches" status="fail"/>
      <LaunchChip v-if="successfulLaunches" :count="successfulLaunches" status="success"/>
      <LaunchChip v-if="pendingLaunches" :count="pendingLaunches" status="pending"/>
      <LaunchLayout :launches="launches" :past="past" />
    </div>
    <Chip v-if="error" className="red" icon="close">
      <b>No launches in selected period</b>
    </Chip>
  </div>
</template>

<script>
import { zeroTime, getPendingLaunchesCount, getSuccessfulLaunchesCount, getFailedLaunchesCount } from '../utils'
import LaunchLayout from '../components/LaunchLayout'
import LaunchChip from '../components/LaunchChip'
import Chip from '../components/Chip'

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

      this.past = startDate < endDate;

      this.$Progress.start()
      this.API.getLaunchesByDate(startDate, endDate)
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
    LaunchLayout,
    LaunchChip,
    Chip
  }
}
</script>
