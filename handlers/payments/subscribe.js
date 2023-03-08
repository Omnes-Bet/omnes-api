const { Stripe } = require("stripe");
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {
  const { name, email, paymentMethod, priceId, userId, planName } =
    JSON.parse(event.body) || {};

  const { subscriptions } = models;

  const subscriptionsChange = await subscriptions.sequelize.transaction();

  const stripe = new Stripe(
    "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"
  );

  try {
    
    const customer = await stripe.customers.create({
      name: name,
      email: email,
      payment_method: paymentMethod,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });
  
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: "any",
          },
        },
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    await subscriptions.create(
      {
        name: name,
        email: email,
        priceId: priceId,
        paymentMethod: paymentMethod,
        planName: planName,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id,
        userId: userId,
        is_active: "1"
      },
      { subscriptionsChange }
    );

    subscriptionsChange.commit();
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id,
      }),
    };
    
  } catch (error) {
    subscriptionsChange.rollback();
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }

};

module.exports.path = "/create-subscription";
module.exports.method = "POST";
