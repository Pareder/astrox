<template>
  <v-chip>
    <v-avatar :class="className">
      <v-icon>{{ icon }}</v-icon>
    </v-avatar>
    <span v-if="text">{{ text }}</span>
    <slot v-else/>
  </v-chip>
</template>

<script>
  export default {
    props: {
      className: {
        type: String
      },
      icon: {
        type: String
      },
      text: {
        type: String
      }
    }
  }
</script>
