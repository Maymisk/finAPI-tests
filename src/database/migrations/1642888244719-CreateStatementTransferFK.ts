import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class CreateStatementTransferFK1642888244719 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey('statements', new TableForeignKey({
            name: "FKStatementTransfer",
            referencedTableName: "transfers",
            referencedColumnNames: ["id"],
            columnNames: ["transfer_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('statements', 'FKStatementTransfer')
    }

}
