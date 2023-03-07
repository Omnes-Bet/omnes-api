const bcrypt = require("bcrypt");
const saltRounds = 10;
/**
 * @param {*} event
 * @param {*} models
 * @returns
 */

module.exports.handler = async function (event, models) {
  const { name, phoneNumber, email, birthday, password, promoCode } =
    JSON.parse(event.body) || {};

  const { users } = models;

  const scope = {
    where: { email: email },
  };

  const getUser = await users.findOne(scope);

  if (getUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Este e-mail ja existe" }),
    };
  }

  const userChange = await users.sequelize.transaction();

  try {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return {
          statusCode: 500,
          body: JSON.stringify(err),
        };
      }

      await users.create(
        {
          name: name,
          phone_number: phoneNumber,
          email: email,
          birthday: birthday,
          is_trial: 1,
          promocode: promoCode,
          create_at: `${new Date().getTime()}`,
          password: hash,
        },
        { userChange }
      );

      userChange.commit();
      
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'autenticado com sucesso' }),
    };

    
  } catch (error) {
    userChange.rollback();

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports.path = "/signup";
module.exports.method = "POST";
