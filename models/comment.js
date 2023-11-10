'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		static associate(models) {
			Comment.belongsTo(models.User, {
				foreignKey: 'authorC_id',
				targetKey: 'id',
			});

			Comment.belongsTo(models.Post, {
				foreignKey: 'post_id',
				targetKey: 'id',
			});
		}
	}

	Comment.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: 'comment_id',
			},
			comment_content: DataTypes.STRING,
			authorC_id: DataTypes.INTEGER.UNSIGNED,
			post_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: 'comments',
			modelName: 'Comment',
		}
	);
	return Comment;
};

/*
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    user_id:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    comment: DataTypes.STRING,
     parent_comment_id: DataTypes.INTEGER -1 
  */
