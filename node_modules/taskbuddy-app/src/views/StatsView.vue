<script setup>
import { computed } from 'vue'
import { useTasksStore } from '../stores/tasks'

const tasks = useTasksStore()

const total = computed(() => tasks.tasks.length)
const completed = computed(() => tasks.completedCount)
const todo = computed(() => tasks.todoCount)
const completionRate = computed(() => {
  if (total.value === 0) return 0
  return Math.round((completed.value / total.value) * 100)
})

const byCategory = computed(() => {
  const map = new Map()
  for (const t of tasks.tasks) {
    const key = t.category || 'Uncategorized'
    const current = map.get(key) ?? { total: 0, completed: 0 }
    current.total += 1
    if (t.status === 'completed') current.completed += 1
    map.set(key, current)
  }
  return Array.from(map.entries())
})

const byPriority = computed(() => {
  const map = new Map([
    ['high', { label: 'High', total: 0 }],
    ['medium', { label: 'Medium', total: 0 }],
    ['low', { label: 'Low', total: 0 }],
  ])
  for (const t of tasks.tasks) {
    const key = t.priority || 'medium'
    const current = map.get(key) ?? { label: key, total: 0 }
    current.total += 1
    map.set(key, current)
  }
  return Array.from(map.entries())
})

const allTasks = computed(() =>
  tasks.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status === 'completed' ? 'Completed' : 'To do',
    category: t.category || 'Uncategorized',
    priority:
      t.priority === 'high' ? 'High' : t.priority === 'low' ? 'Low' : 'Medium',
    dueDate: t.dueDate || '—',
  }))
)
</script>

<template>
  <section class="grid gap-5">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">Stats</h1>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">A quick overview of your tasks.</p>
    </header>

    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
        <div class="text-sm text-zinc-600 dark:text-zinc-400">Total</div>
        <div class="mt-1 text-2xl font-semibold">{{ total }}</div>
      </div>
      <div class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
        <div class="text-sm text-zinc-600 dark:text-zinc-400">To do</div>
        <div class="mt-1 text-2xl font-semibold">{{ todo }}</div>
      </div>
      <div class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
        <div class="text-sm text-zinc-600 dark:text-zinc-400">Completed</div>
        <div class="mt-1 text-2xl font-semibold">{{ completed }}</div>
      </div>
    </div>

    <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-sm font-medium">Completion rate</div>
          <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {{ completionRate }}% of tasks are completed
          </div>
        </div>
        <div class="text-2xl font-semibold tabular-nums">{{ completionRate }}%</div>
      </div>

      <div class="mt-4 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-900" role="progressbar" :aria-valuenow="completionRate" aria-valuemin="0" aria-valuemax="100">
        <div class="h-2 rounded-full bg-zinc-900 transition-all dark:bg-white" :style="{ width: `${completionRate}%` }" />
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">By category</h2>
        <p class="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          How many tasks you have in each area of your life.
        </p>
        <table class="mt-3 w-full border-separate border-spacing-y-1">
          <thead class="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <tr>
              <th scope="col" class="text-left">Category</th>
              <th scope="col" class="text-right">Total</th>
              <th scope="col" class="text-right">Completed</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="byCategory.length === 0">
              <td colspan="3" class="py-2 text-xs text-zinc-600 dark:text-zinc-400">
                No tasks yet. Add some from the dashboard to see category stats.
              </td>
            </tr>
            <tr
              v-for="[cat, info] in byCategory"
              :key="cat"
              class="text-xs"
            >
              <th scope="row" class="text-left font-medium text-zinc-800 dark:text-zinc-100">
                {{ cat }}
              </th>
              <td class="text-right tabular-nums text-zinc-700 dark:text-zinc-200">
                {{ info.total }}
              </td>
              <td class="text-right tabular-nums text-zinc-700 dark:text-zinc-200">
                {{ info.completed }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">By priority</h2>
        <p class="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          How many tasks are high, medium, or low priority.
        </p>
        <table class="mt-3 w-full border-separate border-spacing-y-1">
          <thead class="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <tr>
              <th scope="col" class="text-left">Priority</th>
              <th scope="col" class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="byPriority.length === 0">
              <td colspan="2" class="py-2 text-xs text-zinc-600 dark:text-zinc-400">
                No tasks yet. Add some with different priorities to see this breakdown.
              </td>
            </tr>
            <tr
              v-for="[key, info] in byPriority"
              :key="key"
              class="text-xs"
            >
              <th scope="row" class="text-left font-medium text-zinc-800 dark:text-zinc-100">
                {{ info.label }}
              </th>
              <td class="text-right tabular-nums text-zinc-700 dark:text-zinc-200">
                {{ info.total }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">All tasks</h2>
      <p class="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
        Detailed list of your tasks with status, category, priority, and due date.
      </p>

      <div v-if="allTasks.length === 0" class="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        You don’t have any tasks yet. Add some from the dashboard to see them here.
      </div>

      <div v-else class="mt-3 max-h-72 overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table class="w-full border-separate border-spacing-y-1 text-xs">
          <thead class="sticky top-0 bg-white text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th scope="col" class="px-3 py-2 text-left">Title</th>
              <th scope="col" class="px-3 py-2 text-left">Status</th>
              <th scope="col" class="px-3 py-2 text-left">Category</th>
              <th scope="col" class="px-3 py-2 text-left">Priority</th>
              <th scope="col" class="px-3 py-2 text-left">Due</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in allTasks"
              :key="task.id"
              class="align-top"
            >
              <th scope="row" class="px-3 py-1.5 text-left font-medium text-zinc-900 dark:text-zinc-100">
                {{ task.title }}
              </th>
              <td class="px-3 py-1.5 text-zinc-700 dark:text-zinc-200">
                {{ task.status }}
              </td>
              <td class="px-3 py-1.5 text-zinc-700 dark:text-zinc-200">
                {{ task.category }}
              </td>
              <td class="px-3 py-1.5 text-zinc-700 dark:text-zinc-200">
                {{ task.priority }}
              </td>
              <td class="px-3 py-1.5 text-zinc-700 dark:text-zinc-200">
                {{ task.dueDate }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

