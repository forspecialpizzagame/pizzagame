import pg from "pg"

export class Database {
    constructor(
        url
    ) {
        this._client = new pg.Client({
            connectionString: url,
            ssl: { rejectUnauthorized: false }
        })
        this._isWorking = false
    }

    get getIsWorking() { return this._isWorking }

    connect() {
        this._client.connect()
            .then(async () => {
                this._isWorking = true
                console.log("Database is running...")
            })
            .catch(() => {
                this._isWorking = false
                console.log("Database is not working")
            })
    }

    async query(query) {
        return new Promise(async (resolve, reject) => {
            await this._client.query(query, [], (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.rows)
                }
            })
        })
    }
}