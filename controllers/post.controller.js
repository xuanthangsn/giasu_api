const db = require('../models/index');
const { DataTypes, Model } = require('sequelize');
const commentController = require('./comment.controller');

const User = require('../models/user')(db.sequelize, DataTypes);
const Vote = require('../models/vote')(db.sequelize, DataTypes);
const Comment = require('../models/comment')(db.sequelize, DataTypes);

module.exports = {
	//create post
	create: async (req, res) => {
		try {
			const newPost = await db.Post.create({
				post_title: req.body.post_title,
				post_content: req.body.post_content,
				user_id: req.body.user_id, // req.session.user_id??
				author: req.body.author,
			});
			return res.status(201).json(newPost);
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	//update post with auth?
	update: async (req, res) => {
		const post_content = req.body.post_content;
		const post_id = req.params.post_id;

		try {
			await db.Post.findOne({
				where: {
					post_id: post_id,
				},
				attributes: ['post_content'],
			}).then((postContent) => {
				if (postContent) {
					db.Post.update(
						{ post_content: post_content },
						{ where: { post_id: post_id } }
					);
					res.status(200).json({
						post: postContent,
						updatedPost: post_content,
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

				attributes: ['post_title', 'post_content', 'user_id'],
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
				attributes: ['post_title', 'post_content', 'createdAt', 'author'],

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
			const { post_id } = req.params;

			const postData = await db.Post.findOne({
				where: { post_id },
				attributes: ['post_title', 'post_content', 'createdAt'],
				include: [
					{
						model: User,
						attributes: ['name', 'id'],
					},
					{
						model: Vote,
						attributes: [
							[
								db.sequelize.fn(
									'COUNT',
									db.sequelize.literal(
										'CASE WHEN Votes.vote_type = "like" THEN 1 END'
									)
								),
								'likeCount',
							],
							[
								db.sequelize.fn(
									'COUNT',
									db.sequelize.literal(
										'CASE WHEN Votes.vote_type = "dislike" THEN 1 END'
									)
								),
								'dislikeCount',
							],
						],
					},
				],
			});

			if (!postData) {
				return res.status(404).json({ message: 'No post found with this id' });
			}

			const commentData = await db.Comment.findAll({
				where: { post_id },
				group: ['comment_id'],
				order: [['createdAt', 'DESC']],
				attributes: ['comment_content', 'createdAt', 'comment_id'],
				include: [
					{
						model: User,
						attributes: ['name', 'id'],
					},
					{
						model: Vote,
						group: ['vote_type'],
						attributes: [
							[
								db.sequelize.fn(
									'count',
									db.sequelize.literal(
										'CASE WHEN Votes.vote_type = "like" THEN 1 END'
									)
								),
								'likeCount',
							],
							[
								db.sequelize.fn(
									'count',
									db.sequelize.literal(
										'CASE WHEN Votes.vote_type = "dislike" THEN 1 END'
									)
								),
								'dislikeCount',
							],
						],
					},
				],
			});

			res.status(200).json({
				postData: postData,
				//votePostData: votePostData,
				commentData: commentData,
			});
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	vote: async (req, res) => {
		try {
			const post_id = req.params.post_id;
			const voteType = req.params.vote_type;
			const user_id = req.body.user_id;

			const vote = await db.Vote.findOne({
				where: {
					post_id: post_id,
					user_id: user_id,
				},

				attributes: ['vote_type'],
			});
			if (vote) {
				if (vote.vote_type == voteType) {
					db.Vote.destroy({
						where: { post_id: post_id },
					});
					res.status(200).json({ message: 'Vote deleted', post_id: post_id });
				} else {
					db.Vote.update(
						{ vote_type: voteType },
						{ where: { post_id: post_id } }
					);

					res.status(200).json({
						originalVote: vote.vote_type,
						updatedVote: voteType,
					});
				}
			} else {
				db.Vote.create({
					vote_type: voteType,
					post_id: post_id,
					user_id: user_id,
					comment_id: null,
				});
				res.status(200).json({
					vote_type: voteType,
					post_id: post_id,
				});
			}
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	getVote: async (req, res) => {
		try {
			await db.Vote.findAndCountAll({
				where: {
					post_id: '1',
				},
				attributes: ['vote_type'],

				group: ['vote_type'],
			}).then((vote) => {
				if (vote) {
					res.status(200).json(vote.count);
				} else {
					res.status(404).json({ message: 'No vote found with this post' });
				}
			});
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	deleteVote: async (req, res) => {
		try {
			const vote = await db.Vote.findOne({
				where: {
					vote_id: req.params.vote_id,
				},
			});

			if (vote) {
				await db.Vote.destroy({
					where: { vote_id: req.params.vote_id },
				});
			} else {
				res.status(404).json({ message: 'No vote found with this id' });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},
};
