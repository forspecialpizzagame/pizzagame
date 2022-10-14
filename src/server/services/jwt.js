import jsonwebtoken from "jsonwebtoken"
import { jwtKey } from "../config.js"

export class JWTService {
    create(data) {
        return jsonwebtoken.sign(data, jwtKey, { expiresIn: "10000000s" })
    }

    verify(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, jwtKey, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
}