import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import Agencies from '@/components/Agencies'
import AgencyLaunches from '@/components/AgencyLaunches'
import LaunchModal from '@/components/LaunchModal'
import SpaceXPast from '@/components/SpaceXPast'
import SpaceXUpcoming from '@/components/SpaceXUpcoming'
import PieChartLaunches from '@/components/PieChartLaunches'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
      children: [
        {
          path: '/past/spacex',
          name: 'SpaceXPast',
          component: SpaceXPast,
          children: [
            {
              path: '/past/spacex/:name',
              name: 'LaunchModal',
              component: LaunchModal
            }
          ]
        },
        {
          path: '/upcoming/spacex',
          name: 'SpaceXUpcoming',
          component: SpaceXUpcoming
        },
        {
          path: '/agencies',
          name: 'Agencies',
          component: Agencies
        },
        {
          path: '/agencies/:id',
          name: 'AgencyLauches',
          component: AgencyLaunches,
          props: true
        },
        {
          path: '/charts',
          name: 'Piechart',
          component: PieChartLaunches
        }
      ]
    }
  ]
})

export default router
