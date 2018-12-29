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
              const tooltipPercentage = parseFloat((tooltipData / data.datasets[1].data[tooltipItem.index] * 100).toFixed(1))
              return `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipData} (${tooltipPercentage}%)`
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
        this.colorTheme = this.$store.getters.getColorTheme
        return this.$store.getters.getColorTheme
      },
      (val) => {
        this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
        this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
        this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
        this.renderChart(this.datacollection, this.options)
      }
    )
    this.options.legend.labels.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.xAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.yAxes[0].ticks.fontColor = this.colorTheme === 'dark' ? '#ddd' : '#666'
    this.options.scales.xAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    this.options.scales.yAxes[0].gridLines.color = this.colorTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    this.renderChart(this.datacollection, this.options)
  },
  destroyed () {
    this.unwatch()
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
