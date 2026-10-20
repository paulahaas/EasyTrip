// Nome do país em português a partir do código ISO alpha-2, usando o Intl do
// navegador (ex.: "JP" → "Japão"). Cai no nome salvo quando não há tradução.
let regionNames: Intl.DisplayNames | null = null
let unknownRegion: string | undefined
try {
  regionNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' })
  // "ZZ" é o código de "Região desconhecida"; usado para detectar códigos sem tradução.
  unknownRegion = regionNames.of('ZZ')
} catch {
  regionNames = null
}

export function countryNamePt(cca2: string, fallback: string): string {
  try {
    const code = cca2.toUpperCase()
    const name = regionNames?.of(code)
    return name && name !== code && name !== unknownRegion ? name : fallback
  } catch {
    return fallback
  }
}

/** "2024-03-01" → "março de 2024". */
export function formatVisitMonth(visitedAt: string): string {
  const [year, month] = visitedAt.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
