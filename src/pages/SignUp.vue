<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { onUnmounted, ref, onDeactivated } from 'vue'
import api from '@/api'
import { useApi } from '@/composable/useApi'
import { validator } from '@/utils/validator'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from '@/composable/useForm'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const router = useRouter()
const { formData, errorMessages, validateForm, validateField, resetForm } = useForm(
  {
    email: '',
    password: '',
    name: '',
    phone: '',
    repeatPassword: '',
  },
  {
    email: (value) => validator.email(value) || 'Please enter a valid email address.',
    password: (value) =>
      validator.password(value) ||
      'Password must include an uppercase letter, a number, and a special character.',
    repeatPassword: (value) => value === formData.password || 'Passwords do not match.',
  },
)

const { data, error, loading, fetchData } = useApi()

const submit = async () => {
  if (!validateForm()) {
    return
  }
  const userId = ref(uuidv4())
  await fetchData(
    api.users.register(userId.value, formData.email, formData.password, formData.name),
  )

  if (error.value && error.value.message) {
    appStore.addMessage({
      type: 'error',
      text: error.value.message,
    })
    return
  }
  if (data.value) {
    appStore.addMessage({
      type: 'success',
      text: 'Registration successful. Welcome aboard!',
    })
    router.push({ name: 'SignIn' })
    resetForm()
  }
}

onDeactivated(() => {
  resetForm()
})
onUnmounted(() => {
  resetForm()
})
</script>
<template>
  <div class="flex justify-center flex-col items-center text-base-dark h-full py-10">
    <div
      class="border-2 border-secondary py-10 px-5 rounded-2xl shadow-md bg-base-light max-w-md w-full"
    >
      <h1 class="text-2xl max-w-130 text-center mb-4">Sign up</h1>
      <form novalidate @submit.prevent="submit">
        <div class="flex gap-4 mb-4">
          <BaseInput
            v-model="formData.name"
            :label="'Enter full name: '"
            :type="'text'"
          ></BaseInput>
          <BaseInput
            v-model="formData.phone"
            :label="'Enter phone number: '"
            :type="'text'"
          ></BaseInput>
        </div>
        <BaseInput
          v-model="formData.email"
          class="mb-4"
          :autocomplete="'current-email'"
          :label="'Enter email *: '"
          :type="'email'"
          :error-message="errorMessages.email"
          @blur="validateField('email', formData.email)"
        ></BaseInput>
        <div class="flex gap-4 mb-4">
          <BaseInput
            v-model="formData.password"
            :label="'Enter password *: '"
            :autocomplete="'current-password'"
            :type="'password'"
            :error-message="errorMessages.password"
            @blur="validateField('password', formData.password)"
          ></BaseInput>
          <BaseInput
            v-model="formData.repeatPassword"
            :label="'Repeat password *: '"
            :autocomplete="'current-password'"
            :type="'password'"
            :error-message="errorMessages.repeatPassword"
            @blur="validateField('repeatPassword', formData.repeatPassword)"
          ></BaseInput>
        </div>
        <BaseButton :loading="loading" :disabled="loading" class="w-full" :type="'submit'"
          >Sign up</BaseButton
        >
      </form>
    </div>
  </div>
</template>
