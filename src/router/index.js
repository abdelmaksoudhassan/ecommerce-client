import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {getToken} from '../helpers/functions'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'authentication',
      component: () => import('../views/AuthenticationView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { needAuth: true }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/ShoppingCartView.vue'),
      meta: { needAuth: true }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { needAuth: true }
    },
    {
      path: '/myorders',
      name: 'myorders',
      component: () => import('../views/MyOrdersView.vue'),
      meta: { needAuth: true }
    },
    {
      path:'/:catchAll(.*)',
      name:'error',
      component: () => import('../views/ErrorView.vue')
    },
  ]
})
router.beforeEach((to,from,next)=>{
  const token = getToken()
  if(to.matched.some(route => route.meta.needAuth)){
    if(! token){
      next({name:'authentication'})
    }else{
      next()
    }
  }else{
    next()
  }
})

export default router
