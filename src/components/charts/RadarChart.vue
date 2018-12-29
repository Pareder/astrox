<script>
import { Radar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Radar,
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
          text: 'Launches by continents',
          fontSize: 16
        },
        scale: {
          pointLabels: {
            fontSize: 14
          },
          gridLines: {},
          ticks: {}
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
        this.options.scale.pointLabels.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.options.scale.gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
        this.options.scale.ticks.backdropColor = this.colorTheme === 'dark' ? '#303030' : '#FAFAFA'
        this.options.scale.ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.renderChart(this.chartData, this.options)
      }
    )
    this.options.title.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scale.pointLabels.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scale.gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    this.options.scale.ticks.backdropColor = this.colorTheme === 'dark' ? '#303030' : '#FAFAFA'
    this.options.scale.ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.renderChart(this.chartData, this.options)
  },
  destroyed () {
    this.unwatch()
  }
}
</script>
