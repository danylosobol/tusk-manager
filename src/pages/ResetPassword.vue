<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import api from '@/api'
import { useApi } from '@/composable/useApi'
import { validator } from '@/utils/validator'
import { useForm } from '@/composable/useForm'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { onUnmounted, onDeactivated } from 'vue'

const router = useRouter()
const appStore = useAppStore()
const recoveryRoute = router.resolve({ name: 'RecoveryPassword' })
const { formData, errorMessages, validateForm, validateField, resetForm } = useForm(
  {
    email: '',
  },
  {
    email: (value) => validator.email(value) || 'Please enter a valid email address.',
  },
)

const { data, error, loading, fetchData } = useApi()

const submit = async () => {
  if (!validateForm()) {
    return
  }
  await fetchData(
    api.users.resetPassword(formData.email, `${window.location.origin}${recoveryRoute.fullPath}`),
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
      text: 'Password reset link has been sent to your email.',
    })
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
      <h1 class="text-2xl max-w-130 text-center mb-4">Reset Password</h1>
      <form novalidate @submit.prevent="submit">
        <BaseInput
          v-model="formData.email"
          class="mb-4"
          :autocomplete="'current-email'"
          :label="'Enter email *: '"
          :type="'email'"
          :error-message="errorMessages.email"
          @blur="validateField('email', formData.email)"
        ></BaseInput>
        <BaseButton :loading="loading" :disabled="loading" class="w-full" :type="'submit'"
          >Reset Password</BaseButton
        >
      </form>
    </div>
  </div>
</template>
