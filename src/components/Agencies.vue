<template>
  <v-container fluid>
    <v-layout wrap align-center justify-center v-if="agencies">
      <v-flex xs12 sm6 class="px-2">
        <v-text-field outline label="Search" placeholder="Type company name" append-icon="search" @input="sortAgencies" v-model="searchModel"></v-text-field>
      </v-flex>
      <v-flex xs6 sm3 class="px-2">
        <v-select outline :items="typesNames" label="Agency type" v-model="typeModel" @change="sortAgencies"></v-select>
      </v-flex>
      <v-flex xs6 sm3 class="px-2">
        <v-select outline :items="agencyCountries" label="Country" v-model="countryModel" @change="sortAgencies"></v-select>
      </v-flex>
      <v-flex class="text-xs-center">
        Click chart sign<v-icon class="px-1">assessment</v-icon> to see launches' info
      </v-flex>
      <v-flex class="text-xs-center">
        Click plus sign<v-icon class="px-1">add</v-icon> on several agencies up to five to compare their launches
      </v-flex>
      <transition-group name="list-complete" tag="div" class="transition_block">
        <v-flex xs12 sm6 md4 class="pa-2 list-complete-item" v-for="agency in (sortedAgencies ? sortedAgencies : agencies)" :key="agency.id">
          <v-card :color="itemsToCompare.includes(agency.id) ? 'primary' : ''" :dark="itemsToCompare.includes(agency.id) ? true : false">
            <v-card-title class="justify-center">
              <v-btn class="absolute_btn" outline icon @click="compareAgencies(agency.id)">
                <v-icon>{{ itemsToCompare.includes(agency.id) ? 'remove' : 'add' }}</v-icon>
              </v-btn>
              <div class="title px-3" style="width: 100%">{{ agency.name }}</div>
              <v-btn class="absolute_menu" icon @click="goToLaunches(agency.id, agency.abbrev, agency.name)">
                <v-icon>assessment</v-icon>
              </v-btn>
              <span class="grey--text pt-2">{{ agency.type }}, {{ agency.countryCode }}</span>
            </v-card-title>
          </v-card>
        </v-flex>
      </transition-group>
      <v-flex xs12 class="title" v-if="sortedAgencies && sortedAgencies.length === 0">
        <v-chip>
            <v-avatar class="red">
              <v-icon>close</v-icon>
            </v-avatar>
             No items found
          </v-chip>
      </v-flex>
    </v-layout>
    <ComparingModal :dialog="dialog" :closeDialog="closeDialog" :comparingAgenciesLaunches="comparingAgenciesLaunches" :names="selectedAgencies" />
    <v-fab-transition>
      <v-btn v-show="itemsToCompare.length > 1" color="primary darken-2" dark fixed bottom right fab @click="goToCompare">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-snackbar v-model="alert" top multi-line :timeout="6000" color="red">
      <div v-if="errorAgencies">{{ errorAgencies }} have no launches at all</div>
      <div v-else>Maximum count of agencies is <strong class="alert__count ml-1 subheading font-weight-bold">5</strong></div>
      <v-btn color="white" flat outline @click="closeAlert">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import ComparingModal from './modals/ComparingModal'

export default {
  data () {
    return {
      agencies: null,
      sortedAgencies: null,
      searchModel: null,
      typeModel: null,
      countryModel: null,
      itemsToCompare: [],
      comparingAgenciesLaunches: null,
      dialog: false,
      errorDialog: false,
      errorAgencies: null,
      alert: false
    }
  },
  computed: {
    ...mapGetters([
      'agencyAllLaunches'
    ]),
    typesNames () {
      return ['All', ...new Set(this.agencies.map(item => item.type))]
    },
    agencyCountries () {
      return ['All', ...new Set(this.agencies.map(item => item.countryCode).sort())]
    },
    selectedAgencies () {
      return this.dialog ? this.itemsToCompare.map(id => this.agencies.find(item => item.id === id).name) : []
    }
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
          if (this.typeModel && this.typeModel !== 'All') {
            if (item.type !== this.typeModel) {
              return false
            }
          }
          if (this.countryModel && this.countryModel !== 'All') {
            if (item.countryCode !== this.countryModel) {
              return false
            }
          }
          if (this.searchModel) {
            return item.name.toLowerCase().startsWith(this.searchModel.toLowerCase())
          }
          return true
        })
      })
    },
    goToLaunches (id, abbrev, name) {
      this.$router.push({
        name: 'AgencyLaunches',
        params: { id: id, abbrev: abbrev, name: name }
      })
    },
    compareAgencies (id) {
      const index = this.itemsToCompare.indexOf(id)
      if (index !== -1) {
        this.itemsToCompare.splice(index, 1)
      } else {
        if (this.itemsToCompare.length >= 5) {
          this.alert = true
          return
        }
        this.itemsToCompare.push(id)
      }
    },
    goToCompare () {
      this.getComparingAgencies()
    },
    getComparingAgencies () {
      this.$Progress.start()
      const promises = this.itemsToCompare.map(item => {
        return new Promise((resolve, reject) => {
          if (this.$store.state.agenciesLaunches[item]) {
            resolve()
          } else {
            this.$store.dispatch('getAgencyAllLaunches', item)
              .then(() => {
                resolve()
              })
              .catch(() => {
                resolve(this.agencies.find(agency => agency.id === item).name)
              })
          }
        })
      })
      Promise.all(promises)
        .then((values) => {
          if (values.filter(item => item).length === this.itemsToCompare.length) {
            this.errorAgencies = values.join(', ')
            this.$Progress.fail()
            this.alert = true
            return
          }
          this.comparingAgenciesLaunches = this.itemsToCompare.map(item => {
            return this.agencyAllLaunches(item)
          })
          this.$Progress.finish()
          this.dialog = true
        })
    },
    closeDialog () {
      this.dialog = null
      this.errorDialog = null
      this.itemsToCompare.length = 0
    },
    closeAlert () {
      this.alert = false
      this.errorAgencies = null
    }
  },
  components: {
    ComparingModal
  }
}
</script>
<style scoped>
.absolute_btn {
  position: absolute;
  bottom: 0;
  left: 0;
}
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
.alert__count {
  width: 30px;
  height: 30px;
  display: inline-block;
  line-height: 30px;
  background: #fff;
  color: #F44336;
  border-radius: 50%;
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
