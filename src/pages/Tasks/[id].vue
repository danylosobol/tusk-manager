<script setup>
import BaseMap from '@/components/ui/BaseMap.vue'
import BaseToggle from '@/components/ui/BaseToggle.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useApi } from '@/composable/useApi'
import { useAppStore } from '@/stores/app'
import api from '@/api'
import { formatter } from '@/utils/formatter'
import { validator } from '@/utils/validator'
import { statuses } from '@/utils/enums'

const { data, error, loading, fetchData } = useApi()
const appStore = useAppStore()
const formData = ref({})
const route = useRoute()
const wasEdited = ref(false)
const task = ref({})

const getTask = async (id) => {
  task.value = {}
  await fetchData(api.collection.getById('tasks', id))

  if (error.value && error.value.message) {
    appStore.addMessage({
      type: 'error',
      text: error.value.message,
    })
    return
  }

  if (data.value) {
    task.value = data.value
  } else {
    appStore.addMessage({
      type: 'error',
      text: 'Task not found.',
    })
  }
}

const updateData = (field, value) => {
  formData.value[field] = value
  task.value[field] = value // Синхронізуємо з task
  wasEdited.value = true
}

const updateField = async (submit, validator = null, erroMessage = null) => {
  if (submit || !wasEdited.value) {
    return
  }

  if (
    wasEdited.value &&
    validator &&
    typeof validator === 'function' &&
    !validator(formData.value[Object.keys(formData.value)[0]])
  ) {
    if (erroMessage) {
      appStore.addMessage({
        type: 'error',
        text: erroMessage,
      })
    }
    return
  }

  await fetchData(api.collection.update('tasks', task.value.$id, formData.value))
  if (error.value && error.value.message) {
    appStore.addMessage({
      type: 'error',
      text: error.value.message,
    })
    return
  }

  if (data.value) {
    task.value = data.value
  }
  formData.value = {}
  wasEdited.value = false
}

onMounted(async () => {
  await getTask(route.params.id)
})

onBeforeRouteUpdate(async (to) => {
  await getTask(to.params.id)
})
</script>

<template>
  <div class="mt-10 w-full min-h-30 text-base-dark bg-white shadow-md p-5 rounded-b-sm">
    <p class="text-sm mb-2" v-if="task.status">
      Status:
      <BaseToggle
        @toggle="
          (state) => updateField(state, (value) => validator.notEmpty(value), 'Choose an option')
        "
      >
        <template #default>
          <span :class="{ 'h-9 bg-gray-300 rounded animate-pulse': loading }">
            {{ formatter.enum(task.status) }}</span
          >
        </template>
        <template #editing>
          <BaseSelect
            :model-value="formData.status || task.status"
            @update:model-value="(value) => updateData('status', value)"
            :options="
              Array.from(statuses).map((status) => ({
                value: status,
                label: formatter.enum(status),
              }))
            "
          ></BaseSelect>
        </template>
      </BaseToggle>
    </p>
    <BaseToggle
      v-if="task.title"
      @toggle="
        (state) =>
          updateField(state, (value) => validator.notEmpty(value), 'Title should not be empty')
      "
      class="inline-block mb-5 min-w-10"
    >
      <template #default>
        <h1
          :class="{ 'h-9 bg-gray-300 rounded animate-pulse text-transparent': loading }"
          class="text-2xl relative inline-block before:absolute before:w-full before:left-0 before:top-[100%] before:h-[2px] before:block before:bg-primary"
        >
          {{ task.title }}
        </h1>
      </template>
      <template #editing>
        <BaseInput
          :model-value="formData.title || task.title"
          @update:model-value="(value) => updateData('title', value)"
        ></BaseInput>
      </template>
    </BaseToggle>
    <h2>Description:</h2>
    <BaseToggle class="mb-5" @toggle="(state) => updateField(state)">
      <template #default>
        <p
          :class="{
            'h-9 bg-gray-300 rounded animate-pulse text-transparent': loading,
          }"
        >
          {{ task.description !== '' ? task.description : 'No description' }}
        </p>
      </template>
      <template #editing>
        <BaseTextarea
          :model-value="formData.description || task.description"
          @update:model-value="(value) => updateData('description', value)"
        ></BaseTextarea>
      </template>
    </BaseToggle>
    <h2>Location:</h2>
    <BaseToggle class="mb-5" @toggle="(state) => updateField(state)">
      <template #default>
        <BaseMap
          v-if="task.place"
          :model-value="task.place ? JSON.parse(task.place) : null"
          :height="240"
        ></BaseMap>
        <p v-else>No place selected</p>
      </template>
      <template #editing>
        <BaseMap
          :editable="true"
          @update:model-value="(value) => updateData('place', JSON.stringify(value))"
          :height="240"
        ></BaseMap>
      </template>
    </BaseToggle>
    <h2>Deadline:</h2>
    <BaseToggle class="mb-5" @toggle="(state) => updateField(state)">
      <template #default>
        <p
          :class="{
            'h-9 bg-gray-300 rounded animate-pulse text-transparent': loading,
          }"
        >
          {{ task.deadline ? formatter.UTCtoLocalTime(task.deadline) : 'No deadline' }}
        </p>
      </template>
      <template #editing>
        <BaseInput
          :type="'datetime-local'"
          :model-value="formData.deadline || task.deadline"
          @update:model-value="(value) => updateData('deadline', value)"
        ></BaseInput>
      </template>
    </BaseToggle>
  </div>
</template>
