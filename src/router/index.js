import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import PastLaunches from '@/components/PastLaunches'
import UpcomingLaunches from '@/components/UpcomingLaunches'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
      children: [
        {
          path: '/past',
          name: 'PastLaunches',
          component: PastLaunches
        },
        {
          path: '/upcoming',
          name: 'UpcomingLaunches',
          component: UpcomingLaunches
        }
      ]
    }
  ]
})

router.replace({ path: '/past', redirect: '/' })

export default router
