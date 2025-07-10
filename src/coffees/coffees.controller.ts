import { Controller, Get, Param, Post, Patch, Delete, Query, HttpCode, UseGuards, SetMetadata } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, createCoffeeSchema } from './schemas/create-coffee.zod';
import { UpdateCoffeeDto, updateCoffeeSchema } from './schemas/update-coffee.zod';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe';
import { coffeeParamSchema } from './schemas/coffee.param.zod';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) { }

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.coffeesService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id', new ZodValidationPipe(coffeeParamSchema)) id: number) {
        return this.coffeesService.findOne(id);
    }

    @Post()
    create(@Body(new ZodValidationPipe(createCoffeeSchema)) createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(
        @Param('id', new ZodValidationPipe(coffeeParamSchema)) id: number,
        @Body(new ZodValidationPipe(updateCoffeeSchema)) updateCoffeeDto: UpdateCoffeeDto
    ) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id', new ZodValidationPipe(coffeeParamSchema)) id: number) {
        return this.coffeesService.remove(id);
    }

    @Post(':id/recommend')
    @HttpCode(202)
    async recommendCoffee(@Param('id', new ZodValidationPipe(coffeeParamSchema)) id: number) {
        const coffee = await this.coffeesService.findOne(id);
        return this.coffeesService.recommendCoffee(coffee);
    }
}
