jest.mock('natural', () => ({ PorterStemmerPt: { stem: (t: string) => t } }));

import { DestinationController } from './destination.controller';

describe('DestinationController', () => {
  let destinationService: { getDestination: jest.Mock };
  let semanticService: { search: jest.Mock };
  let ctrl: DestinationController;

  beforeEach(() => {
    destinationService = {
      getDestination: jest.fn().mockResolvedValue({ destino: 'Brazil' }),
    };
    semanticService = { search: jest.fn().mockResolvedValue([]) };
    ctrl = new DestinationController(
      destinationService as never,
      semanticService as never,
    );
  });

  it('semanticSearch delega para semanticSearchService.search', async () => {
    await ctrl.semanticSearch('brasil frio');
    expect(semanticService.search).toHaveBeenCalledWith('brasil frio');
  });

  it('getDestination delega para destinationService.getDestination', async () => {
    await ctrl.getDestination('Brazil');
    expect(destinationService.getDestination).toHaveBeenCalledWith('Brazil');
  });
});
