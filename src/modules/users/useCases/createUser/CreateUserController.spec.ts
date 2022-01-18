import { Connection } from "typeorm";
import createConnection from '../../../../database'
import request from 'supertest'
import { app } from "../../../../app";


let connection: Connection

describe("Create user controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })
    
    it("Should be able to create an user", async () => {
        const response = await request(app).post('/api/v1/users').send({
            name: 'new user',
            email:'newuser@gmail.com',
            password: 'mynewpassword123'
        })

        expect(response.status).toBe(201)
    })
})