<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    default: 3,
  },
})

const emit = defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const pages = computed(() => {
  const pages = []
  let start = Math.max(1, props.page - Math.floor(props.max / 2))
  let end = Math.min(totalPages.value, start + props.max - 1)

  if (end - start + 1 < props.max) {
    start = Math.max(1, end - props.max + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-center space-x-2">
    <button type="button" class="cursor-pointer" v-if="page > 1" @click="goToPage(page - 1)">
      Previous
    </button>

    <ul class="flex flex-wrap">
      <li v-for="p in pages" :key="p" class="p-2">
        <button
          type="button"
          :class="{ underline: p === page }"
          class="cursor-pointer"
          @click="goToPage(p)"
          :disabled="p === page"
        >
          {{ p }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="cursor-pointer"
      v-if="page < totalPages"
      @click="goToPage(page + 1)"
    >
      Next
    </button>
  </div>
</template>
