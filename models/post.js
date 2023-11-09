'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Post.belongsTo(models.Tutor, {
        foreignKey: 'user_id',
    });

      Post.hasMany(models.Comment, {
        foreignKey: 'post_id',
    });
    
    }
    
  }
  Post.init({
    post_id: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    post_title: DataTypes.STRING,
    post_content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: "posts",
    modelName: 'Post',
  });
  return Post;
};

/*
id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  primaryKey: true,
  autoIncrement: true,
  defaultValue: 1,
},
title: {
  type: DataTypes.STRING,
  allowNull: false
},
content: {
  type: DataTypes.TEXT,
  allowNull: true
},
user_id:  {
  type: DataTypes.INTEGER,
  references: {
    model: 'user',
    key: 'id'
  }
}
*/