import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtForTags1760366337685 implements MigrationInterface {
    name = 'AddCreatedAtForTags1760366337685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "createdAt"`);
    }

}
