<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
  },
  label: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const uniqueId = ref(uuidv4())
const textareaValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="w-full">
    <label
      class="block mb-1 text-sm font-medium cursor-pointer"
      v-if="props.label"
      :for="uniqueId"
      >{{ props.label }}</label
    >
    <textarea
      class="block text-md py-2 w-full px-2 border-1 rounded-sm border-primary outline-primary focus:border-primary resize-none min-h-[150px]"
      :id="uniqueId"
      v-model="textareaValue"
      @blur="(event) => emit('blur', event)"
    ></textarea>
    <span class="text-red-600 text-sm" v-if="props.errorMessage">{{ props.errorMessage }}</span>
  </div>
</template>
