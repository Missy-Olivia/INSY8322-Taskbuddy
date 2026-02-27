<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskCard from '../components/tasks/TaskCard.vue'
import TaskForm from '../components/tasks/TaskForm.vue'
import TaskEditDialog from '../components/tasks/TaskEditDialog.vue'
import { useTasksStore } from '../stores/tasks'

const tasksStore = useTasksStore()
const route = useRoute()
const router = useRouter()

const banner = ref('')
const editingTaskId = ref(null)
const selectedCategory = ref('all')

const currentFilter = computed(() => {
  const f = route.params.filter
  return typeof f === 'string' ? f : 'all'
})

watch(
  currentFilter,
  (f) => {
    const allowed = new Set(['all', 'todo', 'completed'])
    const next = allowed.has(f) ? f : 'all'
    tasksStore.setFilter(next)
    if (next !== f) router.replace({ name: 'dashboard' })
  },
  { immediate: true }
)

const filterLabel = computed(() => {
  if (tasksStore.filter === 'todo') return 'To do'
  if (tasksStore.filter === 'completed') return 'Completed'
  return 'All'
})

const categories = computed(() => {
  const base = ['Work', 'School', 'Personal', 'Family', 'Health', 'Other']
  const set = new Set(base)
  for (const t of tasksStore.tasks) {
    if (t.category) set.add(t.category)
  }
  return Array.from(set).sort()
})

const visibleTasks = computed(() => {
  const base = tasksStore.filteredTasks
  if (selectedCategory.value === 'all') return base
  return base.filter((t) => t.category === selectedCategory.value)
})

function toFilter(f) {
  if (f === 'all') return { name: 'dashboard' }
  return { name: 'dashboard', params: { filter: f } }
}

function addTask(payload) {
  banner.value = ''
  try {
    tasksStore.addTask(payload)
    banner.value = 'Task added.'
  } catch (e) {
    banner.value = e?.message ?? 'Unable to add task.'
  }
}

function clearCompleted() {
  tasksStore.clearCompleted()
  banner.value = 'Completed tasks cleared.'
}

const editingTask = computed(() => tasksStore.tasks.find((t) => t.id === editingTaskId.value) ?? null)

function openEdit(id) {
  editingTaskId.value = id
}

function closeEdit() {
  editingTaskId.value = null
}

function saveEdit(updates) {
  if (!editingTask.value) return
  try {
    tasksStore.updateTask(editingTask.value.id, updates)
    banner.value = 'Task updated.'
    closeEdit()
  } catch (e) {
    banner.value = e?.message ?? 'Unable to update task.'
  }
}

function readTasksAloud() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    banner.value = 'Read aloud is not available in this browser.'
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()

  const tasks = visibleTasks.value
  if (!tasks.length) {
    const utterance = new SpeechSynthesisUtterance('You have no tasks in this view.')
    synth.speak(utterance)
    return
  }

  const parts = tasks.map((t, index) => {
    const status = t.status === 'completed' ? 'completed' : 'to do'
    const category = t.category || 'personal'
    const due = t.dueDate ? `due ${t.dueDate}` : 'no due date'
    return `Task ${index + 1}: ${t.title}, ${status}, category ${category}, ${due}.`
  })

  const utterance = new SpeechSynthesisUtterance(parts.join(' '))
  synth.speak(utterance)
}
</script>

<template>
  <section class="grid gap-5">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p class="text-sm text-zinc-600 dark:text-zinc-400">
          Viewing: <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ filterLabel }}</span>
        </p>
        <p v-if="selectedCategory !== 'all'" class="text-xs text-zinc-600 dark:text-zinc-400">
          Category: <span class="font-medium">{{ selectedCategory }}</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <RouterLink
          :to="toFilter('all')"
          class="rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white"
          :class="
            tasksStore.filter === 'all'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900'
          "
        >
          All
        </RouterLink>
        <RouterLink
          :to="toFilter('todo')"
          class="rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white"
          :class="
            tasksStore.filter === 'todo'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900'
          "
        >
          To do
        </RouterLink>
        <RouterLink
          :to="toFilter('completed')"
          class="rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white"
          :class="
            tasksStore.filter === 'completed'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900'
          "
        >
          Completed
        </RouterLink>

        <button
          v-if="tasksStore.hasCompleted"
          type="button"
          class="ml-0 inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus-visible:outline-white sm:ml-2"
          @click="clearCompleted"
        >
          Clear completed
        </button>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus-visible:outline-white"
          @click="readTasksAloud"
        >
          <span aria-hidden="true">🔈</span>
          <span class="ml-1">Read tasks aloud</span>
        </button>
      </div>
    </header>

    <TaskForm @submit-task="addTask" />

    <p v-if="banner" class="text-sm text-zinc-700 dark:text-zinc-300" role="status" aria-live="polite">
      {{ banner }}
    </p>

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="rounded-xl px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white"
        :class="
          selectedCategory === 'all'
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900'
        "
        @click="selectedCategory = 'all'"
      >
        All categories
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        class="rounded-xl px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white"
        :class="
          selectedCategory === cat
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900'
        "
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="grid gap-3">
      <TaskCard
        v-for="t in visibleTasks"
        :key="t.id"
        :task="t"
        @status-change="tasksStore.toggleTask"
        @delete="tasksStore.deleteTask"
        @edit="openEdit"
      />

      <div
        v-if="tasksStore.filteredTasks.length === 0"
        class="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
      >
        <p class="font-medium text-zinc-900 dark:text-zinc-100">No tasks here.</p>
        <p class="mt-1">Add a task above, or switch filters.</p>
      </div>
    </div>

    <TaskEditDialog
      :open="Boolean(editingTask)"
      :task="editingTask"
      @close="closeEdit"
      @save="saveEdit"
    />
  </section>
</template>

