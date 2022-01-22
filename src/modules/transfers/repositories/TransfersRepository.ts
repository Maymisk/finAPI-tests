import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { ITransfersRepository } from "./ITransfersRepository";


class TransfersRepository implements ITransfersRepository {
    private transfersRepository: Repository<Transfer>

    constructor() {
        this.transfersRepository = getRepository(Transfer)
    }

    async create({ amount, description, sender_id }: ICreateTransferDTO): Promise<Transfer> {
        const transfer = this.transfersRepository.create({
            amount,
            description,
            sender_id
        })

        await this.transfersRepository.save(transfer)

        return transfer
    }
}

export {TransfersRepository}