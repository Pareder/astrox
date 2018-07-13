<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data () {
    return {
      datacollection: {
        labels: Object.keys(this.launches),
        datasets: [
          {
            label: this.agencyAbbrev,
            backgroundColor: '#00C3E6',
            borderWidth: 3,
            borderColor: '#00869e',
            stack: 'Stack',
            data: Object.values(this.launches).map(item => item.agency)
          },
          {
            label: 'Total',
            backgroundColor: '#41B883',
            borderWidth: 3,
            borderColor: '#2e845e',
            stack: 'Stack',
            data: Object.values(this.launches).map(item => item.total)
          }
        ]
      },
      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
          titleFontSize: 14,
          bodyFontSize: 14
        },
        legend: {
          labels: {
            fontSize: 16
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: 0.2,
        categoryPercentage: 0.2,
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                fontSize: 14
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontSize: 14,
                callback: (value) => Number.isInteger(value) ? value : void (0)
              }
            }
          ]
        },
        onClick: this.chartClicked
      },
      years: null,
      yearClicked: null
    }
  },
  props: {
    openDialog: {
      type: Function
    },
    launches: {
      type: Object
    },
    agencyAbbrev: {
      type: String
    }
  },
  mounted () {
    this.renderChart(this.datacollection, this.options)
  },
  methods: {
    chartClicked (evt, item) {
      if (item[0]) {
        this.yearClicked = +item[0]['_model'].label
        this.openDialog(this.yearClicked)
      }
    }
  }
}
</script>
