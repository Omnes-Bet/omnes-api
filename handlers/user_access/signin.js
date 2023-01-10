const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { Stripe } = require("stripe");
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {
  const { email, password } = JSON.parse(event.body) || {};

  const { users, subscriptions } = models;

  const scope = {
    where: { email: email },
  };

  const getUser = await users.findOne(scope);

  if (!getUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "email nao existe" }),
    };
  }

  let result = getUser;

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
  
    result.dataValues.status = userSubscription.status;
    
  }

  const isAuthentic = await bcrypt.compare(password, getUser.password);

    if(isAuthentic) {
      let token = jwt.sign({
        userId: getUser.id,
        email: getUser.email,
        phoneNumber: getUser.phone_number,
        birthday: getUser.birthday
      }, 
      "SenhaDificil",
      {
        expiresIn: "1h"
      });

        return {
            statusCode: 200,
            body: JSON.stringify({ 
              message: "User logado com sucesso",
              token: token,
              data: result
             }),
          };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Usuario nao autenticado" }),
    };

};

module.exports.path = "/signin";
module.exports.method = "POST";
