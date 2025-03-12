<script setup>
import { useAppStore } from '@/stores/app'
import { computed, ref, watch } from 'vue'
import BaseSidebar from '@/components/ui/BaseSidebar.vue'
import BaseAccordion from '@/components/ui/BaseAccordion.vue'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const router = useRouter()
const currentUser = appStore.currentUser

const sidebarStatus = computed({
  get: () => appStore.isSidebarOpened,
  set: (value) => appStore.setSidebar(value),
})

const sidebarConfig = computed({
  get: () => appStore.sidebarConfig,
  set: (value) => appStore.setSidebarConfig(value),
})

const accordionsState = ref({ ...(sidebarConfig.value?.accordions ?? {}) })

const sidebarMenu = [
  {
    title: 'Tasks',
    id: 'tasks',
    links: [
      {
        title: 'Create task',
        name: 'CreateTask',
        object: 'task',
      },
      {
        title: 'My tasks',
        name: 'Tasks',
      },
    ],
  },
  {
    title: 'Profile',
    name: 'Profile',
  },
]

const changeSidebarConfig = (id, state) => {
  sidebarConfig.value = {
    ...sidebarConfig.value,
    accordions: {
      ...sidebarConfig.value?.accordions,
      [id]: state,
    },
  }
}

const logoutHadler = () => {
  sidebarStatus.value = false
  router.push({ name: 'logout' })
}

watch(
  () => sidebarConfig.value?.accordions,
  (newAccordions) => {
    if (!newAccordions) return
    accordionsState.value = newAccordions
  },
  { immediate: true },
)
</script>

<template>
  <aside>
    <BaseSidebar v-model="sidebarStatus">
      <div class="flex flex-col h-full text-base-dark">
        <div class="flex items-start mt-2 px-2 border-b-base-dark border-solid border-b pb-2">
          <div
            v-if="currentUser?.email"
            class="w-[40px] aspect-square mr-3 uppercase text-base-light flex items-center justify-center rounded-full bg-base-dark"
          >
            {{ Array.from(currentUser.email)[0] }}
          </div>
          <p>
            <span class="block text-sm" v-if="currentUser?.name">{{ currentUser.name }}</span>
            <span class="block text-sm" v-if="currentUser?.email">{{ currentUser.email }}</span>
          </p>
        </div>
        <div class="max-h-full overflow-y-auto">
          <template v-for="(item, index) in sidebarMenu" :key="index">
            <BaseAccordion
              v-if="!item.name && item.links"
              v-model="accordionsState[item.id]"
              class="px-2 border-b-base-dark border-solid border-b"
              @update:model-value="(state) => changeSidebarConfig(item.id, state)"
            >
              <template #header>
                <span class="block py-2">{{ item.title }}</span>
              </template>
              <template #content>
                <ul v-if="item.links && item.links.length > 0">
                  <li class="p-2" v-for="(link, linkIndex) in item.links" :key="linkIndex">
                    <RouterLink
                      @click="sidebarStatus = false"
                      class="hover:text-primary transition-colors"
                      :to="{
                        name: link.name,
                        ...(link.object ? { meta: { object: link.object } } : {}),
                      }"
                      >{{ link.title }}</RouterLink
                    >
                  </li>
                </ul>
              </template>
            </BaseAccordion>
            <RouterLink
              @click="() => (sidebarStatus = false)"
              class="p-2 border-b-base-dark border-solid border-b block"
              v-else
              :to="{ name: item.name }"
              >{{ item.title }}</RouterLink
            >
          </template>
        </div>
        <div class="px-2 mt-auto py-2 border-b-base-dark border-solid border-t">
          <button
            @click="logoutHadler"
            class="cursor-pointer hover:text-primary transition-colors"
            type="button"
          >
            Log out
          </button>
        </div>
      </div>
    </BaseSidebar>
  </aside>
  <div class="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px8 grow-1">
    <RouterView> </RouterView>
  </div>
</template>
