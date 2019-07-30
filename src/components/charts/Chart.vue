<script>
import { Bar } from 'vue-chartjs'
import { LIGHT_FONT_COLOR, DARK_FONT_COLOR, LIGHT_GRID_LINES_COLOR, DARK_GRID_LINES_COLOR } from '../../config'

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
            borderWidth: 0,
            borderColor: '#00869e',
            stack: 'Stack',
            data: Object.values(this.launches).map(item => item.agency)
          },
          {
            label: 'Total',
            backgroundColor: '#41B883',
            borderWidth: 0,
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
          bodyFontSize: 14,
          callbacks: {
            label: (tooltipItem, data) => {
              const tooltipData = tooltipItem.yLabel
              const percentage = parseFloat((tooltipData / data.datasets[1].data[tooltipItem.index] * 100).toFixed(1))

              return `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipData} (${percentage}%)`
            }
          }
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
              },
              gridLines: {}
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontSize: 14,
                callback: (value) => Number.isInteger(value) ? value : void (0)
              },
              gridLines: {}
            }
          ]
        },
        onClick: this.chartClicked
      },
      years: null,
      yearClicked: null,
      unwatch: null
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
    this.unwatch = this.$store.watch(
      () => {
        this.colorTheme = this.$store.state.colorTheme

        return this.colorTheme
      },
      () => {
        this.setOptionsColor()
        this.renderChart(this.datacollection, this.options)
      }
    )

    this.setOptionsColor()
    this.renderChart(this.datacollection, this.options)
  },

  destroyed () {
    this.unwatch()
  },

  methods: {
    setOptionsColor () {
      this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
      this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
      this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
      this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ?
        LIGHT_GRID_LINES_COLOR :
        DARK_GRID_LINES_COLOR
      this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ?
        LIGHT_GRID_LINES_COLOR :
        DARK_GRID_LINES_COLOR
    },

    chartClicked (evt, item) {
      if (item[0]) {
        this.yearClicked = +item[0]['_model'].label
        this.openDialog(this.yearClicked)
      }
    }
  }
}
</script>
