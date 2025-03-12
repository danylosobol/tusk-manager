<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const navigation = computed(() =>
  appStore.isAuthenticated
    ? []
    : [
        { name: 'SignIn', title: 'Sign in' },
        { name: 'SignUp', title: 'Sign up' },
      ],
)
</script>

<template>
  <ul>
    <li v-for="(item, index) in navigation" :key="index">
      <RouterLink
        :active-class="'text-secondary'"
        class="text-base-light hover:text-secondary transition-colors"
        :to="{ name: item.name }"
        >{{ item.title }}</RouterLink
      >
    </li>
  </ul>
</template>
