import { Connection } from "typeorm"

import { UsersRepository } from "../../../users/repositories/UsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"

import createConnection from '../../../../database'
import request from 'supertest'
import { app } from "../../../../app"

let connection: Connection
let usersRepository: UsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Get balance controller", () => {
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

    it("should be able to get an user's balance", async () => {
        const user = await createUserUseCase.execute({
            name: "johnathan",
            email: "john@gmail.com",
            password: '0000'
        })

        const {token} = await authenticateUserUseCase.execute({email: user.email, password: '0000'})

        const response = await request(app).get('/api/v1/statements/balance').set({
            Authorization: `Bearer ${token}`
        })

        expect(response.body).toHaveProperty('balance')
        expect(response.body.balance).toEqual(0)
    })

})
