const { Stripe } = require("stripe");

/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {
  const { email } = JSON.parse(event.body) || {};

  const { users, subscriptions } = models;

  const scope = {
    where: { email: email },
  };

  const getUser = await users.findOne(scope);

  const result = {
    id: getUser.id,
    name: getUser.name,
    email: getUser.email,
    phoneNumber: getUser.phone_number,
  };

  const subscriptionScope = {
    where: { userId: getUser.id },
  };

  const getSubscription = await subscriptions.findOne(subscriptionScope);

  if(getSubscription){

    const stripe = new Stripe(
      "sk_test_51MKap3BNTabfN8IzVl9nSJCGxq5eNnfVAow1vkA6fsbWOfB1Z08ev9GOBExnYEKZ259CtzGl9DlD0rpqg4N0oVYj00ePa9m6oc"
    );
  
    const userSubscription = await stripe.subscriptions.retrieve(
      getSubscription.subscriptionId
    );
  
    result.status = userSubscription.status;
    
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

module.exports.path = "/getUserInfo";
module.exports.method = "POST";
