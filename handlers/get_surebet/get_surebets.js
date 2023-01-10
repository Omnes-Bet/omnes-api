const axios = require("axios")
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {

    const pythonReturn = await axios.get("https://omnes-python-api.herokuapp.com/getSurebets");
  
      return {
        statusCode: 200,
        body: JSON.stringify(pythonReturn.data),
      };
  
  };
  
  module.exports.path = "/getSurebets";
  module.exports.method = "GET";
  