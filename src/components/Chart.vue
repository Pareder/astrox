<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data () {
    return {
      launches: null,
      datacollection: {
        labels: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
        datasets: [
          {
            label: 'Launches',
            backgroundColor: '#1976D2',
            data: []
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: 0.2,
        categoryPercentage: 0.2,
        scales: {
          xAxes: [
            {
              barPercentage: 0.5,
              ticks: {
                fontSize: 14
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                max: 20,
                beginAtZero: true,
                fontSize: 14
              }
            }
          ]
        },
        onClick: this.chartClicked
      },
      years: null,
      yearClicked: null
    }
  },
  props: {
    openDialog: {
      type: Function
    }
  },
  created () {
    this.$http.get(`https://api.spacexdata.com/v2/launches`, { responseType: 'json' })
      .then(response => {
        this.launches = [ ...response.body ]
        this.getYears()
      }, response => {
        console.log(response)
      })
  },
  methods: {
    getYears () {
      this.years = this.launches.map(item => new Date(item.launch_date_utc).getFullYear())
      for (let i = 0; i < this.datacollection.labels.length; i++) {
        this.datacollection.datasets[0].data.push(this.calcCountByYear(this.datacollection.labels[i]))
      }
      this.renderChart(this.datacollection, this.options)
    },
    calcCountByYear (year) {
      return this.years.filter(item => item === year).length
    },
    chartClicked (evt, item) {
      if (item[0]) {
        this.yearClicked = item[0]['_model'].label
        const launchesByYear = this.launches.filter(item => {
          if (new Date(item.launch_date_utc).getFullYear() === this.yearClicked) {
            return item
          }
        })
        this.openDialog(launchesByYear, this.yearClicked)
      }
    }
  }
}
</script>
