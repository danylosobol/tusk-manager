<script setup>
import { defineProps, computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  label: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])

const uniqueId = ref(uuidv4())

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="flex items-center">
    <input type="checkbox" class="mr-2 cursor-pointer" v-model="inputValue" :id="uniqueId" />
    <label v-if="props.label" class="text-sm cursor-pointer" :for="uniqueId">{{
      props.label
    }}</label>
  </div>
</template>
