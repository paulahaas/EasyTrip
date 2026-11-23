import type { VisitedCountry } from '@easytrip/shared'

export type SavedCountry = Pick<VisitedCountry, 'cca2' | 'countryName'>

/** Separa países em comum, só do amigo e só meus. */
export function compareVisited(mine: SavedCountry[], theirs: SavedCountry[]) {
  const mineSet = new Set(mine.map((c) => c.cca2))
  const theirSet = new Set(theirs.map((c) => c.cca2))
  return {
    emComum: theirs.filter((c) => mineSet.has(c.cca2)),
    soDela: theirs.filter((c) => !mineSet.has(c.cca2)),
    soMeus: mine.filter((c) => !theirSet.has(c.cca2)),
  }
}

/** Agrupa as viagens por ano, da mais recente para a mais antiga. */
export function groupByYear(visited: VisitedCountry[]) {
  const dated = visited
    .filter((v) => v.visitedAt)
    .sort((a, b) => b.visitedAt!.localeCompare(a.visitedAt!))
  const years = new Map<string, VisitedCountry[]>()
  for (const v of dated) {
    const year = v.visitedAt!.slice(0, 4)
    years.set(year, [...(years.get(year) ?? []), v])
  }
  return {
    years: [...years.entries()],
    undated: visited.filter((v) => !v.visitedAt),
  }
}
