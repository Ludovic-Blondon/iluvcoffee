import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesService } from '../coffees/coffees.service';

describe('CoffeeRatingService', () => {
  let service: CoffeeRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeRatingService,
        {
          provide: CoffeesService,
          useValue: {}, // 👈 mock du service dépendant
        },
      ],
    }).compile();

    service = module.get<CoffeeRatingService>(CoffeeRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
