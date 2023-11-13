const db = require('../models/index');

module.exports = {
	// auth ??
	create: async (req, res) => {
		try {
			const newPost = await db.Comment.create({
				post_id: req.body.post_id,
				comment_content: req.body.comment_content,
				user_id: req.body.user_id, // req.session.user_id
				author: req.body.author,
			});
			return res.status(201).json(newPost);
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	getAll: async (req, res) => {
		try {
			const commentData = await db.Comment.findAll({});
			res.json(commentData);
		} catch (err) {
			res.status(500).json(err);
		}
	},

	update: async (req, res) => {
		const comment_content = req.body.comment_content;
		const comment_id = req.params.comment_id;

		try {
			await db.Comment.findOne({
				where: {
					comment_id: comment_id,
				},

				attributes: ['comment_content'],
			}).then((commentContent) => {
				if (commentContent) {
					db.Comment.update(
						{
							comment_content: comment_content,
						},

						{
							where: { comment_id: comment_id },
						}
					);
					res.status(200).json({
						comment: commentContent,
						updatedComment: comment_content,
					});
				} else {
					res.status(404).json({ message: 'No comment found with this id' });
				}
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	delete: async (req, res) => {
		try {
			await db.Comment.findOne({
				where: {
					comment_id: req.params.comment_id,
				},

				attributes: ['comment_content', 'user_id'],
			}).then((commentContent) => {
				if (commentContent) {
					db.Comment.destroy({
						where: { comment_id: req.params.comment_id },
					});

					res.status(200).json({
						deletedComment: commentContent,
					});
				} else {
					res.status(404).json({ message: 'No comment found with this id' });
				}
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	vote: async (req, res) => {
		try {
			const post_id = null;
			const comment_id = req.params.comment_id;
			const voteType = req.params.vote_type;

			const vote = await db.Vote.findOne({
				where: {
					comment_id: comment_id,
					user_id: req.body.user_id,
				},
				attributes: ['vote_type'],
			});

			if (vote) {
				if (vote.vote_type == voteType) {
					db.Vote.destroy({
						where: { comment_id: comment_id },
					});
					return res
						.status(200)
						.json({ message: 'Vote deleted', comment_id: comment_id });
				} else {
					db.Vote.update(
						{ vote_type: voteType },

						{ where: { comment_id: comment_id } }
					);

					return res.status(200).json({
						originalVote: vote.vote_type,
						updatedVote: voteType,
					});
				}
			} else {
				db.Vote.create({
					vote_type: voteType,
					comment_id: comment_id,
					user_id: req.body.user_id,
					post_id: post_id,
				});
				res.status(200).json({
					vote_type: voteType,
					comment_id: comment_id,
				});
			}
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	deleteVote: async (req, res) => {
		try {
			const vote = await db.Vote.findOne({
				where: {
					comment_id: req.params.comment_id,
					user_id: req.body.user_id,
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
