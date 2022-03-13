const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerExtractPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production', // LE INDICO EL MODO EXPLICITAMENTE
    entry: './src/index.js', // el punto de entrada de mi aplicación
    output: { // Esta es la salida de mi bundle
        path: path.resolve(__dirname, 'dist'),
        // resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
        // para no tener conflictos entre Linux, Windows, etc
        filename: '[name].[contenthash].js', 
        // EL NOMBRE DEL ARCHIVO FINAL,
        assetModuleFilename: 'assets/images/[hash][ext][query]',
        // Agrego el flag nativo de clean para la carpeta dist
        clean: true
    },
    resolve: {
        extensions: ['.js'], // LOS ARCHIVOS QUE WEBPACK VA A LEER
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/')
        }
    },
    module: {
        // REGLAS PARA TRABAJAR CON WEBPACK
        rules : [
            {
                test: /\.m?js$/, // LEE LOS ARCHIVOS CON EXTENSION .js o .mjs
                exclude: /node_modules/, // IGNORA LOS MODULOS DE LA CARPETA
                use: {
                    loader: 'babel-loader'
                }
            },
            {   //añadiendo el loader de css
                test: /\.css|.styl$/i, // añadimo una regla para css junto con i para que no se aplique a los archivos .css.map
                use: [MiniCssExtractPlugin.loader, // LO QUE HACE ES EXTRACTAR EL CSS A UN ARCHIVO DISTINTO
                'css-loader',   // LO QUE HACE ES CARGAR EL CSS 
                'stylus-loader', // LO QUE HACE ES CARGAR EL precompilador de estilos STYLUS
                ],
            },
            {
                test: /\.png/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000, // O LE PASAMOS UN BOOLEANOS TRUE O FALSE
                        // Habilita o deshabilita la transformación de archivos en base64.
                       mimetype: 'aplication/font-woff',
                       // Especifica el tipo MIME con el que se alineará el archivo. 
                       // Los MIME Types (Multipurpose Internet Mail Extensions)
                       // son la manera standard de mandar contenido a través de la red.
                       name: "[name].[contenthash].[ext]",
                       // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN
                       // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria 
                       // ubuntu-regularhola.woff
                       outputPath: './assets/fonts/', 
                       // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
                       publicPath: '../assets/fonts/',
                       // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
                      esModule: false 
                       // AVISAR EXPLICITAMENTE SI ES UN MODULO
                }
                }
            }
        ]
    },
    // SECCION DE PLUGINS
    plugins: [
        new HtmlWebpackPlugin({ // CONFIGURACIÓN DEL PLUGIN
            inject: true, // INYECTA EL BUNDLE AL TEMPLATE HTML
            template: './public/index.html', // LA RUTA AL TEMPLATE HTML
            filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }), //Utilizamos el css-loader y el mini-css-extract-plugin para extraer el css a un archivo aparte
        new CopyPlugin({ // COPIA LOS ARCHIVOS DE LA CARPETA src A LA CARPETA DIST
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerExtractPlugin(), //optimizacion css
            new TerserPlugin(), //Optimizacion Javascript
        ]
    }
}