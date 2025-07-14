import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

describe('CoffeesController', () => {
  let controller: CoffeesController;
  let service: CoffeesService;

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
    service = module.get<CoffeesService>(CoffeesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with pagination query', () => {
      const query: PaginationQueryDto = { limit: 10, offset: 0 };
      controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', () => {
      controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should call service.create with dto', () => {
      const dto: CreateCoffeeDto = {
        name: 'Café',
        brand: 'Nest',
        flavors: ['chocolate'],
      };
      controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', () => {
      const dto: UpdateCoffeeDto = { name: 'Updated Coffee' };
      controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', () => {
      controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('recommendCoffee', () => {
    it('should call service.findOne and service.recommendCoffee', async () => {
      const coffee = { id: 1, name: 'Test Coffee' };
      service.findOne = jest.fn().mockResolvedValue(coffee);

      await controller.recommendCoffee(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.recommendCoffee).toHaveBeenCalledWith(coffee);
    });
  });
});
