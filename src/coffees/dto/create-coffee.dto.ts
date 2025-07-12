import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayUnique, MinLength, MaxLength } from 'class-validator';

export class CreateCoffeeDto {
    @ApiProperty({ example: 'Café noir' })
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name: string;

    @ApiProperty({ example: 'Nest Brand' })
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    brand: string;

    @ApiProperty({ example: ['chocolat', 'vanille'], required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayUnique()
    flavors: string[] = [];
}
