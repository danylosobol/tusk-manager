<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { validator } from '@/utils/validator'
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useApi } from '@/composable/useApi'
import { useForm } from '@/composable/useForm'
import api from '@/api'

const appStore = useAppStore()
const { data, error, loading, fetchData } = useApi()
const { formData, errorMessages, validateField, validateForm, resetForm } = useForm(
  {
    password: '',
    oldPassword: '',
  },
  {
    password: (value) =>
      validator.password(value) ||
      'Password must include an uppercase letter, a number, and a special character.',
    oldPassword: (value) =>
      validator.password(value) ||
      'Password must include an uppercase letter, a number, and a special character.',
  },
)

const submit = async () => {
  if (!validateForm()) {
    return
  }

  await fetchData(api.users.updatePassword(formData.password, formData.oldPassword))

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
      text: 'Password was successfully updated',
    })
    resetForm()
  }
}
</script>

<template>
  <div class="mt-10 w-full min-h-30 text-base-dark bg-white shadow-md p-5 rounded-b-sm">
    <h1
      class="text-2xl relative inline-block before:absolute before:w-full before:left-0 before:top-[100%] before:h-[2px] before:block before:bg-primary mb-5"
    >
      Profile
    </h1>
    <form @submit.prevent="submit">
      <p class="mb-5">Update password</p>
      <BaseInput
        class="mb-2"
        v-model="formData.password"
        :type="'password'"
        :autocomplete="'new-password'"
        :label="'New password: '"
        :error-message="errorMessages.password"
        @blur="(event) => validateField('password', event.target.value)"
      ></BaseInput>
      <BaseInput
        class="mb-2"
        v-model="formData.oldPassword"
        :type="'password'"
        :autocomplete="'current-password'"
        :label="'Current password: '"
        :error-message="errorMessages.oldPassword"
        @blur="(event) => validateField('oldPassword', event.target.value)"
      ></BaseInput>
      <div class="text-center mt-5">
        <BaseButton :type="'submit'">Change password</BaseButton>
      </div>
    </form>
  </div>
</template>
