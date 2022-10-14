import { PlayerService } from "./player.service.js"

export class PlayerController {
    constructor() {
        this._playerService = new PlayerService()
    }
    
    getPlayer(req, res) {
        this._playerService.getPlayer(req.cookies["auth"])
            .then((data) => {
                delete data[0].id
                    delete data[0].name

                    data[0].pizzaList = {}

                    for (let key in data[0]) {
                        if (key != "money" && key != "highscore" && key != "pizzaList") {
                            data[0].pizzaList[key] = data[0][key]
                            delete data[0][key]
                        }
                    }

                    res.status(200).json(data)
            })
            .catch(() => res.status(500).json({ error: "Server error" }))
    }

    getPlayers(req, res) {
        this._playerService.getPlayers(req.body.count)
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ error: "Server error" }))
    }

    buyPizza(req, res) {
        this._playerService.buyPizza(req.cookies["auth"], req.body)
            .then((data) => res.json(data))
            .catch((code) => res.status(code ?? 500).json({ error: "Server error" }))
    }

    updatePlayer(req, res) {
        this._playerService.updatePlayer(req.cookies["auth"], req.body)
            .then((data) => res.json(data))
            .catch((code) => res.status(code ?? 500).json({ error: "Server error" }))
    }

    logout(req, res) {
        res.clearCookie("auth")
        res.status(200).json({})
    }
}