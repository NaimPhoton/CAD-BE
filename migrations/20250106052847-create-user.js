"use strict";
/** @type {import('sequelize-cli').Migration} */

const TABLE_NAME = "Users";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        field: "first_name",
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      lastName: {
        field: "last_name",
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fullName: {
        field: "full_name",
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },

      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
