import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import Agencies from '@/components/Agencies'
import AgencyLaunches from '@/components/AgencyLaunches'
import LaunchesCharts from '@/components/LaunchesCharts'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
      children: [
        {
          path: '/agencies',
          name: 'Agencies',
          component: Agencies
        },
        {
          path: '/agencies/:id',
          name: 'AgencyLaunches',
          component: AgencyLaunches,
          props: true
        },
        {
          path: '/charts',
          name: 'LaunchesCharts',
          component: LaunchesCharts
        }
      ]
    }
  ]
})

export default router
