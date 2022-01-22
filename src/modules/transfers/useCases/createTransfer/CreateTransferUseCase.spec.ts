import { OperationType } from "../../../statements/entities/Statement"
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../../../statements/useCases/createStatement/CreateStatementUseCase"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryTransfersRepository } from "../../repositories/in-memory/InMemoryTransfersRepository"
import { CreateTransferUseCase } from "./CreateTransferUseCase"


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTransfersRepository: InMemoryTransfersRepository

let createTransferUseCase: CreateTransferUseCase
let createStatementUseCase: CreateStatementUseCase

describe("Create transfer use case", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryTransfersRepository = new InMemoryTransfersRepository()

        createTransferUseCase = new CreateTransferUseCase(
            inMemoryTransfersRepository, 
            inMemoryStatementsRepository, 
            inMemoryUsersRepository)

        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository)
    })

    it("Should be able to create a new transference", async () => {
        const receiverUser = await inMemoryUsersRepository.create({
            name: "Marguerite Barnes",
            email: "cihi@ewiwuvik.gb",
            password: "1234"
        })

        const senderUser = await inMemoryUsersRepository.create({
            name: "Laura Gibbs",
            email: "ohe@osi.to",
            password: "4321"
        })

        await createStatementUseCase.execute({
            user_id: senderUser.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "minimum amount needed"
        })

        const transfer = await createTransferUseCase.execute({
            amount: 100,
            description: "a nice deposit to you :blush:",
            sender_id: senderUser.id as string,
            receiver_id: receiverUser.id
        })

        expect(transfer).toHaveProperty("id")
        expect(transfer).toHaveProperty("sender_id")
        expect(transfer).toHaveProperty("type")
    })
})