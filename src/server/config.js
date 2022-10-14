import path from "path"

export const version = "1.7.2"
export const root = path.resolve("src", "server")

export const port = process.env.PORT ?? 80
export const jwtKey = process.env.JWT_KEY
export const adminName = process.env.ADMIN_NAME
export const adminPassword = process.env.ADMIN_PASSWORD
export const databaseURL = process.env.DATABASE_URL
export const pizzaCostList = {
    "pepperoni": "not sold",
    "farmhouse": 50,
    "margaret": 150,
    "cheese": 300,
    "spice": 2000,
    "tuscany": 700,
    "carbonara": 300,
    "belarusian": 800,
    "hawaiian": 300,
    "mexican": 1200,
    "pumpkin": 600,
    "italian": 1500,
    "gold": 3000,
    "bavarian": 1500,
    "chicken": 700,
    "diamond": "not sold",
    "ruby": "not sold",
    "emerald": "not sold",
    "amethyst": "not sold",
    "jade": "not sold",
    "topaz": "not sold",
    "amber": "not sold"
}