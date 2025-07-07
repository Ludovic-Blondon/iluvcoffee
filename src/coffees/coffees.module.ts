import { Module, Scope } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constant';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [CoffeesService, {
        provide: COFFEE_BRANDS,
        useFactory: async (connection: Connection) => {
            // const coffeeBrands = await connection.query('SELECT * FROM coffee_brands');
            const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe', 'folgers']);
            console.log('[!] Async factory');
            return coffeeBrands;
        },
        inject: [Connection],
        scope: Scope.TRANSIENT,
    }
    ],
    exports: [CoffeesService],
})
export class CoffeesModule { }
