<template>
  <v-app>
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
        <v-list-tile @click="goToPage('/agencies')" active-class="red--text">
          <v-list-tile-action>
            <v-icon>business</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Agencies</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
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
    <v-toolbar app dark flat clipped-left color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        AstroX
        <span v-if="$route.path.length > 1">
          / {{ $route.path | capitalize }}
        </span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <Information v-if="$route.name === 'Start'" />
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<script>
import Information from './Information'

export default {
  data () {
    return {
      drawer: false
    }
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
  methods: {
    goToPage (page) {
      this.drawer = false
      this.$router.push(page)
    }
  },
  components: {
    Information
  }
}
</script>
