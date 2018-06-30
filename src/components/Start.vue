<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list two-line>
        <v-list-tile @click="goToPage('past')">
          <v-list-tile-action>
            <v-icon>timelapse</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Past</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="goToPage('upcoming')">
          <v-list-tile-action>
            <v-icon>timeline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Upcoming</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark clipped-left color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>SpaceX Rocket Launches</v-toolbar-title>
    </v-toolbar>
    <v-content class="mt-5">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    goToPage (path) {
      this.drawer = false
      this.$router.push(path)
    }
  }
}
</script>
