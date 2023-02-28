const router = require('express').Router();
const { Blog, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, async (req, res) => {
    try {
        const newBlog = await Blog.create({
            ...(req.body),
            user_id: req.session.user_id,
            include: [{
                model: Comment,
                attributes: ['comment_text'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }]
        });
        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

// router.post('/', withAuth, async (req, res) => {
//     try {
//         const newComment = await Comment.create({
//             ...(req.body),
//             user_id: req.session.user_id,
//             include: [{
//                 model: Comment,
//                 attributes: ['comment_text'],
//                 include: {
//                     model: User,
//                     attributes: ['username']
//                 }
//             }]
//         });
//         res.status(200).json(newComment);
//     } catch (err) {
//         res.status(400).json(err);
//     }
// });




router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });
        

        if (!blogData) {
            res.status(404).json({ message: 'No blog found with this id!' });
            return;
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;