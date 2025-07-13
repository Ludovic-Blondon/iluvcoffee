import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  let flavorRepository: MockRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
    flavorRepository = module.get<MockRepository>(getRepositoryToken(Flavor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of coffees', async () => {
      const coffees = [{ id: 1, name: 'Coffee 1', brand: 'Brand 1', flavors: ['flavor 1', 'flavor 2'] }];
      coffeeRepository.find!.mockResolvedValue(coffees);
      const result = await service.findAll({});
      expect(result).toEqual(coffees);
    });
  });

  describe('findOne', () => {
    describe('when coffee with id exists', () => {
      it('should return a coffee', async () => {
        const coffeeId = 1;
        const expectedCoffee = {};

        coffeeRepository.findOne!.mockResolvedValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);

      });
    });

    describe('when coffee with id does not exist', () => {
      it('should throw an error', () => {
        const coffeeId = 99;
        coffeeRepository.findOne!.mockResolvedValue(undefined);

        expect(service.findOne(coffeeId)).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('create', () => {
    it('should create a coffee', async () => {
      const createCoffeeDto: CreateCoffeeDto = {
        name: 'Coffee 1',
        brand: 'Brand 1',
        flavors: ['flavor 1', 'flavor 2'],
      };

      coffeeRepository.create!.mockReturnValue(createCoffeeDto);
      coffeeRepository.save!.mockResolvedValue(createCoffeeDto);

      const coffee = await service.create(createCoffeeDto);
      expect(coffee).toEqual(createCoffeeDto); // 👈 check if the coffee is created
    });
  });

  describe('update', () => {
    it('should update a coffee', async () => {
      const coffeeId = 1;
      const updateCoffeeDto: UpdateCoffeeDto = {
        name: 'Coffee 1',
        brand: 'Brand 1',
        flavors: ['flavor 1', 'flavor 2'],
      };

      coffeeRepository.preload!.mockResolvedValue({ id: coffeeId, ...updateCoffeeDto });
      coffeeRepository.save!.mockResolvedValue({ id: coffeeId, ...updateCoffeeDto });
      coffeeRepository.findOne!.mockResolvedValue({ id: coffeeId, ...updateCoffeeDto });

      const coffee = await service.update(coffeeId, updateCoffeeDto);
      expect(coffee).toEqual({ id: coffeeId, ...updateCoffeeDto });
    });

    describe('when coffee with id does not exist', () => {
      it('should throw an error', () => {
        const coffeeId = 99;
        const updateCoffeeDto: UpdateCoffeeDto = {
          name: 'Coffee 1',
          brand: 'Brand 1',
          flavors: ['flavor 1', 'flavor 2'],
        };
        coffeeRepository.preload!.mockResolvedValue(undefined);
        expect(service.update(coffeeId, updateCoffeeDto)).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('remove', () => {
    it('should remove a coffee', async () => {
      const coffeeId = 1;
      coffeeRepository.findOne!.mockResolvedValue({ id: coffeeId });
      coffeeRepository.remove!.mockResolvedValue({ id: coffeeId });
      await service.remove(coffeeId);
    });

    describe('when coffee with id does not exist', () => {
      it('should throw an error', () => {
        const coffeeId = 99;
        coffeeRepository.findOne!.mockResolvedValue(undefined);
        expect(service.remove(coffeeId)).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('preloadFlavorByName', () => {
    it('should return a flavor', async () => {
      const flavorName = 'flavor 1';
      const flavor = { id: 1, name: flavorName };
      flavorRepository.findOne!.mockResolvedValue(flavor);
      const result = await service['preloadFlavorByName'](flavorName);
      expect(result).toEqual(flavor);
    });

    it('should create a flavor if it does not exist', async () => {
      const flavorName = 'flavor 1';
      flavorRepository.findOne!.mockResolvedValue(undefined);
      flavorRepository.create!.mockReturnValue({ id: 1, name: flavorName });
      const result = await service['preloadFlavorByName'](flavorName);
      expect(result).toEqual({ id: 1, name: flavorName });
    });
  });

  describe('recommendCoffee', () => {
    it('should return a coffee', async () => {
      const coffeeId = 1;
      coffeeRepository.findOne!.mockResolvedValue({ id: coffeeId });
      const result = await service.recommendCoffee({ id: coffeeId, name: 'Coffee 1', brand: 'Brand 1', recommendations: 1, flavors: [] });
      expect(result).toEqual(undefined);
    });
  });
});
