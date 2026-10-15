interface CountryMeta {
  flag: string
  cca2: string
}

const COUNTRIES: Record<string, CountryMeta> = {
  france: { flag: '🇫🇷', cca2: 'FR' },
  brazil: { flag: '🇧🇷', cca2: 'BR' },
  brasil: { flag: '🇧🇷', cca2: 'BR' },
  japan: { flag: '🇯🇵', cca2: 'JP' },
  'united states': { flag: '🇺🇸', cca2: 'US' },
  usa: { flag: '🇺🇸', cca2: 'US' },
  germany: { flag: '🇩🇪', cca2: 'DE' },
  italy: { flag: '🇮🇹', cca2: 'IT' },
  spain: { flag: '🇪🇸', cca2: 'ES' },
  portugal: { flag: '🇵🇹', cca2: 'PT' },
  argentina: { flag: '🇦🇷', cca2: 'AR' },
  canada: { flag: '🇨🇦', cca2: 'CA' },
  australia: { flag: '🇦🇺', cca2: 'AU' },
  china: { flag: '🇨🇳', cca2: 'CN' },
  india: { flag: '🇮🇳', cca2: 'IN' },
  mexico: { flag: '🇲🇽', cca2: 'MX' },
  'united kingdom': { flag: '🇬🇧', cca2: 'GB' },
  netherlands: { flag: '🇳🇱', cca2: 'NL' },
  colombia: { flag: '🇨🇴', cca2: 'CO' },
  chile: { flag: '🇨🇱', cca2: 'CL' },
  peru: { flag: '🇵🇪', cca2: 'PE' },
  norway: { flag: '🇳🇴', cca2: 'NO' },
  sweden: { flag: '🇸🇪', cca2: 'SE' },
  switzerland: { flag: '🇨🇭', cca2: 'CH' },
}

export function getCountryFlag(destination: string): string {
  return COUNTRIES[destination.toLowerCase()]?.flag ?? '🌍'
}

export function getCountryCode(destination: string): string | null {
  return COUNTRIES[destination.toLowerCase()]?.cca2 ?? null
}
