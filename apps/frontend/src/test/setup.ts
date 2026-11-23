import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Node 25+ expõe um `localStorage` global próprio (vazio sem --localstorage-file)
// que encobre o do jsdom. Garante um Storage em memória funcional nos testes.
function memoryStorage(): Storage {
  let data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => {
      data = new Map()
    },
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => {
      data.delete(k)
    },
    setItem: (k, v) => {
      data.set(k, String(v))
    },
  }
}

function storageWorks(): boolean {
  try {
    const s = globalThis.localStorage
    s.setItem('__probe__', '1')
    s.removeItem('__probe__')
    return true
  } catch {
    return false
  }
}

if (!storageWorks()) {
  const storage = memoryStorage()
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true })
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})
