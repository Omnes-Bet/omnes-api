module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('subscriptions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			paymentMethod: {
				type: Sequelize.STRING,
				allowNull: false
			},
			priceId: {
				type: Sequelize.STRING,
				allowNull: false
			},
			planName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			clientSecret: {
				type: Sequelize.STRING,
				allowNull: false
			},
			subscriptionId: {
				type: Sequelize.STRING,
				allowNull: false
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('subscriptions');
	},
};