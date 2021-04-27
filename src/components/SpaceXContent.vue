<template>
  <div>
    <v-tabs
      v-model="activeLaunch"
      :color="isThemeLight ? 'primary darken-2' : 'grey darken-2'"
      dark
      slider-color="yellow"
      show-arrows
    >
      <v-tab v-for="(launch, id) in launches" :key="id" ripple>
        {{ new Date(launch.launch_date_utc).toLocaleDateString().slice(0, -5) }}
      </v-tab>
      <v-tab-item v-for="(launch, id) in launches" :key="launch.id" lazy>
        <SpaceXCard :launch="launch" :isActive="id === activeLaunch" @click="getRocketDetails(id)" />
      </v-tab-item>
    </v-tabs>
    <RocketModal
      :dialog="Boolean(rocket)"
      :rocket="rocket"
      @close="closeRocketDialog"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SpaceXCard from './SpaceXCard'
import RocketModal from './modals/RocketModal'

export default {
  data() {
    return {
      activeLaunch: null,
      rocket: null
    }
  },

  props: {
    launches: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'isThemeLight'
    ])
  },

  methods: {
    getRocketDetails (id) {
      const name = this.launches[id].rocket.rocket_name.replace(' ', '').toLowerCase()

      if (this.$store.state.rockets[name]) {
        this.rocket = this.$store.state.rockets[name]
      } else {
        this.$Progress.start()
        this.$store.dispatch('getRocket', name)
          .then(() => {
            this.rocket = this.$store.state.rockets[name]
            this.$Progress.finish()
          })
          .catch(() => {
            this.$Progress.fail()
          })
      }
    },

    closeRocketDialog () {
      this.rocket = null
    },
  },

  components: {
    SpaceXCard,
    RocketModal
  }
}
</script>
