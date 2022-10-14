import express from "express"
import { adminPassword } from "../config.js"
import { UserController } from "../core/user/user.controller.js"
import { database } from "../main.js"
import { adminMiddleware } from "../middlewares/admin.middleware.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { apiRouter } from "./api.route.js"

const userController = new UserController()

export const mainRouter = express.Router()

mainRouter.get("/", authMiddleware, (req, res) => res.render("main-page"))

mainRouter.get("/login", (req, res) => res.render("login-page", { message: "" }))
mainRouter.post("/login", (req, res) => userController.login(req, res))
mainRouter.get("/signup", (req, res) => res.render("signup-page", { message: "" }))
mainRouter.post("/signup", (req, res) => userController.signup(req, res))
mainRouter.get("/logout", (req, res) => userController.logout(req, res))

mainRouter.get("/admin", adminMiddleware, (req, res) => res.render("admin-page", { response: "" }))
mainRouter.post("/admin", adminMiddleware, async (req, res) => {
    if (req.body["password"] == adminPassword) {
        await database.query(req.body["command"])
            .then((data) => res.render("admin-page", { response: JSON.stringify(data) }))
    } else {
        res.render("admin-page", { response: "Access denied" })
    }
})

mainRouter.use("/api", authMiddleware, apiRouter)

mainRouter.get("*", (req, res) => res.render("error-page", {
    code: 404,
    message: "Page dont find",
    linkTitle: "home",
    linkHref: "/"
}))