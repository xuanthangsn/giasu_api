const db = require('../models/index');

module.exports = {
	// auth ??
	create: async (req, res) => {
		try {
			const newPost = await db.Comment.create({
				post_id: req.body.post_id,
				comment_content: req.body.comment_content,
				authorC_id: req.body.user_id, // req.session.user_id
			});
			return res.status(200).json(newPost);
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	},

	getAll: async (req, res) => {
		db.Comment.findAll({})
			.then((commentData) => res.json(commentData))
			.catch((err) => {
				res.status(500).json(err);
			});
	},

	update: async (req, res) => {
		// const { comment_content } = req.body.comment_content;
		// const { comment_id } = req.params.comment_id ;

		try {
			await db.Comment.findOne({
				where: {
					comment_id: req.params.comment_id,
				},

				attributes: ['comment_content'],
			}).then((commentContent) => {
				if (commentContent) {
					db.Comment.update(
						{
							comment_content: req.body.comment_content,
						},

						{
							where: { comment_id: req.params.comment_id },
						}
					);
					res.status(200).json({
						comment: commentContent,
						updatedComment: req.body.comment_content,
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

				attributes: ['comment_content', 'authorC_id'],
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
};
