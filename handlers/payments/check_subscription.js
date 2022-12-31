const { Stripe } = require("Stripe");
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {
    
    const stripe = new Stripe('sk_test_51MKap3BNTabfN8IzVl9nSJCGxq5eNnfVAow1vkA6fsbWOfB1Z08ev9GOBExnYEKZ259CtzGl9DlD0rpqg4N0oVYj00ePa9m6oc')

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
  