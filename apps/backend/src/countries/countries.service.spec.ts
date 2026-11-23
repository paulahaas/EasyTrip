import { NotFoundException } from '@nestjs/common';
import { CountriesService } from './countries.service';

let svc: CountriesService;

beforeAll(() => {
  svc = new CountriesService();
});

describe('CountriesService', () => {
  describe('getAll', () => {
    it('retorna array não vazio', () => {
      expect(svc.getAll().length).toBeGreaterThan(100);
    });

    it('cada entrada tem cca2 e nome', () => {
      const all = svc.getAll();
      for (const c of all.slice(0, 20)) {
        expect(c.cca2).toMatch(/^[A-Z]{2}$/);
        expect(typeof c.name).toBe('string');
        expect(c.name.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getByCca2', () => {
    it('encontra Brasil por cca2', () => {
      const c = svc.getByCca2('BR');
      expect(c).not.toBeNull();
      expect(c!.name).toBe('Brazil');
    });

    it('retorna null para cca2 inexistente', () => {
      expect(svc.getByCca2('ZZ')).toBeNull();
    });

    it('aceita minúsculas', () => {
      expect(svc.getByCca2('br')).not.toBeNull();
    });
  });

  describe('getByCca3', () => {
    it('encontra Brasil por cca3', () => {
      const c = svc.getByCca3('BRA');
      expect(c).not.toBeNull();
      expect(c!.cca2).toBe('BR');
    });

    it('retorna null para cca3 inexistente', () => {
      expect(svc.getByCca3('ZZZ')).toBeNull();
    });
  });

  describe('getByName', () => {
    it('encontra por nome exato', () => {
      const c = svc.getByName('Brazil');
      expect(c.cca2).toBe('BR');
    });

    it('é case-insensitive', () => {
      const c = svc.getByName('brazil');
      expect(c.cca2).toBe('BR');
    });

    it('encontra por altSpelling (Brasil)', () => {
      const c = svc.getByName('Brasil');
      expect(c.cca2).toBe('BR');
    });

    it('lança NotFoundException para nome inexistente', () => {
      expect(() => svc.getByName('Neverland')).toThrow(NotFoundException);
    });

    it('encontra pelo nome em português sem acento', () => {
      expect(svc.getByName('japao').cca2).toBe('JP');
      expect(svc.getByName('Alemanha').cca2).toBe('DE');
    });

    it('encontra por sigla', () => {
      expect(svc.getByName('br').cca2).toBe('BR');
      expect(svc.getByName('usa').cca2).toBe('US');
    });

    it('não chuta país para trechos curtos ou ambíguos', () => {
      expect(() => svc.getByName('a')).toThrow(NotFoundException);
      expect(() => svc.getByName('land')).toThrow(NotFoundException);
      // "IR" é a sigla do Irã, não um trecho de "Emirados Árabes".
      expect(svc.getByName('ir').cca2).toBe('IR');
      // "Congo" é o nome em português da República do Congo.
      expect(svc.getByName('congo').cca2).toBe('CG');
    });

    it('aceita trecho único com 4+ letras', () => {
      expect(svc.getByName('zeala').cca2).toBe('NZ');
    });

    it('encontra Japan por nome exato', () => {
      expect(svc.getByName('Japan').cca2).toBe('JP');
    });
  });

  describe('getBySubregion', () => {
    it('retorna países da sub-região', () => {
      const res = svc.getBySubregion('South America');
      expect(res.length).toBeGreaterThan(5);
      for (const c of res) {
        expect(c.subregion).toBe('South America');
      }
    });

    it('retorna [] para sub-região inexistente', () => {
      expect(svc.getBySubregion('Narnia')).toEqual([]);
    });

    it('retorna [] para string vazia', () => {
      expect(svc.getBySubregion('')).toEqual([]);
    });
  });

  describe('flag', () => {
    it('gera URL correta para BR', () => {
      const c = svc.getByCca2('BR')!;
      expect(c.flag).toBe('https://flagcdn.com/br.svg');
    });
  });
});
