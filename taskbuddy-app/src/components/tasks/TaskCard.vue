<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete', 'status-change', 'share', 'edit'])

function priorityLabel(p) {
  if (p === 'high') return 'High'
  if (p === 'low') return 'Low'
  return 'Medium'
}

function priorityClass(p) {
  if (p === 'high') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200'
  if (p === 'low') return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
  return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200'
}

function onToggle() {
  emit('status-change', task.id)
}
</script>

<template>
  <article
    class="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-900 dark:bg-zinc-950 dark:hover:border-zinc-800"
  >
    <div class="flex items-start gap-3">
      <div class="pt-0.5">
        <input
          :id="`task-${task.id}`"
          type="checkbox"
          class="size-5 rounded border-zinc-300 text-zinc-900 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-white/10"
          :checked="task.status === 'completed'"
          @change="onToggle"
          :aria-label="task.status === 'completed' ? 'Mark as to do' : 'Mark as completed'"
        />
      </div>

      <div class="min-w-0 flex-1">
        <label
          :for="`task-${task.id}`"
          class="block cursor-pointer text-sm font-medium text-zinc-900 dark:text-zinc-100"
          :class="task.status === 'completed' ? 'line-through opacity-60' : ''"
        >
          {{ task.title }}
        </label>

        <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span
            class="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200"
          >
            {{ task.status === 'completed' ? 'Completed' : 'To do' }}
          </span>

          <span
            class="inline-flex items-center rounded-full border px-2 py-0.5 font-medium"
            :class="priorityClass(task.priority)"
          >
            Priority: {{ priorityLabel(task.priority) }}
          </span>

          <span
            class="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
          >
            {{ task.category || 'Personal' }}
          </span>

          <span v-if="task.dueDate" class="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
            <span aria-hidden="true">📅</span>
            Due {{ task.dueDate }}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center rounded-lg px-2 py-1 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:focus-visible:outline-white"
        @click="emit('edit', task.id)"
      >
        <span aria-hidden="true">✎</span>
        <span class="sr-only">Edit task</span>
      </button>

      <button
        type="button"
        class="inline-flex items-center rounded-lg px-2 py-1 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:focus-visible:outline-white"
        @click="emit('delete', task.id)"
        :aria-label="`Delete task: ${task.title}`"
      >
        <span aria-hidden="true">🗑</span>
      </button>
    </div>
  </article>
</template>

