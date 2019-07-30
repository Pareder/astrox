<template>
  <v-layout wrap align-center>
    <v-flex xs12 sm6 md4 class="pa-2" v-for="launch in visibleLaunches" :key="launch.id">
      <v-card v-lazy>
        <v-card-title class="justify-center">
          <h3 class="headline">{{ launch.name }}</h3>
        </v-card-title>
        <v-list>
          <v-list-tile avatar v-if="start">
            <v-avatar>
              <v-icon>business</v-icon>
            </v-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-if="launch.lsp" class="normal-space">
                <router-link class="no-underline" :to="`/agencies/${launch.lsp.id}`">
                  {{ launch.lsp.name }}
                </router-link>,
                {{ launch.lsp.countryCode }}
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
              <v-list-tile-title v-if="past">{{ new Date(launch.net).toLocaleString() }}</v-list-tile-title>
              <v-list-tile-title v-else class="visible-overflow">
                <v-tooltip top>
                  <v-badge color="transparent" slot="activator">
                    <v-icon slot="badge" v-if="launch.tbddate === 1 || launch.tbdtime === 1" small>info</v-icon>
                    {{ new Date(launch.net).toLocaleString() }}
                  </v-badge>
                  <span v-if="launch.tbddate === 1 || launch.tbdtime === 1">Launch date is not exact</span>
                  <span v-else>Launch date</span>
                </v-tooltip>
              </v-list-tile-title>
              <v-list-tile-sub-title>Launch Date</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar v-if="past">
            <v-tooltip top>
              <v-avatar slot="activator">
                <v-icon :color="launch.status === 3 ? 'light-green' : 'red'">
                  {{ launch.status === 3 ? 'check' : 'error_outline' }}
                </v-icon>
              </v-avatar>
              <span v-if="launch.failreason">{{ launch.failreason }}</span>
              <span v-else-if="launch.status === 4">Failed</span>
              <span v-else>Success</span>
            </v-tooltip>
            <v-list-tile-content>
              <v-list-tile-title>{{ launch.status === 3 ? 'Success' : 'Failed' }}</v-list-tile-title>
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
      currentNumber: 0
    }
  },

  props: {
    launches: {
      type: Array
    },
    past: {
      type: Boolean
    }
  },

  computed: {
    start () {
      return this.$route.name === 'Start'
    }
  },

  created () {
    if (this.launches) {
      this.setVisibleLaunches()

      window.onscroll = () => {
        const bottomOfWindow = (document.documentElement.scrollTop + window.innerHeight) === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.setVisibleLaunches()
        }
      }
    }
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
