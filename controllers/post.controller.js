const db = require("../models/index");

module.exports = {

//create post
create : async (req, res) => {

    try {
        const newPost = await db.Post.create({ 
            post_id: req.body.post_id, // auto increment ko can thiet
            post_title : req.body.post_title,
            post_content : req.body.post_content, 
            user_id : req.body.user_id // req.session.user_id??
        });
        return res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
},

//update post with auth?
update : async (req, res) => {
  const {
    post_content
  } = req.body;

  try {
    const updateResult = await db.Post.update(req.body, {
        where: {
            post_id: req.params.post_id,
        },
    });
    return res.status(200).json(updateResult);
} catch (err) {
    console.log(err);
    return res.status(500).json(err);
}
},

//delete post withAuth
delete : async (req, res) => {
    try {
        const deletePostData = await db.Post.destroy({
            where: {
                id: req.body.post_id,
            },
        });
        return res.status(200).json(deletePostData);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
},

getAll : async (req, res) => {
    try {
        const postData = await db.Post.findAll({
          attributes: ['post_id', 'post_title', 'post_content', 'createdAt'],
          order: [['createdAt', 'DESC']],
          
          include: [
            /*
            {
              model: Tutor,
              attributes: ['username'],
            },
            */
             
            {
              model: Comment,
              attributes: [
                'comment_id',
                'comment_content',
                'post_id',
               // 'user_id',
                'createdAt',
              ],
             /* 
              include: {
                model: User,
                attributes: ['username'],
              },
              */
            },
          ],
         
        });
        
        if (!postData) {
            res.status(404).json({ message: 'No post found '});
            return;
          }
        res.status(200).json(postData);
      } catch (err) {
        res.status(500).json(err);
      }
},

get : async (req, res) => {
   try {
       const postData = await db.Post.findOne({
           where: {
               post_id: req.params.post_id,
               
           },
           attributes: ['post_id', 'post_content', 'post_title', 'createdAt'],
           
           include: [
            /*
            {
              model: User,
              attributes: ['username'],
            },
            */
            {
              model: Comment,
              attributes: [
                'comment_id',
                'comment_content',
                'post_id',
                //'user_id',
                'createdAt',
              ],
              /*
              include: {
                model: User,
                attributes: ['username'],
              },
              */
            },
          ],
          
       });
       if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.status(200).json(postData.reverse());
   } catch (err) {
    console.log(err);
    res.status(500).json(err);
   }
},

}

