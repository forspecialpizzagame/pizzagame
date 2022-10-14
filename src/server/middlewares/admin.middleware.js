import { adminName, adminPassword } from "../config.js"
import { JWTService } from "../services/jwt.js"

export function adminMiddleware(req, res, next) {
    const token = req.cookies["auth"]

    if (token == undefined) {
        res.redirect("/login")
    } else {
        const jwt = new JWTService()
        
        jwt.verify(token)
            .then((data) => {
                if ((adminName == null) || (adminPassword == null)) {
                    res.redirect("/")
                } else if (data.username === adminName) {
                    next()
                } else {
                    res.render("error-page", {
                        code: 403,
                        message: "Access denied",
                        linkTitle: "login",
                        linkHref: "/login"
                    })
                }
            })
            .catch(() => {
                res.clearCookie("auth")
                res.render("error-page", {
                    code: 401,
                    message: "Token is expired",
                    linkTitle: "login",
                    linkHref: "/login"
                })
            })
    }
}