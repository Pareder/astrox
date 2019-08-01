import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/HomePage'
import AgenciesPage from '@/pages/AgenciesPage'
import AgencyLaunchesPage from '@/pages/AgencyLaunchesPage'
import ChartsPage from '@/pages/ChartsPage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      meta: {
        title: 'AstroX — be the launch',
        metaTags: [
          {
            name: 'description',
            content: 'AstroX is built on open rocket launches API and represents the statistics of past and upcoming rocket launches.'
          },
          {
            property: 'og:description',
            content: 'AstroX is built on open rocket launches API and represents the statistics of past and upcoming rocket launches.'
          }
        ]
      },
    },
    {
      path: '/agencies',
      name: 'Agencies',
      component: AgenciesPage,
      meta: {
        title: 'All rocket launching agencies',
        metaTags: [
          {
            name: 'description',
            content: 'Full list of launch service providers, their launch history and ability to compare several ones.'
          },
          {
            property: 'og:description',
            content: 'Full list of launch service providers, their launch history and ability to compare several ones.'
          }
        ]
      }
    },
    {
      path: '/agencies/:id',
      name: 'AgencyLaunches',
      component: AgencyLaunchesPage,
      props: true,
      meta: {
        title: 'Launch agency',
        metaTags: [
          {
            name: 'description',
            content: 'Launch statistics of chosen agency.'
          },
          {
            property: 'og:description',
            content: 'Launch statistics of chosen agency.'
          }
        ]
      }
    },
    {
      path: '/charts',
      name: 'Charts',
      component: ChartsPage,
      meta: {
        title: 'Launch charts by years',
        metaTags: [
          {
            name: 'description',
            content: 'Check launches by countries, by companies, by months, by days, by day time and by continents.'
          },
          {
            property: 'og:description',
            content: 'Check launches by countries, by companies, by months, by days, by day time and by continents.'
          }
        ]
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el))

  if (!nearestWithMeta) {
    return next()
  }

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta')

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key])
    })

    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  }).forEach(tag => document.head.appendChild(tag))

  next()
})

export default router
