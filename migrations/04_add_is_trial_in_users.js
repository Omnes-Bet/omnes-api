"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "is_trial", {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "is_trial");
  },
};
