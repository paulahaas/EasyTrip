import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
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
  semanticSearch(@Query('q') q?: string) {
    const query = typeof q === 'string' ? q.trim() : '';
    if (!query) throw new BadRequestException('Informe o parâmetro q.');
    if (query.length > 200) {
      throw new BadRequestException('Busca muito longa (máx. 200 caracteres).');
    }
    return this.semanticSearchService.search(query);
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Retorna informações agregadas de um destino',
    description:
      'Endpoint público. Agrega dados offline do world-countries (capital, idioma, moeda, continente, fuso), população do Banco Mundial, OpenWeatherMap (clima da capital) e ExchangeRate-API (conversão para BRL). Clima e câmbio vêm `null` se a API externa falhar.',
  })
  @ApiParam({
    name: 'name',
    example: 'Brazil',
    description:
      'Nome do país em inglês ou português, sigla (BR, BRA) ou grafia alternativa, com ou sem acento',
  })
  getDestination(@Param('name') name: string) {
    return this.destinationService.getDestination(name);
  }
}
