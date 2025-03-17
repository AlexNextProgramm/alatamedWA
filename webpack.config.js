const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { javascript } = require('webpack');

 const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev


const folder = {
    Public:{
        name:'Public',
        Css:"CSS",
        json:"Json",
        javascript: "JS",
        images: "images"
    },
    src:{
        name:'src',
        api:"api",
        component: 'component',
        Css: {name:"CSS",
               fonts:'fonts'
            },
        json:"JSON",
        javascript: "JS",
        images: "images"
    }
}

// console.log('isDev:', isDev)

const index = {
    context: path.resolve(__dirname, folder.src.name),
    mode: "development",
    entry:{},
    devtool: 'inline-source-map',
    output:{
        filename: `./${folder.Public.javascript}/[name][hash].js`,
        path: path.resolve(__dirname, folder.Public.name),
        assetModuleFilename: 'images/[name][ext][query]',
    },
    plugins:[
             new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*', '!php/**'],
             }),
             new MiniCssExtractPlugin({
                filename:`./${folder.Public.Css}/[name][hash].css` }),
                new CopyPlugin({
                    patterns: [
                      {
                        context: path.resolve(__dirname, 'src/'),
                        from: ".htaccess",
                        to:''

                      },
                      {
                        context: path.resolve(__dirname, 'src/JSON'),
                        from: "./*.json",
                        to:'Json'
                      },
                      {
                        context: path.resolve(__dirname, 'src/images/whatsApp'),
                        from: "./*.*",
                        to:'images'

                      },
                      {
                        context: path.resolve(__dirname, 'src/images/IMAGE-SAMPLE'),
                        from: "./*.*",
                        to:'images/IMAGE-SAMPLE'

                      },
                    ],
                  })
            ],
    module:{
        rules:[ {
                test:/\.css$/,
                use:[
                    {
                    loader:MiniCssExtractPlugin.loader,
                    options: {  },
                    },'css-loader'
                  ]
            },
            {
                test:/\.s[ac]ss$/,
                use:[{ loader:MiniCssExtractPlugin.loader,
                        options: {  },
                     },'css-loader','sass-loader']
            },
            {
                test: /\.(png|jpg|svg|gif|jpeg)$/,
                type: "asset/resource",
                
                
            },
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.json"
                }
            },
            {
                test:/\.(ttf|woff|woff2|eot)$/,
                loader:'file-loader',
                options:{
                         outputPath: 'CSS/ttf'
                        }
            },{
                test: /\.json$/i,
                type: "asset/resource",
                generator: {
                    filename: 'Json/[name].json'
                  }
            }
           
            
        ]
    },
    resolve:{
        extensions:['.tsx','.ts', '.js'],//',json', 'png','img','svg'],
        // extensionAlias: {
        //   '.js': ['.ts', '.js']    
        // },
      
        // alias:{ '@models': path.resolve(__dirname, 'src')  },
        // fallback:{
        //     "fs": false,
        //     "tls": false,
        //     "net": false,
        //     "path": false,
        //     "zlib": false,
        //     "http": false,
            
        //     "https": false,
        //     "stream": false,
          
        // }
    },
    devServer:{
        port: 3000,
        hot: isDev
    },
    // optimization:{
    //     splitChunks: {
    //                 chunks: 'all'
    //                 },
    //     minimize: true,
    //     minimizer: [
    //     //   For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
    //       // `...`
    //     //   new JsonMinimizerPlugin({
    //     //     test: /\.foo\.json/i,
    //     //   }),
    //     ]
    // },

}



let Page = [ 'index', 'admin', 'senior_admin', 'doctor', 'marketing', 'system_admin' ]
// let Page = [ 'index', 'system_admin' ]

Page.forEach((names)=>{
    if(names == 'index'){
        let Html = new HTMLWebpackPlugin({
            filename: 'index.php',
            template:  "./index.php",
            chunks: ['index'],
        minify:{
            collapseWhitespace: isProd
        }})
        index.entry['index'] = './index.ts'
        index.plugins.push(Html)
        
    }else{
        let Html = new HTMLWebpackPlugin({
            filename: './page/'+ names+'.php',
            template:  './page/' + names + ".php",
            chunks: [names], // скрипты которые подключаються к это странице 
        minify:{
            collapseWhitespace: isProd
        }})
     index.entry[names] = './page/TSPages/' + names + '.ts'
     index.plugins.push(Html)
    }
    
    }
)
module.exports = [index]