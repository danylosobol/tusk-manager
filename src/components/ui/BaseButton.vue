<script setup>
import BaseLoader from '@/components/ui/BaseLoader.vue'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: [String, Object],
    default: null,
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const isRouterLink = computed(() => !!props.to)
</script>

<template>
  <Component
    :is="isRouterLink ? 'RouterLink' : 'button'"
    :to="isRouterLink ? to : undefined"
    :type="isRouterLink ? undefined : type"
    :disabled="props.disabled"
    :class="{
      'relative text-transparent': props.loading,
      'hover:bg-base-dark cursor-pointer': !props.disabled,
      'cursor-not-allowed': props.disabled,
    }"
    class="bg-primary text-base-light p-2 rounded-sm min-w-20 text-center transition-colors inline-block"
  >
    <slot></slot>
    <BaseLoader :color="'bg-base-light'" :is-loading="props.loading"></BaseLoader>
  </Component>
</template>
