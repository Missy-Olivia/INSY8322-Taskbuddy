<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: false,
    default: null,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const localTitle = ref('')
const localCategory = ref('')
const localPriority = ref('medium')
const localDue = ref('')
const error = ref('')

watch(
  () => props.task,
  (t) => {
    if (!t) return
    localTitle.value = t.title ?? ''
    localCategory.value = t.category ?? 'Personal'
    localPriority.value = t.priority ?? 'medium'
    localDue.value = t.dueDate ?? ''
    error.value = ''
  },
  { immediate: true }
)

const headingId = computed(() => 'task-edit-title')

function onSave() {
  error.value = ''
  if (!localTitle.value.trim()) {
    error.value = 'Title is required.'
    return
  }
  emit('save', {
    title: localTitle.value,
    category: localCategory.value,
    priority: localPriority.value,
    dueDate: localDue.value || null,
  })
}
</script>

<template>
  <div
    v-if="open && task"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    role="dialog"
    :aria-labelledby="headingId"
  >
    <div class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      <header class="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 :id="headingId" class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Edit task
          </h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Update the details below, then press Save.
          </p>
        </div>
        <button
          type="button"
          class="rounded-lg px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:focus-visible:outline-white"
          @click="emit('close')"
        >
          <span aria-hidden="true">✕</span>
          <span class="sr-only">Close</span>
        </button>
      </header>

      <form class="grid gap-3" @submit.prevent="onSave" novalidate>
        <div>
          <label for="edit-title" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Title</label>
          <input
            id="edit-title"
            v-model="localTitle"
            type="text"
            class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
          />
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label for="edit-category" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Category</label>
            <input
              id="edit-category"
              v-model="localCategory"
              type="text"
              class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
            />
          </div>

          <div>
            <label for="edit-priority" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Priority</label>
            <select
              id="edit-priority"
              v-model="localPriority"
              class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label for="edit-due" class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Due date</label>
          <input
            id="edit-due"
            v-model="localDue"
            type="date"
            class="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-white/10"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400" role="alert">
          {{ error }}
        </p>

        <div class="mt-2 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            class="inline-flex justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus-visible:outline-white"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex justify-center rounded-xl bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

