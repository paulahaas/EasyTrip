import { useState } from 'react'
import { Globe2 } from 'lucide-react'

interface CountryFlagProps {
  /** Código ISO alpha-2 (ex.: "BR"). */
  cca2: string | null | undefined
  /** Altura em px; a largura segue a proporção 4:3. */
  size?: number
}

// Bandeira em imagem (flagcdn.com, o mesmo do cartão do país). Emoji de
// bandeira não aparece no Windows, que mostra só as letras ("BR").
export function CountryFlag({ cca2, size = 14 }: CountryFlagProps) {
  const [failed, setFailed] = useState(false)
  const width = Math.round((size * 4) / 3)
  const code = cca2?.toLowerCase()

  if (!code || failed) {
    return <Globe2 size={size} aria-hidden style={{ color: '#7c8194', flexShrink: 0 }} />
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={width}
      height={size}
      alt=""
      aria-hidden
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 object-cover"
      style={{
        width,
        height: size,
        borderRadius: 2,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.12)',
      }}
    />
  )
}
