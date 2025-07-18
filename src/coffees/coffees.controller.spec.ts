import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

describe('CoffeesController', () => {
  let controller: CoffeesController;

  const mockCoffeesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    recommendCoffee: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoffeesController],
      providers: [
        {
          provide: CoffeesService,
          useValue: mockCoffeesService,
        },
      ],
    }).compile();

    controller = module.get<CoffeesController>(CoffeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with pagination query', async () => {
      const query: PaginationQueryDto = { limit: 10, offset: 0 };
      await controller.findAll(query);
      expect(mockCoffeesService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      await controller.findOne(1);
      expect(mockCoffeesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateCoffeeDto = {
        name: 'Café',
        brand: 'Nest',
        flavors: ['chocolate'],
      };
      await controller.create(dto);
      expect(mockCoffeesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateCoffeeDto = { name: 'Updated Coffee' };
      await controller.update(1, dto);
      expect(mockCoffeesService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      await controller.remove(1);
      expect(mockCoffeesService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('recommendCoffee', () => {
    it('should call service.findOne and service.recommendCoffee', async () => {
      const coffee = { id: 1, name: 'Test Coffee' };
      mockCoffeesService.findOne = jest.fn().mockResolvedValue(coffee);

      await controller.recommendCoffee(1);

      expect(mockCoffeesService.findOne).toHaveBeenCalledWith(1);
      expect(mockCoffeesService.recommendCoffee).toHaveBeenCalledWith(coffee);
    });
  });
});
