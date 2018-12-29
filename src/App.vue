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
:not(.v-table__overflow)::-webkit-scrollbar {
  width: 1em;
}
:not(.v-table__overflow)::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #fff;
}
:not(.v-table__overflow)::-webkit-scrollbar-thumb {
  height: 50px;
  background: url('assets/startup.png') no-repeat 50% 50%;
  outline: 1px solid slategrey;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-display: swap;
}
.v-card__media__content {
  width: 100%;
}
.visible-overflow {
  overflow: visible !important;
}
.v-tabs__bar .material-icons {
  display: flex;
}
.normal-space {
  white-space: normal;
}
.v-toolbar__content .colorChanger {
  width: 30px;
  height: 30px;
}
.rocket_img {
  object-fit: cover;
}
.chartjs-render-monitor {
  margin-top: 20px;
}
</style>
