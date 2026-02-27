import { ref, watch } from 'vue'
import { readJson, writeJson } from '../utils/storage'

const zoom = ref(100) // percentage

function applyZoom(value) {
  const clamped = Math.min(150, Math.max(90, value))
  document.documentElement.style.fontSize = `${clamped}%`
  zoom.value = clamped
}

export function useZoom() {
  function initZoom() {
    const saved = readJson('zoom', 100)
    applyZoom(typeof saved === 'number' ? saved : 100)
  }

  function increase() {
    applyZoom(zoom.value + 10)
  }

  function decrease() {
    applyZoom(zoom.value - 10)
  }

  watch(
    zoom,
    (value) => {
      writeJson('zoom', value)
    },
    { immediate: false }
  )

  return {
    zoom,
    initZoom,
    increase,
    decrease,
  }
}

