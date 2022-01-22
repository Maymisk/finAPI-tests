import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";

export interface ITransfersRepository {
    create({amount, description, sender_id}: ICreateTransferDTO): Promise<Transfer>;
}