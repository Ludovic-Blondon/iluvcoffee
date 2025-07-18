/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  let coffeeId: number;
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  describe('Create [POST /]', () => {
    describe('when coffee data is correct', () => {
      it('Create [POST /]', async () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send(coffee as CreateCoffeeDto)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            expect(body).toEqual(expectedPartialCoffee);
            coffeeId = body.id;
          });
      });
    });

    describe('when coffee data is incorrect', () => {
      it('should return 400 if no data is sent', () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send({})
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if name is too short', async () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send({ ...coffee, name: 'a' } as CreateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'name must be longer than or equal to 3 characters',
            ]);
          });
      });

      it('should return 400 if name is too long', async () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send({ ...coffee, name: 'a'.repeat(256) } as CreateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'name must be shorter than or equal to 255 characters',
            ]);
          });
      });

      it('should return 400 if brand is too short', async () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send({ ...coffee, brand: 'a' } as CreateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'brand must be longer than or equal to 3 characters',
            ]);
          });
      });

      it('should return 400 if brand is too long', async () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send({ ...coffee, brand: 'a'.repeat(256) } as CreateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'brand must be shorter than or equal to 255 characters',
            ]);
          });
      });

      it('should return 400 if flavors is not an array', async () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send({
            ...coffee,
            flavors: 'chocolate' as unknown as string[],
          } as CreateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              "All flavors's elements must be unique",
              'flavors must be an array',
            ]);
          });
      });

      it('should return 400 if flavors is not an array of strings', async () => {
        return request(app.getHttpServer())
          .post('/coffees')
          .send({
            ...coffee,
            flavors: [1, 2, 3] as unknown as string[],
          } as CreateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'each value in flavors must be a string',
            ]);
          });
      });
    });
  });

  describe('Get all [GET /]', () => {
    it('Get all [GET /]', async () => {
      return request(app.getHttpServer())
        .get('/coffees')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
          expect(body).toEqual(expect.arrayContaining([expectedPartialCoffee]));
        });
    });
  });

  describe('Get one [GET /:id]', () => {
    describe('when coffee with id exists', () => {
      it('Get one [GET /:id]', async () => {
        return request(app.getHttpServer())
          .get(`/coffees/${coffeeId}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(expectedPartialCoffee);
          });
      });

      describe('when coffee with id does not exist', () => {
        it('should return 404', async () => {
          return request(app.getHttpServer())
            .get('/coffees/1000')
            .expect(HttpStatus.NOT_FOUND)
            .then(({ body }) => {
              expect(body.message).toEqual(`Coffee #1000 not found`);
            });
        });

        it('should return 404 if id is not a number', async () => {
          return request(app.getHttpServer())
            .get('/coffees/not-a-number')
            .expect(HttpStatus.BAD_REQUEST)
            .then(({ body }) => {
              expect(body.message).toEqual(
                'Validation failed (numeric string is expected)',
              );
            });
        });
      });
    });
  });

  describe('Update one [PATCH /:id]', () => {
    describe('when coffee with id exists', () => {
      it('Update one [PATCH /:id]', async () => {
        const updateCoffeeDto: UpdateCoffeeDto = {
          ...coffee,
          name: 'New and Improved Shipwreck Roast',
        };

        return request(app.getHttpServer())
          .patch(`/coffees/${coffeeId}`)
          .send(updateCoffeeDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.name).toEqual(updateCoffeeDto.name);
          });
      });
    });

    describe('when coffee with id does not exist', () => {
      it('should return 404', async () => {
        return request(app.getHttpServer())
          .patch('/coffees/1000')
          .send(coffee)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.message).toEqual(`Coffee #1000 not found`);
          });
      });
    });

    describe('when payload is incorrect', () => {
      it('should return 400 if name is too short', async () => {
        return request(app.getHttpServer())
          .patch('/coffees/1')
          .send({ name: 'a' } as UpdateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'name must be longer than or equal to 3 characters',
            ]);
          });
      });

      it('should return 400 if name is too long', async () => {
        return request(app.getHttpServer())
          .patch('/coffees/1')
          .send({ name: 'a'.repeat(256) } as UpdateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'name must be shorter than or equal to 255 characters',
            ]);
          });
      });

      it('should return 400 if brand is too short', async () => {
        return request(app.getHttpServer())
          .patch('/coffees/1')
          .send({ brand: 'a' } as UpdateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'brand must be longer than or equal to 3 characters',
            ]);
          });
      });

      it('should return 400 if brand is too long', async () => {
        return request(app.getHttpServer())
          .patch('/coffees/1')
          .send({ brand: 'a'.repeat(256) } as UpdateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'brand must be shorter than or equal to 255 characters',
            ]);
          });
      });

      it('should return 400 if flavors is not an array', async () => {
        return request(app.getHttpServer())
          .patch('/coffees/1')
          .send({
            flavors: 'chocolate' as unknown as string[],
          } as UpdateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              "All flavors's elements must be unique",
              'flavors must be an array',
            ]);
          });
      });

      it('should return 400 if flavors is not an array of strings', async () => {
        return request(app.getHttpServer())
          .patch('/coffees/1')
          .send({
            flavors: [1, 2, 3] as unknown as string[],
          } as UpdateCoffeeDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.message).toEqual([
              'each value in flavors must be a string',
            ]);
          });
      });
    });
  });

  describe('Recommend coffee [POST /:id/recommend]', () => {
    it('when coffee with id exists', async () => {
      const coffee = await request(app.getHttpServer())
        .get(`/coffees/${coffeeId}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => body);
      const recommendedScore = coffee.recommendations;

      return request(app.getHttpServer())
        .post(`/coffees/${coffeeId}/recommend`)
        .expect(HttpStatus.ACCEPTED)
        .then(async () => {
          const coffee = await request(app.getHttpServer())
            .get(`/coffees/${coffeeId}`)
            .expect(HttpStatus.OK)
            .then(({ body }) => body);
          expect(coffee.recommendations).toBe(recommendedScore + 1);
        });
    });

    it('when coffee with id does not exist', async () => {
      return request(app.getHttpServer())
        .post('/coffees/1000/recommend')
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toEqual(`Coffee #1000 not found`);
        });
    });
  });

  describe('Delete one [DELETE /:id]', () => {
    it('when coffee with id exists', async () => {
      return request(app.getHttpServer())
        .delete(`/coffees/${coffeeId}`)
        .expect(HttpStatus.OK)
        .then(() => {
          return request(app.getHttpServer())
            .get(`/coffees/${coffeeId}`)
            .expect(HttpStatus.NOT_FOUND);
        });
    });

    it('when coffee with id does not exist', async () => {
      return request(app.getHttpServer())
        .delete('/coffees/1000')
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toEqual(`Coffee #1000 not found`);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
