const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: IS_PROD ? '/' : '/',
  outputDir: process.env.outputDir || 'dist',
  assetsDir: '',
  configureWebpack: config => {
    const plugins = []
    config.plugins = [...config.plugins, ...plugins]
  },
  transpileDependencies: ['node_modules/webpack-dev-server/client'],
  chainWebpack: config => {
    config.entry.app = ['@babel/polyfill', './src/main.js']
    config.module
      .rule('compile')
      .test(/\.js$/)
      .include.add(resolve('src'))
      .add(resolve('test'))
      .add(resolve('static'))
      .add(resolve('node_modules/webpack-dev-server/client'))
      .add(resolve('node_modules'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ]
        ]
      })
    config.resolve.symlinks(true)
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .plugin('ignore')
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      )

    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@$', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@utils', resolve('src/utils'))
      .set('@config', resolve('src/config'))
      .set('@layouts', resolve('src/layouts'))
      .set('@store', resolve('src/store'))
      .set('@mixins', resolve('src/mixins'))

    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }

    if (IS_PROD) {
      config.optimization.delete('splitChunks')
    }
    return config
  },

  // css相关配置
  css: {
    modules: false,
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      css: {}
    }
  },

  lintOnSave: true,
  runtimeCompiler: true,
  productionSourceMap: !IS_PROD,
  parallel: require('os').cpus().length > 1,
  pwa: {},

  devServer: {
    open: false, // 自动打开浏览器
    hotOnly: true,
    port: 8082
    // proxy: {
    //   '/phfa': {
    //     target: 'http://192.168.0.128:20220',
    //     // 开启代理，在本地创建一个虚拟服务端
    //     changeOrigin: true,
    //     // 是否启用websockets
    //     ws: true
    //     // pathRewrite: {
    //     //   '^/api': ''
    //     // }
    //   }
    // }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/styles/variables.less')]
    },
    vconsole: { enable: false }
  }
}
