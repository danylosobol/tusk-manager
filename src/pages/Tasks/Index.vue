<script setup>
import PaginationTable from '@/components/functional/PaginationTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import api from '@/api'
import { useApi } from '@/composable/useApi'
import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue'
import { formatter } from '@/utils/formatter'
import { useQueryParams } from '@/composable/useQueryParams'

const { queryParams, updateQueryParam, updateNestedParams, getNestedParams, getQueryParameter } =
  useQueryParams()
const { data, loading, error, fetchData } = useApi()
const appStore = useAppStore()
const currentUser = appStore.currentUser
const bulkAction = ref('')
const selected = ref([])
const page = ref(1)
const sort = ref({})
const perPage = ref(5)
const tasks = ref([])
const total = ref(0)

const columns = ref([
  {
    name: 'title',
    label: 'Title',
    field: 'title',
    style: { width: 'calc(100% - 340px)' },
    sort: {
      enable: true,
    },
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    style: { width: '109px' },
    sort: {
      enable: true,
    },
  },
  {
    name: 'actions',
    label: 'Actions',
    style: {
      width: '181px',
    },
  },
])

const updatePage = (newPage) => {
  if (newPage === Number(queryParams.value.page)) {
    return
  }
  page.value = newPage
  updateQueryParam('page', newPage)
  fetchTasks()
}

const updateSort = (newValue) => {
  if (!newValue || typeof newValue !== 'object' || Object.keys(newValue).length === 0) {
    sort.value = {}
  }

  if (!sort.value) {
    sort.value = { orderAsc: [], orderDesc: [] }
  }

  sort.value.orderAsc = []
  sort.value.orderDesc = []

  for (const [key, value] of Object.entries(newValue)) {
    if (value === 'ASC') {
      sort.value.orderAsc.push(key)
    } else if (value === 'DESC') {
      sort.value.orderDesc.push(key)
    }
  }
  updateNestedParams('sort', newValue)
  fetchTasks()
}

const fetchTasks = async () => {
  await fetchData(
    api.collection.getAll('tasks', {
      limit: perPage.value,
      offset: perPage.value * page.value - perPage.value,
      ...sort.value,
      equal: {
        user_id: currentUser.$id,
      },
    }),
  )

  if (error.value && error.value.message) {
    appStore.addMessage({
      type: 'error',
      text: error.value.message,
    })
    return
  }

  if (data.value) {
    tasks.value = data.value?.documents
    total.value = data.value?.total
  }
}

const initializeParams = () => {
  page.value = Number(getQueryParameter('page', 1))
  sort.value = getNestedParams('sort')

  columns.value = columns.value.map((col) => {
    if (col.sort?.enable) {
      col.sort.default = sort.value[col.name] || undefined
    }
    return col
  })
}

const updateSelected = (newValue) => {
  selected.value = newValue
}

const bulkActionHandler = () => {
  if (selected.value.length === 0) {
    appStore.addMessage({
      type: 'info',
      text: 'Please select multiple tasks first.',
    })
    return
  }

  if (bulkAction.value === '') {
    appStore.addMessage({
      type: 'info',
      text: 'Please select any action.',
    })
    return
  }

  switch (bulkAction.value) {
    case 'delete':
      deleteTasks()
      break
  }
}

const deleteTask = async (id, single = false) => {
  const response = await fetchData(api.collection.delete('tasks', id))
  if (!single) {
    return response
  } else {
    if (error.value && error.value.message) {
      appStore.addMessage({
        type: 'error',
        text: error.value.message,
      })
      return
    }
    if (data.value) {
      appStore.addMessage({
        type: 'info',
        text: 'Task was successfully deleted.',
      })
      await fetchTasks()
    }
  }
}

const deleteTasks = async () => {
  try {
    const requests = selected.value.map((task) => deleteTask(task.$id, false))
    const results = await Promise.allSettled(requests)

    const successfulDeletions = results.filter((result) => result.status === 'fulfilled')
    const failedDeletions = results.filter((result) => result.status === 'rejected')

    if (successfulDeletions.length > 0) {
      appStore.addMessage({
        type: 'info',
        text: `Successfully deleted ${successfulDeletions.length} task(s).`,
      })
      await fetchTasks()
      selected.value = []
    }

    if (failedDeletions.length > 0) {
      appStore.addMessage({
        type: 'error',
        text: `Failed to delete ${failedDeletions.length} task(s).`,
      })
    }
  } catch (error) {
    appStore.addMessage({
      type: 'error',
      text: error.message || 'An unexpected error occurred.',
    })
  }
}

onMounted(() => {
  initializeParams()
  fetchTasks()
})
</script>

<template>
  <div class="mt-10 w-full min-h-30 text-base-dark bg-white shadow-md p-5 rounded-b-sm">
    <h1
      class="text-2xl relative inline-block before:absolute before:w-full before:left-0 before:top-[100%] before:h-[2px] before:block before:bg-primary mb-5"
    >
      Tasks
    </h1>

    <div class="flex items-center mb-4">
      <BaseSelect
        class="max-w-50"
        :placeholder="'Select an action'"
        v-model="bulkAction"
        :options="[{ value: 'delete', label: 'Delete' }]"
      ></BaseSelect>
      <BaseButton @click="bulkActionHandler" class="ml-2 py-[9px]">Submit</BaseButton>
    </div>
    <div class="overflow-x-auto">
      <div class="min-w-lg">
        <PaginationTable
          @update:current-page="updatePage"
          :total="total"
          :per-page="perPage"
          :page="page"
          :columns="columns"
          :rows="tasks"
          :loading="loading"
          :selection="true"
          @update:sort="updateSort"
          @update:selection="updateSelected"
        >
          <template #cell-status="{ row }">
            <span>
              {{ formatter.enum(row.status) }}
            </span>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex items-center flex-wrap gap-1">
              <BaseButton :to="{ name: 'Task', params: { id: row.$id } }" class="text-sm px-1"
                >View</BaseButton
              >
              <BaseButton @click="() => deleteTask(row.$id, true)" class="text-sm px-1"
                >Delete</BaseButton
              >
            </div>
          </template>
        </PaginationTable>
      </div>
    </div>
  </div>
</template>
