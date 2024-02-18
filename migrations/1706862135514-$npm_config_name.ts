import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1706862135514 implements MigrationInterface {

    private readonly logger = new Logger($npmConfigName1706862135514.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Migration has been run');
        // await queryRunner.query(`CREATE TABLE "genre" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "genreId" integer, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd78d" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`CREATE TABLE "author" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "biography" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "authorId" integer, CONSTRAINT "PK_a3afef72ec8f80e6e5f2f3f80b7" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_1f5e6e8d3c3e3e4e2d7d0c6a7d3" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_3d6e3b6b8d8e9b6e7c8d8e9b6e7" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(): Promise<void> {
        this.logger.log('Migration has been reverted');
    }

}
