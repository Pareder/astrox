<template>
  <v-flex xs12 sm6 md4 class="pa-2">
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
          :color="isThemeLight ? 'primary' : ''"
          @click.stop="$emit('click')"
        >
          Details
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    launch: {
      type: Object,
      required: true
    },
    start: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'isThemeLight'
    ])
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
