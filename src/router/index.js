import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import nearbyPlaces from '@/components/nearbyPlaces'
import source from '@/components/source'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'nearbyPlaces',
      component: nearbyPlaces
    }
  ]
})
