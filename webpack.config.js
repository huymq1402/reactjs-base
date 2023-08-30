const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require('webpack')
const env = (process.env.ENV == "production" || process.env.ENV == "prod") ? "prod" : "dev";
const CONFIG_PATH = path.resolve(`src/configs/config.${env}.js`);
module.exports = {
    entry: "./src/index.js", // Dẫn tới file index.js ta đã tạo
    output: {
        path: path.join(__dirname, "/build"), // Thư mục chứa file được build ra
        filename: "bundle.js", // Tên file được build ra
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Sẽ sử dụng babel-loader cho những file .js
                exclude: /node_modules/, // Loại trừ thư mục node_modules
                use: ["babel-loader"]
            },
            {
                test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.svg$/, // Sử dụng @svgr/webpack (dùng svg như React components) / file-loader (dùng svg như url) cho các file png, svg, ....
                use: [
                    '@svgr/webpack',
                    'file-loader',
                ],
            },
        ]
    },
    resolve: {
        alias: {
            "@config": CONFIG_PATH,
            "src": path.resolve("src"),
            "@modules": path.resolve("src/modules"),
            "@containers": path.resolve("src/modules/containers"),
            "@components": path.resolve("src/modules/components"),
        }
    },
    devServer: {
        historyApiFallback: true,
    },
    // Chứa các plugins sẽ cài đặt trong tương lai
    plugins: [
        // Alias import in HTML
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico',
            logo: './public/logo192.png',
            manifest: "./public/manifest.json"
        }),

        // Auto import React from 'react'
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            React: "react"
        })
    ]
};