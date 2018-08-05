<template>
  <v-container fluid>
    <v-layout wrap align-center v-if="agencies">
      <v-flex xs12 sm6 class="px-2">
        <v-text-field outline label="Search" placeholder="Type company name" append-icon="search" @input="sortAgencies" v-model="searchModel"></v-text-field>
      </v-flex>
      <v-flex xs6 sm3 class="px-2">
        <v-select outline :items="typesNames" label="Agency type" v-model="typeModel" @change="sortAgencies"></v-select>
      </v-flex>
      <v-flex xs6 sm3 class="px-2">
        <v-select outline :items="agencyCountries" label="Country" v-model="countryModel" @change="sortAgencies"></v-select>
      </v-flex>
      <transition-group name="list-complete" tag="div" class="transition_block">
        <v-flex xs12 sm6 md4 class="pa-2 list-complete-item" v-for="(agency, id) in (sortedAgencies ? sortedAgencies : agencies)" :key="id">
          <v-card>
            <v-card-title class="justify-center">
              <div class="title px-3" style="width: 100%">{{ agency.name }}</div>
              <v-menu class="absolute_menu">
                <v-btn slot="activator" icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="goToLaunches(agency.id, agency.abbrev, agency.name)" color="primary">
                    <v-list-tile-title>Launches</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <span class="grey--text pt-2">{{ agency.type }}, {{ agency.countryCode }}</span>
            </v-card-title>
          </v-card>
        </v-flex>
      </transition-group>
      <v-flex xs12 class="title" v-if="sortedAgencies && sortedAgencies.length === 0">
        No items found
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      agencies: null,
      sortedAgencies: null,
      searchModel: null,
      typeModel: null,
      countryModel: null
    }
  },
  computed: {
    typesNames () {
      return ['All', ...new Set(this.agencies.map(item => item.type))]
    },
    agencyCountries () {
      return ['ALL', ...new Set(this.agencies.map(item => item.countryCode).sort())]
    },
    ...mapGetters({
      colorTheme: 'getColorTheme'
    })
  },
  created () {
    if (this.$store.state.agencies) {
      this.agencies = this.$store.state.agencies
    } else {
      this.$store.dispatch('getAgenciesInfo')
        .then(() => {
          this.agencies = this.$store.state.agencies
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  methods: {
    sortAgencies () {
      this.$nextTick(() => {
        this.sortedAgencies = this.agencies.filter(item => {
          return ((this.typeModel && this.typeModel !== 'All') ? (item.type === this.typeModel) : true) && ((this.countryModel && this.countryModel !== 'All') ? (item.countryCode === this.countryModel) : true) && (this.searchModel ? item.name.toLowerCase().startsWith(this.searchModel.toLowerCase()) : true)
        })
      })
    },
    goToLaunches (id, abbrev, name) {
      this.$router.push({
        name: 'AgencyLaunches',
        params: { id: id, abbrev: abbrev, name: name }
      })
    },
    goToPast (id, abbrev, name) {
      if (id === 121) {
        this.$router.push({
          name: 'SpaceXPast'
        })
        return
      }
      this.$router.push({
        name: 'AgencyPastLaunches',
        params: { id: id, abbrev: abbrev, name: name }
      })
    }
  }
}
</script>
<style scoped>
.absolute_menu {
  position: absolute;
  top: 0;
  right: 0;
}
.transition_block {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
<style>
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
