import { createRouter, createWebHashHistory } from 'vue-router'
// import { routes } from './routes'
import pinia from '@/store'
import useUserStore from '@/store/modules/user'


let userStore = useUserStore(pinia)

console.log(userStore.token)


const routes = [
  {
    path: '/login',
    component: () => import('../views/login/Login.vue')
  },

  {
    path: '/setting',
    component: () => import('../views/setting/index.vue')
  },
  {
    path: '/chatgpt',
    component: () => import('../views/chatgpt/ChatgptHome.vue')
  }, {
    path: '/',
    redirect: '/login'
  }

]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})
router.beforeEach((to, from, next) => {

  if (to.path === '/login') {
    next()
  } else {
    if (localStorage.getItem("TOKEN")) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})
// router.beforeEach((to, from, next) => {

//   if (to.path == "/login") {
//     next()
//   }

// })
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem("token")
//   if (to.path == '/login') {
//     next()
//   } else {
//     if (token) {
//       next()
//     } else {
//       next({ path: '/login' })
//     }
//   }
// })
// router.beforeEach((to, from, next) => {
//   let token = localStorage.getItem("token");
//   if (token) {
//     if (to.path == '/login') {
//       next()
//     }
//   } else {
//     if (to.path == '/login') {
//       next()
//     } else {
//       next({ path: '/login' })
//     }
//   }
// })

export default router