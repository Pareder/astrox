<template>
  <v-layout wrap align-center>
    <v-flex xs12 sm6 md4 class="pa-2" v-for="launch in launches" :key="launch.id">
      <lazy-component>
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
                <v-list-tile-title class="normal-space">
                  <router-link class="no-underline" :to="`/agencies/${launch.lsp.id}`">{{ launch.lsp && launch.lsp.name }}</router-link>, {{ launch.lsp && launch.lsp.countryCode }}
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
                    <v-badge color="grey" slot="activator">
                      <span slot="badge" v-if="launch.tbddate === 1 || launch.tbdtime === 1">?</span>
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
                  <v-icon :color="launch.status === 3 ? 'light-green' : 'red'">{{ launch.status === 3 ? 'check' : 'error_outline' }}</v-icon>
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
            <v-btn large flat outline :color="colorTheme === 'light' ? 'primary' : ''" @click.stop="getLaunchDetails(launch.id)">Details</v-btn>
          </v-card-actions>
        </v-card>
      </lazy-component>
    </v-flex>
    <DetailsModal :dialog="detailsDialog" :closeDialog="closeDetailsDialog" :mutateDialog="mutateDetailsDialog" :launch="launchClicked" />
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import DetailsModal from './DetailsModal'

export default {
  data () {
    return {
      detailsDialog: false,
      launchClicked: null
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
    },
    ...mapGetters({
      colorTheme: 'getColorTheme'
    })
  },
  methods: {
    getLaunchDetails (id) {
      if (this.start) {
        this.launchClicked = { ...this.launches.find(item => item.id === id) }
        this.detailsDialog = true
      } else {
        if (this.$store.state.launchDetails && this.$store.state.launchDetails[id]) {
          this.launchClicked = { ...this.$store.state.launchDetails[id] }
          this.detailsDialog = true
        } else {
          this.$store.dispatch('getLaunchDetails', id)
            .then(response => {
              this.launchClicked = { ...this.$store.state.launchDetails[id] }
              this.detailsDialog = true
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    closeDetailsDialog () {
      this.detailsDialog = false
    },
    mutateDetailsDialog (newValue) {
      this.detailsDialog = newValue
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
