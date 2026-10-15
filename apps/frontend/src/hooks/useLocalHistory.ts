import { useState } from 'react'

const STORAGE_KEY = 'easytrip:search-history'
const MAX_ITEMS = 8

function load(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(items: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useLocalHistory() {
  const [history, setHistory] = useState<string[]>(load)

  function add(query: string) {
    setHistory((prev) => {
      const deduped = [
        query,
        ...prev.filter((q) => q.toLowerCase() !== query.toLowerCase()),
      ]
      const next = deduped.slice(0, MAX_ITEMS)
      save(next)
      return next
    })
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }

  return { history, add, clear }
}
