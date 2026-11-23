import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AddVisitedDto } from './add-visited.dto';
import { maxVisitYear } from './visit-date.decorator';

const errors = (body: object) =>
  validateSync(plainToInstance(AddVisitedDto, body)).map((e) => e.property);

describe('AddVisitedDto', () => {
  it('aceita só o cca2', () => {
    expect(errors({ cca2: 'JP' })).toEqual([]);
  });

  it('aceita data até o ano que vem', () => {
    expect(errors({ cca2: 'JP', visitedAt: `${maxVisitYear()}-01-01` })).toEqual([]);
  });

  it('recusa data depois do ano que vem', () => {
    expect(
      errors({ cca2: 'JP', visitedAt: `${maxVisitYear() + 1}-01-01` }),
    ).toEqual(['visitedAt']);
  });

  it('recusa nome gigante', () => {
    expect(errors({ cca2: 'JP', countryName: 'x'.repeat(101) })).toEqual([
      'countryName',
    ]);
  });
});
