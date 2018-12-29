<template>
  <v-app :dark="colorTheme === 'dark'">
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list two-line>
        <v-list-tile @click="goToPage('/')" active-class="red--text">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="goToPage('/agencies')" active-class="red--text">
          <v-list-tile-action>
            <v-icon>business</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Agencies</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="goToPage('/charts')" active-class="red--text">
          <v-list-tile-action>
            <v-icon>pie_chart</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Charts</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark :color="colorTheme === 'light' ? 'primary' : ''" flat clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        AstroX
        <span v-if="$route.path.length > 1">
          / {{ $route.path | capitalize }}
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="colorChanger" v-if="colorTheme === 'dark'" light small fab @click.stop="changeTheme('light')"></v-btn>
      <v-btn class="colorChanger" v-else color="grey darken-4" small fab @click.stop="changeTheme('dark')"></v-btn>
    </v-toolbar>
    <v-content>
      <Information v-if="$route.name === 'Start'" />
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import Information from './Information'

export default {
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapGetters({
      colorTheme: 'getColorTheme'
    })
  },
  filters: {
    capitalize (value) {
      if (!value) return ''
      value = value.split('/')
      value.splice(0, 1)
      value = value.map(item => item.charAt(0).toUpperCase() + item.slice(1))
      return value.join(' / ')
    }
  },
  watch: {
    colorTheme (val) {
      this.$vuetify.theme.primary = val === 'dark' ? '#D2D219' : '#1976D2'
    }
  },
  created () {
    this.$vuetify.theme.primary = this.colorTheme === 'dark' ? '#D2D219' : '#1976D2'
  },
  methods: {
    goToPage (page) {
      this.drawer = false
      this.$router.push(page)
    },
    changeTheme (color) {
      this.$store.commit('SET_COLOR_THEME', color)
    }
  },
  components: {
    Information
  }
}
</script>
