<script setup>
import { useElementProperty } from '@/composable/useElementProperty'
import { computed, defineProps, ref } from 'vue'
import ChevronIcon from '@/components/icons/ChevronIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

const internalState = ref(false)
const contentElement = ref(null)
const contentHeight = useElementProperty(contentElement, 'scrollHeight')
const contentStyle = computed(() => {
  return { 'max-height': isAccordionOpened.value ? contentHeight.value + 'px' : '0px' }
})

const isAccordionOpened = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : internalState.value),
  set: (value) => {
    emit('update:modelValue', value)
    if (props.modelValue === undefined) {
      internalState.value = value
    }
  },
})

const toggle = () => {
  isAccordionOpened.value = !isAccordionOpened.value
}
</script>

<template>
  <div>
    <div class="relative w-full text-left cursor-pointer pr-[24px]" @click="toggle">
      <slot name="header"></slot>
      <div
        :class="{ 'rotate-180': isAccordionOpened }"
        class="absolute top-[50%] -translate-y-[50%] transition-transform right-0 w-[24px] aspect-square"
      >
        <ChevronIcon class="fill-base-dark"></ChevronIcon>
      </div>
    </div>
    <div
      :style="contentStyle"
      class="transition-[max-height] no-scrollbar overflow-y-hidden"
      ref="contentElement"
    >
      <div>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
