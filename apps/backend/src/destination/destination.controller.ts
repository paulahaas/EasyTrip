import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { SemanticSearchService } from '../semantic-search/semantic-search.service';

@ApiTags('Destination')
@Controller('destination')
export class DestinationController {
  constructor(
    private readonly destinationService: DestinationService,
    private readonly semanticSearchService: SemanticSearchService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary: 'Busca semântica de países por atributos',
    description:
      'Busca países usando linguagem natural em português ou inglês. Ex: "país frio", "fala português", "América do Sul". Retorna metadados sem clima/câmbio.',
  })
  @ApiQuery({
    name: 'q',
    example: 'país frio',
    description: 'Query em linguagem natural',
  })
  semanticSearch(@Query('q') q: string) {
    return this.semanticSearchService.search(q);
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Retorna informações agregadas de um destino',
    description:
      'Endpoint público. Agrega RestCountries (capital, idioma, moeda, população, continente), OpenWeatherMap (clima da capital) e ExchangeRate (conversão para BRL).',
  })
  @ApiParam({
    name: 'name',
    example: 'Brazil',
    description:
      'Nome do país em inglês (ou formato aceito pelo RestCountries)',
  })
  getDestination(@Param('name') name: string) {
    return this.destinationService.getDestination(name);
  }
}
