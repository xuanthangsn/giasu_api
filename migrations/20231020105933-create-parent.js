'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Parents',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER.UNSIGNED,
				},
				user_id: {
					type: Sequelize.INTEGER.UNSIGNED,
					unique: true,
					references: {
						model: 'users',
						key: 'id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},
				fullname: {
					type: Sequelize.STRING,
				},
				check_status: {
					type: Sequelize.STRING,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			},
			{
				freezeTableName: true,
			}
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Parents');
	},
};
