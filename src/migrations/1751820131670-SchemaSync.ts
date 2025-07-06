import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1751820131670 implements MigrationInterface {
    name = 'SchemaSync1751820131670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`);
    }

}
