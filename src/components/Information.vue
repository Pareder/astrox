<template>
  <div>
    <h1 dark class="display-2 pa-4 ma-3">AstroX</h1>
    <p class="headline pa-4">Select date to see all rocket launches between selected date and today.</p>
    <v-flex xs12 sm4 md2 offset-sm4 offset-md5>
      <v-dialog ref="dialog" v-model="dateModal" persistent lazy full-width width="290px">
        <v-text-field slot="activator" v-model="datepicker" label="Pick date to see" prepend-icon="event"></v-text-field>
        <v-date-picker v-model="datepicker" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dateModal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="changeDate">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>
    <h3 v-if="error">
      <v-chip>
        <v-avatar class="red">X</v-avatar>
        No launches in selected period
      </v-chip>
    </h3>
    <v-dialog v-model="progressDialog" hide-overlay persistent width="300">
      <v-card color="indigo" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
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
  methods: {
    changeDate (e) {
      this.error = false
      this.dateModal = false
      this.progressDialog = true
      const date = new Date(this.datepicker)
      const formattedDate = `${date.getFullYear()}-${date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
      const finalYear = `${new Date().getFullYear()}-${new Date().getMonth() > 8 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()}`
      this.$http.get(`https://launchlibrary.net/1.4/launch/${formattedDate}/${finalYear}?limit=-1`)
        .then(response => {
          this.launches = response.body.launches
          this.progressDialog = false
        }, response => {
          this.progressDialog = false
          this.error = true
          this.launches = null
          console.log(response)
        })
    }
  },
  components: {
    LaunchLayout
  }
}
</script>
