"use strict";
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    birthday: DataTypes.DATE,
    password: DataTypes.STRING,
    is_trial: DataTypes.BOOLEAN,
    promocode: DataTypes.STRING
  }, 
  {
    timestamps: false
  },
  {
    tableName: 'users'
  });
  return Users;
};