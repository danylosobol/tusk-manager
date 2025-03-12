<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { useEventListener } from '@/composable/useEventListener'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const sidebarElement = ref(null)
const isFirstClick = ref(true)

useEventListener(document, 'click', (event) => {
  if (!props.modelValue) return

  if (isFirstClick.value) {
    isFirstClick.value = false
    return
  }

  if (sidebarElement.value && !sidebarElement.value.contains(event.target)) {
    emit('update:modelValue', false)
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      isFirstClick.value = true
    }
  },
)
</script>

<template>
  <div
    ref="sidebarElement"
    :class="{ 'translate-x-[-100%]': !modelValue }"
    class="fixed left-0 top-0 h-full z-5 bg-base-light w-full max-w-md transition-transform"
  >
    <div class="relative max-h-full h-full">
      <button
        @click="emit('update:modelValue', false)"
        class="absolute cursor-pointer top-3 group right-3 h-[24px] aspect-square"
        type="button"
      >
        <CloseIcon class="fill-base-dark group-hover:fill-primary transition-colors"></CloseIcon>
      </button>
      <div class="pt-8 h-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
