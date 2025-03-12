<script setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ref,
  defineEmits,
  defineProps,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  shallowRef,
} from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
  height: {
    type: Number,
    default: () => 500,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'initialized'])
const marker = ref(null)

const mapCoordinates = computed({
  get: () => {
    if (!props.modelValue || !props.modelValue.latitude || !props.modelValue.longitude) {
      return { latitude: 50.4501, longitude: 30.5234 }
    }
    return props.modelValue
  },
  set: (value) => emit('update:modelValue', value),
})

const setMapEvent = () => {
  mapInstance.value.on('click', (event) => {
    addMarker(event.latlng.lat, event.latlng.lng)
    mapCoordinates.value = { latitude: event.latlng.lat, longitude: event.latlng.lng }
  })
}

const addMarker = (latitude, longitude) => {
  if (marker.value) {
    mapInstance.value.removeLayer(marker.value)
  }
  marker.value = new L.Marker({ lat: latitude, lng: longitude })
  mapInstance.value.addLayer(marker.value)
}

const mapElement = ref(null)
const mapInstance = shallowRef(null)

const initiliazeMap = () => {
  if (mapInstance.value || !mapElement.value) {
    return
  }

  mapInstance.value = L.map(mapElement.value, {
    maxZoom: 18,
    minZoom: 1,
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
  }).setView([mapCoordinates.value.latitude, mapCoordinates.value.longitude], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(mapInstance.value)

  if (props.modelValue) {
    addMarker(mapCoordinates.value.latitude, mapCoordinates.value.longitude)
  }

  emit('initialized', mapInstance.value)
  if (props.editable) {
    setMapEvent()
  }
}

onMounted(async () => {
  await nextTick()
  initiliazeMap()
})

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
})
</script>

<template>
  <div class="relative z-0">
    <div :style="{ height: height + 'px' }" class="relative" ref="mapElement"></div>
  </div>
</template>
