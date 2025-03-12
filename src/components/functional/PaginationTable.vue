<script setup>
import { defineEmits, defineProps, ref, computed } from 'vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  total: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selection: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:currentPage', 'update:selection', 'update:sort'])
const rows = computed(() => props.rows)
const columns = computed(() => props.columns)
const selectAll = ref(false)
const selectedRowIds = ref({})
const selectedRows = computed(() => props.rows.filter((row) => selectedRowIds.value[row.$id]))

const sortableColumns = computed(() =>
  props.columns.reduce((acc, { name, sort }) => {
    if (sort?.enable) {
      acc[name] = sort.default || undefined
    }
    return acc
  }, {}),
)

const toggleRowSelection = (rowId) => {
  selectedRowIds.value[rowId] = !selectedRowIds.value[rowId]
  selectAll.value =
    Object.keys(selectedRowIds.value).filter((key) => selectedRowIds.value[key]).length ===
    props.rows.length
  emit('update:selection', selectedRows.value)
}

const toggleSelectAll = (value) => {
  props.rows.forEach((row, index) => {
    selectedRowIds.value[row.$id || index] = value
  })
  emit('update:selection', selectedRows.value)
}

const toggleSort = (column) => {
  if (sortableColumns.value[column] === 'ASC') {
    sortableColumns.value[column] = 'DESC'
  } else if (sortableColumns.value[column] === 'DESC') {
    sortableColumns.value[column] = undefined
  } else {
    sortableColumns.value[column] = 'ASC'
  }
  emit('update:sort', sortableColumns.value)
}

const getSortSymbol = (type) => {
  return type === 'ASC' ? '&#8593;' : type === 'DESC' ? '&#8595;' : '&#8597;'
}
</script>

<template>
  <template v-if="rows.length > 0">
    <table class="w-full border-1 border-primary">
      <thead class="border-b-1 border-primary" v-if="columns.length > 0">
        <tr>
          <th style="width: 20px" class="p-2" v-if="props.selection">
            <BaseCheckbox @update:model-value="toggleSelectAll" v-model="selectAll"></BaseCheckbox>
          </th>
          <th
            class="text-left p-2 border-r-1 border-primary"
            v-for="col in columns"
            :key="col.name"
            :style="col.style"
          >
            <slot :name="`header-${col.name}`">
              {{ col.label }}
            </slot>

            <span
              v-if="col.sort && col.sort.enable"
              @click="() => toggleSort(col.name)"
              class="cursor-pointer select-none ml-1"
              v-html="getSortSymbol(sortableColumns[col.name])"
            ></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in loading ? Array(5).fill({}) : rows"
          :key="loading ? row + Math.random() : row.$id || index"
          class="border-b border-primary"
        >
          <td class="p-2" v-if="props.selection">
            <BaseCheckbox
              :model-value="selectedRowIds[row.$id || index]"
              @update:modelValue="() => toggleRowSelection(row.$id || index)"
            ></BaseCheckbox>
          </td>
          <td v-for="col in columns" :key="col.name" class="p-2 border-r border-primary">
            <div v-if="loading" class="h-9 bg-gray-300 rounded animate-pulse"></div>
            <slot v-else :name="`cell-${col.name}`" :row="row">{{ row[col.field] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <BasePagination
      v-if="props.total > rows.length"
      @update:current-page="(page) => emit('update:currentPage', page)"
      :total="props.total"
      :page="props.page"
      :per-page="props.perPage"
    ></BasePagination>
  </template>
  <p v-else>No data founded</p>
</template>
