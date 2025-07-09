import { Controller, Get, Param, Post, Patch, Delete, Query, HttpCode, UseGuards, SetMetadata } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, createCoffeeSchema } from './dto/create-coffee.dto';
import { UpdateCoffeeDto, updateCoffeeSchema } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { ZodValidationPipe } from 'src/common/zod.validation.pipe';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) { }

    @Public()
    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.coffeesService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffeesService.findOne(id);
    }

    @Post()
    create(@Body(new ZodValidationPipe(createCoffeeSchema)) createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCoffeeSchema)) updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }

    @Post(':id/recommend')
    @HttpCode(202)
    async recommendCoffee(@Param('id') id: string) {
        const coffee = await this.coffeesService.findOne(id);
        return this.coffeesService.recommendCoffee(coffee);
    }
}
