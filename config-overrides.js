const path = require("path");

module.exports = function override(config) {
  config.output.filename = "static/js/[name].[contenthash:8].js";
  config.output.chunkFilename = "static/js/[name].[contenthash:8].chunk.js";

  return config;
};
