import { client } from '.'
import { useAppStore } from '@/stores/app'

export const users = {
  async login(email, password) {
    return client
      .account()
      .createEmailPasswordSession(email, password)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async register(userId, email, password, name) {
    return client
      .account()
      .create(userId, email, password, name)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async resetPassword(email, recoveryEndpoint) {
    return client
      .account()
      .createRecovery(email, recoveryEndpoint)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async setNewPassword(userId, secret, password) {
    return client
      .account()
      .updateRecovery(userId, secret, password)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async getCurrentUser() {
    return client
      .account()
      .get()
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async logout() {
    return client
      .account()
      .deleteSession('current')
      .then((response) => {
        const appStore = useAppStore()
        appStore.setUser(null)
        appStore.setToken(null)
        return response
      })
      .catch((error) => {
        throw error
      })
  },
  async updatePassword(newPassword, oldPassword) {
    return client
      .account()
      .updatePassword(newPassword, oldPassword)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
}
