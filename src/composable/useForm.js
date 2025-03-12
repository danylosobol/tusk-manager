import { reactive, ref } from 'vue'

export const useForm = (initialFields = {}, rules = {}) => {
  const formData = reactive({ ...initialFields })
  const errorMessages = reactive({})
  const isFormValid = ref(false)

  const validateField = (fieldName, value) => {
    const rule = rules[fieldName]
    if (rule) {
      const result = rule(value)
      errorMessages[fieldName] = typeof result === 'string' ? result : ''
      return !result || typeof result === 'boolean'
    }
    return true
  }

  const validateForm = () => {
    let isValid = true
    for (const fieldName in rules) {
      const fieldIsValid = validateField(fieldName, formData[fieldName])
      if (!fieldIsValid) {
        isValid = false
      }
    }
    isFormValid.value = isValid
    return isValid
  }

  const resetForm = () => {
    isFormValid.value = false
    Object.assign(formData, initialFields)
    for (const fieldName in errorMessages) {
      errorMessages[fieldName] = ''
    }
  }

  return {
    formData,
    errorMessages,
    isFormValid,
    validateForm,
    validateField,
    resetForm,
  }
}
