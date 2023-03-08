const { Stripe } = require("stripe");
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {
    
    const stripe = new Stripe('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')

    const subscription = await stripe.subscriptions.retrieve(
        'sub_1MKuEIBNTabfN8Iz2STDPhCb'
      );

      return {
        statusCode: 200,
        body: JSON.stringify(subscription),
      };
  
  };
  
  module.exports.path = "/checkSubscription";
  module.exports.method = "GET";
  