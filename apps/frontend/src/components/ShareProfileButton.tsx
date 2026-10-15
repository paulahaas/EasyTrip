import { Copy, Share2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ShareProfileButtonProps {
  userId: string
}

export function ShareProfileButton({ userId }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = `${window.location.origin}/profile/${userId}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Meu perfil no EasyTrip', text: 'Veja meu perfil de viagens', url })
        return
      }
    } catch {
      // fallthrough para clipboard
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Não foi possível copiar o link')
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={share}
      className="gap-1.5 text-xs rounded-full cursor-pointer"
      style={{
        background: 'rgba(79,142,247,0.08)',
        borderColor: 'rgba(79,142,247,0.25)',
        color: '#7dd3fc',
      }}
    >
      {copied ? <Copy size={13} /> : <Share2 size={13} />}
      {copied ? 'Copiado!' : 'Compartilhar'}
    </Button>
  )
}
