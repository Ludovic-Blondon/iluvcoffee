import { Controller, Get, Param, Post, Patch, Delete, Query, HttpCode, ParseIntPipe } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CoffeesService } from './coffees.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UpdateCoffeeDto, CreateCoffeeDto, CoffeeParamDto } from './dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) { }

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.coffeesService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.coffeesService.findOne(id);
    }

    @Post()
    @ApiBody({ type: CreateCoffeeDto })
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCoffeeDto: UpdateCoffeeDto
    ) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.coffeesService.remove(id);
    }

    @Post(':id/recommend')
    @HttpCode(202)
    async recommendCoffee(@Param('id', ParseIntPipe) id: number) {
        const coffee = await this.coffeesService.findOne(id);
        return this.coffeesService.recommendCoffee(coffee);
    }
}
