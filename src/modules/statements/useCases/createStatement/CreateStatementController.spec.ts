import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'
import { UsersRepository } from '../../../users/repositories/UsersRepository'
import { AuthenticateUserUseCase } from '../../../users/useCases/authenticateUser/AuthenticateUserUseCase'
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'

let connection: Connection
let usersRepository: UsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Create statement controller", () => {
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

    it("Should be able to create a deposit statement", async () => {
        const user = await createUserUseCase.execute({
            name: "random guy",
            email: "randomg@gmail.com",
            password: "123"
        })

        const {token} = await authenticateUserUseCase.execute({email: user.email, password: '123'})
        
        const response = await request(app).post('/api/v1/statements/deposit').send({
            amount: 100,
            description: "$100 deposit"
        }).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("type")
        expect(response.body.description).toEqual('$100 deposit')
    })
})