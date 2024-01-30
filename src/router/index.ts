import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import BottomBar from '../components/BottomBar.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/childform',
    name: 'ChildForm',
    component: () => import('@/views/ChildForm.vue')
  },
  {
    path: '/home',
    component: BottomBar,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('@/views/Activities.vue')
      }
    ]
  },
  {
    path: '/formPAC',
    name: 'FormPAC',
    component: () => import('@/components/FormPAC.vue')
  },
  {
    path: '/initPAC',
    name: 'InitPAC',
    component: () => import('@/views/InitPAC.vue')
  },
  {
    path: '/modifacc',
    name: 'ModifAcc',
    component :() => import('@/views/ModifAcc.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
