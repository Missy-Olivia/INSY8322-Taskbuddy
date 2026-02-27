<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')

function submit() {
  error.value = ''
  const e = email.value.trim()
  if (!e) {
    error.value = 'Email is required.'
    return
  }

  auth.login({ email: e, password: password.value })
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  router.push(redirect)
}
</script>

<template>
  <section class="mx-auto grid max-w-xl gap-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">
        Sign in to access your dashboard, stats, and profile.
      </p>
    </header>

    <form
      class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
      @submit.prevent="submit"
      novalidate
    >
      <div class="grid gap-4">
        <div>
          <label for="email" class="block text-sm font-medium">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400" role="alert">
          {{ error }}
        </p>

        <button
          type="submit"
          class="inline-flex justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
        >
          Sign in
        </button>

        <p class="text-sm text-zinc-600 dark:text-zinc-400">
          New here?
          <RouterLink class="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100" to="/register">
            Create an account
          </RouterLink>
        </p>
      </div>
    </form>
  </section>
</template>

