import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly dataSource: DataSource,
    ) { }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: {
                flavors: true,
            },
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: { id: +id },
            relations: {
                flavors: true,
            },
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors && (await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        ));

        const existingCoffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if (!existingCoffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(existingCoffee);
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(flavorName: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({
            where: { name: flavorName },
        });
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepository.create({ name: flavorName });
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.recommendations++;
            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };
            await queryRunner.manager.save(Event, recommendEvent);
            await queryRunner.manager.save(Coffee, coffee);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
