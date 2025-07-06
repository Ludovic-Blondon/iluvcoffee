import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';

@Controller('coffee-rating')
export class CoffeeRatingController {
    constructor(private readonly coffeeRatingService: CoffeeRatingService) { }

    @HttpCode(HttpStatus.ACCEPTED)
    @Post(':id')
    recommendCoffee(@Param('id') coffeeId: string) {
        return this.coffeeRatingService.recommendCoffee(coffeeId);
    }
}
