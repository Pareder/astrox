<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable>
      <v-card tile>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="closeDialog">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Launches in {{ year }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container
            fluid
            style="min-height: 0;"
            grid-list-lg>
            <v-layout row wrap>
              <v-flex xs12 v-for="(launch, id) in launches" :key="id">
                <v-card light>
                  <div class="headline pt-3">{{ launch.mission_name }}</div>
                  <v-container fluid grid-list-lg>
                    <v-layout row>
                      <v-flex xs8>
                        <v-list light three-line>
                          <v-subheader>Information</v-subheader>
                          <v-list-tile avatar>
                            <v-list-tile-content>
                              <v-btn large right @click.stop="getRocketDetails(id)">{{ launch.rocket.rocket_name }}</v-btn>
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
                          <v-list-tile avatar>
                            <v-avatar>
                              <v-icon>place</v-icon>
                            </v-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{ launch.launch_site.site_name_long }}</v-list-tile-title>
                              <v-list-tile-sub-title>Launch Site</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-card-text class="text-xs-left subheading" v-if="launch.details">
                            {{ launch.details }}
                          </v-card-text>
                          <gmap-map
                            v-if="mapsLoaded"
                            class="ml-3"
                            :center="launch.location"
                            :zoom="10"
                            style="width:80%;  height: 400px;">
                            <gmap-marker :position="launch.location" :title="launch.launch_site.site_name_long"></gmap-marker>
                          </gmap-map>
                        </v-list>
                      </v-flex>
                      <v-flex xs4>
                        <v-card-media
                          :src="launch.links.mission_patch"
                          height="100%"
                          contain></v-card-media>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
    <RocketModal :dialog="rocketDialog" :closeDialog="closeRocketDialog" :rocket="rocket" />
  </div>
</template>
<script>
import RocketModal from './RocketModal'

export default {
  data () {
    return {
      mapsLoaded: false,
      rocket: null,
      rocketDialog: false
    }
  },
  props: {
    dialog: {
      type: Boolean
    },
    closeDialog: {
      type: Function
    },
    launches: {
      type: Array
    },
    year: {
      type: Number
    }
  },
  watch: {
    launches: async function (val) {
      this.mapsLoaded = false
      const promises = this.launches.map((item) => {
        return new Promise(resolve => {
          this.$http.get(`https://maps.google.com/maps/api/geocode/json?address=${item.launch_site.site_name.replace(/ /g, '+')}&key=AIzaSyC9H_ZF0P-ghuts2MmTKxJDOaw7KTSM0AI`)
            .then(response => {
              item.location = response.body.results[0].geometry.location
              resolve()
            }, response => {
              console.log(response)
            })
        })
      })
      await Promise.all(promises)
      this.mapsLoaded = true
    }
  },
  methods: {
    getRocketDetails (id) {
      this.$http.get(`https://api.spacexdata.com/v2/rockets/${this.launches[id].rocket.rocket_name.replace(' ', '').toLowerCase()}`)
        .then(response => {
          this.rocket = { ...response.body }
          this.rocketDialog = true
        }, response => {
          console.log(response)
        })
    },
    closeRocketDialog () {
      this.rocketDialog = false
    }
  },
  components: {
    RocketModal
  }
}
</script>
