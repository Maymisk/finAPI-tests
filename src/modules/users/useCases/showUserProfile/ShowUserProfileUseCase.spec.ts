import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let usersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });

    it("Should be able to show an user's profile", async () => {
        const user = await createUserUseCase.execute({
            name: "david bowie",
            email: "davidb@gmail.com",
            password: "s0mebodyUpTh3r3L1kesM3"
        })

        const showUser = await showUserProfileUseCase.execute(user.id as string);

        expect(showUser).toBeInstanceOf(User);
        expect(showUser.id).toEqual(user.id);
    });

    it("shouldn't be able to show a nonexisting user's profile", () => {
        expect(async () => {
            await showUserProfileUseCase.execute('fake id');
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});