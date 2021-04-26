<template>
  <v-dialog v-model="localDialog" max-width="500px">
    <v-card v-if="launch">
      <v-btn absolute icon class="close-btn" @click.native="closeDialog">
        <v-icon color="grey">close</v-icon>
      </v-btn>
      <div class="headline px-5 pt-3">
        {{ launch.name }}
      </div>
      <v-card-text>
        <v-list two-line>
          <v-list-tile avatar>
            <v-list-tile-avatar v-if="launch.image">
              <img :src="launch.image" class="rocket_img" height="100%">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ launch.rocket.configuration.family }} | {{ launch.rocket.configuration.name }}
              </v-list-tile-title>
              <v-list-tile-sub-title>Rocket</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar v-if="launch.mission.type">
            <v-list-tile-avatar>
              <v-icon>work</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ launch.mission.type }}</v-list-tile-title>
              <v-list-tile-sub-title>Mission</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <p v-if="launch.mission && launch.mission.description"
            class="subheading text-xs-left px-3"
          >
            {{ launch.mission.description }}
          </p>
        </v-list>
        <v-tabs
          v-model="activeTab"
          :color="colorTheme === 'light' ? 'primary darken-2' : 'grey darken-2'"
          dark
          slider-color="lime"
        >
          <v-tab href="#tab-0">
            <v-icon>map</v-icon>
          </v-tab>
          <v-tab v-for="(video, id) in launch.vidURLs" :key="video.url" :href="`#tab-${id + 1}`">
            <v-icon>videocam</v-icon>
          </v-tab>
          <v-tab-item value="tab-0">
            <gmap-map :center="location" :zoom="8" class="map">
              <gmap-marker :position="location" :title="launch.pad.location.name"></gmap-marker>
            </gmap-map>
          </v-tab-item>
          <v-tab-item v-for="(video, id) in launch.vidURLs" :key="video.url" :value="`tab-${id + 1}`">
            <div class="video" v-if="dialog">
              <iframe
                v-if="video.url.includes('youtu')"
                width="100%"
                height="300"
                frameborder="0"
                :src="getYouTubeLink(video.url)"
              ></iframe>
              <iframe
                v-else-if="video.url.includes('vimeo')"
                width="100%"
                height="300"
                frameborder="0"
                :src="getVimeoLink(video.url)"
              ></iframe>
              <v-btn v-else flat color="primary" :href="video">{{ video.url }}</v-btn>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :color="colorTheme === 'light' ? 'primary' : ''" @click.stop="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getYouTubeLink, getVimeoLink } from '../../utils'

export default {
  data () {
    return {
      location: {
        lat: null,
        lng: null
      },
      activeTab: null
    }
  },

  props: {
    dialog: {
      type: Boolean
    },
    launch: {
      type: Object
    }
  },

  computed: {
    ...mapState([
      'colorTheme'
    ]),

    localDialog: {
      get () {
        return this.dialog
      },
      set () {
        this.closeDialog()
      }
    },
  },

  watch: {
    launch: function (value) {
      this.location = {
        lat: Number(value?.pad?.latitude),
        lng: Number(value?.pad?.longitude)
      }
    }
  },

  methods: {
    closeDialog () {
      this.activeTab = null
      this.$emit('closeDialog')
    },

    getYouTubeLink (link) {
      return getYouTubeLink(link)
    },

    getVimeoLink (link) {
      return getVimeoLink(link)
    }
  }
}
</script>

<style scoped>
  .close-btn {
    top: 6px;
    left: 6px;
  }
  .map {
    width: 100%;
    height: 300px;
  }
</style>
