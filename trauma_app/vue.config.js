const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: IS_PROD ? './' : '/',
  outputDir: process.env.outputDir || 'dist',
  assetsDir: '',
  configureWebpack: config => {
    const plugins = []
    if (IS_PROD) {
      // 去除consle
      plugins.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        })
      )
    }

    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: config => {
    config.entry.app = ['./src/main.js']
    // 修复HMR
    config.resolve.symlinks(true)

    // 删除momentJs中语言包
    config
      .plugin('ignore')
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      )

    config.module
      .rule('js')
      .test(/\.(js|jsx)$/)
      .exclude.add([/@babel(?:\/|\\{1,2})runtime|core-js/])
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        configFile: path.resolve(__dirname, 'babel.config.js'),
        compact: false,
        cacheDirectory: true,
        sourceMaps: false
      })
      .end()

    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 添加别名
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@$', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@constant', resolve('src/constant'))
      .set('@model', resolve('src/model'))
      .set('@utils', resolve('src/utils'))
      .set('@config', resolve('src/config'))
      .set('@layouts', resolve('src/layouts'))
      .set('@store', resolve('src/store'))
      .set('@mixins', resolve('src/mixins'))

    // 打包分析
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
  transpileDependencies: [],
  lintOnSave: true,
  runtimeCompiler: true,
  productionSourceMap: !IS_PROD,
  devServer: {
    open: false,
    hotOnly: true
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/global/variables.less')
      ]
    },
    vconsole: { enable: false }
  }
}
