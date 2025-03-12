<script setup>
import BrandIcon from '@/components/icons/BrandIcon.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import GlobalNotification from '@/components/GlobalNotification.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import { ref, onMounted } from 'vue'
import { useElementProperty } from './composable/useElementProperty'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from './stores/app'

const transitionDuration = 200
const headerRef = ref(null)
const loading = ref(false)
const headerHeight = useElementProperty(headerRef, 'clientHeight')
const appStore = useAppStore()
const router = useRouter()

onMounted(() => {
  router.beforeEach((to, from, next) => {
    if (to.path === from.path && to.query !== from.query) {
      next()
      return
    }

    loading.value = true
    setTimeout(() => {
      next()
    }, transitionDuration)
  })

  router.afterEach(() => {
    setTimeout(() => {
      loading.value = false
    }, transitionDuration)
  })
})
</script>

<template>
  <BaseLoader
    class="bg-base-dark z-2"
    :duration="transitionDuration"
    :is-loading="loading"
  ></BaseLoader>
  <header ref="headerRef" class="bg-base-dark fixed w-full z-1">
    <div class="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px8">
      <div class="py-4 flex">
        <RouterLink class="max-w-20 max-h-10 flex" :to="{ path: '/' }">
          <BrandIcon class="fill-base-light w-full h-full"></BrandIcon>
        </RouterLink>
        <nav class="max-w-50 ml-auto">
          <HeaderNavigation class="flex flex-wrap gap-5"></HeaderNavigation>
        </nav>
        <button
          class="cursor-pointer ml-4 transition-colors group"
          @click="appStore.setSidebar(true)"
          v-if="appStore.isAuthenticated"
          type="button"
        >
          <MenuIcon
            class="h-[24px] fill-base-light group-hover:fill-secondary aspect-square"
          ></MenuIcon>
        </button>
      </div>
    </div>
  </header>
  <main class="min-h-screen flex" :style="{ paddingTop: headerHeight + 'px' }">
    <RouterView> </RouterView>
  </main>
  <GlobalNotification></GlobalNotification>
  <Transition name="brand-fade">
    <div v-if="appStore.isSidebarOpened" class="fixed z-4 bg-base-dark inset-0 opacity-40"></div>
  </Transition>
</template>

<style scoped></style>
