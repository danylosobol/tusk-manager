<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: false,
  },
  duration: {
    type: Number,
    required: false,
    default: 200,
  },
  color: {
    type: String,
    default: 'bg-primary',
  },
})
</script>

<template>
  <Transition name="brand-fade" mode="in-out">
    <div
      :style="{ transitionDuration: props.duration + 'ms' }"
      v-if="props.isLoading"
      class="absolute w-full h-full inset-0 flex justify-center items-center p-5"
    >
      <div :class="color" class="thumb thumb-1"></div>
      <div :class="color" class="thumb thumb-2"></div>
      <div :class="color" class="thumb thumb-3"></div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.thumb {
  width: 5px;
  min-height: 20px;
  margin: 4px;
  animation: loading 0.6s var(--tw-ease, var(--default-transition-timing-function)) infinite;

  &.thumb-1 {
    animation-delay: 0s;
  }

  &.thumb-2 {
    animation-delay: 0.2s;
  }

  &.thumb-3 {
    animation-delay: 0.4s;
  }
}

@keyframes loading {
  0% {
  }
  20% {
    transform: scale(1.5);
  }
  40% {
    transform: scale(1);
  }
}
</style>
