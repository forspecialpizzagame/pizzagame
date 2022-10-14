import { pizzaCostList } from "../../config.js"
import { JWTService } from "../../services/jwt.js"
import { PlayerRepository } from "./player.repository.js"

export class PlayerService {
    constructor() {
        this._playerRepository = new PlayerRepository()
        this._jwt = new JWTService()
    }

    async getPlayer(token) {
        return this._jwt.verify(token)
            .then(async (data) => await this._playerRepository.getPlayer(data.username))
    }

    async getPlayers(count) {
        return this._playerRepository.getPlayers(count)
    }

    async buyPizza(token, body) {
        return new Promise(async (resolve, reject) => {
            this._jwt.verify(token)
                .then(async (data) => {
                    if (body["pizzaName"] != undefined) {
                        const player = await this._playerRepository.getPlayer(data.username)
                        const isPizza = player[0][body["pizzaName"]]
                        
                        if (pizzaCostList[body["pizzaName"]] == "not sold") {
                            await this._playerRepository.setPlayer(data.username, body["pizzaName"], true)
                            resolve({ status: "ok" })
                        } else {
                            const money = player[0]["money"]

                            if (money >= pizzaCostList[body["pizzaName"]] && !isPizza) {
                                await this._playerRepository.setPlayer(data.username, "money", money - pizzaCostList[body["pizzaName"]])
                                await this._playerRepository.setPlayer(data.username, body["pizzaName"], true)
                                resolve({ status: "ok" })
                            } else {
                                resolve({ status: "not ok" })
                            }
                        }
                    } else {
                        reject(400)
                    }
                })
                .catch(() => reject(500))
        })
    }

    async updatePlayer(token, body) {
        return new Promise(async (resolve, reject) => {
            this._jwt.verify(token)
                .then(async (data) => {
                    if (body["money"] != undefined && body["highscore"] != undefined) {
                        await this._playerRepository.setPlayer(data.username, "money", body["money"])
                        await this._playerRepository.setPlayer(data.username, "highscore", body["highscore"])
                        resolve({ status: "ok" })
                    } else {
                        reject(400)
                    }
                })
                .catch(() => reject(500))
        })
    }
}