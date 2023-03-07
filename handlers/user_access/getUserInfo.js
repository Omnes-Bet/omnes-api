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
    is_trial: getUser.is_trial
  };

  const subscriptionScope = {
    where: { userId: getUser.id, is_active: "1" },
  };

  const set = (object, attr, value) => {
    if (value)
      object[attr] = value
  }

  function isMoreThan24HoursAgo(timestamp) {
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // Number of milliseconds in 24 hours
    const currentTime = new Date().getTime(); // Current timestamp in milliseconds
    return currentTime - timestamp > twentyFourHoursInMs;
  }

  if(isMoreThan24HoursAgo(getUser.created_at) && getUser.is_trial == 1) {

    const transaction = await users.sequelize.transaction();

    set(getUser, 'is_trial', "0");
    await getUser.save({ transaction });

    await transaction.commit();

  }

  const getSubscription = await subscriptions.findOne(subscriptionScope);

  if(getSubscription){

    const stripe = new Stripe(
      "sk_test_51MKap3BNTabfN8IzVl9nSJCGxq5eNnfVAow1vkA6fsbWOfB1Z08ev9GOBExnYEKZ259CtzGl9DlD0rpqg4N0oVYj00ePa9m6oc"
    );
  
    const userSubscription = await stripe.subscriptions.retrieve(
      getSubscription.subscriptionId
    );

    if(userSubscription.status == "canceled"){

      const transaction = await subscriptions.sequelize.transaction();

      set(getSubscription, 'is_active', "0");
      await getSubscription.save({ transaction });

      await transaction.commit();

    }

    result.subsInfo = userSubscription
    
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

module.exports.path = "/getUserInfo";
module.exports.method = "POST";
