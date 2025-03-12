<script setup>
import { useAppStore } from '@/stores/app'
import { watch, ref, onUnmounted } from 'vue'

const appStore = useAppStore()
const list = ref([])
const notificationDuration = 1500
const timeouts = ref([])
const maxNotifications = 3

const getClassNames = (type) => {
  const classNames = {
    error: 'bg-red-600 text-base-light',
    success: 'bg-green-600 text-base-light',
    info: 'bg-base-dark text-base-light',
  }
  return classNames[type]
}

const removeItem = (index) => {
  list.value.splice(index, 1)
}

const startTimerForNewMessage = () => {
  const timeout = setTimeout(() => {
    removeItem(0)
  }, notificationDuration)

  timeouts.value.push(timeout)
}

watch(
  () => appStore.messages,
  (newValue) => {
    if (Array.isArray(newValue) && newValue.length > 0) {
      const messages = appStore.getMessages()
      messages.forEach((message) => {
        if (list.value.length >= maxNotifications) {
          removeItem(0)
        }
        list.value.push(message)
        startTimerForNewMessage()
      })
    }
  },
  { deep: true },
)

onUnmounted(() => {
  timeouts.value.forEach((timeout) => clearTimeout(timeout))
})
</script>

<template>
  <TransitionGroup
    name="list"
    class="fixed p-2 z-3 top-0 bottom-0 pointer-events-none flex justify-end flex-col left-[50%] -translate-x-[50%] w-full max-w-md"
    tag="ul"
  >
    <li
      class="py-1 px-3 text-sm text-center rounded-md mb-2"
      v-for="(listItem, index) in list"
      :key="index"
      :class="getClassNames(listItem.type)"
    >
      {{ listItem.text }}
    </li>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.list-enter-active,
.list-leave-active {
  transition:
    opacity var(--default-transition-duration) var(--default-transition-timing-function),
    transform var(--default-transition-duration) var(--default-transition-timing-function);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
