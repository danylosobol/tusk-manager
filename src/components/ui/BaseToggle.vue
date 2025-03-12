<script setup>
import { useEventListener } from '@/composable/useEventListener'
import { ref, defineEmits } from 'vue'

const isEditing = ref(false)
const element = ref(null)
const emit = defineEmits(['toggle'])

const toggle = (state) => {
  isEditing.value = state
  emit('toggle', isEditing.value)
}

useEventListener(document, 'click', (event) => {
  if (element.value && isEditing.value && !element.value.contains(event.target)) {
    toggle(false)
  }
})
</script>

<template>
  <div
    ref="element"
    @dblclick="() => toggle(true)"
    title="Double-click to edit"
    class="relative cursor-pointer"
  >
    <slot v-if="!isEditing" name="default"></slot>
    <slot v-else name="editing"></slot>
  </div>
</template>
