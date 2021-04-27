<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
    <v-card tile>
      <v-toolbar dark :color="isThemeLight ? 'primary' : ''">
        <v-btn icon dark @click.native="$emit('close')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ agencyName ? `${agencyName} ` : '' }}Launches in {{ year }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <Chip v-if="!launches || !launches.length" className="red" icon="close" text="No launches in this year" />
        <SpaceXContent v-else-if="isSpaceX" :launches="launches" />
        <LaunchLayout v-else :launches="launches" />
      </v-card-text>
      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Chip from '../Chip'
import LaunchLayout from '../LaunchLayout'
import SpaceXContent from '@/components/SpaceXContent'

export default {
  data () {
    return {
      activeLaunch: 0
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
    agencyName: {
      type: String
    },
    isSpaceX: {
      type: Boolean
    }
  },

  computed: {
    ...mapGetters([
      'isThemeLight'
    ])
  },

  components: {
    Chip,
    LaunchLayout,
    SpaceXContent
  }
}
</script>

<style scoped>
  .list-with-bg {
    width: 100%;
    height: 100%;
  }
  .map {
    width: 100%;
    height: 400px;
  }
</style>
