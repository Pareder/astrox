<script>
import { Pie, mixins } from 'vue-chartjs'
import { LIGHT_FONT_COLOR, DARK_FONT_COLOR } from '../../config'

const { reactiveProp } = mixins

export default {
  extends: Pie,

  mixins: [reactiveProp],

  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.title,
          fontSize: 16
        },
        legend: {
          display: !this.noLegend,
          position: this.position || 'left',
          labels: {
            fontSize: 16
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data
              const tooltipData = allData[tooltipItem.index]
              const tooltipPercentage = (tooltipData / allData.reduce((sum, next) => sum + next) * 100).toFixed(1)

              return `${data.labels[tooltipItem.index]}: ${tooltipData} (${tooltipPercentage}%)`
            }
          }
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
    },
    noLegend: {
      type: Boolean
    },
    position: {
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
      this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
    }
  }
}
</script>
