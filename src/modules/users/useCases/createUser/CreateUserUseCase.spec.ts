import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user use case", () => {
    
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
    })

    it("Should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "john",
            email: "john@gmail.com",
            password: "123"
        });

        expect(user).toMatchObject({
            name: user.name,
            email: user.email,
            password: user.password
        });
    });

    it("shouldn't be able to create an user with an already registered email", () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "doe",
                email: "doe@gmail.com",
                password: "456"
            });

            await createUserUseCase.execute(user);
        }).rejects.toBeInstanceOf(CreateUserError);
    });

});