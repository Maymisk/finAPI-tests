import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetBalanceError } from "./GetBalanceError"


let statementRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance use case", () => {

    beforeEach(() => {
        statementRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();

        createUserUseCase = new CreateUserUseCase(usersRepository);
        getBalanceUseCase = new GetBalanceUseCase(statementRepository, usersRepository);
    });

    it("Should be able to get an user's balance", async () => {
        const user = await createUserUseCase.execute({
            name: "third john",
            email: "thirdjohn@gmail.com",
            password: "000000"
        });

        const balance = await getBalanceUseCase.execute({user_id: user.id as string});

        expect(balance).toHaveProperty("statement");
        expect(balance).toHaveProperty("balance")
    });

    it("shouldn't be able to get the balance of a nonexistent user", () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id: "some id hehe"});
        }).rejects.toBeInstanceOf(GetBalanceError)
    });

});