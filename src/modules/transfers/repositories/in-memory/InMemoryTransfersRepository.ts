import { Transfer } from "../../entities/Transfer";
import { ICreateTransferDTO } from "../../useCases/createTransfer/ICreateTransferDTO";
import { ITransfersRepository } from "../ITransfersRepository";


class InMemoryTransfersRepository implements ITransfersRepository {
    private transfers: Transfer[] = []

    async create({ amount, description, sender_id }: ICreateTransferDTO): Promise<Transfer> {
        const transfer = new Transfer()

        Object.assign(transfer, {
            amount,
            description,
            sender_id
        })

        this.transfers.push(transfer)
        return transfer
    }

}

export {InMemoryTransfersRepository}