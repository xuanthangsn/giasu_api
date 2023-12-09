'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tutors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      userID: {
        type: Sequelize.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
      },
      school: {
        type: Sequelize.TEXT,
      },
      specialized: {
        type: Sequelize.TEXT,
      },
      expTeach: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      job: {
        type: Sequelize.STRING,
      },
      skillRange: {
        type: Sequelize.TEXT,
      },
      subjectIds: {
        type: Sequelize.TEXT,
      },
      schedule: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      avatar: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tutors");
  },
};
