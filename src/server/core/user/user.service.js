import crypto from "crypto"
import { JWTService } from "../../services/jwt.js"
import { ValidatorService } from "../../services/validator.js"
import { UserRepository } from "./user.repository.js"

export class UserService {
    constructor() {
        this._validator = new ValidatorService()
        this._jwt = new JWTService()

        this.repository = new UserRepository()
    }

    async login(username, password) {
        return new Promise(async (resolve, reject) => {
            if ((!username) || (!password)) {
                reject("Fields did not complete")
            } else {
                if (!this._validator.verifyUsername(username)) {
                    reject("Username is not correct. [A-Z][a-z][0-9][_] (<13)")
                } else if (!this._validator.verifyPassword(password)) {
                    reject("Password is not correct. [A-Z][a-z][0-9][_] (>5<17)")
                } else {
                    await this.repository.verifyUser(username, crypto.createHash("SHA256").update(password).digest("hex"))
                        .then((data) => {
                            if (data.length != 0) {
                                resolve(this._jwt.create({ username }))
                            } else {
                                reject("Username or password are not match")
                            }
                        })
                        .catch(() => reject("Database error"))
                }
            }
        })
    }

    async signup(username, password, rpassword) {
        return new Promise(async (resolve, reject) => {
            if ((!username) || (!password) || (!rpassword)) {
                reject("Fields did not complete")
            } else {
                if (password != rpassword) {
                    reject("Passwords are unequal")
                } else if (!this._validator.verifyUsername(username)) {
                    reject("Username is not correct. [A-Z][a-z][0-9][_] (<13)")
                } else if (!this._validator.verifyPassword(password)) {
                    reject("Password is not correct. [A-Z][a-z][0-9][_] (>5<17)")
                } else {
                    await this.repository.findUser(username)
                        .then(async (data) => {
                            if (data.length == 0) {
                                await this.repository.createUser(username, crypto.createHash("SHA256").update(password).digest("hex"))
                                    .then(() => resolve())
                                    .catch(() => reject("Database error"))
                            } else {
                                reject("Username is taken")
                            }
                        })
                        .catch(() => resolve("Database error"))
                }
            }
        })
    }
}