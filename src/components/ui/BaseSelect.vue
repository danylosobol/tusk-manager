<script setup>
import { defineEmits, defineProps, computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import ChevronIcon from '@/components/icons/ChevronIcon.vue'
import { useEventListener } from '@/composable/useEventListener'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: () => '',
  },
  label: {
    type: String,
    default: () => '',
  },
  errorMessage: {
    type: String,
    default: () => '',
  },
})
const emit = defineEmits(['update:modelValue'])
const uniqueId = ref(uuidv4())
const isOpened = ref(false)
const selectElement = ref(null)
const selectValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
const displayValue = computed(() => {
  const selectedLabel = getOptionLabel(selectValue.value)
  return selectedLabel || props.placeholder
})

const getOptionLabel = (value) => {
  if (!value || !props.options?.length) return ''
  return props.options.find((option) => option.value === value)?.label || ''
}

const optionHandler = (value) => {
  selectValue.value = value
  isOpened.value = false
}

useEventListener(document, 'click', (event) => {
  if (selectElement.value && !selectElement.value.contains(event.target) && isOpened.value) {
    isOpened.value = false
  }
})
</script>

<template>
  <div class="w-full">
    <div class="relative">
      <label
        class="block mb-1 text-sm font-medium cursor-pointer"
        v-if="props.label"
        :for="uniqueId"
        >{{ props.label }}</label
      >
      <select class="hidden" v-model="selectValue" :id="uniqueId">
        <option
          :selected="option.selected"
          v-for="(option, index) in props.options"
          :value="option.value"
          :key="index"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <div
        ref="selectElement"
        class="relative text-md py-2 w-full px-2 border-1 cursor-pointer rounded-sm border-primary outline-primary h-[42px]"
      >
        <span
          @click="isOpened = !isOpened"
          class="w-[calc(100%-20px)] block select-none"
          :class="{
            'opacity-70': !selectValue && props.placeholder,
          }"
          >{{ displayValue }}</span
        >
        <div
          :class="{ 'rotate-180': isOpened }"
          class="absolute top-[50%] -translate-y-[50%] right-[5px] transition-transform"
        >
          <ChevronIcon class="fill-base-dark"></ChevronIcon>
        </div>
        <ul
          :class="{ hidden: !isOpened }"
          class="absolute left-0 top-[calc(100%+1px)] w-full bg-white t z-1 shadow-sm py-2 max-h-[136px] overflow-y-auto"
          v-if="props.options && props.options.length > 0"
        >
          <li
            class="p-2 cursor-pointer text-base-dark hover:bg-primary hover:text-base-light transition-colors select-none"
            v-for="option in options"
            :key="option.value"
            @click="() => optionHandler(option.value)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
    <span class="text-red-600 text-sm" v-if="props.errorMessage">{{ props.errorMessage }}</span>
  </div>
</template>
