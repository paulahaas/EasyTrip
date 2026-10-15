import { CountryMeta } from '../countries/countries.service';
import { keywordMap } from './keyword-map';

function climateTokens(lat: number): string {
  const a = Math.abs(lat);
  if (a >= 66.5)
    return 'polar arctic glacial neve snow gelo ice extremo extreme congelado frozen';
  if (a >= 50)
    return 'frio cold gelado freezing neve snow inverno winter temperatura baixa';
  if (a >= 35)
    return 'fresco cool temperado temperate clima ameno mild moderate';
  if (a >= 23.5)
    return 'quente warm calor heat sol sun verão summer subtropical';
  return 'tropical quente hot calor trópico tropics sol sun humid chuva rain floresta forest';
}

function hemisphereTokens(lat: number): string {
  if (lat > 0)
    return 'hemisferio norte northern hemisphere inverno dezembro winter december verão julho summer july';
  if (lat < 0)
    return 'hemisferio sul southern hemisphere inverno julho winter july verão dezembro summer december estações invertidas';
  return '';
}

export function buildProfile(country: CountryMeta): string {
  const parts: string[] = [];

  parts.push(country.name.toLowerCase());
  // altSpellings includes native names (e.g. "Brasil" for Brazil)
  if (country.altSpellings) {
    country.altSpellings.forEach((s) => parts.push(s.toLowerCase()));
  }
  parts.push(country.continent.toLowerCase());
  parts.push(country.subregion.toLowerCase());

  country.languages.forEach((l) => parts.push(l.toLowerCase()));
  country.currencies.forEach((c) => parts.push(c.toLowerCase()));

  const hasCoords = !(country.latlng[0] === 0 && country.latlng[1] === 0);
  if (hasCoords) {
    parts.push(climateTokens(country.latlng[0]));
    parts.push(hemisphereTokens(country.latlng[0]));
  }

  if (country.landlocked) {
    parts.push('sem litoral landlocked interior sem costa sem praia sem mar');
  } else {
    parts.push('com litoral coastal costeiro praia beach mar sea oceano ocean');
    if (country.name.toLowerCase().includes('island')) {
      parts.push('ilha island ilhas islands país ilha island nation');
    }
  }

  // Enrich with all keyword-map terms that match this country.
  // This makes "brasil", "fala português", "país frio", etc. searchable via FTS.
  for (const entry of keywordMap) {
    try {
      if (entry.filter(country)) {
        parts.push(entry.keywords.join(' '));
      }
    } catch {
      // ignore malformed filter
    }
  }

  return parts.filter(Boolean).join(' ');
}
