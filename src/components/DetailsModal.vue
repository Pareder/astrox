<template>
  <v-dialog v-model="localDialog" max-width="500px">
    <v-card v-if="launch">
      <div class="headline pa-3">
        {{ launch.name }}
      </div>
      <v-card-text>
        <v-list light two-line>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="imageURL" height="100%">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ launch.rocket.familyname }} | {{ launch.rocket.name }}</v-list-tile-title>
              <v-list-tile-sub-title>Rocket</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar v-if="missionType">
            <v-list-tile-avatar>
              <v-icon>work</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ missionType }}</v-list-tile-title>
              <v-list-tile-sub-title>Mission</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <p class="subheading text-xs-left px-3" v-if="launch.missions && launch.missions.length > 0 && launch.missions[0].description">
            {{ launch.missions[0].description }}
          </p>
        </v-list>
        <v-tabs v-model="activeTab" color="primary darken-2" dark slider-color="lime">
          <v-tab>
            <v-icon>map</v-icon>
          </v-tab>
          <v-tab v-for="(video, id) in launch.vidURLs" :key="id">
            <v-icon>videocam</v-icon>
          </v-tab>
          <v-tab-item>
            <gmap-map :center="location" :zoom="8" style="width:100%;  height: 300px;">
              <gmap-marker :position="location" :title="launch.location.name"></gmap-marker>
            </gmap-map>
          </v-tab-item>
          <v-tab-item v-for="(video, id) in launch.vidURLs" :key="id">
            <lazy-component tag="div" style="line-height: 0">
              <iframe v-if="video.includes('youtube')" width="100%" height="300" frameborder="0" :src="`http://www.youtube.com/embed/${video.split('v=')[1]}`"></iframe>
              <iframe v-else-if="video.includes('vimeo')" width="100%" height="300" frameborder="0" :src="`https://player.vimeo.com/video/${video.split('vimeo.com/')[1]}`"></iframe>
              <v-btn v-else flat color="primary" :href="video">{{ video }}</v-btn>
            </lazy-component>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click.stop="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data () {
    return {
      location: {
        lat: null,
        lng: null
      },
      activeTab: 0,
      missionType: null
    }
  },
  props: {
    dialog: {
      type: Boolean
    },
    mutateDialog: {
      type: Function
    },
    closeDialog: {
      type: Function
    },
    launch: {
      type: Object
    }
  },
  computed: {
    localDialog: {
      get () {
        return this.dialog
      },
      set (newValue) {
        this.activeTab = 0
        this.mutateDialog(newValue)
      }
    },
    imageURL () {
      const imageArray = this.launch.rocket.imageURL.split('_')
      return `${imageArray[0]}_320.${imageArray[1].split('.')[1]}`
    }
  },
  watch: {
    launch: function (value) {
      this.location.lat = this.launch.location.pads[0].latitude
      this.location.lng = this.launch.location.pads[0].longitude
      if (value.missions && value.missions.length > 0 && value.missions[0].type) {
        if (this.$store.state.missionTypes) {
          this.missionType = this.$store.getters.missionType(value.missions[0].type)
        } else {
          this.$store.dispatch('getMissionTypes')
            .then(response => {
              this.missionType = this.$store.getters.missionType(value.missions[0].type)
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    }
  }
}
</script>
