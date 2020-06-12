<template>
  <Chip :className="options[status].avatarClasses" :icon="options[status].icon">
    <strong class="mr-1">{{ count }}</strong>
    {{ launchText }}
  </Chip>
</template>

<script>
  import Chip from './Chip'

  export default {
    data() {
      return {
        options: {
          success: {
            avatarClasses: 'light-green accent-4',
            icon: 'done',
            text: 'successful'
          },
          fail: {
            avatarClasses: 'red lighten-1',
            icon: 'close',
            text: 'failed'
          },
          pending: {
            avatarClasses: 'yellow',
            icon: 'timeline',
            text: 'pending'
          },
          commercial: {
            avatarClasses: 'cyan',
            icon: 'business',
            text: 'commercial'
          },
          government: {
            avatarClasses: 'cyan',
            icon: 'business',
            text: 'government'
          }
        }
      }
    },

    props: {
      count: {
        type: Number
      },
      status: {
        type: String,
        validator: val => ['success', 'fail', 'pending', 'commercial', 'government'].includes(val)
      }
    },

    computed: {
      launchText() {
        return `${this.options[this.status].text} ${this.count === 1 ? 'launch' : 'launches'}`
      }
    },

    components: {
      Chip
    }
  }
</script>
