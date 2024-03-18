import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1710584822943 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" text array NOT NULL DEFAULT '{ "Patient"}'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isSecondFactorAuthenticated"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
