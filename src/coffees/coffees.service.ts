import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entities';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectModel(Coffee.name) private coffeeModel: Model<Coffee>,
        @InjectModel(Event.name) private eventModel: Model<Event>,
        @InjectConnection() private connection: Connection,
    ) { }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit = 10, offset = 0 } = paginationQuery;
        return this.coffeeModel.find().skip(offset).limit(limit).exec();
    }

    async findOne(id: string) {
        const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    create(createCoffeeDto: CreateCoffeeDto) {
        const coffee = new this.coffeeModel(createCoffeeDto);
        return coffee.save();
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const existingCoffee = await this.coffeeModel
            .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
            .exec();

        if (!existingCoffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }

        return existingCoffee;
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return coffee.deleteOne();
    }

    async recommendCoffee(coffee: Coffee) {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const recommendEvent = new this.eventModel({
                name: 'recommend_coffee',
                type: 'coffee',
                payload: { coffeeId: coffee._id },
            });
            await recommendEvent.save({ session });

            await this.coffeeModel.findOneAndUpdate(
                { _id: coffee._id },
                { $inc: { recommendations: 1 } },
                { session }
            );

            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }
}
