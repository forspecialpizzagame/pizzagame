import { database } from "../main.js"

export function databaseMiddleware(req, res, next) {    
    if (database.getIsWorking) {
        next()
    } else {
        res.render("error-page", {
            code: "500",
            message: "Server is not working now",
            linkTitle: "",
            linkHref: "#"
        })
    }
}