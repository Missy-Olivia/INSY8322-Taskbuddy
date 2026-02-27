import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { readJson, writeJson } from '../utils/storage'
import { useAuthStore } from './auth'

function normalizeFilter(filter) {
  if (filter === 'todo' || filter === 'completed') return filter
  return 'all'
}

function normalizePriority(priority) {
  if (priority === 'low' || priority === 'medium' || priority === 'high') return priority
  return 'medium'
}

function normalizeCategory(category) {
  const trimmed = String(category ?? '').trim()
  return trimmed || 'Personal'
}

function isDueDateInPast(dateString) {
  if (!dateString) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${dateString}T00:00:00`)
  return Number.isFinite(due.getTime()) ? due < today : false
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const filter = ref('all')

  const completedCount = computed(() => tasks.value.filter((t) => t.status === 'completed').length)
  const todoCount = computed(() => tasks.value.filter((t) => t.status !== 'completed').length)
  const hasCompleted = computed(() => completedCount.value > 0)

  const filteredTasks = computed(() => {
    const auth = useAuthStore()
    const f = normalizeFilter(filter.value)
    const visible = tasks.value.filter((t) => {
      const isOwner = t.ownerId === auth.user?.id
      const isShared = Array.isArray(t.sharedWith)
        ? t.sharedWith.some((u) => u.userId === auth.user?.id)
        : false
      return isOwner || isShared
    })
    if (f === 'all') return visible
    return visible.filter((t) => t.status === f)
  })

  function loadFromStorage() {
    const saved = readJson('tasks', [])
    const raw = Array.isArray(saved) ? saved : []
    tasks.value = raw.map((t) => ({
      ...t,
      category: normalizeCategory(t?.category),
      priority: normalizePriority(t?.priority),
      dueDate: t?.dueDate || null,
      status: t?.status === 'completed' ? 'completed' : 'todo',
    }))
  }

  function setFilter(next) {
    filter.value = normalizeFilter(next)
  }

  function addTask({ title, dueDate, category, priority }) {
    const trimmed = String(title ?? '').trim()
    if (!trimmed) throw new Error('Task title is required.')
    if (isDueDateInPast(dueDate)) throw new Error('Due date cannot be in the past.')

    const auth = useAuthStore()

    tasks.value.unshift({
      id: crypto.randomUUID?.() ?? String(Date.now()),
      title: trimmed,
      status: 'todo',
      dueDate: dueDate || null,
      category: normalizeCategory(category),
      priority: normalizePriority(priority),
      createdAt: new Date().toISOString(),
      completedAt: null,
      ownerId: auth.user?.id ?? 'anonymous',
      sharedWith: [],
    })
  }

  function toggleTask(id) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx < 0) return
    const curr = tasks.value[idx]
    const nextStatus = curr.status === 'completed' ? 'todo' : 'completed'
    tasks.value[idx] = {
      ...curr,
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? new Date().toISOString() : null,
    }
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function clearCompleted() {
    tasks.value = tasks.value.filter((t) => t.status !== 'completed')
  }

  function updateTask(id, updates) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx < 0) return
    const current = tasks.value[idx]
    const next = {
      ...current,
      ...updates,
    }
    if (next.dueDate && isDueDateInPast(next.dueDate)) {
      throw new Error('Due date cannot be in the past.')
    }
    next.category = normalizeCategory(next.category)
    next.priority = normalizePriority(next.priority)
    tasks.value[idx] = next
  }

  function shareTask(id, { userId, email, canEdit }) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx < 0) return
    const current = tasks.value[idx]
    const existing = Array.isArray(current.sharedWith) ? current.sharedWith : []
    const updatedList = existing.filter((u) => u.userId !== userId)
    updatedList.push({
      userId,
      email,
      canEdit: Boolean(canEdit),
    })
    tasks.value[idx] = {
      ...current,
      sharedWith: updatedList,
    }
  }

  watch(
    tasks,
    (value) => writeJson('tasks', value),
    { deep: true }
  )

  return {
    tasks,
    filter,
    filteredTasks,
    completedCount,
    todoCount,
    hasCompleted,
    loadFromStorage,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    updateTask,
    shareTask,
  }
})

