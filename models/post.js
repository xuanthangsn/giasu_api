'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate(models) {
			Post.belongsTo(models.User, {
				foreignKey: 'user_id',
				targetKey: 'id',
			});
			Post.hasMany(models.Comment, {
				foreignKey: 'post_id',
			});
			Post.hasMany(models.Vote, {
				foreignKey: 'post_id',
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
			user_id: DataTypes.INTEGER.UNSIGNED,
			author: DataTypes.STRING,
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
