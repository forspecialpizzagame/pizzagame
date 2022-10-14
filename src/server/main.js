import cookieParser from "cookie-parser"
import express from "express"
import path from "path"
import { databaseURL, port, root, version } from "./config.js"
import { Database } from "./database.js"
import { databaseMiddleware } from "./middlewares/database.middleware.js"
import { mainRouter } from "./routes/mian.route.js"

const app = express()

export const database = new Database(databaseURL)
database.connect()

app.set("view engine", "ejs")
app.set("views", path.resolve(root, "views"))

app.use("/public", express.static(path.resolve(root, "..", "public")))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/", databaseMiddleware, mainRouter)

app.listen(port, () => console.log(`Server running on port ${port}. Version ${version}`))