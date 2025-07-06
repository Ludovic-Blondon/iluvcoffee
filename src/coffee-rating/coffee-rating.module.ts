import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { CoffeeRatingController } from './coffee-rating.controller';

@Module({
  imports: [CoffeesModule],
  providers: [CoffeeRatingService],
  controllers: [CoffeeRatingController]
})
export class CoffeeRatingModule { }
