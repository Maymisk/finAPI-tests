import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create statement use case", () => {
    beforeEach(() => {
        statementRepository = new InMemoryStatementsRepository()
        usersRepository = new InMemoryUsersRepository()

        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementRepository)
        createUserUseCase = new CreateUserUseCase(usersRepository)
    });

    it("should be able to create a new deposit", async () => {
        const user = await createUserUseCase.execute({
            name: "another john",
            email: "anotherjohn@gmail.com",
            password: "999"
        });
        
        const statementOperation = await createStatementUseCase.execute({user_id: user.id as string, type: OperationType.DEPOSIT, amount: 100, description: "normal deposit"});

        expect(statementOperation).toHaveProperty("user_id");
        expect(statementOperation).toHaveProperty("amount");
        expect(statementOperation).toHaveProperty("type");
    });

    it("should be able to create a new withdrawal", async () => {
        const user = await createUserUseCase.execute({
            name: "some person",
            email: "someperson@gmail.com",
            password: "765765"
        });
        
        await createStatementUseCase.execute({user_id: user.id as string, type: OperationType.DEPOSIT, amount: 100, description: "$100 deposit"});
        const statementOperation = await createStatementUseCase.execute({user_id: user.id as string, type: OperationType.WITHDRAW, amount: 50, description: "$50 withdrawal"});

        expect(statementOperation).toHaveProperty("user_id");
        expect(statementOperation).toHaveProperty("amount");
        expect(statementOperation).toHaveProperty("type");
    });

    it("A nonexistent user shouldn't be able to create a new statement", () => {
        expect(async () => {
            const statementOperation = await createStatementUseCase.execute({
                user_id: "some id that doesn't exist", 
                type: OperationType.DEPOSIT, 
                amount: 100, 
                description: "impossible deposit"});

        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("A user shouldn't be able to withdraw money they don't have", () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "another doe",
                email: "anotherdoe@gmail.com",
                password: "101010"
            });

            const statementOperation = await createStatementUseCase.execute({
                user_id: user.id as string, 
                type: OperationType.WITHDRAW, 
                amount: 10000, 
                description: "sneaky invalid withdraw" });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});