const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash() {
  try {
    return GitRevision.version()
  } catch (e) { }
  return 'unknown'
}

const isProd = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.DefinePlugin({
    APP_VERSION: `"${require('./package.json').version}"`,
    GIT_HASH: JSON.stringify(getGitHash()),
    BUILD_DATE: buildDate
  })
]
if (isProd) {
  plugins.push(new BundleAnalyzerPlugin())
}
const vueConfig = {
  configureWebpack: {
    plugins,
    externals: {}
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))
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

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })


    config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin({ shorthands: true }))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          'primary-color': '#444FDB',
          'link-color': '#444FDB',
          'border-radius-base': '2px',
          '@level-color-1': '#b41226',
          '@level-color-2': '#df6926',
          '@level-color-3': '#ff9900',
          '@level-color-4': '#009900'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8008,
    open: true
  },
  productionSourceMap: false,
  lintOnSave: true,
  transpileDependencies: []
}

if (process.env.VUE_APP_PREVIEW === 'true') {
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
