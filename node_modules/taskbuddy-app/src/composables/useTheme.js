import { computed, ref, watch } from 'vue'
import { readJson, writeJson } from '../utils/storage'

const theme = ref('light') // 'light' | 'dark' | 'system'

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

function applyTheme(mode) {
  const resolved = mode === 'system' ? getSystemTheme() : mode
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function useTheme() {
  const resolvedTheme = computed(() => (theme.value === 'system' ? getSystemTheme() : theme.value))

  function initTheme() {
    const saved = readJson('theme', null)
    if (saved === 'light' || saved === 'dark' || saved === 'system') theme.value = saved
    applyTheme(theme.value)
  }

  function setTheme(next) {
    if (next !== 'light' && next !== 'dark' && next !== 'system') return
    theme.value = next
  }

  watch(
    theme,
    (value) => {
      writeJson('theme', value)
      applyTheme(value)
    },
    { immediate: false }
  )

  return {
    theme,
    resolvedTheme,
    initTheme,
    setTheme,
  }
}

