import api from '@/api'
import { authMiddleware, fetchUserMiddleware } from './middlewares'
import { useAppStore } from '@/stores/app'

export const loadRoutes = async () => {
  const routes = [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      beforeEnter: [authMiddleware, fetchUserMiddleware],
      children: [
        {
          path: '',
          name: 'Index',
          component: () => import('@/pages/Index.vue'),
        },
        {
          path: 'sign-in',
          name: 'SignIn',
          component: () => import('@/pages/SignIn.vue'),
        },
        {
          path: 'sign-up',
          name: 'SignUp',
          component: () => import('@/pages/SignUp.vue'),
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: () => import('@/pages/ResetPassword.vue'),
        },
        {
          path: 'recovery-password',
          name: 'RecoveryPassword',
          component: () => import('@/pages/RecoveryPassword.vue'),
        },
      ],
    },
    {
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      beforeEnter: [authMiddleware, fetchUserMiddleware],
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/pages/Dashboard.vue'),
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/pages/Profile.vue'),
        },
        {
          path: '/tasks',

          children: [
            {
              path: '',
              component: () => import('@/pages/Tasks/Index.vue'),
              name: 'Tasks',
            },
            {
              path: ':id',
              component: () => import('@/pages/Tasks/[id].vue'),
              name: 'Task',
            },
            {
              path: 'create',
              component: () => import('@/pages/Tasks/Create.vue'),
              name: 'CreateTask',
            },
          ],
        },
      ],
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        const appStore = useAppStore()
        appStore.addMessage({
          type: 'success',
          text: 'You have successfully logged out.',
        })

        api.users.logout().then(() => {
          next('/')
        })
      },
    },
  ]

  return routes
}
