import { database } from "../../main.js"

export class UserRepository {
    async findUser(name) {
        return await database.query(`SELECT name FROM users WHERE name = '${name}'`)
    }
    
    async createUser(name, hash) {
        await database.query(`INSERT INTO users (name, password) VALUES ('${name}', '${hash}')`)
            .then(() => database.query(`INSERT INTO players (name) VALUES ('${name}')`))
    }

    async verifyUser(name, hash) {
        return await database.query(`SELECT * FROM users WHERE name = '${name}' AND password = '${hash}'`)
    }
}