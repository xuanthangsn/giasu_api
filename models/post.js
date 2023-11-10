'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate(models) {
			Post.belongsTo(models.User, {
				foreignKey: 'authorP_id',
				targetKey: 'id',
			});
			Post.hasMany(models.Comment, {
				foreignKey: 'id',
			});
		}
	}

	Post.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: 'post_id',
			},
			post_title: DataTypes.STRING,
			post_content: DataTypes.TEXT,
			authorP_id: DataTypes.INTEGER.UNSIGNED,
		},
		{
			sequelize,
			tableName: 'posts',
			modelName: 'Post',
		}
	);
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
