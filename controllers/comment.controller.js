const db = require("../models/index");

module.exports = {

// auth ??
   create : async (req, res) => {
      try {
         const newPost = await db.Comment.create({ 
             post_id : req.body.post_id, // auto increment
             comment_content : req.body.comment_content, 
             user_id : req.body.user_id // req.session.user_id
         });
         return res.status(200).json(newPost);
     } catch (err) {
         console.log(err);
         return res.status(500).json(err);
     }
   },

   getAll : async (req, res) => {
    db.Comment.findAll({})
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      res.status(500).json(err);
    });
   },

   delete : async (req, res) => {
    db.Comment.destroy({
        where: {
          comment_id: req.params.comment_id,
        },
      })
        .then((commentData) => {
          if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
          }
          res.json(commentData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
   },
}