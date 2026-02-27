const PREFIX = 'taskbuddy:'

function key(name) {
  return `${PREFIX}${name}`
}

export function readJson(name, fallback) {
  try {
    const raw = localStorage.getItem(key(name))
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(name, value) {
  localStorage.setItem(key(name), JSON.stringify(value))
}

export function remove(name) {
  localStorage.removeItem(key(name))
}

