import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1706862135514 implements MigrationInterface {

    private readonly logger = new Logger($npmConfigName1706862135514.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Migration has been run');
        await queryRunner.query(`UPDATE users SET email = 'admin'`);
    }

    public async down(): Promise<void> {
        this.logger.log('Migration has been reverted');
    }

}
