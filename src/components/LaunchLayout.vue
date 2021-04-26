<template>
  <v-layout wrap align-center>
    <v-flex xs12 sm6 md4 class="pa-2" v-for="launch in visibleLaunches" :key="launch.id">
      <v-card>
        <v-card-title class="justify-center">
          <h3 class="headline">{{ launch.name }}</h3>
        </v-card-title>
        <v-list>
          <v-list-tile avatar v-if="start">
            <v-avatar>
              <v-icon>business</v-icon>
            </v-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-if="launch.launch_service_provider" class="normal-space">
                <router-link class="no-underline" :to="`/agencies/${launch.launch_service_provider.id}`">
                  {{ launch.launch_service_provider.name }}
                </router-link>,
                {{ launch.launch_service_provider.type }}
              </v-list-tile-title>
              <v-list-tile-title v-else class="normal-space">
                Unknown
              </v-list-tile-title>
              <v-list-tile-sub-title>
                Agency
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-avatar>
              <v-icon>access_time</v-icon>
            </v-avatar>
            <v-list-tile-content class="visible-overflow">
              <v-list-tile-title>{{ new Date(launch.net).toLocaleString() }}</v-list-tile-title>
              <v-list-tile-sub-title>Launch Date</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-tooltip top>
              <v-avatar slot="activator">
                <v-icon v-if="launch.status.id === 3" color="light-green">
                  check
                </v-icon>
                <v-icon v-else-if="launch.status.id === 4" color="red">
                  error_outline
                </v-icon>
                <v-icon v-else color="gray">
                  {{ launch.status.id === 1 ? 'check' : 'warning' }}
                </v-icon>
              </v-avatar>
              <span>{{ launch.status.description }}</span>
            </v-tooltip>
            <v-list-tile-content>
              <v-list-tile-title>{{ launch.status.abbrev }}</v-list-tile-title>
              <v-list-tile-sub-title>Launch Status</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-card-actions>
          <v-btn
            large
            flat
            outline
            :color="$store.state.colorTheme === 'light' ? 'primary' : ''"
            @click.stop="getLaunchDetails(launch.id)"
          >
            Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <DetailsModal
      :dialog="detailsDialog"
      @closeDialog="closeDetailsDialog"
      :launch="launchClicked"
    />
  </v-layout>
</template>

<script>
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

    getLaunchDetails (id) {
      if (this.start) {
        this.launchClicked = { ...this.launches.find(item => item.id === id) }
        this.detailsDialog = true
      } else {
        if (this.$store.state.launchDetails && this.$store.state.launchDetails[id]) {
          this.launchClicked = { ...this.$store.state.launchDetails[id] }
          this.detailsDialog = true
        } else {
          this.$Progress.start()
          this.$store.dispatch('getLaunchDetails', id)
            .then(() => {
              this.launchClicked = { ...this.$store.state.launchDetails[id] }
              this.detailsDialog = true
              this.$Progress.finish()
            })
            .catch(() => {
              this.$Progress.fail()
            })
        }
      }
    },

    closeDetailsDialog () {
      this.detailsDialog = false
    }
  },

  components: {
    DetailsModal
  }
}
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
.no-underline:hover {
  text-decoration: underline;
}
</style>
