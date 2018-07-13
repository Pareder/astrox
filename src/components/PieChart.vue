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
        legend: {
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
              return `${data.labels[tooltipItem.index]}: ${tooltipData} (${tooltipPercentage}%)`
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
    this.renderChart(this.chartData, this.options)
  }
}
</script>
