import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged, getAuth } from 'firebase/auth'

import HomeView from '../views/HomeView.vue'
import ContactView from '../views/ContactsView.vue'
import LogInView from '../views/LogInView.vue'
import MainView from '../views/MainView.vue'
import ProfileView from '../views/ProfileView.vue'
import EditFileView from '../views/EditFileView.vue'
import GroupView from '../views/GroupView.vue'

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomeView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'home',
      component: MainView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/edit_file/:file_doc_ref',
      name: 'edit_file',
      component: EditFileView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/group',
      name: 'group',
      component: GroupView,
      meta: {
        requiresAuth: true
      }
    },
  ]
})

const getCurrentUser = () =>{
  return new Promise((resolve, reject)=> {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user)=>{
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  console.log(from,to)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth) {
    if(await getCurrentUser()){
      console.log("You are authorized to access this area.");
      next()
    } else {
      console.log("You are not authorized to access this area.")
      next('login')
    }
  } else {
    if(await getCurrentUser()){
      console.log("You are authorized.");
      next('home')
    } else {
      next()
    }
  }
})

export default router
