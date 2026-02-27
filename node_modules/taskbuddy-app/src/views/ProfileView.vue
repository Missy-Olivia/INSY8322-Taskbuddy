<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTasksStore } from '../stores/tasks'

const auth = useAuthStore()
const tasks = useTasksStore()

const bio = ref(auth.user?.bio ?? '')
const nameInput = ref(auth.user?.name ?? '')
const savedMessage = ref('')

watch(
  () => auth.user?.bio,
  (next) => {
    bio.value = next ?? ''
  }
)

watch(
  () => auth.user?.name,
  (next) => {
    nameInput.value = next ?? ''
  }
)

const email = computed(() => auth.user?.email ?? '')
const name = computed(() => auth.user?.name ?? '')
const role = computed(() => auth.role)
const totalTasks = computed(() => tasks.tasks.length)
const completedTasks = computed(() => tasks.completedCount)
const todoTasks = computed(() => tasks.todoCount)

function save() {
  if (nameInput.value.trim()) {
    auth.updateName(nameInput.value.trim())
  }
  auth.updateBio(bio.value)
  savedMessage.value = 'Profile updated.'
  window.setTimeout(() => {
    savedMessage.value = ''
  }, 1500)
}
</script>

<template>
  <section class="grid gap-5">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">Profile</h1>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">View and update your information.</p>
    </header>

    <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Name</dt>
          <dd class="mt-1">
            <input
              id="name"
              v-model="nameInput"
              type="text"
              class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
            />
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</dt>
          <dd class="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{{ email }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Persona</dt>
          <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
            <span class="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium dark:border-zinc-800 dark:bg-zinc-900/40">
              {{ role }}
            </span>
          </dd>
        </div>
      </dl>

      <div class="mt-6 grid gap-3 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 sm:grid-cols-3">
        <div>
          <div class="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Total tasks</div>
          <div class="mt-1 text-xl font-semibold">{{ totalTasks }}</div>
        </div>
        <div>
          <div class="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">To do</div>
          <div class="mt-1 text-xl font-semibold">{{ todoTasks }}</div>
        </div>
        <div>
          <div class="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Completed</div>
          <div class="mt-1 text-xl font-semibold">{{ completedTasks }}</div>
        </div>
      </div>

      <div class="mt-6">
        <label for="bio" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Bio</label>
        <textarea
          id="bio"
          v-model="bio"
          rows="4"
          class="mt-1 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
          placeholder="Tell us about yourself (optional)…"
        />
      </div>

      <div class="mt-4 flex flex-wrap items-start gap-6">
        <button
          type="button"
          class="inline-flex justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
          @click="save"
        >
          Save changes
        </button>

        <p v-if="savedMessage" class="text-sm text-zinc-700 dark:text-zinc-300" role="status" aria-live="polite">
          {{ savedMessage }}
        </p>

        <fieldset class="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
          <legend class="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Persona</legend>
          <div class="mt-2 grid gap-2">
            <label class="flex items-center gap-2">
              <input
                :checked="role === 'student'"
                type="radio"
                value="student"
                class="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-white/30"
                @change="auth.updateRole('student')"
              />
              <span>Student</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                :checked="role === 'parent'"
                type="radio"
                value="parent"
                class="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-white/30"
                @change="auth.updateRole('parent')"
              />
              <span>Parent / caregiver</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                :checked="role === 'visually-impaired'"
                type="radio"
                value="visually-impaired"
                class="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-white/30"
                @change="auth.updateRole('visually-impaired')"
              />
              <span>Visually impaired user</span>
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  </section>
</template>

