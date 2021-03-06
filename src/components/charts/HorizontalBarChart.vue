<script>
import { HorizontalBar, mixins } from 'vue-chartjs'
import { LIGHT_FONT_COLOR, DARK_FONT_COLOR, LIGHT_GRID_LINES_COLOR, DARK_GRID_LINES_COLOR } from '../../config'

const { reactiveProp } = mixins

export default {
  extends: HorizontalBar,

  mixins: [reactiveProp],

  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        title: {
          display: true,
          text: this.title,
          fontSize: 16
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data
              const tooltipData = allData[tooltipItem.index]
              const tooltipPercentage = (tooltipData / allData.reduce((sum, next) => sum + next) * 100).toFixed(1)

              return `Launches: ${tooltipData} (${tooltipPercentage}%)`
            }
          }
        },
        scales: {
          yAxes: [
            {
              gridLines: {},
              ticks: {
                fontSize: 14
              }
            }
          ],
          xAxes: [
            {
              gridLines: {},
              ticks: {
                beginAtZero: true,
                callback: (value) => Number.isInteger(value) ? value : void (0)
              }
            }
          ]
        }
      },
      unwatch: null
    }
  },

  props: {
    chartData: {
      type: Object
    },
    title: {
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
        this.renderChart(this.chartData, this.options)
      }
    )

    this.setOptionsColor()
    this.renderChart(this.chartData, this.options)
  },

  destroyed () {
    this.unwatch()
  },

  methods: {
    setOptionsColor () {
      this.options.title.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
      this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
      this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
      this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ?
        LIGHT_GRID_LINES_COLOR :
        DARK_GRID_LINES_COLOR
      this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ?
        LIGHT_GRID_LINES_COLOR :
        DARK_GRID_LINES_COLOR
    },
  }
}
</script>
