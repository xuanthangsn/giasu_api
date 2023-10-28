"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Parent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parent.belongsTo(models.User);
    }
  }
  Parent.init(
    {
      user_id: DataTypes.INTEGER.UNSIGNED,
      fullname: DataTypes.STRING,
      check_status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Parent",
    }
  );
  return Parent;
};
