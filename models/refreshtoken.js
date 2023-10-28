"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RefreshToken.init(
    {
      user_id: DataTypes.INTEGER.UNSIGNED,
      live_time: DataTypes.INTEGER.UNSIGNED,
      revoked: DataTypes.BOOLEAN,
      issuedAt: DataTypes.DATE,
      expiredAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "refreshtokens",
      timestamps: false,
    }
  );
  return RefreshToken;
};
