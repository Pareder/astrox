<script>
import { Bar, mixins } from 'vue-chartjs'
import { mapGetters } from 'vuex'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  data () {
    return {
      options: {
        tooltips: {
          intersect: false,
          mode: 'index',
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
              ticks: {
                fontSize: 14
              },
              gridLines: {}
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontSize: 14,
                callback: (value) => Number.isInteger(value) ? value : void (0)
              },
              gridLines: {}
            }
          ]
        }
      }
    }
  },
  props: {
    chartData: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      colorTheme: 'getColorTheme'
    })
  },
  mounted () {
    this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    this.renderChart(this.chartData, this.options)
  }
}
</script>
