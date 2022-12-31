const { exec } = require("child_process");
const { promisify } = require("util");
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {

    const execPromise = promisify(exec);

    const pythonReturn = await execPromise("python3 app.py");
  
    const result = JSON.parse(pythonReturn.stdout)
  
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
  
  };
  
  module.exports.path = "/getSurebets";
  module.exports.method = "GET";
  