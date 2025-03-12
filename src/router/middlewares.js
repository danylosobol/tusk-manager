import { useAppStore } from '@/stores/app'
import api from '@/api'

export const authMiddleware = (to, from, next) => {
  const appStore = useAppStore()

  if (to.meta.requiresAuth && !appStore.isAuthenticated && to.name !== 'SignIn') {
    return next({ name: 'SignIn' })
  }

  if (to.name?.match(/^(SignIn|SignUp|Index)$/) && appStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  next()
}

export const fetchUserMiddleware = async (to, from, next) => {
  const appStore = useAppStore()

  if (appStore.isAuthenticated && !appStore.user) {
    await api.users
      .getCurrentUser()
      .then((data) => appStore.setUser(data))
      .catch((error) => {
        appStore.setUser(null)
        appStore.setToken(null)
      })
  }

  next()
}
