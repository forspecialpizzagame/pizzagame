import { JWTService } from "../services/jwt.js"

export function authMiddleware(req, res, next) {
    const token = req.cookies["auth"]

    if (token == undefined) {
        res.redirect("/login")
    } else {
        const jwt = new JWTService()
        
        jwt.verify(token)
            .then((data) => {
                res.cookie("auth", jwt.create({ username: data.username }), { httpOnly: true, maxAge: 10000000 * 1000 })
                next()
            })
            .catch((err) => {
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