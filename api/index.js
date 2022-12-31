/* REGISTER FUNCTIONS */
const path = require("path");
const glob = require("glob");

const fns = [];

glob
  .sync("./api/**/*.js")
  .forEach((file) => fns.push(require(path.resolve(file))));

module.exports = fns;