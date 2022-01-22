import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { OperationType } from "../../../statements/entities/Statement";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { CreateStatementError } from "../../../statements/useCases/createStatement/CreateStatementError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Transfer } from "../../entities/Transfer";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {

    constructor(
        @inject("TransfersRepository")
        private transfersRepository: ITransfersRepository,
        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){}

    async execute({amount, description, sender_id, receiver_id}: ICreateTransferDTO): Promise<Transfer> {
        receiver_id = String(receiver_id)

        const receiverUser = await this.usersRepository.findById(receiver_id)

        if(!receiverUser) {
            throw new AppError("Receiver user does not exist")
        }

        const senderBalance = await this.statementsRepository.getUserBalance({user_id: sender_id})

        if (senderBalance.balance < amount) {
            throw new CreateStatementError.InsufficientFunds()
        }

        const transfer = await this.transfersRepository.create({
            amount, 
            description,
            sender_id
        })

        await this.statementsRepository.create({
            user_id: sender_id,
            amount,
            description,
            type: OperationType.WITHDRAW,
            transfer_id: transfer.id
        })
        
        await this.statementsRepository.create({
            user_id: receiver_id,
            amount,
            description,
            type: OperationType.DEPOSIT,
            transfer_id: transfer.id
        })

        return transfer
    }

}

export {CreateTransferUseCase}