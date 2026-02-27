import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { readJson, remove, writeJson } from '../utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value))
  const displayName = computed(() => user.value?.name || user.value?.email || 'User')
  const role = computed(() => user.value?.role ?? 'parent')

  function loadFromStorage() {
    const saved = readJson('auth', null)
    token.value = saved?.token ?? null
    user.value = saved?.user ?? null
  }

  function login({ email }) {
    token.value = `demo.${crypto.randomUUID?.() ?? String(Date.now())}`
    user.value = {
      id: user.value?.id ?? (crypto.randomUUID?.() ?? String(Date.now())),
      name: user.value?.name ?? email?.split('@')?.[0] ?? 'User',
      email,
      bio: user.value?.bio ?? '',
      role: user.value?.role ?? 'parent',
    }
  }

  function register({ name, email, role: preferredRole }) {
    token.value = `demo.${crypto.randomUUID?.() ?? String(Date.now())}`
    user.value = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      name,
      email,
      role: preferredRole || 'student',
      bio: '',
    }
  }

  function updateBio(bio) {
    if (!user.value) return
    user.value = { ...user.value, bio }
  }

  function updateName(name) {
    if (!user.value) return
    user.value = { ...user.value, name }
  }

  function updateRole(nextRole) {
    if (!user.value) return
    if (!['student', 'parent', 'visually-impaired'].includes(nextRole)) return
    user.value = { ...user.value, role: nextRole }
  }

  function logout() {
    token.value = null
    user.value = null
    remove('auth')
  }

  watch(
    () => ({ token: token.value, user: user.value }),
    (value) => {
      if (!value.token) {
        remove('auth')
        return
      }
      writeJson('auth', value)
    },
    { deep: true }
  )

  return {
    token,
    user,
    isAuthenticated,
    displayName,
    role,
    loadFromStorage,
    login,
    register,
    updateBio,
    updateName,
    updateRole,
    logout,
  }
})

