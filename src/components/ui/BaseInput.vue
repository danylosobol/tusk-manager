<script setup>
import VisibilityIcon from '@/components/icons/VisibilityIcon.vue'
import VisibilityOffIcon from '@/components/icons/VisibilityOffIcon.vue'
import { defineProps, defineEmits, computed, onUnmounted, ref, onDeactivated } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { debounce } from 'lodash'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    default: () => '',
  },
  label: {
    type: String,
    default: () => '',
  },
  type: {
    type: String,
    default: () => 'text',
  },
  autocomplete: {
    type: String,
  },
  placeholder: {
    type: String,
    default: () => '',
  },
  debounce: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const uniqueId = ref(uuidv4())
const isPasswordVisible = ref(false)
const inputType = ref(props.type)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (props.debounce) {
      debouncedUpdate(value)
    } else {
      emit('update:modelValue', value)
    }
  },
})

const debouncedUpdate = debounce((value) => {
  emit('update:modelValue', value)
}, props.debounce)

const toggleInputType = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
  isPasswordVisible.value = !isPasswordVisible.value
}

const resetField = () => {
  inputType.value = props.type
  isPasswordVisible.value = false
}

onUnmounted(() => {
  debouncedUpdate.cancel()
  resetField()
})

onDeactivated(() => {
  resetField()
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
    <div class="relative">
      <input
        class="block text-md py-2 w-full px-2 border-1 rounded-sm border-primary outline-primary focus:border-primary"
        :class="props.type === 'password' ? 'pr-5' : ''"
        :autocomplete="props.autocomplete"
        :type="inputType"
        :id="uniqueId"
        v-model="inputValue"
        :placeholder="props.placeholder"
        @blur="(event) => emit('blur', event)"
      />
      <button
        class="w-3 aspect-square absolute z-2 top-[50%] cursor-pointer right-2 -translate-y-[50%] fill-base-dark"
        type="button"
        v-if="props.type === 'password'"
        @click="toggleInputType"
      >
        <component
          :is="isPasswordVisible ? VisibilityIcon : VisibilityOffIcon"
          class="w-full fill-base-dark"
        ></component>
      </button>
    </div>
    <span class="text-red-600 text-sm" v-if="props.errorMessage">{{ props.errorMessage }}</span>
  </div>
</template>
