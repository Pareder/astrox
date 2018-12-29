<template>
  <v-dialog v-model="localDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
    <v-card tile>
      <v-toolbar dark :color="colorTheme === 'light' ? 'primary' : ''">
        <v-btn icon dark @click.native="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Comparing</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="localDialog && years">
        <ComparingChart :chartData="getChartData" />
        <v-flex xs12 class="mt-3">
          <v-data-table :headers="launchHeaders" :items="launchStats" hide-actions class="elevation-1">
            <template slot="headers" slot-scope="props">
              <th :width="'20%'"></th>
              <th v-for="(header, id) in props.headers" :key="id" :style="`color: ${colors[id]}`" class="subheading">{{ header.text }}</th>
            </template>
            <template slot="items" slot-scope="props">
              <td v-for="(agency, id) in props.item" :key="id" :class="agency">
                {{ agency | capitalize }}
              </td>
            </template>
          </v-data-table>
        </v-flex>
        <v-layout wrap justify-space-around class="mt-3">
          <v-flex xs12 sm6 md4 v-for="(name, id) in names" :key="id" v-if="comparingAgenciesLaunches[id].length > 0">
            <PieChart :chartData="getPieChartData(id)" :title="name" :noLegend="true" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import ComparingChart from '../charts/ComparingChart'
import PieChart from '../charts/PieChart'

export default {
  data () {
    return {
      colors: ['#00BCD4', '#41B883', '#FF5722', '#BA68C8', '#FBC02D'],
      years: null
    }
  },
  props: {
    dialog: {
      type: Boolean
    },
    closeDialog: {
      type: Function
    },
    comparingAgenciesLaunches: {
      type: Array
    },
    names: {
      type: Array
    }
  },
  computed: {
    localDialog: {
      get () {
        return this.dialog
      },
      set () {
        this.closeDialog()
      }
    },
    ...mapGetters({
      colorTheme: 'getColorTheme'
    }),
    getChartData () {
      return {
        labels: this.years,
        datasets: this.names.map((item, id) => {
          return {
            label: item,
            backgroundColor: this.colors[id],
            borderWidth: 0,
            borderColor: '#00869e',
            data: this.getYearData(id)
          }
        })
      }
    },
    launchHeaders () {
      return [
        ...this.names.map(item => {
          return {
            text: item,
            sortable: false,
            width: `${80 / this.names.length}%`,
            align: 'center'
          }
        })
      ]
    },
    launchStats () {
      const total = {
        name: 'total'
      }
      const successful = {
        name: 'successful'
      }
      const failed = {
        name: 'failed'
      }
      const pending = {
        name: 'pending'
      }
      this.comparingAgenciesLaunches.map((item, id) => {
        total[`agency${id}`] = item.length
        successful[`agency${id}`] = total[`agency${id}`] ? (this.getSuccessfulLaunches(id) + ' (' + (this.getSuccessfulLaunches(id) / total[`agency${id}`] * 100).toFixed(1) + '%)') : 0
        failed[`agency${id}`] = total[`agency${id}`] ? (this.getFailedLaunches(id) + ' (' + (this.getFailedLaunches(id) / total[`agency${id}`] * 100).toFixed(1) + '%)') : 0
        pending[`agency${id}`] = total[`agency${id}`] ? (this.getPendingLaunches(id) + ' (' + (this.getPendingLaunches(id) / total[`agency${id}`] * 100).toFixed(1) + '%)') : 0
      })
      return [
        total,
        successful,
        failed,
        pending
      ]
    }
  },
  filters: {
    capitalize (value) {
      if (typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
      return value
    }
  },
  watch: {
    dialog (newVal) {
      if (newVal) {
        this.calculateYears()
      }
    }
  },
  methods: {
    calculateYears () {
      const yearsSet = [...new Set(this.comparingAgenciesLaunches.flat().map(item => new Date(item.net).getFullYear()))]
      const minYear = Math.min.apply(null, yearsSet)
      const maxYear = Math.max.apply(null, yearsSet)
      const years = []
      for (let i = minYear; i <= maxYear; i++) {
        years.push(i)
      }
      this.years = [...years]
    },
    getYearData (id) {
      return this.years.map(year => this.comparingAgenciesLaunches[id].filter(item => new Date(item.net).getFullYear() === year).length)
    },
    getPieChartData (id) {
      return {
        labels: ['Successful', 'Failed', 'Pending'],
        datasets: [
          {
            backgroundColor: ['#64DD17', '#EF5350', '#FFEB3B'],
            borderWidth: 0,
            data: [this.getSuccessfulLaunches(id), this.getFailedLaunches(id), this.getPendingLaunches(id)]
          }
        ]
      }
    },
    getSuccessfulLaunches (id) {
      return this.comparingAgenciesLaunches[id].filter(item => item.status === 3).length
    },
    getFailedLaunches (id) {
      return this.comparingAgenciesLaunches[id].filter(item => item.status === 4 || item.failreason).length
    },
    getPendingLaunches (id) {
      return this.comparingAgenciesLaunches[id].filter(item => item.status === 1 || item.status === 2).length
    }
  },
  components: {
    ComparingChart,
    PieChart
  }
}
</script>
<style scoped>
.text--blue {
  color: #00C3E6;
}
.text--green {
  color: #41B883;
}
.successful {
  color: #64DD17;
}
.failed {
  color: #EF5350;
}
.pending {
  color: #FFC107;
}
</style>
