"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("subscriptions", "is_active", {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("subscriptions", "is_active");
  },
};
