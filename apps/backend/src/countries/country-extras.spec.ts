import {
  callingCode,
  continentNamePt,
  drivingSide,
  languageNamePt,
  timezoneInfo,
} from './country-extras';

describe('country-extras', () => {
  it('traduz idiomas a partir do código ISO 639-3', () => {
    expect(languageNamePt('por', 'Portuguese')).toBe('Português');
    expect(languageNamePt('jpn', 'Japanese')).toBe('Japonês');
    // código válido mas sem tradução no Intl → mantém o nome original
    expect(languageNamePt('qqq', 'Original')).toBe('Original');
  });

  it('traduz continentes e usa a sub-região nas Américas', () => {
    expect(continentNamePt('Americas', 'South America')).toBe('América do Sul');
    expect(continentNamePt('Americas', 'Caribbean')).toBe('Caribe');
    expect(continentNamePt('Asia', 'Eastern Asia')).toBe('Ásia');
  });

  it('monta o código de discagem', () => {
    expect(callingCode({ root: '+5', suffixes: ['5'] })).toBe('+55');
    expect(callingCode({ root: '+1', suffixes: ['201', '202'] })).toBe('+1');
    expect(callingCode(undefined)).toBeNull();
  });

  it('identifica o lado em que se dirige', () => {
    expect(drivingSide('GB')).toBe('esquerda');
    expect(drivingSide('jp')).toBe('esquerda');
    expect(drivingSide('BR')).toBe('direita');
  });

  it('usa o fuso da capital e mostra a faixa quando há vários', () => {
    const br = timezoneInfo('BR', 'Brasília')!;
    expect(br.fusoPrincipal).toBe('America/Sao_Paulo');
    expect(br.quantidade).toBeGreaterThan(1);
    expect(br.fusos).toMatch(/^UTC−0\d:00 a UTC−0\d:00$/);

    expect(timezoneInfo('JP', 'Tokyo')).toMatchObject({
      fusoPrincipal: 'Asia/Tokyo',
      fusos: 'UTC+09:00',
      quantidade: 1,
    });
    expect(timezoneInfo('MX', 'Mexico City')!.fusoPrincipal).toBe(
      'America/Mexico_City',
    );
    expect(timezoneInfo('IN', 'New Delhi')!.fusos).toBe('UTC+05:30');
  });

  it('não mistura fusos de outros países (Austrália)', () => {
    const au = timezoneInfo('AU', 'Canberra')!;
    expect(au.fusoPrincipal).toBe('Australia/Sydney');
    expect(au.fusos).not.toContain('UTC+09:00 a');
  });
});
