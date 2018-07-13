<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.native="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ agencyName ? `${agencyName} ` : '' }}Launches in {{ year }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="+$route.params.id === 121">
        <h3 v-if="!launches || launches.length === 0">No launches in this year</h3>
        <v-tabs v-else v-model="activeLaunch" color="primary darken-2" dark slider-color="yellow" show-arrows>
          <v-tab v-for="(launch, id) in launches" :key="id" ripple>
            {{ new Date(launch.launch_date_utc).toLocaleDateString().slice(0, -5) }}
          </v-tab>
          <v-tab-item v-for="(launch, id) in launches" :key="launch.id" lazy>
            <v-card light>
              <div class="headline pa-3">{{ launch.mission_name }}</div>
              <v-container fluid grid-list-lg>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-card-media :src="launch.links.mission_patch" height="100%" contain>
                      <v-list light three-line class="list-with-bg" style="background: rgba(255,255,255,0.9)">
                        <v-subheader>Information</v-subheader>
                        <v-list-tile avatar>
                          <v-list-tile-content>
                            <v-btn large color="primary" right @click.stop="getRocketDetails(id)">{{ launch.rocket.rocket_name }}</v-btn>
                            <v-list-tile-sub-title>Rocket</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile avatar>
                          <v-avatar>
                            <v-icon>access_time</v-icon>
                          </v-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ new Date(launch.launch_date_utc).toLocaleString() }}</v-list-tile-title>
                            <v-list-tile-sub-title>Launch Date</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile avatar>
                          <v-avatar>
                            <v-icon>place</v-icon>
                          </v-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ launch.launch_site.site_name_long }}</v-list-tile-title>
                            <v-list-tile-sub-title>Launch Site</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-card-text class="text-xs-left subheading" v-if="launch.details">
                          {{ launch.details }}
                        </v-card-text>
                      </v-list>
                    </v-card-media>
                  </v-flex>
                  <v-flex xs12 md6 class="pr-3">
                    <v-tabs v-model="launch.activeTab" color="primary darken-2" dark slider-color="lime" icons-and-text>
                      <v-tab>
                        Map
                        <v-icon>map</v-icon>
                      </v-tab>
                      <v-tab>
                        Video
                        <v-icon>videocam</v-icon>
                      </v-tab>
                      <v-tab-item>
                        <gmap-map :center="launch.location" :zoom="10" style="width:100%;  height: 400px;">
                          <gmap-marker :position="launch.location" :title="launch.launch_site.site_name_long"></gmap-marker>
                        </gmap-map>
                      </v-tab-item>
                      <v-tab-item>
                        <lazy-component tag="div" style="line-height: 0">
                          <iframe v-if="launch.links.video_link" width="100%" height="400" frameborder="0" :src="`http://www.youtube.com/embed/${launch.links.video_link.split('v=')[1]}`">
                          </iframe>
                        </lazy-component>
                      </v-tab-item>
                    </v-tabs>
                  </v-flex>
                  <v-flex xs12>
                    <lazy-component tag="div">
                      <iframe v-if="launch.telemetry.flight_club" class="mt-3 px-2" id="altitude1" title="Inline Frame Example" width="100%" height="600" frameborder="0" :src="launch.telemetry.flight_club"></iframe>
                    </lazy-component>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-text v-else>
        <h3 v-if="!launches || launches.length === 0">No launches in this year</h3>
        <LaunchLayout :launches="launches" />
      </v-card-text>
      <div style="flex: 1 1 auto;"></div>
    </v-card>
    <RocketModal :dialog="rocketDialog" :closeDialog="closeRocketDialog" :mutateDialog="mutateRocketDialog" :rocket="rocket" />
    <img src="../../static/rocket.png" width="50" height="50" class="rocket" />
  </v-dialog>
</template>
<script>
import LaunchLayout from './LaunchLayout'
import RocketModal from './RocketModal'

export default {
  data () {
    return {
      activeLaunch: 0,
      rocket: null,
      rocketDialog: false
    }
  },
  props: {
    launches: {
      type: Array
    },
    year: {
      type: Number
    },
    dialog: {
      type: Boolean
    },
    closeDialog: {
      type: Function
    },
    agencyName: {
      type: String
    }
  },
  methods: {
    getRocketDetails (id) {
      const name = this.launches[id].rocket.rocket_name.replace(' ', '').toLowerCase()
      if (this.$store.state.rockets[name]) {
        this.rocket = { ...this.$store.state.rockets[name] }
        this.rocketDialog = true
      } else {
        this.$store.dispatch('getRocket', name)
          .then(() => {
            this.rocket = { ...this.$store.state.rockets[name] }
            this.rocketDialog = true
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    closeRocketDialog () {
      this.rocketDialog = false
    },
    mutateRocketDialog (newValue) {
      this.rocketDialog = newValue
    }
  },
  components: {
    LaunchLayout,
    RocketModal
  }
}
</script>
<style>
.list-with-bg {
  width: 100%;
}
.rocket {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 5;
  animation: rocket 4s linear infinite;
}
@keyframes rocket {
  25% {
    transform: translate(50px, -50%) rotate(30deg);
  }
  40% {
    transform: translate(10px, -90%) rotate(-30deg);
  }
  50% {
    transform: translate(0, -100%) rotate(-210deg);
  }
  75% {
    transform: translate(50px, -50%) rotate(-180deg);
  }
  90% {
    transform: translate(10px, -10%) rotate(-150deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}
</style>
