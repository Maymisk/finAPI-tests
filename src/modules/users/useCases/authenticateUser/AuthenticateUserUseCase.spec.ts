import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("authenticate user use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("Should be able to authenticate an user", async () => {
        const user = await createUserUseCase.execute({
            name: "michael jackson",
            email: "mjackson@gmail.com",
            password: "eeee heee"
        });

        const response = await authenticateUserUseCase.execute({email: user.email, password: "eeee heee"});

        expect(response).toHaveProperty("user");
        expect(response).toHaveProperty("token");
    })

    it("shouldn't be able to do authentication with an invalid email", () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "ice cube",
                email: "icecube@gmail.com",
                password: "w3st s1de"
            });

            await authenticateUserUseCase.execute({email: "invalid email", password: user.password});
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("Shouldn't be able to do authentication with an invalid password", () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "george michael",
                email: "geomichael@gmail.com",
                password: "d4ncingCar3l3ssly"
            });

            await authenticateUserUseCase.execute({email: user.email, password: "should've known better than to use the wrong password"});
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});