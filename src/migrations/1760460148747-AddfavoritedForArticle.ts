import { MigrationInterface, QueryRunner } from "typeorm";

export class AddfavoritedForArticle1760460148747 implements MigrationInterface {
    name = 'AddfavoritedForArticle1760460148747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "favorited" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "favoritesCount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "favoritesCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "favorited"`);
    }

}
