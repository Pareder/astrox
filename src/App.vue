<template>
  <div id="app">
    <router-view/>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import '../node_modules/vuetify/dist/vuetify.min.css';
@import '../node_modules/material-design-icons-iconfont/dist/material-design-icons.css';

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v-list__tile__content {
  overflow: visible;
}
.visible-overflow {
  overflow: visible !important;
}
.tabs__bar .material-icons {
  display: flex;
}
.normal-space {
  white-space: normal;
}
</style>
