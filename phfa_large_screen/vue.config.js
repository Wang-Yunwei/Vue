const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProd = process.env.NODE_ENV === "production";

const plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];
if (isProd) {
  plugins.push(new BundleAnalyzerPlugin());
}
const vueConfig = {
  configureWebpack: {
    plugins
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@$", resolve("src"));

    config.plugin("html").tap((args) => {
      args[0].title = "急救公告大屏";
      return args;
    });
  },
  devServer: {
    port: 20222,
    open: true,
  },
  productionSourceMap: false,
  lintOnSave: true,
  transpileDependencies: [],
};

module.exports = vueConfig;
