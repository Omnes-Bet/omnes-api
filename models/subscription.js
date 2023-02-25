"use strict";
module.exports = (sequelize, DataTypes) => {
  const Subscriptions = sequelize.define('subscriptions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    priceId: DataTypes.STRING,
    planName: DataTypes.STRING,
    clientSecret: DataTypes.STRING,
    subscriptionId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, 
  {
    timestamps: false
  },
  {
    tableName: 'subscriptions'
  });
  return Subscriptions;
};