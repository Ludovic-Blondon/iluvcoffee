import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeRatingController } from './coffee-rating.controller';
import { CoffeeRatingService } from './coffee-rating.service';

describe('CoffeeRatingController', () => {
  let controller: CoffeeRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoffeeRatingController],
      providers: [
        {
          provide: CoffeeRatingService,
          useValue: {}, // 👈 mock du service injecté dans le contrôleur
        },
      ],
    }).compile();

    controller = module.get<CoffeeRatingController>(CoffeeRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
