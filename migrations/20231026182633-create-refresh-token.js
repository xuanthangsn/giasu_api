'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RefreshTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      live_time: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      revoked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      issuedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expiredAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      freezeTableName: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RefreshTokens');
  }
};