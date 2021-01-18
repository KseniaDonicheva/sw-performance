import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes: [{
//     path: '/',
//     component: Home,
//     children: [{ path: '/', name: 'Home', component: Home },
//       { path: '/content1', name: 'Content1', component: () => import(/* webpackChunkName: "content1" */ '../views/Content1.vue') }]
//   }]
// })
const routes = [
  {
    path: '',
    name: 'Home',
    component: Home
  },
  {
    path: '/content1',
    name: 'Content1',
    component: () => import(/* webpackChunkName: "content1" */ '../views/Content1.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
