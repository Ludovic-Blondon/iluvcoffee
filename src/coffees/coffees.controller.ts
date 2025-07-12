import { Controller, Get, Param, Post, Patch, Delete, Query, HttpCode } from '@nestjs/common';
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
    findOne(@Param() params: CoffeeParamDto) {
        return this.coffeesService.findOne(params.id);
    }

    @Post()
    @ApiBody({ type: CreateCoffeeDto })
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateCoffeeDto })
    update(
        @Param() params: CoffeeParamDto,
        @Body() updateCoffeeDto: UpdateCoffeeDto
    ) {
        return this.coffeesService.update(params.id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param() params: CoffeeParamDto) {
        return this.coffeesService.remove(params.id);
    }

    @Post(':id/recommend')
    @HttpCode(202)
    async recommendCoffee(@Param() params: CoffeeParamDto) {
        const coffee = await this.coffeesService.findOne(params.id);
        return this.coffeesService.recommendCoffee(coffee);
    }
}
