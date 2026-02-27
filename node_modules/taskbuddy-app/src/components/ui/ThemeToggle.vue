<script setup>
import { useTheme } from '../../composables/useTheme'

const { theme, setTheme } = useTheme()

function nextMode(curr) {
  if (curr === 'system') return 'light'
  if (curr === 'light') return 'dark'
  return 'system'
}

function cycle() {
  setTheme(nextMode(theme.value))
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
    @click="cycle"
    :aria-label="`Theme: ${theme}. Click to change.`"
  >
    <span class="sr-only">Toggle theme</span>
    <span aria-hidden="true" class="text-base leading-none">◐</span>
    <span class="hidden sm:inline">Theme: {{ theme }}</span>
  </button>
</template>

