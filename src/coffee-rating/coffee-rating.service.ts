import { Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
    constructor(private readonly coffeesService: CoffeesService) { }

    async recommendCoffee(coffeeId: string) {
        const coffee = await this.coffeesService.findOne(coffeeId);
        return await this.coffeesService.recommendCoffee(coffee);
    }
}
