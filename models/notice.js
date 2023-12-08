'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notice.init({
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    pathto: DataTypes.STRING,
    isRead: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Notice',
    tableName: 'notices'
  });
  return Notice;
};