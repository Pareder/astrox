<template>
    <v-tabs
      v-model="active"
      :color="colorTheme === 'light' ? 'primary darken-2' : 'grey darken-2'"
      dark
      slider-color="yellow"
      align-with-title
    >
      <v-tab ripple>
        Past
      </v-tab>
      <v-tab ripple>
        Upcoming
      </v-tab>
      <v-tab-item lazy class="mt-3">
        <PastLaunches :agencyId="agencyId" :agencyAbbrev="agencyAbbrev" :agencyName="agencyName" />
      </v-tab-item>
      <v-tab-item lazy class="mt-3">
        <UpcomingLaunches :agencyId="agencyId" :agencyAbbrev="agencyAbbrev" :agencyName="agencyName" />
      </v-tab-item>
    </v-tabs>
</template>

<script>
import { mapState } from 'vuex'
import PastLaunches from '../components/PastLaunches'
import UpcomingLaunches from '../components/UpcomingLaunches'

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
    ...mapState([
     'colorTheme'
    ])
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
        this.$Progress.start()
        this.$store.dispatch('getAgenciesInfo')
          .then(() => {
            const { abbrev, name } = this.$store.getters.agencyInfo(this.agencyId)
            this.agencyAbbrev = abbrev
            this.agencyName = name
            this.$Progress.finish()
          })
          .catch(() => {
            this.$Progress.fail()
          })
      }
    }
  },

  components: {
    PastLaunches,
    UpcomingLaunches
  }
}
</script>
