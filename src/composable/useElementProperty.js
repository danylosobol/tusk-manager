import { ref, onMounted, onUnmounted } from 'vue'

export const useElementProperty = (elementRef, property) => {
  const propertyValue = ref(null)

  const updateProperty = () => {
    if (elementRef.value) {
      propertyValue.value = elementRef.value[property]
    }
  }

  let observer
  onMounted(() => {
    updateProperty()

    if (window.ResizeObserver) {
      observer = new ResizeObserver(updateProperty)
      observer.observe(elementRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return propertyValue
}
