import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import createConnection from '../../../../database'
import request from 'supertest'
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";

let connection: Connection

let usersRepository: UsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Show user profile controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

        usersRepository = new UsersRepository()
        createUserUseCase = new CreateUserUseCase(usersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    it("Should be able to show an user's profile", async () => {
        const user = await createUserUseCase.execute({
            name: "johnny",
            email: "johnny@gmail.com",
            password: "johnnyspassword123"
        })

        const {token} = await authenticateUserUseCase.execute({
            email: user.email,
            password: 'johnnyspassword123'
        })

        const response = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`
        })

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("name")
        expect(response.body).toHaveProperty("email")
        expect(response.body).toHaveProperty("created_at")
        expect(response.body).toHaveProperty("updated_at")
    })
})
