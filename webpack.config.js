const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const globImporter = require("node-sass-glob-importer");
const postcssPresetEnv = require("postcss-preset-env");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
console.log("process.env", __dirname);

const publicPath = path.resolve(__dirname, "web/");
const resourcesPath = path.resolve(__dirname, "src/");

const getHost = (config = {}) => {
  const protocol = config.https ? "https" : "http";
  const host = config.host || "localhost";
  const port = config.port || 3000;

  return `${protocol}://${host}${port ? `:${port}` : ""}`;
};

const getMode = (dev = isDev) => (dev ? "development" : "production");

const getEntry = (dev = isDev, config = {}) => {
  const mainEntry = path.join(resourcesPath, "js/main.js");

  if (dev) {
    return [
      "@babel/polyfill",
      `webpack-dev-server/client?${getHost(config)}`,
      "webpack/hot/only-dev-server",
      mainEntry,
    ];
  }

  return ["@babel/polyfill", mainEntry];
};

const getOutput = (dev = isDev) => {
  if (dev) {
    return {
      filename: "bundle.js",
      publicPath: "/js/",
    };
  }

  return {
    filename: "bundle-[hash].js",
    path: path.resolve(publicPath, "build"),
    publicPath: "/build/",
  };
};

const getDevTool = (dev = isDev) => dev && "cheap-module-source-map";

const getModule = (dev = isDev) => {
  const jsLoader = {
    test: /\.[jt]sx?$/,
    exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
    use: ["babel-loader"],
  };

  const styleLoader = {
    test: /\.s?css$/,
    exclude: /node_modules/,
    use: [
      dev ? "style-loader" : MiniCssExtractPlugin.loader,
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          plugins: () => [postcssPresetEnv()],
        },
      },
      {
        loader: "sass-loader",
        options: {
          importer: globImporter(),
        },
      },
    ],
  };

  const imagesLoader = {
    test: /\.(png|jpg|gif|svg)$/,
    use: [
      {
        loader: "url-loader",
        options: dev
          ? {}
          : {
            limit: 8192,
            name: "images/[name]-[hash].[ext]",
          },
      },
    ],
  };

  const fontsLoader = {
    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    exclude: /images/,
    use: [
      {
        loader: "url-loader",
        options: dev
          ? {}
          : {
            limit: 8192,
            name: "fonts/[name]-[hash].[ext]",
          },
      },
    ],
  };

  return {
    rules: [jsLoader, styleLoader, imagesLoader, fontsLoader],
  };
};

const getDevServer = (dev = isDev, config = {}) => {
  if (dev) {
    return {
      publicPath: `${getHost(config)}/js/`,
      port: config.port,
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    };
  }

  return undefined;
};

const getOptimization = (dev = isDev) => {
  if (dev) {
    return {};
  }

  return {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
  };
};

module.exports = (...args) => {
  const [dev, config] = args;

  return {
    mode: getMode(dev),
    entry: getEntry(dev, config),
    output: getOutput(dev, config),
    devtool: getDevTool(dev),
    module: getModule(dev),
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        Utilities: path.join(resourcesPath, "/js/helpers/utils.js"),
      },
    },
    devServer: getDevServer(dev, config),
    optimization: getOptimization(dev),
  };
};
