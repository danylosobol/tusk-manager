<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseMap from '@/components/ui/BaseMap.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { useForm } from '@/composable/useForm'
import { useApi } from '@/composable/useApi'
import { validator } from '@/utils/validator'
import { statuses } from '@/utils/enums'
import { formatter } from '@/utils/formatter'
import { ref, watch, computed, onDeactivated, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import api from '@/api'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'

const addDeadline = ref(false)
const addPlace = ref(false)
const dateTime = ref('')
const coordinates = ref({})
const router = useRouter()

const appStore = useAppStore()
const currentUser = computed(() => appStore.user)
const taskId = ref(uuidv4())

const { data, error, loading, fetchData } = useApi()

const options = ref(
  Array.from(statuses).map((status) => ({ value: status, label: formatter.enum(status) })),
)

const { formData, errorMessages, validateForm, validateField, resetForm } = useForm(
  {
    title: '',
    description: '',
    status: '',
    deadline: '',
    place: '',
    user_id: currentUser.value.$id,
  },
  {
    title: (value) => validator.notEmpty(value) || "Title shouldn't be empty",
    status: (value) => validator.notEmpty(value) || 'Choose one of status',
  },
)

const clearForm = () => {
  resetForm()
  addDeadline.value = false
  addPlace.value = false
  dateTime.value = ''
  coordinates.value = {}
  taskId.value = uuidv4()
}

const submit = async () => {
  if (!validateForm()) {
    return
  }

  await fetchData(api.collection.create('tasks', taskId.value, formData))

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
      text: 'Task was successfully created.',
    })
    router.push({ name: 'Tasks' })
    clearForm()
  }
}

watch(
  () => dateTime.value,
  (newValue) => {
    if (!newValue) return
    formData.deadline = formatter.localTimeToUTC(newValue)
  },
)

watch(
  () => coordinates.value,
  (newValue) => {
    if (!newValue) return
    formData.place = JSON.stringify(newValue)
  },
)

onDeactivated(() => {
  clearForm()
})
onUnmounted(() => {
  clearForm()
})
</script>

<template>
  <div class="mt-10 w-full min-h-30 text-base-dark bg-white shadow-md p-5 rounded-b-sm">
    <h1
      class="text-2xl relative inline-block before:absolute before:w-full before:left-0 before:top-[100%] before:h-[2px] before:block before:bg-primary mb-5"
    >
      Create
    </h1>

    <form novalidate @submit.prevent="submit">
      <BaseInput
        v-model="formData.title"
        class="mb-4"
        :label="'Title *: '"
        :type="'text'"
        :error-message="errorMessages.title"
        @blur="validateField('title', formData.title)"
      ></BaseInput>
      <BaseTextarea
        v-model="formData.description"
        class="mb-4"
        :label="'Description: '"
      ></BaseTextarea>
      <BaseSelect
        v-model="formData.status"
        class="mb-4"
        :label="'Status *: '"
        :placeholder="'Select an option'"
        :error-message="errorMessages.status"
        @update:model-value="validateField('status', formData.status)"
        :options="options"
      ></BaseSelect>
      <BaseCheckbox
        class="mb-4"
        v-model="addDeadline"
        :label="'Have this task a deadline?'"
      ></BaseCheckbox>
      <Transition name="brand-fade">
        <BaseInput
          v-show="addDeadline"
          class="mb-4"
          v-model="dateTime"
          :label="'Deadline: '"
          :type="'datetime-local'"
        ></BaseInput>
      </Transition>
      <BaseCheckbox
        class="mb-4"
        v-model="addPlace"
        :label="'Have this task a place?'"
      ></BaseCheckbox>
      <TransitionGroup name="brand-fade">
        <p class="text-sm font-medium mb-1" v-if="addPlace">Place:</p>
        <BaseMap :editable="true" class="mb-4" v-model="coordinates" v-if="addPlace"></BaseMap>
      </TransitionGroup>
      <BaseButton :loading="loading" :disabled="loading" class="w-full" :type="'submit'"
        >Submit</BaseButton
      >
    </form>
  </div>
</template>
