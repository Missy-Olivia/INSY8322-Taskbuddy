<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['submit-task'])

const title = ref('')
const category = ref('Personal')
const priority = ref('medium')
const dueDate = ref('')
const error = ref('')

const canSubmit = computed(() => title.value.trim().length > 0)

function onSubmit() {
  error.value = ''
  if (!canSubmit.value) {
    error.value = 'Please enter a task title.'
    return
  }

  emit('submit-task', {
    title: title.value,
    category: category.value,
    priority: priority.value,
    dueDate: dueDate.value || null,
  })

  title.value = ''
  dueDate.value = ''
  priority.value = 'medium'
}
</script>

<template>
  <form
    class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
    @submit.prevent="onSubmit"
    novalidate
  >
    <div class="grid gap-3 sm:grid-cols-12 sm:items-end">
      <div class="sm:col-span-6">
        <label for="task-title" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Task</label>
        <input
          id="task-title"
          v-model="title"
          type="text"
          autocomplete="off"
          class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-700 dark:focus:ring-white/10"
          placeholder="e.g., Study for quiz"
          :aria-invalid="Boolean(error)"
          :aria-describedby="error ? 'task-error' : undefined"
        />
      </div>

      <div class="sm:col-span-3">
        <label for="task-category" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Category</label>
        <select
          id="task-category"
          v-model="category"
          class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
        >
          <option value="Work">Work</option>
          <option value="School">School</option>
          <option value="Personal">Personal</option>
          <option value="Family">Family</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="sm:col-span-3">
        <label for="task-priority" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Priority</label>
        <select
          id="task-priority"
          v-model="priority"
          class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div class="sm:col-span-4">
        <label for="task-due" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Due (optional)</label>
        <input
          id="task-due"
          v-model="dueDate"
          type="date"
          class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
        />
      </div>

      <div class="sm:col-span-8">
        <button
          type="submit"
          class="inline-flex w-full justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white sm:w-auto"
          :disabled="!canSubmit"
        >
          Add task
        </button>
      </div>
    </div>

    <p v-if="error" id="task-error" class="mt-3 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </form>
</template>

