<template>
  <v-card tile>
    <v-toolbar dark color="primary">
      <v-toolbar-title>Upcoming launches</v-toolbar-title>
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
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <div style="flex: 1 1 auto;"></div>
    <RocketModal :dialog="rocketDialog" :closeDialog="closeRocketDialog" :rocket="rocket" />
  </v-card>
</template>
<script>
import RocketModal from './RocketModal'

export default {
  data () {
    return {
      launches: null,
      rocket: null,
      rocketDialog: false
    }
  },
  created () {
    this.$http.get('https://api.spacexdata.com/v2/launches/upcoming', { responseType: 'json' })
      .then(response => {
        this.launches = [ ...response.body ]
      }, response => {
        console.log(response)
      })
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
