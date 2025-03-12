<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import api from '@/api'
import { useApi } from '@/composable/useApi'
import { validator } from '@/utils/validator'
import { useForm } from '@/composable/useForm'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { onUnmounted, onDeactivated } from 'vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { formData, errorMessages, validateForm, validateField, resetForm } = useForm(
  {
    password: '',
    repeatPassword: '',
  },
  {
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
  if (!route.query.userId || !route.query.secret) {
    appStore.addMessage({
      type: 'error',
      text: 'Wrong reset password link. Try to reset password again.',
    })
    return
  }

  await fetchData(
    api.users.setNewPassword(route.query.userId, route.query.secret, formData.password),
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
      text: 'Your password has been successfully updated.',
    })
    resetForm()
    router.push({ name: 'SignIn' })
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
      <h1 class="text-2xl max-w-130 text-center mb-4">Set New Password</h1>
      <form novalidate @submit.prevent="submit">
        <input id="userName" name="username" autocomplete="username" value="" />
        <BaseInput
          v-model="formData.password"
          class="mb-4"
          :autocomplete="'current-password'"
          :label="'Enter new password *: '"
          :type="'password'"
          :error-message="errorMessages.password"
          @blur="validateField('password', formData.password)"
        ></BaseInput>
        <BaseInput
          v-model="formData.repeatPassword"
          class="mb-4"
          :label="'Repeat password *: '"
          :autocomplete="'current-password'"
          :type="'password'"
          :error-message="errorMessages.repeatPassword"
          @blur="validateField('repeatPassword', formData.repeatPassword)"
        ></BaseInput>
        <BaseButton :loading="loading" :disabled="loading" class="w-full" :type="'submit'"
          >Set New Password</BaseButton
        >
      </form>
    </div>
  </div>
</template>
