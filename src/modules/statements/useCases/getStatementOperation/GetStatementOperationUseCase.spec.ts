import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let statementRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operation use case", () => {
    beforeEach(() => {
        statementRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();

        createUserUseCase = new CreateUserUseCase(usersRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementRepository);
    })

    it("Should be able to get an user's statement operation", async () => {
        const user = await createUserUseCase.execute({
            name: "third doe",
            email: "thirddoe@gmail.com",
            password: "123123123"
        })

        const statement = await createStatementUseCase.execute({user_id: user.id as string, type: OperationType.DEPOSIT, amount: 120, description: "120 bucks deposit"});

        const statementOperation = await getStatementOperationUseCase.execute({user_id: user.id as string, statement_id: statement.id as string});

        expect(statementOperation.user_id).toEqual(user.id);
        expect(statementOperation.description).toEqual("120 bucks deposit");
    });

    it("Shouldn't be able to get a nonexistent user's statement operation", async () => {
        await expect(async () => {
            const user = await createUserUseCase.execute({
                name: "fourth john",
                email: "fourthjohn@gmail.com",
                password: "456456456"
            });

            const statement = await createStatementUseCase.execute({user_id: user.id as string, type: OperationType.DEPOSIT, amount: 150, description: "150 bucks deposit"});
            
            await getStatementOperationUseCase.execute({user_id: "some fake user id", statement_id: statement.id as string});

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it("shouldn't be able to get a nonexistent statement operation", async () => {
        await expect(async () => {
            const user = await createUserUseCase.execute({
                name: "fourth doe",
                email: "fourthdoe@gmail.com",
                password: "88888"
            });

            const statement = await createStatementUseCase.execute({user_id: user.id as string, type: OperationType.DEPOSIT, amount: 200, description: "200 bucks deposit"});
            
            await getStatementOperationUseCase.execute({user_id: user.id as string, statement_id: "some fake statement id"});
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});