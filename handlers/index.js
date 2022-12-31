/* REGISTER FUNCTIONS */
const path = require("path");
const glob = require("glob");

const fns = [];

glob
  .sync("./handlers/**/*.js")
  .forEach((file) => fns.push(require(path.resolve(file))));

module.exports = fns;