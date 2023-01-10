const { Stripe } = require("stripe");
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {

    const { userId } = JSON.parse(event.body) || {};

    const { subscriptions } = models;

    const scope = {
        where: { userId }
    }

    const getSubscription = await subscriptions.findOne(scope);

    console.log("DANIELLLgetSubscriptiongetSubscription", getSubscription);
    
    const stripe = new Stripe('sk_test_51MKap3BNTabfN8IzVl9nSJCGxq5eNnfVAow1vkA6fsbWOfB1Z08ev9GOBExnYEKZ259CtzGl9DlD0rpqg4N0oVYj00ePa9m6oc')

    const subscription = await stripe.subscriptions.update('sub_1MKuEIBNTabfN8Iz2STDPhCb', {cancel_at_period_end: true});

      return {
        statusCode: 200,
        body: JSON.stringify(subscription),
      };
  
  };
  
  module.exports.path = "/cancel_subscription";
  module.exports.method = "POST";
  