import { ref } from 'vue'

export function useApi() {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async (request) => {
    loading.value = true
    error.value = null
    try {
      const response = await request
      data.value = response
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    fetchData,
  }
}
