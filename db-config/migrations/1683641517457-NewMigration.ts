import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1683641517457 implements MigrationInterface {
    name = 'NewMigration1683641517457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brandId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "brandId" integer`);
    }

}
