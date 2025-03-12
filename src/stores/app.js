import { CookieManager } from '@/utils/cookieManager'
import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', {
  state: () => ({
    messages: [],
    user: null,
    token:
      (CookieManager.get('a_session_tusk-manager') ||
        JSON.parse(localStorage.getItem('cookieFallback'))?.['a_session_tusk-manager']) ??
      null,
    sidebar: false,
    sidebarConfig: JSON.parse(localStorage.getItem('sidebarConfig')) ?? null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isSidebarOpened: (state) => state.sidebar,
    currentUser: (state) => state.user,
  },
  actions: {
    addMessage(message) {
      if (!message) {
        return
      }
      this.messages.push(message)
    },
    getMessages() {
      const ret = [...this.messages]
      this.messages = []
      return ret
    },
    setUser(user) {
      if (!user) {
        this.user = null
        return
      }
      this.user = user
    },
    setToken(token) {
      if (!token) {
        this.token = null
        CookieManager.delete('a_session_tusk-manager', '/')
        localStorage.removeItem('cookieFallback')
        return
      }
      this.token = token
    },
    setSidebar(status) {
      this.sidebar = !!status
    },
    setSidebarConfig(config) {
      if (!config) {
        this.sidebarConfig = null
        localStorage.removeItem('sidebarConfig')
        return
      }

      this.sidebarConfig = config
      localStorage.setItem('sidebarConfig', JSON.stringify(config))
    },
  },
})
