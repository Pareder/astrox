<template>
  <v-card>
    <div class="headline pa-3">{{ launch.mission_name }}</div>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 md6>
          <v-img class="no-padding" :src="launch.links.mission_patch" height="100%" contain>
            <v-list
              three-line
              class="list-with-bg"
              :class="{ light: isThemeLight, dark: !isThemeLight }"
            >
              <v-subheader>Information</v-subheader>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-btn
                    large
                    :color="isThemeLight ? 'primary' : ''"
                    right
                    @click.stop="$emit('click')"
                  >
                    {{ launch.rocket.rocket_name }}
                  </v-btn>
                  <v-list-tile-sub-title>Rocket</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-avatar>
                  <v-icon>access_time</v-icon>
                </v-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ new Date(launch.launch_date_utc).toLocaleString() }}
                  </v-list-tile-title>
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
          </v-img>
        </v-flex>
        <v-flex xs12 md6 class="pr-3">
          <v-tabs
            v-model="launch.activeTab"
            :color="isThemeLight ? 'primary darken-2' : 'grey darken-2'"
            dark
            slider-color="lime"
            icons-and-text
          >
            <v-tab>
              Map
              <v-icon>map</v-icon>
            </v-tab>
            <v-tab>
              Video
              <v-icon>videocam</v-icon>
            </v-tab>
            <v-tab-item>
              <gmap-map :center="launch.location" :zoom="10" class="map">
                <gmap-marker
                  :position="launch.location"
                  :title="launch.launch_site.site_name_long"
                ></gmap-marker>
              </gmap-map>
            </v-tab-item>
            <v-tab-item v-if="isActive">
              <div class="video">
                <iframe
                  v-if="launch.links.video_link"
                  width="100%"
                  height="400"
                  :src="getYouTubeLink(launch.links.video_link)"
                ></iframe>
              </div>
            </v-tab-item>
          </v-tabs>
        </v-flex>
        <v-flex xs12>
          <iframe
            v-if="isActive && launch.telemetry.flight_club"
            class="mt-3 px-2"
            id="altitude1"
            title="Telemetry"
            width="100%"
            height="600"
            :src="launch.telemetry.flight_club"
          ></iframe>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getYouTubeLink } from '@/utils'

export default {
  props: {
    launch: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'isThemeLight'
    ])
  },

  methods: {
    getYouTubeLink
  }
}
</script>

<style scoped>
.list-with-bg {
  width: 100%;
  height: 100%;
}

.light {
  background-color: rgba(255, 255, 255, 0.9);
}

.dark {
  background-color: rgba(66, 66, 66, 0.9);
}

.map {
  width: 100%;
  height: 400px;
}
</style>