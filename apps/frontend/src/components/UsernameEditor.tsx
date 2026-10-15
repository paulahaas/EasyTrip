import { useState, type FormEvent } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfileSchema } from '@easytrip/shared'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'

interface UsernameEditorProps {
  username: string
}

const iconButton =
  'inline-flex items-center justify-center h-7 w-7 rounded-md cursor-pointer transition-colors disabled:opacity-50'

export function UsernameEditor({ username }: UsernameEditorProps) {
  const { updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(username)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function startEditing() {
    setValue(username)
    setError(null)
    setEditing(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = updateProfileSchema.safeParse({ username: value })
    if (!parsed.success) {
      setError('Use 3 a 20 caracteres: letras, números, "_" ou "."')
      return
    }
    if (parsed.data.username === username) {
      setEditing(false)
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateProfile(parsed.data)
      toast.success('Nome de usuário atualizado')
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-1.5">
        <h1
          className="text-xl sm:text-2xl font-normal leading-tight"
          style={{ color: '#f0f2f8' }}
        >
          @{username}
        </h1>
        <button
          type="button"
          onClick={startEditing}
          className={iconButton}
          style={{ color: '#7c8194' }}
          aria-label="Editar nome de usuário"
          title="Editar nome de usuário"
        >
          <Pencil size={14} />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-xl" style={{ color: '#7c8194' }}>@</span>
        <Input
          aria-label="Novo nome de usuário"
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
          autoCapitalize="none"
          spellCheck={false}
          maxLength={20}
          autoFocus
          className="h-8 max-w-56"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditing(false)
          }}
        />
        <button
          type="submit"
          disabled={saving}
          className={iconButton}
          style={{ color: '#7dd3fc' }}
          aria-label="Salvar nome de usuário"
          title="Salvar"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className={iconButton}
          style={{ color: '#7c8194' }}
          aria-label="Cancelar edição"
          title="Cancelar"
        >
          <X size={16} />
        </button>
      </div>
      {error && (
        <p className="text-xs" role="alert" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </form>
  )
}
