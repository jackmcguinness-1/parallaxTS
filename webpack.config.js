module.exports = {
    entry: "./build/parallax.js",
    output: {
        path: __dirname + "/dist",
        filename: "Parallax.js",
    },
    module: {
        rules: [
            {
            exclude: [
                /node_modules/,
            ]
            }
        ]
    }
}