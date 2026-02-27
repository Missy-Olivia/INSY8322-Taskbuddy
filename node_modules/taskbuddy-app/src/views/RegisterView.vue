<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
const error = ref('')

function submit() {
  error.value = ''
  const n = name.value.trim()
  const e = email.value.trim()
  if (!n) {
    error.value = 'Name is required.'
    return
  }
  if (!e) {
    error.value = 'Email is required.'
    return
  }

  auth.register({ name: n, email: e, password: password.value, role: role.value })
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <section class="mx-auto grid max-w-xl gap-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">
        TaskBuddy uses a demo auth flow for the course project (stored locally).
      </p>
    </header>

    <form
      class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
      @submit.prevent="submit"
      novalidate
    >
      <div class="grid gap-4">
        <div>
          <label for="name" class="block text-sm font-medium">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="name"
            class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
            placeholder="Your name"
            required
          />
        </div>

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
            autocomplete="new-password"
            class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
            placeholder="••••••••"
          />
        </div>

        <fieldset class="mt-1 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <legend class="px-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">I’m mostly using TaskBuddy as a…</legend>
          <div class="mt-2 grid gap-2 text-sm text-zinc-700 dark:text-zinc-200">
            <label class="flex items-center gap-2">
              <input
                v-model="role"
                type="radio"
                value="student"
                class="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-white/30"
              />
              <span>Student</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="role"
                type="radio"
                value="parent"
                class="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-white/30"
              />
              <span>Parent / caregiver</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="role"
                type="radio"
                value="visually-impaired"
                class="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-white/30"
              />
              <span>Visually impaired user</span>
            </label>
          </div>
        </fieldset>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400" role="alert">
          {{ error }}
        </p>

        <button
          type="submit"
          class="inline-flex justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
        >
          Create account
        </button>

        <p class="text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?
          <RouterLink class="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100" to="/login">
            Sign in
          </RouterLink>
        </p>
      </div>
    </form>
  </section>
</template>

