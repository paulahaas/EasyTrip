import { useState, useRef, type KeyboardEvent } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  disabled?: boolean
}

export function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSearch() {
    if (value.trim()) onSearch(value.trim())
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div
      className="flex items-center gap-0 mb-7 rounded-xl overflow-hidden transition-shadow"
      style={{
        background: '#16181f',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="pl-4 flex items-center shrink-0" style={{ color: '#4e5468' }}>
        <Search size={17} />
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Busque por clima, idioma, região, país..."
        disabled={disabled}
        className="flex-1 bg-transparent h-12 px-3 text-sm outline-none placeholder:text-muted2"
        style={{ color: '#f0f2f8' }}
      />
      <button
        type="button"
        onClick={handleSearch}
        disabled={disabled || !value.trim()}
        className="shrink-0 h-12 px-5 text-sm font-semibold rounded-none transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)', color: '#0e0f14' }}
      >
        Buscar
      </button>
    </div>
  )
}
