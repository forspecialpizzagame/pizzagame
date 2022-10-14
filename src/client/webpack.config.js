const path = require("path")

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "game.js",
        path: path.resolve("..", "public", "js")
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts"]
    }
}