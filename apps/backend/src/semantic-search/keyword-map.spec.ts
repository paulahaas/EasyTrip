jest.mock('natural', () => ({ PorterStemmerPt: { stem: (t: string) => t } }));

import { keywordMap, normalizeText, removeStopwords } from './keyword-map';

describe('normalizeText', () => {
  it('remove acentos e converte para minúsculas', () => {
    expect(normalizeText('Ação')).toBe('acao');
    expect(normalizeText('BRASIL')).toBe('brasil');
    expect(normalizeText('  Olá  ')).toBe('ola');
    expect(normalizeText('Café')).toBe('cafe');
  });

  it('retorna string vazia para input vazio', () => {
    expect(normalizeText('')).toBe('');
  });
});

describe('removeStopwords', () => {
  it('remove stopwords em PT', () => {
    const res = removeStopwords('o Brasil é um país bonito');
    expect(res).not.toContain('o');
    expect(res).not.toContain('um');
    expect(res).toContain('brasil');
    expect(res).toContain('bonito');
  });

  it('remove stopwords em EN', () => {
    const res = removeStopwords('a country in the world');
    expect(res).not.toContain('a');
    expect(res).not.toContain('the');
    expect(res).not.toContain('in');
  });

  it('filtra palavras de 1 caractere', () => {
    expect(removeStopwords('a b c brasil')).toEqual(['brasil']);
  });

  it('retorna [] para texto com só stopwords', () => {
    expect(removeStopwords('o a os as um')).toEqual([]);
  });
});

describe('keywordMap', () => {
  it('tem entradas com tag, score e filter', () => {
    expect(keywordMap.length).toBeGreaterThan(0);
    for (const entry of keywordMap.slice(0, 10)) {
      expect(typeof entry.tag).toBe('string');
      expect(typeof entry.score).toBe('number');
      expect(typeof entry.filter).toBe('function');
    }
  });

  it('entrada Brasil corresponde apenas ao Brasil', () => {
    const brasilEntry = keywordMap.find((e) => e.tag === 'Brasil');
    expect(brasilEntry).toBeDefined();
    expect(brasilEntry!.filter({ cca2: 'BR' } as never)).toBe(true);
    expect(brasilEntry!.filter({ cca2: 'AR' } as never)).toBe(false);
  });
});
