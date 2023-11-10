const db = require('../models/index');
const { DataTypes } = require('sequelize');

const User = require('../models/user')(db.sequelize, DataTypes);

module.exports = {
	//create post
	create: async (req, res) => {
		try {
			const newPost = await db.Post.create({
				post_title: req.body.post_title,
				post_content: req.body.post_content,
				authorP_id: req.body.user_id, // req.session.user_id??
			});
			return res.status(200).json(newPost);
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	//update post with auth?
	update: async (req, res) => {
		// const { post_content } = req.body.post_content;
		// const { post_id } = req.params.post_id ;

		try {
			await db.Post.findOne({
				where: {
					post_id: req.params.post_id,
				},

				attributes: ['post_content'],
			}).then((postContent) => {
				if (postContent) {
					db.Post.update(
						{
							post_content: req.body.post_content,
						},

						{
							where: { post_id: req.params.post_id },
						}
					);
					res.status(200).json({
						post: postContent,
						updatedPost: req.body.post_content,
					});
				} else {
					res.status(404).json({ message: 'No post found with this id' });
				}
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	//delete post withAuth
	delete: async (req, res) => {
		try {
			await db.Post.findOne({
				where: {
					post_id: req.params.post_id,
				},

				attributes: ['post_title', 'post_content', 'authorP_id'],
			}).then((postContent) => {
				if (postContent) {
					db.Post.destroy({
						where: { post_id: req.params.post_id },
					});

					res.status(200).json({
						deletedPost: postContent,
					});
				} else {
					res.status(404).json({ message: 'No post found with this id' });
				}
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	findAll: async (req, res) => {
		try {
			const postData = await db.Post.findAll({
				attributes: ['post_title', 'post_content', 'createdAt'],
				include: [
					{
						model: User,
						attributes: ['username'],
					},
				],

				order: [['createdAt', 'DESC']],
			});

			if (postData) {
				res.status(200).json(postData);
			} else {
				res.status(404).json({ message: 'No post found ' });
			}
		} catch (err) {
			res.status(500).json(err);
		}
	},

	findOne: async (req, res) => {
		try {
			await db.Post.findOne({
				where: {
					post_id: req.params.post_id,
				},

				attributes: ['post_title', 'post_content', 'createdAt'],

				include: [
					{
						model: User,
						attributes: ['username'],
					},
				],

				order: [['createdAt', 'DESC']],
			}).then((postData) => {
				if (postData) {
					db.Comment.findAll({
						where: { post_id: req.params.post_id },

						attributes: ['comment_content', 'createdAt'],

						include: [
							{
								model: User,
								attributes: ['username'],
							},
						],

						order: [['createdAt', 'DESC']],
					}).then((commentData) => {
						res.status(200).json({
							postData: postData,
							commentData: commentData,
						});
					});
				} else {
					res.status(404).json({ message: 'No post found with this id' });
				}
			});
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},
};
