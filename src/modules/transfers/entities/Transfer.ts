import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Statement } from "../../statements/entities/Statement";

enum TransferType {
    TRANSFER = "transfer",
    RECEIVE = "receive"
}

@Entity("transfers")
class Transfer {

    @PrimaryColumn('uuid')
    id?: string;

    @Column('uuid')
    sender_id: string;

    @Column()
    amount: number;

    @Column()
    description: string;

    @Column({type: 'enum', enum: TransferType})
    type?: TransferType;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor(){
        if(!this.id) {
            this.id = uuidV4()
        }

        if(!this.type) {
            this.type = TransferType.TRANSFER
        }
    }
}

export {Transfer, TransferType}