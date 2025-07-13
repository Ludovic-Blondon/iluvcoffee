import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
    let app: INestApplication<App>;
    const coffee = {
        name: 'Shipwreck Roast',
        brand: 'Buddy Brew',
        flavors: ['chocolate', 'vanilla'],
    };
    const expectedPartialCoffee = expect.objectContaining({
        ...coffee,
        flavors: expect.arrayContaining(
            coffee.flavors.map(name => expect.objectContaining({ name })),
        ),
    });

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CoffeesModule,
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5433,
                    username: 'postgres',
                    password: 'pass123',
                    database: 'postgres',
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        await app.init();
    });

    it('Create [POST /]', async () => {
        return request(app.getHttpServer())
            .post('/coffees')
            .send(coffee as CreateCoffeeDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                expect(body).toEqual(expectedPartialCoffee);
            });
    });

    it('Get all [GET /]', async () => {
        return request(app.getHttpServer())
            .get('/coffees')
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body.length).toBe(1);
                expect(body).toEqual([expectedPartialCoffee]);
            });
    });

    it('Get one [GET /:id]', async () => {
        return request(app.getHttpServer())
            .get('/coffees/1')
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body).toEqual(expectedPartialCoffee);
            });
    });

    it('Update one [PATCH /:id]', async () => {
        const updateCoffeeDto: UpdateCoffeeDto = {
            ...coffee,
            name: 'New and Improved Shipwreck Roast'
        }

        return request(app.getHttpServer())
            .patch('/coffees/1')
            .send(updateCoffeeDto)
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body.name).toEqual(updateCoffeeDto.name);
            });
    });

    it('Delete one [DELETE /:id]', async () => {
        return request(app.getHttpServer())
            .delete('/coffees/1')
            .expect(HttpStatus.OK)
            .then(() => {
                return request(app.getHttpServer())
                    .get('/coffees/1')
                    .expect(HttpStatus.NOT_FOUND);
            })
    });

    afterAll(async () => {
        await app.close();
    });
});