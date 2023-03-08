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
    
    const stripe = new Stripe('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')

    const subscription = await stripe.subscriptions.update(getSubscription.dataValues.subscriptionId, {cancel_at_period_end: true});

      return {
        statusCode: 200,
        body: JSON.stringify(subscription),
      };
  
  };
  
  module.exports.path = "/cancel_subscription";
  module.exports.method = "POST";
  