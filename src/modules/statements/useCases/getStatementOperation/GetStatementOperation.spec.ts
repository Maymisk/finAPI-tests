import { Connection } from 'typeorm'
import createConnection from '../../../../database'
import { UsersRepository } from '../../../users/repositories/UsersRepository'
import { AuthenticateUserUseCase } from '../../../users/useCases/authenticateUser/AuthenticateUserUseCase'
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { OperationType } from '../../entities/Statement'
import { StatementsRepository } from '../../repositories/StatementsRepository'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import request from "supertest"
import { app } from '../../../../app'

let connection: Connection
let usersRepository: UsersRepository
let statemensRepository: StatementsRepository

let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Get statement operation controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

        usersRepository = new UsersRepository()
        statemensRepository = new StatementsRepository()

        createUserUseCase = new CreateUserUseCase(usersRepository)
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statemensRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    it("Should be able to get an user's statement operation", async () => {
        const user = await createUserUseCase.execute({
            name: "justin",
            email: "justin@gmail.com",
            password: "8765"
        })

        const {token} = await authenticateUserUseCase.execute({email: user.email, password: "8765"})

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: '$100 bucks deposit'
        })

        const response = await request(app).get(`/api/v1/statements/${statement.id}`).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("type")
        expect(response.body).toHaveProperty("user_id")
    })

})