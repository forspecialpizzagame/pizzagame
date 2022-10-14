import { database } from "../../main.js"

export class PlayerRepository {
    constructor() {}
    
    async getPlayer(name) {
        return await database.query(`SELECT * FROM players WHERE name = '${name}'`)
    }

    async getPlayers(count) {
        return await database.query(`SELECT name, highscore FROM players ORDER BY highscore DESC LIMIT ${count}`)
    }

    async setPlayer(name, column, value) {
        return await database.query(`UPDATE players SET ${column} = ${value} WHERE name = '${name}'`)
    }
}