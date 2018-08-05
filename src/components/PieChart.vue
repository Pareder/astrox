<script>
import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        /* onResize: () => {
          const width = document.body.getBoundingClientRect().width
          if (width < 1000 && this.options.legend.display) {
            this.options.legend.display = false
            this.$data._chart.destroy()
            this.renderChart(this.chartData, this.options)
          } else if (width > 1000 && !this.options.legend.display) {
            this.options.legend.display = true
            this.$data._chart.destroy()
            this.renderChart(this.chartData, this.options)
          }
        }, */
        title: {
          display: true,
          text: 'Launches by companies',
          fontSize: 16
        },
        legend: {
          display: true,
          position: 'left',
          labels: {
            fontSize: 16
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data
              const tooltipData = allData[tooltipItem.index]
              const tooltipPercentage = Math.round((tooltipData / allData.reduce((sum, next) => sum + next)) * 100)
              return `${data.labels[tooltipItem.index]} (${tooltipPercentage}%)`
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
        this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.renderChart(this.chartData, this.options)
      }
    )
    this.options.title.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.renderChart(this.chartData, this.options)
  },
  destroyed () {
    this.unwatch()
  }
}
</script>
