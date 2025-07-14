import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoffeeSchema } from './entities/coffee.entities';
import { Coffee } from './entities/coffee.entities';
import { EventSchema } from 'src/events/entities/event.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Coffee.name, schema: CoffeeSchema }]),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule { }
