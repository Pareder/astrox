<template>
  <div>
    <v-tabs v-model="active" :color="colorTheme === 'light' ? 'primary darken-2' : 'grey darken-2'" dark slider-color="yellow" align-with-title>
      <v-tab ripple>
        Past
      </v-tab>
      <v-tab ripple>
        Upcoming
      </v-tab>
      <v-tab-item lazy class="mt-3">
        <SpaceXPast v-if="agencyId === 121" />
        <PastLaunches v-else :agencyId="agencyId" :agencyAbbrev="agencyAbbrev" :agencyName="agencyName" />
      </v-tab-item>
      <v-tab-item lazy class="mt-3">
        <UpcomingLaunches :agencyId="agencyId" :agencyAbbrev="agencyAbbrev" :agencyName="agencyName" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SpaceXPast from './SpaceXPast'
import PastLaunches from './PastLaunches'
import UpcomingLaunches from './UpcomingLaunches'

export default {
  data () {
    return {
      active: 0,
      agencyId: +this.id,
      agencyAbbrev: this.abbrev,
      agencyName: this.agencyName
    }
  },
  props: {
    id: {
      type: [String, Number]
    },
    abbrev: {
      type: String
    },
    name: {
      type: String
    }
  },
  computed: {
    ...mapGetters({
      colorTheme: 'getColorTheme'
    })
  },
  created () {
    if (!this.agencyAbbrev || !this.agencyName) {
      this.getAgencyInfo()
    }
  },
  methods: {
    getAgencyInfo () {
      if (this.$store.state.agencies) {
        const { abbrev, name } = this.$store.getters.agencyInfo(this.agencyId)
        this.agencyAbbrev = abbrev
        this.agencyName = name
      } else {
        this.$store.dispatch('getAgenciesInfo')
          .then(() => {
            const { abbrev, name } = this.$store.getters.agencyInfo(this.agencyId)
            this.agencyAbbrev = abbrev
            this.agencyName = name
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  },
  components: {
    SpaceXPast,
    PastLaunches,
    UpcomingLaunches
  }
}
</script>
