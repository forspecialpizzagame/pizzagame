import { UserService } from "./user.service.js"

export class UserController {
    constructor() {
        this.userService = new UserService()
    }

    login(req, res) {
        const { username, password } = req.body

        this.userService.login(username, password)
            .then((token) => {
                res.cookie("auth", token, { httpOnly: true, maxAge: 10000000 * 1000 })
                res.redirect("/")
            })
            .catch((err) => res.render("login-page", { message: err }))
    }

    signup(req, res) {
        const { username, password, rpassword } = req.body

        this.userService.signup(username, password, rpassword)
            .then(() => {
                this.login(req, res)
            })
            .catch((err) => res.render("signup-page", { message: err }))
    }

    logout(req, res) {
        res.clearCookie("auth")
        res.redirect("/login")
    }
}