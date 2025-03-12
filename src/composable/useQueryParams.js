import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useQueryParams = () => {
  const router = useRouter()
  const route = useRoute()

  const getQueryParameter = (key, defaultValue = null) => {
    return !route.query[key] ? defaultValue : route.query[key]
  }

  const updateQueryParam = (key, value) => {
    const query = { ...route.query }
    if (value) {
      query[key] = value.toString()
    } else {
      delete query[key]
    }
    router.push({ query })
  }

  const removeQueryParam = (key) => {
    updateQueryParam(key, null)
  }

  const clearQueryParams = () => {
    router.push({ query: {} })
  }

  const updateNestedParams = (prefix, newParams) => {
    const query = { ...route.query }

    Object.keys(query).forEach((key) => {
      if (key.startsWith(`${prefix}[`)) {
        delete query[key]
      }
    })

    if (newParams && typeof newParams === 'object' && Object.keys(newParams).length > 0) {
      for (const [key, value] of Object.entries(newParams)) {
        query[`${prefix}[${key}]`] = value
      }
    }

    router.push({ query })
  }

  const getNestedParams = (prefix) => {
    const nestedParams = {}
    Object.keys(route.query).forEach((key) => {
      if (key.startsWith(`${prefix}[`)) {
        const field = key.replace(`${prefix}[`, '').replace(']', '')
        const value = route.query[key]
        nestedParams[field] = value
      }
    })
    return nestedParams
  }

  const queryParams = computed(() => ({ ...route.query }))

  return {
    queryParams,
    getQueryParameter,
    updateQueryParam,
    removeQueryParam,
    clearQueryParams,
    updateNestedParams,
    getNestedParams,
  }
}
