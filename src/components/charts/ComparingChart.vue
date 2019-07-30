<script>
import { Bar, mixins } from 'vue-chartjs'
import { mapState } from 'vuex'
import { LIGHT_FONT_COLOR, DARK_FONT_COLOR, LIGHT_GRID_LINES_COLOR, DARK_GRID_LINES_COLOR } from '../../config'

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
    ...mapState([
      'colorTheme'
    ])
  },

  mounted () {
    this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
    this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
    this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? LIGHT_FONT_COLOR : DARK_FONT_COLOR
    this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ?
      LIGHT_GRID_LINES_COLOR :
      DARK_GRID_LINES_COLOR
    this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ?
      LIGHT_GRID_LINES_COLOR :
      DARK_GRID_LINES_COLOR
    this.renderChart(this.chartData, this.options)
  }
}
</script>
