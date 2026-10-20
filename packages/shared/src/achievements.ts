import { CONTINENT_KEYS } from './continents';

export interface Achievement {
  id: string;
  titulo: string;
  descricao: string;
  /** Emoji exibido no selo. */
  icone: string;
  conquistada: boolean;
  progresso: { atual: number; meta: number };
}

/** Só o que as conquistas precisam de cada país visitado. */
export interface VisitedForAchievements {
  cca2: string;
  continent: string;
  visitedAt?: string | null;
}

// Países independentes da América do Sul (sem territórios ultramarinos).
const SOUTH_AMERICA = ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'];
// Países que fazem fronteira com o Brasil (inclui a Guiana Francesa).
const BRAZIL_NEIGHBORS = ['AR', 'BO', 'CO', 'GF', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'];

interface Rule {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  meta: number;
  atual: (v: VisitedForAchievements[]) => number;
}

const countIn = (list: string[]) => (v: VisitedForAchievements[]) =>
  v.filter((c) => list.includes(c.cca2)).length;

const continents = (v: VisitedForAchievements[]) =>
  new Set(v.map((c) => c.continent).filter((c) => (CONTINENT_KEYS as readonly string[]).includes(c))).size;

const inContinent = (key: string) => (v: VisitedForAchievements[]) =>
  v.filter((c) => c.continent === key).length;

/** Maior número de países diferentes visitados num mesmo ano (só conta viagens com data). */
function bestYear(v: VisitedForAchievements[]): number {
  const perYear = new Map<string, number>();
  for (const c of v) {
    if (!c.visitedAt) continue;
    const year = c.visitedAt.slice(0, 4);
    perYear.set(year, (perYear.get(year) ?? 0) + 1);
  }
  return Math.max(0, ...perYear.values());
}

const RULES: Rule[] = [
  { id: 'primeiro-carimbo', icone: '🛂', titulo: 'Primeiro carimbo', descricao: 'Marcar o primeiro país visitado', meta: 1, atual: (v) => v.length },
  { id: 'fora-do-brasil', icone: '✈️', titulo: 'Fora do Brasil', descricao: 'Visitar um país além do Brasil', meta: 1, atual: (v) => v.filter((c) => c.cca2 !== 'BR').length },
  { id: 'explorador', icone: '🧭', titulo: 'Explorador', descricao: 'Visitar 5 países', meta: 5, atual: (v) => v.length },
  { id: 'viajante', icone: '🎒', titulo: 'Viajante', descricao: 'Visitar 10 países', meta: 10, atual: (v) => v.length },
  { id: 'globetrotter', icone: '🌍', titulo: 'Globetrotter', descricao: 'Visitar 25 países', meta: 25, atual: (v) => v.length },
  { id: 'cidadao-do-mundo', icone: '🏆', titulo: 'Cidadão do mundo', descricao: 'Visitar 50 países', meta: 50, atual: (v) => v.length },
  { id: 'dois-continentes', icone: '🗺️', titulo: 'Entre continentes', descricao: 'Visitar 2 continentes', meta: 2, atual: continents },
  { id: 'cinco-continentes', icone: '🌐', titulo: 'Cinco continentes', descricao: 'Visitar 5 continentes', meta: 5, atual: continents },
  { id: 'todos-continentes', icone: '👑', titulo: 'Todos os continentes', descricao: 'Visitar os 7 continentes, Antártida inclusa', meta: 7, atual: continents },
  { id: 'vizinhos', icone: '🤝', titulo: 'Bons vizinhos', descricao: 'Visitar todos os vizinhos do Brasil', meta: BRAZIL_NEIGHBORS.length, atual: countIn(BRAZIL_NEIGHBORS) },
  { id: 'sul-americano', icone: '🦙', titulo: 'Sul-americano', descricao: 'Visitar todos os países da América do Sul', meta: SOUTH_AMERICA.length, atual: countIn(SOUTH_AMERICA) },
  { id: 'eurotrip', icone: '🏰', titulo: 'Eurotrip', descricao: 'Visitar 10 países da Europa', meta: 10, atual: inContinent('Europe') },
  { id: 'rumo-ao-oriente', icone: '🏯', titulo: 'Rumo ao Oriente', descricao: 'Visitar 5 países da Ásia', meta: 5, atual: inContinent('Asia') },
  { id: 'pinguim', icone: '🐧', titulo: 'Pinguim', descricao: 'Visitar a Antártida', meta: 1, atual: inContinent('Antarctica') },
  { id: 'ano-agitado', icone: '📅', titulo: 'Ano agitado', descricao: 'Visitar 3 países no mesmo ano (com data da viagem)', meta: 3, atual: bestYear },
];

export function computeAchievements(visited: VisitedForAchievements[]): Achievement[] {
  return RULES.map((rule) => {
    const atual = Math.min(rule.atual(visited), rule.meta);
    return {
      id: rule.id,
      titulo: rule.titulo,
      descricao: rule.descricao,
      icone: rule.icone,
      conquistada: atual >= rule.meta,
      progresso: { atual, meta: rule.meta },
    };
  });
}
