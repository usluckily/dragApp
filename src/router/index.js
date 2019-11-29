import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import edit from '@/view/edit'
import view from '@/view/view'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/edit',
      name: 'edit',
      component: edit
    },
    {
      path: '/view',
      name: 'view',
      component: view,
      props: true
    }
  ]
})
