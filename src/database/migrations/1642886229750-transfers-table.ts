import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";

export class CreateTransferOperation1642874679193 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "transfers",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "sender_id",
                    type: "uuid"
                },
                {
                    name: "amount",
                    type: "numeric"
                },
                {
                    name: "description",
                    type: "varchar"
                },
                {
                    name: "type",
                    type: "enum",
                    enum: ["transfer", "receive"]
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ],
            foreignKeys: [
                {
                    name: "FKTransferSenderUser",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    columnNames: ["sender_id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("transfers")
    }

}
