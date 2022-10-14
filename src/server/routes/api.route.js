import express from "express"
import { PlayerController } from "../core/player/player.controller.js"

const playerController = new PlayerController()

export const apiRouter = express.Router()

apiRouter.get("/getplayer", (req, res) => playerController.getPlayer(req, res))
apiRouter.post("/getplayers", (req, res) => playerController.getPlayers(req, res))
apiRouter.post("/buypizza", (req, res) => playerController.buyPizza(req, res))
apiRouter.post("/updateplayer", (req, res) => playerController.updatePlayer(req, res))
apiRouter.get("/logout", (req, res) => playerController.logout(req, res))

apiRouter.use("*", (req, res) => res.status(500).send("error"))