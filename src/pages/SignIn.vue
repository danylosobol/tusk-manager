<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useApi } from '@/composable/useApi'
import api from '@/api'
import { useAppStore } from '@/stores/app'
import { useForm } from '@/composable/useForm'
import { validator } from '@/utils/validator'
import { useRouter } from 'vue-router'
import { onDeactivated, onUnmounted } from 'vue'

const router = useRouter()
const { formData, errorMessages, validateForm, validateField, resetForm } = useForm(
  {
    email: '',
    password: '',
  },
  {
    email: (value) => validator.email(value) || 'Please enter a valid email address.',
    password: (value) =>
      validator.password(value) ||
      'Password must include an uppercase letter, a number, and a special character.',
  },
)

const { data, error, loading, fetchData } = useApi()
const appStore = useAppStore()

const submit = async () => {
  if (!validateForm()) {
    return
  }

  await fetchData(api.users.login(formData.email, formData.password))

  if (error.value && error.value.message) {
    appStore.addMessage({
      type: 'error',
      text: error.value.message,
    })
    return
  }

  if (data.value) {
    appStore.setUser(data.value)
    appStore.setToken({})
    appStore.addMessage({
      type: 'success',
      text: 'Login successful. Welcome back!',
    })

    resetForm()
    router.push({ name: 'Dashboard' })
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
      <h1 class="text-2xl max-w-130 text-center mb-4">Sign in</h1>
      <form novalidate @submit.prevent="submit">
        <BaseInput
          v-model="formData.email"
          class="mb-4"
          :autocomplete="'current-email'"
          :label="'Your email *: '"
          :type="'email'"
          :error-message="errorMessages.email"
          @blur="validateField('email', formData.email)"
        ></BaseInput>
        <BaseInput
          v-model="formData.password"
          class="mb-4"
          :label="'Your password *: '"
          :autocomplete="'current-password'"
          :type="'password'"
          :error-message="errorMessages.password"
          @blur="validateField('password', formData.password)"
        ></BaseInput>
        <div class="flex items-center justify-between mb-4">
          <RouterLink
            class="text-base-dark ml-auto text-sm hover:text-primary transition-colors"
            :to="{ name: 'ResetPassword' }"
            >Forgot password?</RouterLink
          >
        </div>
        <BaseButton :loading="loading" :disabled="loading" class="w-full" :type="'submit'"
          >Sign in</BaseButton
        >
      </form>
    </div>
  </div>
</template>
