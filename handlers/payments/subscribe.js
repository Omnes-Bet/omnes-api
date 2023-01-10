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
    "sk_test_51MKap3BNTabfN8IzVl9nSJCGxq5eNnfVAow1vkA6fsbWOfB1Z08ev9GOBExnYEKZ259CtzGl9DlD0rpqg4N0oVYj00ePa9m6oc"
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
        userId: userId
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
