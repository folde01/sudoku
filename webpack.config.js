module.exports = {
    mode: 'development',
    entry: './src/js/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.css$/, 
                loader: "style-loader!css-loader"
            }
        ]
    }
}