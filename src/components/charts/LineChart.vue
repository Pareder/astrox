<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: this.title,
          fontSize: 16
        },
        scales: {
          yAxes: [
            {
              gridLines: {},
              ticks: {
                beginAtZero: true,
                callback: (value) => Number.isInteger(value) ? value : void (0)
              }
            }
          ],
          xAxes: [
            {
              gridLines: {},
              ticks: {}
            }
          ]
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
        }
      }
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
        this.colorTheme = this.$store.getters.getColorTheme
        return this.$store.getters.getColorTheme
      },
      (val) => {
        this.options.title.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
        this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
        this.renderChart(this.chartData, this.options)
      }
    )
    this.options.title.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    this.renderChart(this.chartData, this.options)
  },
  destroyed () {
    this.unwatch()
  }
}
</script>
