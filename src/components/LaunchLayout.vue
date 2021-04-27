<template>
  <v-layout wrap align-center>
    <LaunchCard
      v-for="(launch, index) in visibleLaunches"
      :key="launch.id"
      :launch="launch"
      :start="start"
      @click="openDetailsDialog(index)"
    />
    <DetailsModal
      :dialog="Boolean(launchClicked)"
      :launch="launchClicked"
      @closeDialog="closeDetailsDialog"
    />
  </v-layout>
</template>

<script>
import LaunchCard from './LaunchCard'
import DetailsModal from './modals/DetailsModal'

export default {
  data () {
    return {
      detailsDialog: false,
      launchClicked: null,
      visibleLaunches: [],
      numberOfLaunches: 10,
      currentNumber: 0,
      ticking: false
    }
  },

  props: {
    launches: {
      type: Array
    },
  },

  computed: {
    start () {
      return this.$route.name === 'Home'
    }
  },

  created () {
    if (this.launches) {
      this.setVisibleLaunches()

      window.onscroll = () => {
        // Optimization for the scroll event
        if (!this.ticking) {
          window.requestAnimationFrame(() => {
            const bottomOfWindow = (document.documentElement.scrollTop + window.innerHeight) === document.documentElement.offsetHeight
            if (bottomOfWindow) {
              this.setVisibleLaunches()
            }

            this.ticking = false
          })

          this.ticking = true
        }
      }
    }
  },

  destroyed () {
    window.onscroll = undefined
  },

  watch: {
    launches (newVal) {
      this.currentNumber = 0
      this.visibleLaunches = newVal.slice(this.currentNumber, this.currentNumber + this.numberOfLaunches)
      this.currentNumber += this.numberOfLaunches
    }
  },

  methods: {
    setVisibleLaunches () {
      this.visibleLaunches.push(...this.launches.slice(this.currentNumber, this.currentNumber + this.numberOfLaunches))
      this.currentNumber += this.numberOfLaunches
    },

    openDetailsDialog (id) {
      this.launchClicked = this.launches[id]
    },

    closeDetailsDialog () {
      this.launchClicked = null
    }
  },

  components: {
    LaunchCard,
    DetailsModal
  }
}
</script>
