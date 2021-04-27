<template>
  <v-dialog v-model="localDialog" max-width="500px">
    <v-card v-if="rocket">
      <div class="headline pa-3">
        {{ rocket.name }}
      </div>
      <v-card-text>
        <v-list two-line>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-container fluid pa-0>
                <v-layout row wrap justify-space-between>
                  <div>
                    <v-list-tile-title>{{ rocket.height.meters }} m</v-list-tile-title>
                    <v-list-tile-sub-title>Height</v-list-tile-sub-title>
                  </div>
                  <div>
                    <v-list-tile-title>{{ rocket.diameter.meters }} m</v-list-tile-title>
                    <v-list-tile-sub-title>Diameter</v-list-tile-sub-title>
                  </div>
                  <div>
                    <v-list-tile-title>{{ rocket.mass.kg.toLocaleString() }} kg</v-list-tile-title>
                    <v-list-tile-sub-title>Mass</v-list-tile-sub-title>
                  </div>
                </v-layout>
              </v-container>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>${{ rocket.cost_per_launch.toLocaleString() }}</v-list-tile-title>
              <v-list-tile-sub-title>Cost per launch</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ rocket.success_rate_pct }}%</v-list-tile-title>
              <v-list-tile-sub-title>Success rate</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-card-text class="text-xs-left">
            {{ rocket.description }}
          </v-card-text>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :color="isThemeLight ? 'primary' : ''"
          @click.stop="$emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    dialog: {
      type: Boolean
    },
    rocket: {
      type: Object
    }
  },

  computed: {
    ...mapGetters([
      'isThemeLight'
    ]),

    localDialog: {
      get () {
        return this.dialog
      },
      set () {
        this.$emit('close')
      }
    }
  }
}
</script>
