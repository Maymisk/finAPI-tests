import { Connection } from "typeorm";
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import createConnection from '../../../../database'
import request from 'supertest'
import { app } from "../../../../app";

let connection: Connection

let usersRespository: UsersRepository
let createUserUseCase: CreateUserUseCase

describe("Authenticate user controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

        usersRespository = new UsersRepository()
        createUserUseCase = new CreateUserUseCase(usersRespository)
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    it("Should be able to authenticate an user", async () => {
        const user = await createUserUseCase.execute({
            name: "pedro",
            email: "pedro@gmail.com",
            password: "pedro123"
        })

        const response = await request(app).post("/api/v1/sessions").send({email: user.email, password: 'pedro123'})

        expect(response.body).toHaveProperty("user")
        expect(response.body).toHaveProperty("token")
    })
})